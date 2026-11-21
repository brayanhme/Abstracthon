
-- MIGRACION 002
-- Creacion automatica de perfiles

-- Funcion para crear un perfil
-- cuando alguien se registra en Supabase Auth.

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Impedir que clientes ejecuten directamente
-- la funcion.

REVOKE ALL ON FUNCTION public.handle_new_user()
FROM PUBLIC, anon, authenticated;

-- Ejecutar la funcion cuando se registra
-- un usuario nuevo.

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Crear perfiles faltantes de usuarios
-- registrados antes de la migracion.

INSERT INTO public.profiles (id)
SELECT u.id
FROM auth.users AS u
WHERE NOT EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;
