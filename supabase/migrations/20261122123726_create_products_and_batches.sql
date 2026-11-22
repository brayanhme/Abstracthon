-- ============================================
-- BACKEND 2 - PRODUCTOS Y LOTES
-- Proyecto: ReAprovecha
-- ============================================

-- 1. PRODUCTOS

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL
        REFERENCES public.organizations(id)
        ON DELETE RESTRICT,

    category_id UUID NOT NULL
        REFERENCES public.categories(id)
        ON DELETE RESTRICT,

    name TEXT NOT NULL,
    description TEXT,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT products_name_check
        CHECK (
            name = btrim(name)
            AND char_length(name) BETWEEN 2 AND 120
        ),

    CONSTRAINT products_description_check
        CHECK (
            description IS NULL
            OR char_length(description) <= 1000
        ),

    CONSTRAINT products_status_check
        CHECK (status IN ('active', 'hidden'))
);

CREATE INDEX idx_products_organization
ON public.products (organization_id);

CREATE INDEX idx_products_category
ON public.products (category_id);


-- 2. LOTES DE PRODUCTOS

CREATE TABLE public.product_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL
        REFERENCES public.products(id)
        ON DELETE RESTRICT,

    expiration_date DATE NOT NULL,

    original_price NUMERIC(10,2) NOT NULL,
    discounted_price NUMERIC(10,2) NOT NULL,

    quantity_on_hand INTEGER NOT NULL,

    quantity_reserved INTEGER NOT NULL DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'available',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT batches_prices_check
        CHECK (
            original_price > 0
            AND discounted_price > 0
            AND discounted_price < original_price
        ),

    CONSTRAINT batches_stock_check
        CHECK (
            quantity_on_hand >= 0
            AND quantity_reserved >= 0
            AND quantity_reserved <= quantity_on_hand
        ),

    CONSTRAINT batches_status_check
        CHECK (status IN ('available', 'withdrawn'))
);

CREATE INDEX idx_batches_product
ON public.product_batches (product_id);

CREATE INDEX idx_batches_expiration
ON public.product_batches (expiration_date);

-- Disponibilidad:
-- quantity_on_hand - quantity_reserved


-- 3. SEGURIDAD

ALTER TABLE public.products
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.product_batches
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
    public.products,
    public.product_batches
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
    public.products,
    public.product_batches
TO anon, authenticated;


-- 4. LECTURA DE PRODUCTOS

CREATE POLICY products_select_public
ON public.products
FOR SELECT
TO anon, authenticated
USING (
    status = 'active'
    AND EXISTS (
        SELECT 1
        FROM public.organizations o
        WHERE o.id = products.organization_id
          AND o.status = 'active'
    )
);

CREATE POLICY products_select_own
ON public.products
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members m
        WHERE m.organization_id = products.organization_id
          AND m.user_id = (SELECT auth.uid())
    )
);


-- 5. LECTURA DE LOTES

CREATE POLICY batches_select_public
ON public.product_batches
FOR SELECT
TO anon, authenticated
USING (
    status = 'available'
    AND expiration_date >=
        (NOW() AT TIME ZONE 'America/La_Paz')::DATE
    AND quantity_on_hand > quantity_reserved
    AND EXISTS (
        SELECT 1
        FROM public.products p
        JOIN public.organizations o
            ON o.id = p.organization_id
        WHERE p.id = product_batches.product_id
          AND p.status = 'active'
          AND o.status = 'active'
    )
);

CREATE POLICY batches_select_own
ON public.product_batches
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.products p
        JOIN public.organization_members m
            ON m.organization_id = p.organization_id
        WHERE p.id = product_batches.product_id
          AND m.user_id = (SELECT auth.uid())
    )
);


-- 6. PUBLICAR PRODUCTO Y LOTE
-- Operacion atomica mediante RPC

CREATE FUNCTION public.publish_product(
    p_organization_id UUID,
    p_category_id UUID,
    p_name TEXT,
    p_expiration_date DATE,
    p_original_price NUMERIC,
    p_discounted_price NUMERIC,
    p_quantity INTEGER,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_product_id UUID;
BEGIN

    v_user_id := (SELECT auth.uid());

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required'
            USING ERRCODE = '42501';
    END IF;

    -- Solo miembros de organizaciones activas
    -- habilitadas para publicar alimentos.

    IF NOT EXISTS (
        SELECT 1
        FROM public.organizations o
        JOIN public.organization_members m
            ON m.organization_id = o.id
        WHERE o.id = p_organization_id
          AND o.status = 'active'
          AND o.organization_type IN (
              'food_business',
              'agricultural_producer'
          )
          AND m.user_id = v_user_id
          AND m.member_role IN ('owner', 'staff')
    ) THEN
        RAISE EXCEPTION 'Organization not authorized'
            USING ERRCODE = '42501';
    END IF;

    -- Validar producto.

    IF COALESCE(char_length(btrim(p_name)), 0)
       NOT BETWEEN 2 AND 120 THEN
        RAISE EXCEPTION 'Invalid product name'
            USING ERRCODE = '22023';
    END IF;

    -- No publicar lotes ya vencidos.

    IF p_expiration_date IS NULL
       OR p_expiration_date <
          (NOW() AT TIME ZONE 'America/La_Paz')::DATE
    THEN
        RAISE EXCEPTION 'Expired product'
            USING ERRCODE = '22023';
    END IF;

    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        RAISE EXCEPTION 'Invalid quantity'
            USING ERRCODE = '22023';
    END IF;

    IF p_original_price IS NULL
       OR p_discounted_price IS NULL
       OR p_original_price <= 0
       OR p_discounted_price <= 0
       OR p_discounted_price >= p_original_price
    THEN
        RAISE EXCEPTION 'Invalid prices'
            USING ERRCODE = '22023';
    END IF;

    -- Crear producto.

    INSERT INTO public.products (
        organization_id,
        category_id,
        name,
        description
    )
    VALUES (
        p_organization_id,
        p_category_id,
        btrim(p_name),
        NULLIF(btrim(p_description), '')
    )
    RETURNING id INTO v_product_id;

    -- Crear primer lote.

    INSERT INTO public.product_batches (
        product_id,
        expiration_date,
        original_price,
        discounted_price,
        quantity_on_hand
    )
    VALUES (
        v_product_id,
        p_expiration_date,
        p_original_price,
        p_discounted_price,
        p_quantity
    );

    RETURN v_product_id;

END;
$$;


-- 7. PERMISOS DE LA RPC

REVOKE ALL ON FUNCTION public.publish_product(
    UUID, UUID, TEXT, DATE, NUMERIC,
    NUMERIC, INTEGER, TEXT
)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.publish_product(
    UUID, UUID, TEXT, DATE, NUMERIC,
    NUMERIC, INTEGER, TEXT
)
TO authenticated;

-- FIN DE MIGRACION