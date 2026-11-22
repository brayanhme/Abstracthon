
-- ==========================================
-- MIGRACION 003: ORGANIZATIONS
-- Plataforma de economia circular alimentaria
-- ==========================================

CREATE TABLE public.organizations (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    organization_type TEXT NOT NULL,

    description TEXT,

    phone TEXT,

    address TEXT,

    status TEXT NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    -- Nombre obligatorio y valido
    CONSTRAINT organizations_name_check
        CHECK (
            char_length(btrim(name))
            BETWEEN 2 AND 120
        ),

    -- Tipos permitidos
    CONSTRAINT organizations_type_check
        CHECK (
            organization_type IN (
                'food_business',
                'recovery_operator',
                'agricultural_producer'
            )
        ),

    -- Estados permitidos
    CONSTRAINT organizations_status_check
        CHECK (
            status IN (
                'pending',
                'active',
                'rejected',
                'suspended'
            )
        ),

    -- Limite de descripcion
    CONSTRAINT organizations_description_check
        CHECK (
            description IS NULL
            OR char_length(description) <= 1000
        ),

    -- Limite de telefono
    CONSTRAINT organizations_phone_check
        CHECK (
            phone IS NULL
            OR char_length(btrim(phone))
                BETWEEN 1 AND 25
        ),

    -- Limite de direccion
    CONSTRAINT organizations_address_check
        CHECK (
            address IS NULL
            OR char_length(btrim(address))
                BETWEEN 1 AND 250
        )
);

-- ==========================================
-- AUTOMATIZAR UPDATED_AT
-- ==========================================

CREATE FUNCTION public.set_organizations_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.set_organizations_updated_at();

-- ==========================================
-- SEGURIDAD DE ORGANIZACIONES
-- ==========================================

-- Activar RLS
ALTER TABLE public.organizations
ENABLE ROW LEVEL SECURITY;

-- Eliminar permisos directos de clientes
REVOKE ALL ON TABLE public.organizations
FROM PUBLIC, anon, authenticated;

-- Permitir lectura sujeta a RLS
GRANT SELECT ON TABLE public.organizations
TO anon, authenticated;

-- Solo organizaciones activas son visibles
CREATE POLICY organizations_select_active
ON public.organizations
FOR SELECT
TO anon, authenticated
USING (
    status = 'active'
);

-- No se crean politicas INSERT, UPDATE o DELETE.
-- Las escrituras quedan bloqueadas para clientes.

-- Indice para consultas del catalogo publico
CREATE INDEX idx_organizations_status_type
ON public.organizations (
    status,
    organization_type
);
