/**
 * Suíte Automatizada de Verificação (Build Next.js + Tailwind CSS + Banco Persistente + CLI)
 */
import { execFileSync } from "child_process";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const nodeExe = process.execPath;
const cliScript = path.join(rootDir, "cli", "brechozadas.mjs");

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`FALHA NA VERIFICAÇÃO: ${msg}`);
  }
  console.log(`  ✓ ${msg}`);
}

async function seedCleanDatabase() {
  const mockTsPath = path.join(rootDir, "src", "data", "mockData.ts");
  const mockSource = await fs.readFile(mockTsPath, "utf-8");
  const transpiled = ts.transpileModule(mockSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  const dataUrl = `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`;
  const mod = await import(dataUrl);

  const seed = {
    products: mod.INITIAL_PRODUCTS,
    stores: mod.STORES,
    offers: {},
    orders: [],
    sceneMembers: mod.SCENE_NETWORK,
    stories: mod.EDITORIAL_STORIES,
  };

  const dbPath = path.join(rootDir, "data", "db.json");
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(seed, null, 2), "utf-8");
  return dbPath;
}

async function main() {
  console.log("🔍 1. Verificando artefatos de produção Next.js & Tailwind CSS...");
  const buildIdPath = path.join(rootDir, ".next", "BUILD_ID");
  assert(fsSync.existsSync(buildIdPath), "Build de produção (.next/BUILD_ID) presente");

  const cssDir = path.join(rootDir, ".next", "static", "css");
  const cssFiles = await fs.readdir(cssDir);
  assert(cssFiles.length > 0, "Bundle CSS estático gerado pelo Next.js");

  const cssContent = await fs.readFile(path.join(cssDir, cssFiles[0]), "utf-8");
  assert(cssContent.toLowerCase().includes("#c93b1e"), "Cor Ferrugem/Terracota (#C93B1E) compilada no CSS");
  assert(cssContent.toLowerCase().includes("#eeff33"), "Cor Amarelo Neon (#EEFF33) compilada no CSS");
  assert(cssContent.includes("shadow-urban"), "Utilitário shadow-urban compilado no CSS");

  const expectedPages = [
    "index.html",
    "explorar.html",
    "brechos.html",
    "acervo.html",
    "revista.html",
    "vender.html",
    "pedidos.html",
  ];
  for (const page of expectedPages) {
    const p = path.join(rootDir, ".next", "server", "app", page);
    assert(fsSync.existsSync(p), `Página pré-renderizada ${page} gerada com sucesso`);
  }

  assert(
    fsSync.existsSync(path.join(rootDir, ".next", "server", "app", "brecho", "[slug]", "page.js")),
    "Rota dinâmica /brecho/[slug] compilada"
  );
  assert(
    fsSync.existsSync(path.join(rootDir, ".next", "server", "app", "peca", "[slug]", "page.js")),
    "Rota dinâmica /peca/[slug] compilada"
  );

  const apiRoutes = ["state", "products", "offers", "orders", "stores", "upload", "scene"];
  for (const api of apiRoutes) {
    assert(
      fsSync.existsSync(path.join(rootDir, ".next", "server", "app", "api", api, "route.js")),
      `Rota Backend API /api/${api} compilada`
    );
  }

  console.log("\n🔍 2. Inicializando banco persistente data/db.json e testando CLI...");
  const dbPath = await seedCleanDatabase();
  const cleanSeed = await fs.readFile(dbPath, "utf-8");
  const parsedSeed = JSON.parse(cleanSeed);
  assert(parsedSeed.products.length === 8, "8 peças iniciais carregadas em data/db.json");
  assert(parsedSeed.stores.length === 4, "4 brechós da cena carregados em data/db.json");

  const statusOut = execFileSync(nodeExe, [cliScript, "status"], {
    cwd: rootDir,
    encoding: "utf-8",
  });
  assert(statusOut.includes("RESUMO EXECUTIVO — BRECHOZADAS"), "CLI 'status' funcionando perfeitamente");

  const importOut = execFileSync(
    nodeExe,
    [cliScript, "importar-legenda", "👕🦏 Pólo Ecko Raridade | Tamanho GG | 💸 R$ 75,00"],
    { cwd: rootDir, encoding: "utf-8" }
  );
  assert(importOut.includes("Legenda importada com sucesso"), "CLI 'importar-legenda' converteu post do Instagram em produto");

  const sellOut = execFileSync(nodeExe, [cliScript, "vender", "#BRZ-109"], {
    cwd: rootDir,
    encoding: "utf-8",
  });
  assert(sellOut.includes("marcada como VENDIDO"), "CLI 'vender' deu baixa automática pelo código");

  // Restaura banco limpo para o usuário acordar com dados impecáveis
  await fs.writeFile(dbPath, cleanSeed, "utf-8");
  console.log("  ✓ Banco data/db.json pré-populado e pronto para uso imediato!");

  console.log("\n🎉 VERIFICAÇÃO 100% APROVADA (BUILD + CSS + ROTAS WEB + ROTAS API + BANCO + CLI)!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
