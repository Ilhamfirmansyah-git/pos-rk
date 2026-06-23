-- ============================================================
-- Anon access policy untuk development (sebelum auth diimplementasi)
-- Jalankan di: Supabase Dashboard → SQL Editor → New query
--
-- CATATAN: Hapus policy ini dan ganti dengan policy berbasis auth
-- setelah fitur multi-user/login diimplementasi.
-- ============================================================

CREATE POLICY "anon_all" ON categories
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON products
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON product_variants
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON transactions
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON transaction_items
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON stock_logs
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON store_users
  FOR ALL TO anon USING (true) WITH CHECK (true);
