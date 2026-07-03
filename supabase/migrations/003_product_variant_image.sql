-- Optional product photo per color variant

ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS image text NULL;
