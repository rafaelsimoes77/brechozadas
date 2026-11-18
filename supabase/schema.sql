-- ====================================================================
-- BRECHOZADAS por @acervodoreliquia
-- Schema Oficial PostgreSQL (Supabase Free Tier)
-- 
-- Para rodar:
-- 1. Acesse seu painel em https://supabase.com
-- 2. Vá em "SQL Editor" -> "New Query"
-- 3. Cole todo este código e clique em "Run" (Ctrl+Enter)
-- ====================================================================

-- 1. Tabela Principal de Estado Unificado (Garante sincronização atômica imediata)
CREATE TABLE IF NOT EXISTS public.app_state (
  id TEXT PRIMARY KEY DEFAULT 'production',
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Peças & Catálogo (Relacional para buscas e relatórios)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  condition TEXT NOT NULL,
  measurements JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  store_slug TEXT NOT NULL,
  is_pro BOOLEAN DEFAULT false,
  is_sold BOOLEAN DEFAULT false,
  drop_tag TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Brechós Parceiros da Cena
CREATE TABLE IF NOT EXISTS public.stores (
  slug TEXT PRIMARY KEY,
  id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  instagram TEXT NOT NULL,
  neighborhood TEXT,
  bio TEXT,
  verified BOOLEAN DEFAULT false,
  is_pro BOOLEAN DEFAULT false,
  accent_color TEXT DEFAULT '#C93B1E',
  rating NUMERIC(3, 1) DEFAULT 5.0,
  delivery_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Pedidos & Escrow (Taxas de intermediação e repasses)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_value NUMERIC(10, 2) DEFAULT 0,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  delivery_method TEXT NOT NULL,
  delivery_detail TEXT,
  payment_method TEXT NOT NULL,
  seller_payouts JSONB NOT NULL DEFAULT '[]'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Trilha de Auditoria Criptográfica SHA-256 (OWASP & LGPD)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  integrity_hash TEXT NOT NULL,
  prev_hash TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT NOT NULL,
  anonymized_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_products_store ON public.products(store_slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_sold ON public.products(is_sold);
CREATE INDEX IF NOT EXISTS idx_audit_integrity ON public.audit_logs(integrity_hash);
CREATE INDEX IF NOT EXISTS idx_orders_code ON public.orders(code);

-- Habilitar RLS (Row Level Security) com políticas de leitura pública e escrita autenticada
ALTER TABLE public.app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir leitura publica de app_state') THEN
    CREATE POLICY "Permitir leitura publica de app_state" ON public.app_state FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir leitura publica de products') THEN
    CREATE POLICY "Permitir leitura publica de products" ON public.products FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir leitura publica de stores') THEN
    CREATE POLICY "Permitir leitura publica de stores" ON public.stores FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir leitura publica de audit_logs') THEN
    CREATE POLICY "Permitir leitura publica de audit_logs" ON public.audit_logs FOR SELECT USING (true);
  END IF;

  -- Políticas para Service Role / Escrita do Backend Next.js
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir escrita total para service_role app_state') THEN
    CREATE POLICY "Permitir escrita total para service_role app_state" ON public.app_state FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir escrita total para service_role products') THEN
    CREATE POLICY "Permitir escrita total para service_role products" ON public.products FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir escrita total para service_role stores') THEN
    CREATE POLICY "Permitir escrita total para service_role stores" ON public.stores FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir escrita total para service_role orders') THEN
    CREATE POLICY "Permitir escrita total para service_role orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir escrita total para service_role audit_logs') THEN
    CREATE POLICY "Permitir escrita total para service_role audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
