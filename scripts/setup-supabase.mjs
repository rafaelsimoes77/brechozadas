#!/usr/bin/env node

/**
 * BRECHOZADAS - Script de Conexão e Semente do Banco Gratuito (Supabase)
 * Execução: node scripts/setup-supabase.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(projectRoot, ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch {}
}

async function main() {
  console.log("\n⚡ ========================================================");
  console.log("   BRECHOZADAS por @acervodoreliquia");
  console.log("   Conector e Inicializador de Banco Gratuito (Supabase)");
  console.log("========================================================\n");

  await loadEnv();

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !url.startsWith("http") || url.includes("COLE_AQUI")) {
    console.log("❌ Chaves do Supabase não encontradas no arquivo .env.local!\n");
    console.log("Passo a passo rápido (100% gratuito, sem cartão de crédito):");
    console.log("1. Acesse: https://supabase.com e crie uma conta grátis");
    console.log("2. Clique em 'New Project' e escolha um nome (ex: brechozadas-db)");
    console.log("3. Vá em 'Project Settings' -> 'API' e copie:");
    console.log("   - Project URL");
    console.log("   - anon / public key (ou service_role key)");
    console.log("4. Vá em 'SQL Editor' -> cole o conteúdo de supabase/schema.sql e rode.");
    console.log("5. Cole as chaves no arquivo .env.local:\n");
    console.log("   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co");
    console.log("   SUPABASE_SERVICE_ROLE_KEY=eyJh...\n");
    console.log("Depois rode novamente este script: node scripts/setup-supabase.mjs\n");
    return;
  }

  console.log(`🔗 Conectando ao endpoint: ${url}...`);
  const client = createClient(url, key, {
    auth: { persistSession: false },
  });

  // Ler dados locais para semear
  const dbJsonPath = path.join(projectRoot, "data", "db.json");
  const rawDb = await fs.readFile(dbJsonPath, "utf-8");
  const localDb = JSON.parse(rawDb);

  console.log(`📦 Dados locais carregados:`);
  console.log(`   - ${localDb.products?.length || 0} peças`);
  console.log(`   - ${localDb.stores?.length || 0} brechós da cena`);
  console.log(`   - ${localDb.auditLogs?.length || 0} registros de auditoria SHA-256`);

  console.log("\n🚀 Enviando estado inicial para a tabela 'app_state' no Supabase...");
  const { error: stateError } = await client.from("app_state").upsert({
    id: "production",
    payload: localDb,
    updated_at: new Date().toISOString(),
  });

  if (stateError) {
    console.error("❌ Erro ao sincronizar app_state:", stateError.message);
    if (stateError.message.includes("relation \"public.app_state\" does not exist")) {
      console.log("\n💡 Dica: Você precisa rodar o script 'supabase/schema.sql' no SQL Editor do Supabase primeiro!");
    }
    return;
  }

  console.log("✅ Tabela 'app_state' sincronizada com sucesso!");

  // Opcional: sincronizar tabela relacional de peças se ela existir
  try {
    const productsRows = (localDb.products || []).map((p) => ({
      id: p.id,
      slug: p.slug,
      code: p.code,
      title: p.title,
      brand: p.brand,
      category: p.category,
      size: p.size,
      price: p.price,
      original_price: p.originalPrice || null,
      condition: p.condition,
      measurements: p.measurements,
      images: p.images,
      store_slug: p.storeSlug,
      is_pro: p.isPro || false,
      is_sold: p.isSold || false,
      drop_tag: p.dropTag || null,
      description: p.description,
    }));

    const { error: prodErr } = await client.from("products").upsert(productsRows);
    if (!prodErr) {
      console.log(`✅ Tabela relacional 'products' sincronizada (${productsRows.length} itens)!`);
    }
  } catch {}

  console.log("\n🎉 Banco permanente gratuito conectado com sucesso!");
  console.log("   Agora os dados do BRECHOZADAS nunca mais serão perdidos em deploys da Vercel.\n");
}

main().catch((err) => {
  console.error("Erro fatal no script:", err);
  process.exit(1);
});
