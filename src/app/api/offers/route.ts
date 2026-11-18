import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, appendAudit } from "@/lib/db";
import { sanitizeText, validatePrice } from "@/lib/security";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const productId = sanitizeText(body.productId, 60);
  const amount = validatePrice(body.amount, 1, 50000);
  const buyerHandle = sanitizeText(body.buyerHandle, 40) || "@comprador_cena";

  if (!productId || amount === null) {
    return NextResponse.json(
      { ok: false, error: "Dados de oferta inválidos" },
      { status: 400 }
    );
  }

  const db = await readDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product || product.isSold) {
    return NextResponse.json(
      { ok: false, error: "Peça indisponível para oferta" },
      { status: 404 }
    );
  }

  // Validação server-side de limite mínimo (impede ofertas maliciosas de R$ 1 via API)
  const minAllowed = Math.round(product.price * product.minOfferRatio);
  if (amount < minAllowed || amount >= product.price) {
    appendAudit(db, {
      action: "SECURITY_REJECTED",
      actor: buyerHandle,
      target: product.code,
      details: `Oferta fora dos limites bloqueada pelo servidor (R$ ${amount}; mínimo R$ ${minAllowed}).`,
      rawIp: req.headers.get("x-forwarded-for"),
    });
    await writeDb(db);
    return NextResponse.json(
      {
        ok: false,
        error: `Oferta deve estar entre R$ ${minAllowed} e R$ ${product.price - 1}.`,
      },
      { status: 422 }
    );
  }

  db.offers[productId] = {
    productId,
    buyerHandle,
    amount,
    status: "pendente",
    createdAt: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  appendAudit(db, {
    action: "OFFER_SUBMITTED",
    actor: buyerHandle,
    target: `${product.code} (${product.title})`,
    details: `Proposta de R$ ${amount} registrada (preço original R$ ${product.price}).`,
    rawIp: req.headers.get("x-forwarded-for"),
  });

  await writeDb(db);
  return NextResponse.json({ ok: true, offer: db.offers[productId] });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const productId = sanitizeText(body.productId, 60);
  const decision = body.decision;

  const db = await readDb();
  const existing = db.offers[productId];
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Oferta não encontrada" },
      { status: 404 }
    );
  }

  const prod = db.products.find((p) => p.id === productId);

  if (decision === "aceita") {
    existing.status = "aceita";
    if (prod) {
      prod.originalPrice = prod.originalPrice || prod.price;
      prod.price = existing.amount;
    }
  } else if (decision === "recusada") {
    existing.status = "recusada";
  } else if (decision === "contraproposta") {
    const validCounter = validatePrice(body.counterAmount, 1, 50000);
    if (validCounter) {
      existing.status = "contraproposta";
      existing.counterAmount = validCounter;
    }
  }

  db.offers[productId] = existing;
  appendAudit(db, {
    action: "OFFER_DECIDED",
    actor: prod ? `@${prod.storeSlug}` : "lojista",
    target: prod?.code || productId,
    details: `Oferta marcada como '${existing.status}' (valor R$ ${existing.amount}).`,
    rawIp: req.headers.get("x-forwarded-for"),
  });

  await writeDb(db);

  return NextResponse.json({
    ok: true,
    offer: existing,
    products: db.products,
  });
}
