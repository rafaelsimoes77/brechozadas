/**
 * BRECHOZADAS — Publicador & Controle de Versões Direto para o GitHub (Zero dependência de Git instalado)
 * Cria o repositório automaticamente na conta do usuário e envia commits versionados completos (código + imagens).
 */
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env.local");

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "out",
  "build",
]);

const IGNORE_FILES = new Set([
  ".env",
  ".env.local",
  ".env.production.local",
  ".env.development.local",
  "tsconfig.tsbuildinfo",
  "next-env.d.ts",
]);

const BINARY_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".ico",
  ".woff",
  ".woff2",
]);

async function readStoredToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  if (fsSync.existsSync(envPath)) {
    const raw = await fs.readFile(envPath, "utf-8");
    const m = raw.match(/^GITHUB_TOKEN=(.+)$/m);
    if (m && m[1].trim()) return m[1].trim();
  }
  return null;
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function ghFetch(urlPath, token, options = {}) {
  const res = await fetch(`https://api.github.com${urlPath}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "brechozadas-deployer",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}
  return { status: res.status, ok: res.ok, json, text };
}

async function collectFiles(dir, relPrefix = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      const nested = await collectFiles(
        path.join(dir, entry.name),
        relPrefix ? `${relPrefix}/${entry.name}` : entry.name
      );
      files = files.concat(nested);
    } else if (entry.isFile()) {
      if (IGNORE_FILES.has(entry.name)) continue;
      if (entry.name.endsWith(".log") || entry.name.endsWith(".tsbuildinfo")) continue;
      const relPath = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
      files.push({
        absPath: path.join(dir, entry.name),
        relPath,
      });
    }
  }
  return files;
}

async function main() {
  const argToken = process.argv.find((a) => a.startsWith("--token="))?.split("=")[1];
  const commitMsg =
    process.argv.find((a) => a.startsWith("--msg="))?.slice(6) ||
    `deploy: atualizacao BRECHOZADAS (${new Date().toLocaleString("pt-BR")})`;
  const repoName =
    process.argv.find((a) => a.startsWith("--repo="))?.split("=")[1] ||
    "brechozadas";

  let token = argToken || (await readStoredToken());

  if (!token) {
    console.log("\n============================================================");
    console.log("  CONECTAR SEU GITHUB (Configuracao unica!)");
    console.log("============================================================");
    console.log("1. Uma aba do GitHub pode ser aberta no link abaixo:");
    console.log("   https://github.com/settings/tokens/new?description=BRECHOZADAS-Deploy&scopes=repo,workflow");
    console.log("2. Role ate o final da pagina, clique em 'Generate token'");
    console.log("3. Copie o codigo que comeca com 'ghp_...' e cole abaixo:\n");
    token = await askQuestion("Cole seu token ghp_... aqui: ");
  }

  if (!token) {
    console.error("❌ Nenhum token informado.");
    process.exit(1);
  }

  console.log("\n🔐 Autenticando no GitHub...");
  const me = await ghFetch("/user", token);
  if (!me.ok) {
    console.error(
      `❌ Token recusado pelo GitHub (HTTP ${me.status}). Certifique-se de usar um Personal Access Token iniciado em 'ghp_' ou 'github_pat_' com permissao 'repo'.`
    );
    process.exit(1);
  }

  const owner = me.json.login;
  console.log(`✅ Conectado como @${owner}!`);

  // Preserva variaveis existentes no .env.local (como Supabase) e atualiza GITHUB_TOKEN
  try {
    let existing = "";
    if (fsSync.existsSync(envPath)) {
      existing = await fs.readFile(envPath, "utf-8");
    }
    if (existing.includes("GITHUB_TOKEN=")) {
      existing = existing.replace(/^GITHUB_TOKEN=.*$/m, `GITHUB_TOKEN=${token}`);
    } else {
      existing = `GITHUB_TOKEN=${token}\n` + existing;
    }
    await fs.writeFile(envPath, existing, "utf-8");
  } catch {}

  // Verifica se o repositorio ja existe; se nao, cria com auto_init: true
  let repoCheck = await ghFetch(`/repos/${owner}/${repoName}`, token);
  if (repoCheck.status === 404) {
    console.log(`📦 Criando repositorio '${owner}/${repoName}' no seu GitHub...`);
    const created = await ghFetch("/user/repos", token, {
      method: "POST",
      body: JSON.stringify({
        name: repoName,
        description:
          "BRECHOZADAS — Marketplace da Moda de Quebrada (@acervodoreliquia) • Next.js + API + CLI",
        private: false,
        auto_init: true,
      }),
    });
    if (!created.ok) {
      console.error("❌ Erro ao criar repositorio:", created.text);
      process.exit(1);
    }
    // Aguarda 2s para o commit inicial do GitHub ficar disponivel
    await new Promise((r) => setTimeout(r, 2000));
    repoCheck = await ghFetch(`/repos/${owner}/${repoName}`, token);
  }

  const defaultBranch = repoCheck.json?.default_branch || "main";
  const refRes = await ghFetch(
    `/repos/${owner}/${repoName}/git/ref/heads/${defaultBranch}`,
    token
  );
  if (!refRes.ok) {
    console.error("❌ Nao foi possivel ler a branch principal:", refRes.text);
    process.exit(1);
  }
  const latestCommitSha = refRes.json.object.sha;

  const files = await collectFiles(rootDir);
  console.log(`📤 Enviando ${files.length} arquivos do projeto (codigo + fotos)...`);

  const treeItems = [];
  for (const f of files) {
    const ext = path.extname(f.relPath).toLowerCase();
    const isBin = BINARY_EXTENSIONS.has(ext);
    const buf = await fs.readFile(f.absPath);

    const blobRes = await ghFetch(`/repos/${owner}/${repoName}/git/blobs`, token, {
      method: "POST",
      body: JSON.stringify({
        content: isBin ? buf.toString("base64") : buf.toString("utf-8"),
        encoding: isBin ? "base64" : "utf-8",
      }),
    });

    if (!blobRes.ok) {
      throw new Error(`Falha ao enviar ${f.relPath}: ${blobRes.text}`);
    }

    treeItems.push({
      path: f.relPath,
      mode: "100644",
      type: "blob",
      sha: blobRes.json.sha,
    });
  }

  const treeRes = await ghFetch(`/repos/${owner}/${repoName}/git/trees`, token, {
    method: "POST",
    body: JSON.stringify({
      tree: treeItems,
    }),
  });
  if (!treeRes.ok) {
    throw new Error(`Falha ao montar arvore Git: ${treeRes.text}`);
  }

  const commitRes = await ghFetch(
    `/repos/${owner}/${repoName}/git/commits`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        message: commitMsg,
        tree: treeRes.json.sha,
        parents: [latestCommitSha],
      }),
    }
  );
  if (!commitRes.ok) {
    throw new Error(`Falha ao registrar versao (commit): ${commitRes.text}`);
  }

  const updateRef = await ghFetch(
    `/repos/${owner}/${repoName}/git/refs/heads/${defaultBranch}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify({
        sha: commitRes.json.sha,
        force: true,
      }),
    }
  );
  if (!updateRef.ok) {
    throw new Error(`Falha ao atualizar branch ${defaultBranch}: ${updateRef.text}`);
  }

  const repoUrl = `https://github.com/${owner}/${repoName}`;
  const vercelImportUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(
    repoUrl
  )}`;

  console.log("\n============================================================");
  console.log("🎉 SUCESSO! PROJETO VERSIONADO NO SEU GITHUB!");
  console.log(`🔗 Repositorio : ${repoUrl}`);
  console.log(`📌 Versao SHA  : ${commitRes.json.sha.slice(0, 7)} ("${commitMsg}")`);
  console.log("------------------------------------------------------------");
  console.log("🚀 PARA ATIVAR O DEPLOY AUTOMATICO 24H NA VERCEL (1 CLIQUE):");
  console.log(`   Abra: https://vercel.com/new e importe '${owner}/${repoName}'`);
  console.log(`   (Ou clique direto: ${vercelImportUrl})`);
  console.log("   A partir dai, toda vez que voce rodar PUBLICAR_NO_GITHUB.bat,");
  console.log("   uma nova versao vai pro ar sozinha em ~30 segundos!");
  console.log("============================================================\n");
}

main().catch((err) => {
  console.error("❌ Erro:", err.message || err);
  process.exit(1);
});
