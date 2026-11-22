-- ============================================
-- BACKEND 2 - RESERVAS
-- Proyecto: ReAprovecha
-- ============================================

-- 1. TABLA DE RESERVAS

CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    consumer_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE RESTRICT,

    batch_id UUID NOT NULL
        REFERENCES public.product_batches(id)
        ON DELETE RESTRICT,

    quantity INTEGER NOT NULL,

    unit_price NUMERIC(10,2) NOT NULL,

    total_price NUMERIC(12,2)
        GENERATED ALWAYS AS (quantity * unit_price) STORED,

    status TEXT NOT NULL DEFAULT 'reserved',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    closed_at TIMESTAMPTZ,

    CONSTRAINT reservations_quantity_check
        CHECK (quantity BETWEEN 1 AND 100),

    CONSTRAINT reservations_price_check
        CHECK (unit_price > 0),

    CONSTRAINT reservations_status_check
        CHECK (
            status IN (
                'reserved',
                'completed',
                'cancelled'
            )
        ),

    CONSTRAINT reservations_closed_check
        CHECK (
            (status = 'reserved' AND closed_at IS NULL)
            OR
            (status IN ('completed', 'cancelled')
             AND closed_at IS NOT NULL)
        )
);

CREATE INDEX idx_reservations_consumer
ON public.reservations (consumer_id);

CREATE INDEX idx_reservations_batch
ON public.reservations (batch_id);

CREATE INDEX idx_reservations_status
ON public.reservations (status);


-- 2. SEGURIDAD RLS

ALTER TABLE public.reservations
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.reservations
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.reservations
TO authenticated;


-- Comprador: consultar sus reservas.
-- Empresa: consultar reservas de sus productos.

CREATE POLICY reservations_select_authorized
ON public.reservations
FOR SELECT
TO authenticated
USING (
    consumer_id = (SELECT auth.uid())

    OR EXISTS (
        SELECT 1
        FROM public.product_batches b
        JOIN public.products p
            ON p.id = b.product_id
        JOIN public.organization_members m
            ON m.organization_id = p.organization_id
        WHERE b.id = reservations.batch_id
          AND m.user_id = (SELECT auth.uid())
          AND m.member_role IN ('owner', 'staff')
    )
);


-- 3. CREAR RESERVA

