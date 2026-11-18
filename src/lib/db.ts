import fs from "fs/promises";
import fsSync from "fs";
import os from "os";
import path from "path";
import {
  INITIAL_PRODUCTS,
  STORES,
  SCENE_NETWORK,
  EDITORIAL_STORIES,
  Product,
  Store,
  SceneMember,
  EditorialStory,
} from "@/data/mockData";
import { AuditLogEntry, createAuditEntry } from "@/lib/security";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase";

export interface OfferRecord {
  productId: string;
  buyerHandle: string;
  amount: number;
  status: "pendente" | "aceita" | "recusada" | "contraproposta";
  counterAmount?: number;
  createdAt: string;
}

export interface SellerPayout {
  storeSlug: string;
  storeName: string;
  isPro: boolean;
  gross: number;
  platformFee: number;
  netSeller: number;
}

export interface OrderRecord {
  id: string;
  code: string;
  items: {
    productId: string;
    code: string;
    title: string;
    price: number;
    size: string;
    image: string;
    storeSlug: string;
    mode: "venda" | "acervo";
  }[];
  subtotal: number;
  discountValue: number;
  shippingCost: number;
  total: number;
  deliveryMethod: "estacao" | "correios";
  deliveryDetail: string;
  paymentMethod: "PIX" | "Cartão";
  sellerPayouts: SellerPayout[];
  createdAt: string;
}

export interface DatabaseSchema {
  products: Product[];
  stores: Store[];
  offers: Record<string, OfferRecord>;
  orders: OrderRecord[];
  sceneMembers: SceneMember[];
  stories: EditorialStory[];
  auditLogs: AuditLogEntry[];
}

export const GENESIS_PREV_HASH =
  "0000000000000000000000000000000000000000000000000000000000000000";

export function resolveProjectRoot(): string {
  const cwd = process.cwd();
  if (fsSync.existsSync(path.join(cwd, "package.json"))) {
    return cwd;
  }
  const nested = path.join(cwd, "acervo-do-reliquia");
  if (fsSync.existsSync(path.join(nested, "package.json"))) {
    return nested;
  }
  return cwd;
}

export function getDbPath(): string {
  if (process.env.VERCEL === "1") {
    return path.join(os.tmpdir(), "brechozadas-db.json");
  }
  return path.join(resolveProjectRoot(), "data", "db.json");
}

export function createInitialSeed(): DatabaseSchema {
  const genesis = createAuditEntry(GENESIS_PREV_HASH, {
    action: "SYSTEM_GENESIS",
    actor: "BRECHOZADAS Security Core",
    target: "ledger/v2",
    details:
      "Trilha de auditoria criptográfica SHA-256 inicializada com proteções OWASP e anonimização LGPD.",
    rawIp: "127.0.0.1",
  });

  return {
    products: structuredClone(INITIAL_PRODUCTS),
    stores: structuredClone(STORES),
    offers: {},
    orders: [],
    sceneMembers: structuredClone(SCENE_NETWORK),
    stories: structuredClone(EDITORIAL_STORIES),
    auditLogs: [genesis],
  };
}

export function appendAudit(
  db: DatabaseSchema,
  params: {
    action: AuditLogEntry["action"];
    actor: string;
    target: string;
    details: string;
    rawIp?: string | null;
  }
): AuditLogEntry {
  if (!Array.isArray(db.auditLogs) || db.auditLogs.length === 0) {
    const genesis = createAuditEntry(GENESIS_PREV_HASH, {
      action: "SYSTEM_GENESIS",
      actor: "BRECHOZADAS Security Core",
      target: "ledger/v2",
      details: "Inicialização automática da trilha de auditoria.",
      rawIp: "127.0.0.1",
    });
    db.auditLogs = [genesis];
  }

  const prevHash = db.auditLogs[0].integrityHash;
  const entry = createAuditEntry(prevHash, params);
  db.auditLogs.unshift(entry);
  return entry;
}

