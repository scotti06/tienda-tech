-- =============================================================================
-- Techstylebv — migraciones pendientes (003 → 006)
-- Pegá todo este script en Supabase → SQL Editor → Run
-- Es idempotente: podés ejecutarlo más de una vez sin romper nada.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 003 — Foto opcional por variante de color
-- -----------------------------------------------------------------------------
ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS image text NULL;

-- -----------------------------------------------------------------------------
-- 004 — Modelos de iPhone (stock por modelo en fundas)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_models (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  model_name text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT product_models_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS product_models_product_id_idx
  ON public.product_models (product_id);

ALTER TABLE public.product_models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON public.product_models;
CREATE POLICY "Public read" ON public.product_models
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth write" ON public.product_models;
CREATE POLICY "Auth write" ON public.product_models
  FOR ALL USING (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 005 — Colores vinculados a un modelo de iPhone (funda de silicona)
-- -----------------------------------------------------------------------------
ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS product_model_id uuid REFERENCES public.product_models(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS product_variants_product_model_id_idx
  ON public.product_variants (product_model_id);

-- -----------------------------------------------------------------------------
-- 006 — Bucket de Storage para subir imágenes desde el admin
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
CREATE POLICY "Public read products bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');

-- =============================================================================
-- Fin — esperá ~10 segundos y recargá el panel admin antes de guardar variantes.
-- =============================================================================
