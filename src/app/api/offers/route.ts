import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, amount, buyerHandle } = body;

  if (!productId || !amount) {
    return NextResponse.json(
      { ok: false, error: "Informe productId e amount" },
      { status: 400 }
    );
  }

  const db = await readDb();
  db.offers[productId] = {
    productId,
    buyerHandle: String(buyerHandle || "@comprador_cena"),
    amount: Number(amount),
    status: "pendente",
    createdAt: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  await writeDb(db);
  return NextResponse.json({ ok: true, offer: db.offers[productId] });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { productId, decision, counterAmount } = body;

  const db = await readDb();
  const existing = db.offers[productId];
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "Oferta não encontrada" },
      { status: 404 }
    );
  }

  if (decision === "aceita") {
    existing.status = "aceita";
    const prod = db.products.find((p) => p.id === productId);
    if (prod) {
      prod.originalPrice = prod.originalPrice || prod.price;
      prod.price = existing.amount;
    }
  } else if (decision === "recusada") {
    existing.status = "recusada";
  } else if (decision === "contraproposta" && counterAmount) {
    existing.status = "contraproposta";
    existing.counterAmount = Number(counterAmount);
  }

  db.offers[productId] = existing;
  await writeDb(db);

  return NextResponse.json({
    ok: true,
    offer: existing,
    products: db.products,
  });
}
