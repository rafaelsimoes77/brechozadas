import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, appendAudit } from "@/lib/db";
import { sanitizeText, validateHexColor } from "@/lib/security";
import { Store } from "@/data/mockData";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ ok: true, stores: db.stores });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cleanName = sanitizeText(body.name, 70);
  const rawHandle = sanitizeText(body.handle, 40);

  if (!cleanName || !rawHandle) {
    return NextResponse.json(
      { ok: false, error: "Informe nome e @handle válidos do brechó" },
      { status: 400 }
    );
  }

  const db = await readDb();
  const cleanHandle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;

  const slug = cleanHandle
    .replace(/^@/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!slug || db.stores.some((s) => s.slug === slug)) {
    return NextResponse.json(
      { ok: false, error: "Já existe um brechó com esse identificador" },
      { status: 409 }
    );
  }

  const created: Store = {
    slug,
    name: cleanName,
    handle: cleanHandle,
    tagline:
      sanitizeText(body.tagline, 120) ||
      "Curadoria autoral de moda urbana no BRECHOZADAS",
    bio:
      sanitizeText(body.bio, 400) ||
      "Loja oficial cadastrada no BRECHOZADAS. Peças únicas, envio rápido para todo o Brasil e retirada combinada nas estações.",
    location: sanitizeText(body.location, 80) || "São Paulo • SP",
    verified: true,
    isPro: Boolean(body.isPro),
    accentColor: validateHexColor(body.accentColor, "#C93B1E"),
    bannerGradient: "from-ink via-zinc-900 to-rust/85",
    followers: 1,
    soldCount: 0,
    rating: 5.0,
    responseTime: "Responde rápido",
    whatsapp: sanitizeText(body.whatsapp, 20).replace(/\D/g, "") || "5511999990000",
    instagram: `https://www.instagram.com/${cleanHandle.replace(/^@/, "")}/`,
    stations: ["Estações Metrô/CPTM SP & ABC"],
    specialties: ["Garimpo Urbano", "Peças Únicas"],
    highlights: [
      { title: "Primeiro Drop", subtitle: "Novidades no ar", emoji: "🔥" },
      { title: "Envios", subtitle: "Brasil + Estações SP", emoji: "🚝" },
    ],
  };

  db.stores.push(created);
  appendAudit(db, {
    action: "STORE_CREATED",
    actor: cleanHandle,
    target: `/brecho/${slug}`,
    details: `Nova loja criada (${created.isPro ? "Plano PRO 0%" : "Modo Direto 10%"}).`,
    rawIp: req.headers.get("x-forwarded-for"),
  });
  await writeDb(db);

  return NextResponse.json({ ok: true, store: created }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const storeSlug = sanitizeText(body.storeSlug, 60);

  const db = await readDb();
  const store = db.stores.find((s) => s.slug === storeSlug);
  if (!store) {
    return NextResponse.json(
      { ok: false, error: "Brechó não encontrado" },
      { status: 404 }
    );
  }

  if (body.accentColor) {
    store.accentColor = validateHexColor(body.accentColor, store.accentColor);
  }
  if (typeof body.isPro === "boolean") store.isPro = body.isPro;
  if (typeof body.followDelta === "number") {
    const delta = body.followDelta > 0 ? 1 : -1;
    store.followers = Math.max(0, store.followers + delta);
  }
  if (typeof body.tagline === "string") {
    store.tagline = sanitizeText(body.tagline, 120);
  }
  if (typeof body.bio === "string") {
    store.bio = sanitizeText(body.bio, 400);
  }

  appendAudit(db, {
    action: "STORE_UPDATED",
    actor: store.handle,
    target: `/brecho/${store.slug}`,
    details: `Configurações atualizadas (PRO=${store.isPro}, cor=${store.accentColor}).`,
    rawIp: req.headers.get("x-forwarded-for"),
  });

  await writeDb(db);
  return NextResponse.json({ ok: true, store });
}
