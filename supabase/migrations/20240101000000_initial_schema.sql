-- ============================================================
-- POS-RK Initial Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Tables ──────────────────────────────────────────────────

CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at   TIMESTAMPTZ
);

CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku                 TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  description         TEXT,
  category_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
  price               INTEGER NOT NULL DEFAULT 0,
  cost_price          INTEGER NOT NULL DEFAULT 0,
  stock               INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  image_url           TEXT,
  barcode             TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  has_variants        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at           TIMESTAMPTZ
);

CREATE TABLE product_variants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  sku        TEXT NOT NULL UNIQUE,
  price      INTEGER NOT NULL DEFAULT 0,
  stock      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at  TIMESTAMPTZ
);

CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number  TEXT NOT NULL UNIQUE,
  cashier_id      UUID,
  cashier_name    TEXT NOT NULL,
  subtotal        INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  tax_amount      INTEGER NOT NULL DEFAULT 0,
  total           INTEGER NOT NULL DEFAULT 0,
  payment_method  TEXT NOT NULL,
  amount_paid     INTEGER NOT NULL DEFAULT 0,
  change_amount   INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'completed',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at       TIMESTAMPTZ
);

CREATE TABLE transaction_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name    TEXT NOT NULL,
  product_sku     TEXT NOT NULL,
  variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  variant_name    TEXT,
  quantity        INTEGER NOT NULL DEFAULT 1,
  unit_price      INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  subtotal        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at       TIMESTAMPTZ
);

CREATE TABLE stock_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  type            TEXT NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_change INTEGER NOT NULL,
  quantity_after  INTEGER NOT NULL,
  reference_id    UUID,
  notes           TEXT,
  performed_by    TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at       TIMESTAMPTZ
);

-- Tabel kasir — terpisah dari Supabase Auth (untuk PIN login cepat)
CREATE TABLE store_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'cashier',
  pin           TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at     TIMESTAMPTZ
);

-- ─── Indexes ─────────────────────────────────────────────────

CREATE INDEX idx_products_category_id   ON products(category_id);
CREATE INDEX idx_products_is_active      ON products(is_active);
CREATE INDEX idx_products_sku            ON products(sku);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_status     ON transactions(status);
CREATE INDEX idx_transaction_items_tx   ON transaction_items(transaction_id);
CREATE INDEX idx_stock_logs_product_id  ON stock_logs(product_id);
CREATE INDEX idx_stock_logs_created_at  ON stock_logs(created_at);

-- ─── Row Level Security ───────────────────────────────────────

ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_users      ENABLE ROW LEVEL SECURITY;

-- Policy: semua operasi untuk authenticated users
-- Perketat nanti setelah multi-user auth diimplementasi
CREATE POLICY "authenticated_all" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all" ON product_variants
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all" ON transactions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all" ON transaction_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all" ON stock_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all" ON store_users
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
