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
}

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
  // Em ambiente Serverless (Vercel), /var/task é somente-leitura, então usamos os.tmpdir()
  if (process.env.VERCEL === "1") {
    return path.join(os.tmpdir(), "brechozadas-db.json");
  }
  return path.join(resolveProjectRoot(), "data", "db.json");
}

export function createInitialSeed(): DatabaseSchema {
  return {
    products: structuredClone(INITIAL_PRODUCTS),
    stores: structuredClone(STORES),
    offers: {},
    orders: [],
    sceneMembers: structuredClone(SCENE_NETWORK),
    stories: structuredClone(EDITORIAL_STORIES),
  };
}

export async function readDb(): Promise<DatabaseSchema> {
  const dbPath = getDbPath();
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    // Em Vercel, tenta primeiro copiar data/db.json empacotado no deploy antes do seed padrão
    if (process.env.VERCEL === "1") {
      try {
        const bundled = await fs.readFile(
          path.join(resolveProjectRoot(), "data", "db.json"),
          "utf-8"
        );
        const parsed = JSON.parse(bundled) as DatabaseSchema;
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
