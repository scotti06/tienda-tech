-- Link color variants to a specific iPhone model (funda de silicona)

ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS product_model_id uuid REFERENCES public.product_models(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS product_variants_product_model_id_idx
  ON public.product_variants (product_model_id);
