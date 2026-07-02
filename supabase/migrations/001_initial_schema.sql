-- Techstylebv store schema (migrated from data/store.json)

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE order_status AS ENUM (
  'pendiente',
  'preparando',
  'enviado',
  'entregado'
);

CREATE TYPE payment_method AS ENUM (
  'mercadopago',
  'card',
  'transfer'
);

CREATE TYPE shipping_method AS ENUM (
  'pickup',
  'standard',
  'express'
);

CREATE TYPE notification_type AS ENUM (
  'purchase'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE products (
  id text PRIMARY KEY,
  slug text NOT NULL,
  name text NOT NULL,
  category_id text NOT NULL,
  category text NOT NULL,
  subcategory text,
  description text,
  price integer NOT NULL DEFAULT 0,
  original_price integer,
  cash_price integer,
  stock integer NOT NULL DEFAULT 0,
  sku text,
  brand text,
  badge text,
  accent text NOT NULL DEFAULT 'bg-[radial-gradient(ellipse_at_50%_0%,#1a2e28_0%,#0a0c10_70%)]',
  image text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  image_frame jsonb NOT NULL DEFAULT '{"width":300,"height":300}',
  image_frame_fill numeric(4, 3),
  rating numeric(4, 2) NOT NULL DEFAULT 0,
  free_shipping boolean NOT NULL DEFAULT false,
  installments text,
  tags text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id text PRIMARY KEY,
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  shipping_street text,
  shipping_city text,
  shipping_province text,
  shipping_postal_code text,
  shipping_notes text,
  shipping_method shipping_method,
  shipping_cost integer,
  subtotal integer,
  payment_method payment_method,
  total integer NOT NULL,
  status order_status NOT NULL DEFAULT 'pendiente',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id text REFERENCES products (id) ON DELETE SET NULL,
  name text NOT NULL,
  image text NOT NULL,
  price integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  model text
);

CREATE TABLE notifications (
  id text PRIMARY KEY,
  type notification_type NOT NULL DEFAULT 'purchase',
  title text NOT NULL,
  order_id text NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  order_number text NOT NULL,
  customer_name text NOT NULL,
  total integer NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE UNIQUE INDEX products_slug_lower_idx ON products (lower(slug));

CREATE INDEX products_active_category_id_idx ON products (active, category_id);

CREATE INDEX orders_created_at_desc_idx ON orders (created_at DESC);

CREATE INDEX notifications_read_created_at_idx ON notifications (read, created_at DESC);

CREATE INDEX order_items_order_id_idx ON order_items (order_id);

CREATE INDEX notifications_order_id_idx ON notifications (order_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Note: the service role key bypasses RLS automatically (full access).

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public catalog: active products only
CREATE POLICY products_public_select
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Checkout: customers can create orders and line items
CREATE POLICY orders_public_insert
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY order_items_public_insert
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Notifications and admin writes use the service role (API routes).
