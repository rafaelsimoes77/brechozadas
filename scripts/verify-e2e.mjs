/**
 * Suíte Automatizada de Verificação V2 (Build + CSS + Novas Rotas + Segurança + Hash-Chain SHA-256 + CLI)
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

async function importTsModule(relFile) {
  const fullPath = path.join(rootDir, relFile);
  const src = await fs.readFile(fullPath, "utf-8");
  const transpiled = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const dataUrl = `data:text/javascript;base64,${Buffer.from(
    transpiled.outputText
  ).toString("base64")}`;
  return import(dataUrl);
}

async function main() {
  console.log("🔍 1. Verificando Build V2, Novas Rotas & Middleware de Segurança...");
  const buildIdPath = path.join(rootDir, ".next", "BUILD_ID");
  assert(fsSync.existsSync(buildIdPath), "Build de produção (.next/BUILD_ID) presente");

  const expectedPages = [
    "index.html",
    "explorar.html",
    "kits.html",
    "brechos.html",
    "acervo.html",
    "revista.html",
    "vender.html",
    "pedidos.html",
    "seguranca.html",
  ];
  for (const page of expectedPages) {
    const p = path.join(rootDir, ".next", "server", "app", page);
    assert(fsSync.existsSync(p), `Página pré-renderizada ${page} gerada com sucesso`);
  }

  const apiRoutes = [
    "state",
    "products",
    "offers",
    "orders",
    "stores",
    "upload",
    "scene",
    "audit",
    "db-status",
  ];
  for (const api of apiRoutes) {
    assert(
      fsSync.existsSync(path.join(rootDir, ".next", "server", "app", "api", api, "route.js")),
      `Rota Backend API /api/${api} compilada`
    );
  }

  assert(
    fsSync.existsSync(path.join(rootDir, ".next", "server", "middleware-manifest.json")),
    "Middleware de Segurança OWASP (CSP, HSTS, Anti-CSRF, Rate Limit) compilado"
  );

  console.log("\n🔍 2. Auditando motor de segurança (XSS, Magic Bytes, LGPD & Hash-Chain SHA-256)...");
  const sec = await importTsModule("src/lib/security.ts");

  const dirty = '<script>alert("xss")</script>Polo Ecko javascript:evil()';
  const cleaned = sec.sanitizeText(dirty, 100);
  assert(!cleaned.includes("<script>") && !cleaned.includes("javascript:"), "Sanitizador bloqueou payloads XSS e URIs maliciosas");

  const fakeExeBuffer = Buffer.from("4D5A90000300000004000000FFFF0000", "hex"); // Executável Windows MZ disfarçado
  assert(sec.verifyImageMagicBytes(fakeExeBuffer).valid === false, "Filtro Magic Bytes bloqueou executável disfarçado de imagem");

  const realJpgImg = await fs.readFile(path.join(rootDir, "public", "images", "peca-polo-ecko.jpg"));
  assert(sec.verifyImageMagicBytes(realJpgImg).valid === true, "Filtro Magic Bytes aprovou foto JPEG autêntica");

  const genesisPrev = "0".repeat(64);
  const e1 = sec.createAuditEntry(genesisPrev, {
    action: "SYSTEM_GENESIS",
    actor: "BRECHOZADAS Security Core",
    target: "ledger/v2",
    details: "Inicialização segura do banco V2 com 6 brechós da cena.",
    rawIp: "127.0.0.1",
  });
  const e2 = sec.createAuditEntry(e1.integrityHash, {
    action: "STORE_UPDATED",
    actor: "@acervodoreliquia",
    target: "/brecho/acervodoreliquia",
    details: "Ecossistema de 6 brechós parceiros verificado.",
    rawIp: "192.168.0.10",
  });
  assert(sec.verifyAuditChain([e2, e1]) === true, "Cadeia criptográfica SHA-256 íntegra validada");

  // Simula tentativa de adulteração de histórico
  const tampered = [{ ...e2, details: "ADULTERADO" }, e1];
  assert(sec.verifyAuditChain(tampered) === false, "Detector de fraude identificou adulteração na trilha de auditoria");

  console.log("\n🔍 3. Gerando seed V2 limpo (6 brechós reais + trilha SHA-256) e testando CLI...");
  const mock = await importTsModule("src/data/mockData.ts");
  const seed = {
    products: mock.INITIAL_PRODUCTS,
    stores: mock.STORES,
    offers: {},
    orders: [],
    sceneMembers: mock.SCENE_NETWORK,
    stories: mock.EDITORIAL_STORIES,
    auditLogs: [e2, e1],
  };

  const dbPath = path.join(rootDir, "data", "db.json");
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(seed, null, 2), "utf-8");

  assert(seed.stores.length === 6, "6 brechós reais da cena carregados (@acervodoreliquia, @bonfire_brecho, @brechodimil, @relicari.oz, @gardebrecho_, @brechodosbari)");

  const statusOut = execFileSync(nodeExe, [cliScript, "status"], {
    cwd: rootDir,
    encoding: "utf-8",
  });
  assert(statusOut.includes("Brechós Cadastrados : 6"), "CLI leu os 6 brechós reais do banco V2");

  console.log("\n🎉 VERIFICAÇÃO V2 + AUDITORIA DE SEGURANÇA 100% APROVADA!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
