import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { Product } from "@/data/mockData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = await readDb();
  const { searchParams } = new URL(req.url);
  const marca = searchParams.get("marca");
  const loja = searchParams.get("loja");
  const disponivel = searchParams.get("disponivel");

  let list = db.products;
  if (marca) list = list.filter((p) => p.brand.toLowerCase() === marca.toLowerCase());
  if (loja) list = list.filter((p) => p.storeSlug === loja);
  if (disponivel === "true") list = list.filter((p) => !p.isSold);

  return NextResponse.json({ ok: true, count: list.length, products: list });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title || !body.price || !body.storeSlug) {
    return NextResponse.json(
      { ok: false, error: "Campos obrigatórios: title, price, storeSlug" },
      { status: 400 }
    );
  }

  const db = await readDb();
  const nextNum = 101 + db.products.length;
  const slugBase = String(body.title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const created: Product = {
    id: `p-${Date.now()}`,
    slug: `${slugBase}-${nextNum}`,
    code: body.mode === "acervo" ? `#ACV-${nextNum}` : `#BRZ-${nextNum}`,
    title: String(body.title).trim(),
    brand: String(body.brand || "Garimpo").trim(),
    category: body.category || "Polos & Camisas",
    size: body.size || "G",
    fit: body.fit || "Regular",
    measurements: body.measurements || {
      largura: "58 cm",
      comprimento: "73 cm",
    },
    condition: body.condition || "9.5/10 • Impecável",
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    rentalDailyPrice:
      body.mode === "acervo" ? Number(body.rentalDailyPrice || body.price) : undefined,
    mode: body.mode === "acervo" ? "acervo" : "venda",
    isSold: Boolean(body.isSold),
    isBoostedPro: Boolean(body.isBoostedPro),
    acceptsOffers: body.acceptsOffers !== false,
    minOfferRatio: Number(body.minOfferRatio || 0.8),
    likes: 1,
    image: body.image || "/images/peca-polo-ecko.jpg",
    storyBehindPiece:
      body.storyBehindPiece ||
      "Relíquia garimpada e higienizada, pronta para envio ou encontro nas estações de SP/ABC.",
    credits: body.credits,
    storeSlug: body.storeSlug,
    questions: [],
  };

  db.products.unshift(created);
  await writeDb(db);

  return NextResponse.json({ ok: true, product: created }, { status: 201 });
}
