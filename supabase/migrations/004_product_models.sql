-- iPhone model stock per fundas product

CREATE TABLE public.product_models (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  model_name text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT product_models_pkey PRIMARY KEY (id)
);

CREATE INDEX product_models_product_id_idx ON public.product_models (product_id);

ALTER TABLE public.product_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.product_models
  FOR SELECT USING (true);

CREATE POLICY "Auth write" ON public.product_models
  FOR ALL USING (auth.role() = 'authenticated');
