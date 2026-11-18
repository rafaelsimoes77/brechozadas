import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, appendAudit } from "@/lib/db";
import { sanitizeText, validatePrice } from "@/lib/security";
import { Product } from "@/data/mockData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = await readDb();
  const { searchParams } = new URL(req.url);
  const marca = searchParams.get("marca");
  const loja = searchParams.get("loja");
  const disponivel = searchParams.get("disponivel");

  let list = db.products;
  if (marca) {
    list = list.filter((p) => p.brand.toLowerCase() === marca.toLowerCase());
  }
  if (loja) list = list.filter((p) => p.storeSlug === loja);
  if (disponivel === "true") list = list.filter((p) => !p.isSold);

  return NextResponse.json({ ok: true, count: list.length, products: list });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cleanTitle = sanitizeText(body.title, 110);
  const validPrice = validatePrice(body.price, 5, 50000);
  const cleanStore = sanitizeText(body.storeSlug, 60);

  if (!cleanTitle || validPrice === null || !cleanStore) {
    return NextResponse.json(
      {
        ok: false,
        error: "Dados inválidos: informe título válido, preço entre R$ 5 e R$ 50.000 e loja.",
      },
      { status: 400 }
    );
  }

  const db = await readDb();
  const nextNum = 101 + db.products.length;
  const slugBase = cleanTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const created: Product = {
    id: `p-${Date.now()}`,
    slug: `${slugBase}-${nextNum}`,
    code: body.mode === "acervo" ? `#ACV-${nextNum}` : `#BRZ-${nextNum}`,
    title: cleanTitle,
    brand: sanitizeText(body.brand, 50) || "Garimpo Urbano",
    category: body.category || "Polos & Camisas",
    size: body.size || "G",
    fit: body.fit || "Regular",
    measurements: {
      largura: sanitizeText(body.measurements?.largura, 30) || "58 cm",
      comprimento: sanitizeText(body.measurements?.comprimento, 30) || "73 cm",
      extra: body.measurements?.extra
        ? sanitizeText(body.measurements.extra, 40)
        : undefined,
    },
    condition: sanitizeText(body.condition, 50) || "9.5/10 • Impecável",
    price: validPrice,
    originalPrice: validatePrice(body.originalPrice, 5, 50000) || undefined,
    rentalDailyPrice:
      body.mode === "acervo"
        ? validatePrice(body.rentalDailyPrice || validPrice, 5, 50000) || validPrice
        : undefined,
    mode: body.mode === "acervo" ? "acervo" : "venda",
    isSold: Boolean(body.isSold),
    isBoostedPro: Boolean(body.isBoostedPro),
    acceptsOffers: body.acceptsOffers !== false,
    minOfferRatio: 0.8,
    likes: 1,
    image: sanitizeText(body.image, 2000000) || "/images/peca-polo-ecko.jpg",
    storyBehindPiece:
      sanitizeText(body.storyBehindPiece, 500) ||
      "Relíquia garimpada e higienizada, pronta para envio ou encontro nas estações de SP/ABC.",
    storeSlug: cleanStore,
    questions: [],
  };

  db.products.unshift(created);
  appendAudit(db, {
    action: "PRODUCT_PUBLISHED",
    actor: `@${cleanStore}`,
    target: `${created.code} (${created.title})`,
    details: `Peça publicada por R$ ${created.price} no modo ${created.mode}.`,
    rawIp: req.headers.get("x-forwarded-for"),
  });
  await writeDb(db);

  return NextResponse.json({ ok: true, product: created }, { status: 201 });
}