CREATE FUNCTION public.create_reservation(
    p_batch_id UUID,
    p_quantity INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_price NUMERIC(10,2);
    v_reservation_id UUID;
BEGIN

    v_user_id := (SELECT auth.uid());

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required'
            USING ERRCODE = '42501';
    END IF;

    IF p_quantity IS NULL
       OR p_quantity NOT BETWEEN 1 AND 100 THEN
        RAISE EXCEPTION 'Invalid quantity'
            USING ERRCODE = '22023';
    END IF;

    -- Actualizacion atomica:
    -- solo aparta unidades si existe disponibilidad.
    -- PostgreSQL bloquea la fila modificada y
    -- comprueba la condicion frente a escrituras
    -- concurrentes.

    UPDATE public.product_batches AS b
    SET quantity_reserved =
        b.quantity_reserved + p_quantity
    FROM public.products AS p,
         public.organizations AS o
    WHERE b.id = p_batch_id
      AND p.id = b.product_id
      AND o.id = p.organization_id
      AND b.status = 'available'
      AND p.status = 'active'
      AND o.status = 'active'
      AND b.expiration_date >=
          (NOW() AT TIME ZONE 'America/La_Paz')::DATE
      AND (
          b.quantity_on_hand - b.quantity_reserved
      ) >= p_quantity
    RETURNING b.discounted_price
    INTO v_price;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Batch unavailable or insufficient stock'
            USING ERRCODE = 'P0001';
    END IF;

    -- El precio queda registrado al momento
    -- de reservar, aunque luego cambie el anuncio.

    INSERT INTO public.reservations (
        consumer_id,
        batch_id,
        quantity,
        unit_price
    )
    VALUES (
        v_user_id,
        p_batch_id,
        p_quantity,
        v_price
    )
    RETURNING id INTO v_reservation_id;

    RETURN v_reservation_id;

END;
$$;


-- 4. CONFIRMAR RETIRO Y PAGO PRESENCIAL

CREATE FUNCTION public.confirm_reservation_pickup(
    p_reservation_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_reservation public.reservations%ROWTYPE;
BEGIN

    v_user_id := (SELECT auth.uid());

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required'
            USING ERRCODE = '42501';
    END IF;

    -- Bloquear la reserva para impedir
    -- confirmaciones o cancelaciones simultaneas.

    SELECT *
    INTO v_reservation
    FROM public.reservations
    WHERE id = p_reservation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reservation not found'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_reservation.status <> 'reserved' THEN
        RAISE EXCEPTION 'Reservation already closed'
            USING ERRCODE = 'P0001';
    END IF;

    -- Solo personal de la empresa correspondiente.

    IF NOT EXISTS (
        SELECT 1
        FROM public.product_batches b
        JOIN public.products p
            ON p.id = b.product_id
        JOIN public.organizations o
            ON o.id = p.organization_id
        JOIN public.organization_members m
            ON m.organization_id = o.id
        WHERE b.id = v_reservation.batch_id
          AND o.status = 'active'
          AND m.user_id = v_user_id
          AND m.member_role IN ('owner', 'staff')
    ) THEN
        RAISE EXCEPTION 'Organization not authorized'
            USING ERRCODE = '42501';
    END IF;

    -- No confirmar entregas de lotes
    -- retirados o con fecha de vencimiento pasada.

    UPDATE public.product_batches
    SET quantity_on_hand =
            quantity_on_hand - v_reservation.quantity,
        quantity_reserved =
            quantity_reserved - v_reservation.quantity
    WHERE id = v_reservation.batch_id
      AND status = 'available'
      AND expiration_date >=
          (NOW() AT TIME ZONE 'America/La_Paz')::DATE
      AND quantity_reserved >= v_reservation.quantity
      AND quantity_on_hand >= v_reservation.quantity;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Batch cannot be delivered'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE public.reservations
    SET status = 'completed',
        closed_at = NOW()
    WHERE id = p_reservation_id;

END;
$$;


-- 5. CANCELAR RESERVA

CREATE FUNCTION public.cancel_reservation(
    p_reservation_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_reservation public.reservations%ROWTYPE;
BEGIN

    v_user_id := (SELECT auth.uid());

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required'
            USING ERRCODE = '42501';
    END IF;

    SELECT *
    INTO v_reservation
    FROM public.reservations
    WHERE id = p_reservation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reservation not found'
            USING ERRCODE = 'P0001';
    END IF;

    IF v_reservation.status <> 'reserved' THEN
        RAISE EXCEPTION 'Reservation already closed'
            USING ERRCODE = 'P0001';
    END IF;

    -- Puede cancelar el comprador o la empresa
    -- propietaria del producto.

    IF v_reservation.consumer_id <> v_user_id
       AND NOT EXISTS (
           SELECT 1
           FROM public.product_batches b
           JOIN public.products p
               ON p.id = b.product_id
           JOIN public.organization_members m
               ON m.organization_id = p.organization_id
           WHERE b.id = v_reservation.batch_id
             AND m.user_id = v_user_id
             AND m.member_role IN ('owner', 'staff')
       )
    THEN
        RAISE EXCEPTION 'Not authorized'
            USING ERRCODE = '42501';
    END IF;

    -- Liberar las unidades apartadas.
    -- Si el lote ya vencio, su politica de lectura
    -- impide que vuelva al catalogo publico.

    UPDATE public.product_batches
    SET quantity_reserved =
        quantity_reserved - v_reservation.quantity
    WHERE id = v_reservation.batch_id
      AND quantity_reserved >= v_reservation.quantity;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Inconsistent reserved stock'
            USING ERRCODE = 'P0001';
    END IF;

    UPDATE public.reservations
    SET status = 'cancelled',
        closed_at = NOW()
    WHERE id = p_reservation_id;

END;
$$;


-- 6. PERMISOS DE LAS FUNCIONES

REVOKE ALL ON FUNCTION
    public.create_reservation(UUID, INTEGER)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.create_reservation(UUID, INTEGER)
TO authenticated;


REVOKE ALL ON FUNCTION
    public.confirm_reservation_pickup(UUID)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.confirm_reservation_pickup(UUID)
TO authenticated;


REVOKE ALL ON FUNCTION
    public.cancel_reservation(UUID)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.cancel_reservation(UUID)
TO authenticated;

-- FIN DE MIGRACION