
-- =====================================================
-- MIGRACION 001: CREATE PROFILES
-- Proyecto: Plataforma de economia circular alimentaria
-- Backend 1: Usuarios y seguridad
-- =====================================================

-- 1. CREAR TABLA PROFILES

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    display_name TEXT,

    phone TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    CONSTRAINT profiles_display_name_check
        CHECK (
            display_name IS NULL
            OR (
                char_length(btrim(display_name))
                BETWEEN 1 AND 100
            )
        ),

    CONSTRAINT profiles_phone_check
        CHECK (
            phone IS NULL
            OR (
                char_length(btrim(phone))
                BETWEEN 1 AND 25
            )
        )
);

-- =====================================================
-- 2. HABILITAR ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles
ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. TRIGGER PARA UPDATED_AT
-- =====================================================

CREATE FUNCTION public.set_profiles_updated_at()
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

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_profiles_updated_at();

-- =====================================================
-- 4. PERMISOS SQL
-- =====================================================

-- Retirar permisos iniciales a clientes.
REVOKE ALL ON TABLE public.profiles
FROM PUBLIC, anon, authenticated;

-- Permitir acceso al esquema.
GRANT USAGE ON SCHEMA public
TO authenticated;

-- Usuarios autenticados pueden consultar perfiles,
-- sujetos a las restricciones RLS.
GRANT SELECT ON TABLE public.profiles
TO authenticated;

-- Usuarios autenticados solo pueden actualizar
-- nombre y telefono.
GRANT UPDATE (display_name, phone)
ON TABLE public.profiles
TO authenticated;

-- No conceder INSERT ni DELETE a clientes.

-- =====================================================
-- 5. POLITICA: CONSULTAR PERFIL PROPIO
-- =====================================================

CREATE POLICY profiles_select_own
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = (SELECT auth.uid())
);

-- =====================================================
-- 6. POLITICA: ACTUALIZAR PERFIL PROPIO
-- =====================================================

CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    id = (SELECT auth.uid())
)
WITH CHECK (
    id = (SELECT auth.uid())
);

-- =====================================================
-- FIN DE MIGRACION 001
-- =====================================================
