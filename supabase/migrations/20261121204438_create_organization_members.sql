
-- ============================================
-- MIGRACION 004: ORGANIZATION MEMBERS
-- Proyecto: Economia circular alimentaria
-- ============================================

CREATE TABLE public.organization_members (

    organization_id UUID NOT NULL,

    user_id UUID NOT NULL,

    member_role TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    -- Un usuario solo puede tener una membresia
    -- por organizacion.
    CONSTRAINT organization_members_pkey
        PRIMARY KEY (organization_id, user_id),

    -- Relacion con la empresa.
    CONSTRAINT organization_members_organization_fk
        FOREIGN KEY (organization_id)
        REFERENCES public.organizations(id)
        ON DELETE RESTRICT,

    -- Relacion con el perfil del usuario.
    CONSTRAINT organization_members_user_fk
        FOREIGN KEY (user_id)
        REFERENCES public.profiles(id)
        ON DELETE RESTRICT,

    -- Roles permitidos.
    CONSTRAINT organization_members_role_check
        CHECK (
            member_role IN ('owner', 'staff')
        )
);

-- ============================================
-- UN SOLO PROPIETARIO POR ORGANIZACION
-- ============================================

CREATE UNIQUE INDEX
idx_organization_members_one_owner
ON public.organization_members (organization_id)
WHERE member_role = 'owner';

-- Indice para buscar todas las organizaciones
-- a las que pertenece un usuario.

CREATE INDEX
idx_organization_members_user_id
ON public.organization_members (user_id);

-- ============================================
-- SEGURIDAD RLS
-- ============================================

ALTER TABLE public.organization_members
ENABLE ROW LEVEL SECURITY;

-- Quitar permisos de los roles publicos.
REVOKE ALL ON TABLE public.organization_members
FROM PUBLIC, anon, authenticated;

-- Permitir consultar membresias,
-- siempre que se cumpla RLS.
GRANT SELECT ON TABLE public.organization_members
TO authenticated;

-- Cada usuario consulta solo sus membresias.
CREATE POLICY organization_members_select_own
ON public.organization_members
FOR SELECT
TO authenticated
USING (
    user_id = (SELECT auth.uid())
);

-- No otorgamos INSERT, UPDATE ni DELETE.
-- Las membresias se gestionaran mediante
-- operaciones controladas posteriormente.
