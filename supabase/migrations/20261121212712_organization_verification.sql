
-- ==========================================
-- MIGRACION 006
-- 1. CONSULTAR MIS ORGANIZACIONES
-- ==========================================

CREATE POLICY organizations_select_as_member
ON public.organizations
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members AS m
        WHERE m.organization_id = organizations.id
          AND m.user_id = (SELECT auth.uid())
    )
);

-- ==========================================
-- 2. SOLICITUDES DE VERIFICACION
-- ==========================================

CREATE TABLE public.organization_verification_requests (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL UNIQUE
        REFERENCES public.organizations(id)
        ON DELETE RESTRICT,

    submitted_by UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE RESTRICT,

    message TEXT,

    review_status TEXT NOT NULL
        DEFAULT 'pending',

    submitted_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    reviewed_at TIMESTAMPTZ,

    review_note TEXT,

    CONSTRAINT verification_message_check
        CHECK (
            message IS NULL
            OR char_length(btrim(message))
               BETWEEN 1 AND 500
        ),

    CONSTRAINT verification_status_check
        CHECK (
            review_status IN (
                'pending',
                'approved',
                'rejected'
            )
        ),

    CONSTRAINT verification_note_check
        CHECK (
            review_note IS NULL
            OR char_length(btrim(review_note))
               BETWEEN 1 AND 1000
        ),

    CONSTRAINT verification_review_consistency_check
        CHECK (
            (
                review_status = 'pending'
                AND reviewed_at IS NULL
            )
            OR
            (
                review_status IN ('approved', 'rejected')
                AND reviewed_at IS NOT NULL
            )
        )
);

CREATE INDEX idx_verification_requests_status
ON public.organization_verification_requests (
    review_status
);

-- ==========================================
-- 3. SEGURIDAD RLS
-- ==========================================

ALTER TABLE
    public.organization_verification_requests
ENABLE ROW LEVEL SECURITY;

-- No permitir acceso directo de escritura.
REVOKE ALL ON TABLE
    public.organization_verification_requests
FROM PUBLIC, anon, authenticated;

-- Los usuarios autenticados pueden leer
-- solamente las solicitudes autorizadas.
GRANT SELECT ON TABLE
    public.organization_verification_requests
TO authenticated;

-- Un propietario puede consultar la solicitud
-- de su propia organizacion.
CREATE POLICY verification_select_own
ON public.organization_verification_requests
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.organization_members AS m
        WHERE m.organization_id =
              organization_verification_requests.organization_id
          AND m.user_id = (SELECT auth.uid())
          AND m.member_role = 'owner'
    )
);

-- INSERT, UPDATE y DELETE siguen bloqueados
-- para los clientes de la aplicacion.

-- ==========================================
-- 4. ENVIAR SOLICITUD DE VERIFICACION
-- ==========================================

CREATE FUNCTION public.submit_organization_verification(
    p_organization_id UUID,
    p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_request_id UUID;
BEGIN

    -- Obtener identidad real.
    v_user_id := (SELECT auth.uid());

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required'
            USING ERRCODE = '42501';
    END IF;

    -- Solo el propietario puede solicitar.
    IF NOT EXISTS (
        SELECT 1
        FROM public.organization_members AS m
        WHERE m.organization_id = p_organization_id
          AND m.user_id = v_user_id
          AND m.member_role = 'owner'
    ) THEN
        RAISE EXCEPTION 'Not organization owner'
            USING ERRCODE = '42501';
    END IF;

    -- Solo organizaciones pendientes.
    IF NOT EXISTS (
        SELECT 1
        FROM public.organizations AS o
        WHERE o.id = p_organization_id
          AND o.status = 'pending'
    ) THEN
        RAISE EXCEPTION 'Organization is not pending'
            USING ERRCODE = 'P0001';
    END IF;

    -- Registrar solicitud.
    INSERT INTO public.organization_verification_requests (
        organization_id,
        submitted_by,
        message
    )
    VALUES (
        p_organization_id,
        v_user_id,
        NULLIF(btrim(p_message), '')
    )
    RETURNING id INTO v_request_id;

    RETURN v_request_id;

END;
$$;

-- Bloquear ejecucion publica por defecto.
REVOKE ALL ON FUNCTION
    public.submit_organization_verification(UUID, TEXT)
FROM PUBLIC, anon, authenticated;

-- Solo usuarios autenticados pueden invocarla.
GRANT EXECUTE ON FUNCTION
    public.submit_organization_verification(UUID, TEXT)
TO authenticated;
