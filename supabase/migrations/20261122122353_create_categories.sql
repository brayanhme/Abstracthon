-- ============================================
-- BACKEND 2 - MIGRACION 001
-- Categorias de alimentos
-- Proyecto: ReAprovecha
-- ============================================

-- 1. TABLA DE CATEGORIAS

CREATE TABLE public.categories (
    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE,

    slug TEXT NOT NULL UNIQUE,

    CONSTRAINT categories_name_check
        CHECK (
            name = btrim(name)
            AND char_length(name) BETWEEN 2 AND 50
        ),

    CONSTRAINT categories_slug_check
        CHECK (
            slug ~ '^[a-z][a-z0-9-]{1,49}$'
        )
);

-- 2. SEGURIDAD RLS

ALTER TABLE public.categories
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.categories
FROM PUBLIC, anon, authenticated;

-- Permitir lectura del catalogo.

GRANT SELECT ON TABLE public.categories
TO anon, authenticated;

CREATE POLICY categories_select_public
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);

-- No habilitamos INSERT, UPDATE ni DELETE
-- desde los clientes web.

-- 3. CATEGORIAS INICIALES

INSERT INTO public.categories (name, slug)
VALUES
    ('Lácteos', 'lacteos'),
    ('Jugos', 'jugos'),
    ('Frutas', 'frutas'),
    ('Verduras', 'verduras'),
    ('Otros', 'otros');

-- ============================================
-- FIN DE MIGRACION
-- ============================================