/** Lê do cache local ou cria inicialização */
async function readLocalFile(): Promise<DatabaseSchema> {
  const dbPath = getDbPath();
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!Array.isArray(parsed.auditLogs) || parsed.auditLogs.length === 0) {
      parsed.auditLogs = createInitialSeed().auditLogs;
    }
    return parsed;
  } catch {
    if (process.env.VERCEL === "1") {
      try {
        const bundled = await fs.readFile(
          path.join(resolveProjectRoot(), "data", "db.json"),
          "utf-8"
        );
        const parsed = JSON.parse(bundled) as DatabaseSchema;
        if (!Array.isArray(parsed.auditLogs) || parsed.auditLogs.length === 0) {
          parsed.auditLogs = createInitialSeed().auditLogs;
        }
        await writeLocalFile(parsed);
        return parsed;
      } catch {}
    }
    const seed = createInitialSeed();
    await writeLocalFile(seed);
    return seed;
  }
}

/** Grava no cache de arquivo local */
async function writeLocalFile(data: DatabaseSchema): Promise<void> {
  const dbPath = getDbPath();
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[BRECHOZADAS DB] Aviso ao gravar cache local:", err);
  }
}

/**
 * Leitura com Dual-Engine:
 * 1. Se Supabase estiver configurado, lê o estado permanente da nuvem.
 * 2. Caso contrário (ou em caso de instabilidade na rede), utiliza o arquivo local JSON com segurança.
 */
export async function readDb(): Promise<DatabaseSchema> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("app_state")
          .select("payload")
          .eq("id", "production")
          .single();

        if (!error && data?.payload) {
          const parsed = data.payload as DatabaseSchema;
          if (!Array.isArray(parsed.auditLogs) || parsed.auditLogs.length === 0) {
            parsed.auditLogs = createInitialSeed().auditLogs;
          }
          // Atualiza cache local em segundo plano
          writeLocalFile(parsed).catch(() => {});
          return parsed;
        }

        // Se a tabela existe mas está vazia, inicializa o seed no Supabase
        if (error && error.code === "PGRST116") {
          const seed = await readLocalFile();
          await supabase.from("app_state").upsert({
            id: "production",
            payload: seed,
            updated_at: new Date().toISOString(),
          });
          return seed;
        }

        console.warn(
          "[BRECHOZADAS Supabase] Falha ao ler da nuvem, acionando fallback local:",
          error?.message
        );
      } catch (err) {
        console.warn(
          "[BRECHOZADAS Supabase] Erro de rede/conexão, acionando fallback local:",
          err
        );
      }
    }
  }

  return readLocalFile();
}

/**
 * Escrita com Dual-Engine:
 * Persiste no Supabase PostgreSQL (permanente entre reinicializações da Vercel)
 * e também atualiza o arquivo local para tolerância a falhas.
 */
export async function writeDb(data: DatabaseSchema): Promise<void> {
  // Sempre atualiza o cache local
  await writeLocalFile(data);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from("app_state").upsert({
          id: "production",
          payload: data,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error(
            "[BRECHOZADAS Supabase] Erro ao sincronizar estado com PostgreSQL:",
            error.message
          );
        }
      } catch (err) {
        console.error("[BRECHOZADAS Supabase] Exceção de sincronização:", err);
      }
    }
  }
}

/** Diagnóstico de status e provedor de banco de dados */
export async function getDatabaseProviderInfo() {
  const configured = isSupabaseConfigured();
  if (!configured) {
    return {
      provider: "local_json" as const,
      isConfigured: false,
      status: "fallback_active",
      message:
        "Operando em armazenamento local JSON. Configure as chaves do Supabase para persistência permanente.",
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      provider: "supabase" as const,
      isConfigured: true,
      status: "client_error",
      message: "Credenciais fornecidas, mas falha ao instanciar o cliente.",
    };
  }

  const start = Date.now();
  try {
    const { data, error } = await supabase
      .from("app_state")
      .select("id, updated_at")
      .eq("id", "production")
      .single();

    const latencyMs = Date.now() - start;

    if (error && error.code !== "PGRST116") {
      return {
        provider: "supabase" as const,
        isConfigured: true,
        status: "error",
        latencyMs,
        message: error.message,
      };
    }

    return {
      provider: "supabase" as const,
      isConfigured: true,
      status: "connected",
      latencyMs,
      message: "Banco de dados permanente Supabase PostgreSQL conectado com sucesso!",
      lastUpdated: data?.updated_at || new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      provider: "supabase" as const,
      isConfigured: true,
      status: "network_error",
      message: err?.message || "Erro de conexão ao testar Supabase.",
    };
  }
}
