#!/usr/bin/env node
/**
 * BRECHOZADAS CLI — Ferramenta de Linha de Comando & Automação de Curadoria
 * Conectada ao mesmo banco persistente (data/db.json) da aplicação Web/API.
 */
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dbPath = path.join(projectRoot, "data", "db.json");

async function loadDb() {
  if (!fsSync.existsSync(dbPath)) {
    console.error(
      "⚠ Banco data/db.json ainda não inicializado. Inicie o servidor web ou rode um pedido/seed primeiro."
    );
    process.exit(1);
  }
  const raw = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(raw);
}

async function saveDb(db) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

function parseInstagramCaption(caption, storeSlug = "acervodoreliquia") {
  const isSold = /vendid[oa]/i.test(caption);

  // Extrai tamanho (ex: "Tamanho G", "Tam M", "TAM GG", "41")
  const sizeMatch = caption.match(/tam(?:anho)?\s*[:\-]?\s*(PP|P|M|G|GG|38|40|41|42)/i);
  const size = sizeMatch ? sizeMatch[1].toUpperCase() : "G";

  // Extrai preço (ex: "R$ 60,00", "60,00$", "38$")
  const priceMatch =
    caption.match(/R\$\s*(\d+(?:[.,]\d{1,2})?)/i) ||
    caption.match(/(\d+(?:[.,]\d{1,2})?)\s*\$/);
  const price = priceMatch
    ? Math.round( parseFloat(priceMatch[1].replace(",", ".")) )
    : 60;

  // Detecta marca conhecida
  const knownBrands = [
    "Ecko Unltd.",
    "Ecko",
    "Polo Ralph Lauren",
    "Ralph Lauren",
    "Nike",
    "Adidas",
    "Alpinestars",
    "Mizuno",
    "FUBU",
    "Oakley",
  ];
  let brand = "Garimpo Urbano";
  for (const b of knownBrands) {
    if (caption.toLowerCase().includes(b.toLowerCase())) {
      brand = b === "Ecko" ? "Ecko Unltd." : b === "Ralph Lauren" ? "Polo Ralph Lauren" : b;
      break;
    }
  }

  // Limpa título da primeira parte da legenda
  let cleanTitle = caption
    .replace(/❌+\s*VENDID[OA]\s*❌+/gi, "")
    .split(/[|\n]/)[0]
    .replace(/[^\p{L}\p{N}\s#\-/.]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanTitle) cleanTitle = `Relíquia Importada ${brand}`;

  return {
    title: cleanTitle,
    brand,
    size,
    price,
    isSold,
    storeSlug,
  };
}

async function main() {
  const [, , cmd, ...args] = process.argv;

  if (!cmd || cmd === "help" || cmd === "--help") {
    console.log(`
🏴 BRECHOZADAS CLI — Gestão & Automação (@acervodoreliquia)
============================================================
Comandos disponíveis:
  status                              Resumo geral do marketplace, vendas e planos PRO
  pecas                               Lista todas as peças cadastradas no banco
  brechos                             Lista todos os brechós e links de suas páginas
  importar-legenda "<texto>" [loja]   Transforma legenda do Instagram em produto no site!
  vender <codigo>                     Marca peça como VENDIDO pelo código (ex: #BRZ-101)
`);
    return;
  }

  const db = await loadDb();

  if (cmd === "status") {
    const disp = db.products.filter((p) => !p.isSold && p.mode === "venda").length;
    const vend = db.products.filter((p) => p.isSold).length;
    const acv = db.products.filter((p) => p.mode === "acervo").length;
    const proStores = db.stores.filter((s) => s.isPro).length;
    const revenue = db.orders.reduce((acc, o) => acc + o.total, 0);

    console.log("\n🏴 RESUMO EXECUTIVO — BRECHOZADAS");
    console.log("--------------------------------------------------");
    console.log(`• Brechós Cadastrados : ${db.stores.length} (${proStores} assinantes PRO 0% taxa)`);
    console.log(`• Peças Disponíveis   : ${disp}`);
    console.log(`• Peças Já Vendidas   : ${vend}`);
    console.log(`• Peças de Acervo     : ${acv} (locação p/ clipes & styling)`);
    console.log(`• Ofertas Registradas : ${Object.keys(db.offers || {}).length}`);
    console.log(`• Pedidos Fechados    : ${db.orders.length} (R$ ${revenue},00 movimentados)`);
    console.log(`• Talentos na Rede    : ${db.sceneMembers.length}`);
    console.log("--------------------------------------------------\n");
    return;
  }

  if (cmd === "pecas") {
    console.log("\n👕 CATÁLOGO DE PEÇAS NO BANCO (data/db.json):");
    console.log("--------------------------------------------------------------------------------");
    for (const p of db.products) {
      const status = p.isSold ? "VENDIDO   " : p.mode === "acervo" ? "ACERVO    " : "DISPONÍVEL";
      console.log(
        `${p.code.padEnd(9)} | ${status} | TAM ${String(p.size).padEnd(4)} | R$ ${String(
          p.price
        ).padEnd(5)} | @${p.storeSlug.padEnd(16)} | ${p.title}`
      );
    }
    console.log("--------------------------------------------------------------------------------\n");
    return;
  }

  if (cmd === "brechos") {
    console.log("\n🏪 PÁGINAS DE BRECHÓS ATIVAS:");
    console.log("--------------------------------------------------------------------------------");
    for (const s of db.stores) {
      const plan = s.isPro ? "PRO (0% taxa)" : "Direto (10%) ";
      console.log(
        `${s.handle.padEnd(20)} | ${plan} | Vendas: ${String(s.soldCount).padEnd(
          4
        )} | /brecho/${s.slug}`
      );
    }
    console.log("--------------------------------------------------------------------------------\n");
    return;
  }

  if (cmd === "importar-legenda") {
    const caption = args[0];
    const storeSlug = args[1] || "acervodoreliquia";
    if (!caption) {
      console.error('Uso: node cli/brechozadas.mjs importar-legenda "👕 Pólo Ecko | Tamanho G | R$ 60,00"');
      process.exit(1);
    }
    const parsed = parseInstagramCaption(caption, storeSlug);
    const nextNum = 101 + db.products.length;
    const slug =
      parsed.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + `-${nextNum}`;

    const created = {
      id: `p-${Date.now()}`,
      slug,
      code: `#BRZ-${nextNum}`,
      title: parsed.title,
      brand: parsed.brand,
      category: "Polos & Camisas",
      size: parsed.size,
      fit: "Largo / Baggy (Chavoso)",
      measurements: { largura: "60 cm", comprimento: "74 cm" },
      condition: "9.5/10 • Importada via CLI do Instagram",
      price: parsed.price,
      mode: "venda",
      isSold: parsed.isSold,
      isBoostedPro: true,
      acceptsOffers: true,
      minOfferRatio: 0.8,
      likes: 1,
      image: "/images/peca-polo-ecko.jpg",
      storyBehindPiece: `Importado automaticamente da legenda original do Instagram: "${caption}"`,
      storeSlug: parsed.storeSlug,
      questions: [],
    };

    db.products.unshift(created);
    await saveDb(db);
    console.log(`✅ Legenda importada com sucesso! Criada peça ${created.code}: "${created.title}" (TAM ${created.size} • R$ ${created.price}) em /peca/${created.slug}`);
    return;
  }

  if (cmd === "vender") {
    const codeArg = (args[0] || "").toUpperCase();
    const target = db.products.find(
      (p) => p.code.toUpperCase() === codeArg || p.code.replace("#", "").toUpperCase() === codeArg
    );
    if (!target) {
      console.error(`❌ Peça com código "${args[0]}" não encontrada.`);
      process.exit(1);
    }
    target.isSold = true;
    await saveDb(db);
    console.log(`✅ Peça ${target.code} (${target.title}) marcada como VENDIDO no site!`);
    return;
  }

  console.error(`Comando desconhecido: ${cmd}. Use "help" para ver os comandos.`);
}

main();
