
-- =============================================
-- MIGRACION 005: ORGANIZATION OPERATIONS
-- Registro seguro de organizaciones
-- =============================================

CREATE FUNCTION public.create_organization(
    p_name TEXT,
    p_organization_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_organization_id UUID;
BEGIN

    -- 1. Obtener el usuario autenticado.
    v_user_id := (SELECT auth.uid());

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION
            'Authentication required'
            USING ERRCODE = '42501';
    END IF;

    -- 2. Verificar que exista su perfil.
    IF NOT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = v_user_id
    ) THEN
        RAISE EXCEPTION
            'User profile not found'
            USING ERRCODE = 'P0001';
    END IF;

    -- 3. Crear la organizacion.
    -- El estado siempre sera pending.
    INSERT INTO public.organizations (
        name,
        organization_type,
        description,
        phone,
        address,
        status
    )
    VALUES (
        btrim(p_name),
        p_organization_type,
        NULLIF(btrim(p_description), ''),
        NULLIF(btrim(p_phone), ''),
        NULLIF(btrim(p_address), ''),
        'pending'
    )
    RETURNING id INTO v_organization_id;

    -- 4. Registrar al usuario como propietario.
    INSERT INTO public.organization_members (
        organization_id,
        user_id,
        member_role
    )
    VALUES (
        v_organization_id,
        v_user_id,
        'owner'
    );

    -- 5. Devolver el identificador generado.
    RETURN v_organization_id;

END;
$$;

-- =============================================
-- PERMISOS DE EJECUCION
-- =============================================

REVOKE ALL ON FUNCTION public.create_organization(
    TEXT, TEXT, TEXT, TEXT, TEXT
)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_organization(
    TEXT, TEXT, TEXT, TEXT, TEXT
)
TO authenticated;
