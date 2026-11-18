import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, OrderRecord, SellerPayout } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ ok: true, orders: db.orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const productIds: string[] = Array.isArray(body.productIds)
    ? body.productIds
    : [];

  if (productIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Nenhum produto informado na sacolinha" },
      { status: 400 }
    );
  }

  const db = await readDb();
  const items = db.products.filter(
    (p) => productIds.includes(p.id) && !p.isSold
  );

  if (items.length === 0) {
    return NextResponse.json(
      { ok: false, error: "As peças selecionadas já foram vendidas" },
      { status: 409 }
    );
  }

  const subtotal = items.reduce((acc, p) => acc + p.price, 0);
  const discountRate = items.length >= 3 ? 0.15 : items.length === 2 ? 0.1 : 0;
  const discountValue = Math.round(subtotal * discountRate);
  const deliveryMethod =
    body.deliveryMethod === "correios" ? "correios" : "estacao";
  const shippingCost = deliveryMethod === "correios" ? 16 : 0;
  const total = Math.max(0, subtotal - discountValue + shippingCost);

  // Calcula repasse líquido por brechó (PRO = 0% taxa | Direto = 10% taxa)
  const payoutsMap = new Map<string, SellerPayout>();
  for (const item of items) {
    const store = db.stores.find((s) => s.slug === item.storeSlug);
    const isPro = Boolean(store?.isPro);
    const itemNetPrice = Math.round(item.price * (1 - discountRate));
    const fee = isPro ? 0 : Math.round(itemNetPrice * 0.1);
    const net = itemNetPrice - fee;

    const current = payoutsMap.get(item.storeSlug) || {
      storeSlug: item.storeSlug,
      storeName: store?.name || item.storeSlug,
      isPro,
      gross: 0,
      platformFee: 0,
      netSeller: 0,
    };
    current.gross += itemNetPrice;
    current.platformFee += fee;
    current.netSeller += net;
    payoutsMap.set(item.storeSlug, current);

    // Baixa automática na peça única + soma vendas do brechó
    if (item.mode === "venda") {
      item.isSold = true;
    }
    if (store) {
      store.soldCount += 1;
    }
  }

  const order: OrderRecord = {
    id: `ord-${Date.now()}`,
    code: `#PED-${Math.floor(1000 + Math.random() * 9000)}`,
    items: items.map((i) => ({
      productId: i.id,
      code: i.code,
      title: i.title,
      price: i.price,
      size: i.size,
      image: i.image,
      storeSlug: i.storeSlug,
      mode: i.mode,
    })),
    subtotal,
    discountValue,
    shippingCost,
    total,
    deliveryMethod,
    deliveryDetail:
      body.deliveryDetail || "Linha 15-Prata • Estação São Mateus",
    paymentMethod: body.paymentMethod === "Cartão" ? "Cartão" : "PIX",
    sellerPayouts: Array.from(payoutsMap.values()),
    createdAt: new Date().toLocaleString("pt-BR"),
  };

  db.orders.unshift(order);
  await writeDb(db);

  return NextResponse.json(
    {
      ok: true,
      order,
      products: db.products,
      stores: db.stores,
    },
    { status: 201 }
  );
}
