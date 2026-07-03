-- Color variants for specific products (e.g. Funda de silicona para iPhone)

CREATE TABLE public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color_name text NOT NULL,
  color_hex text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_pkey PRIMARY KEY (id)
);

CREATE INDEX product_variants_product_id_idx ON public.product_variants (product_id);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.product_variants
  FOR SELECT USING (true);

CREATE POLICY "Auth write" ON public.product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- Persist selected color on order line items
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS color_name text,
  ADD COLUMN IF NOT EXISTS color_hex text;
