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
  // Mantém os últimos 200 eventos encadeados caso escale muito, ou preserva todos para verificação completa
  return entry;
}

export async function readDb(): Promise<DatabaseSchema> {
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
        await writeDb(parsed);
        return parsed;
      } catch {}
    }
    const seed = createInitialSeed();
    await writeDb(seed);
    return seed;
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  const dbPath = getDbPath();
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}
