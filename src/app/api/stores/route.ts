import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { Store } from "@/data/mockData";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ ok: true, stores: db.stores });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.handle) {
    return NextResponse.json(
      { ok: false, error: "Informe nome e @handle do brechó" },
      { status: 400 }
    );
  }

  const db = await readDb();
  const cleanHandle = String(body.handle).startsWith("@")
    ? String(body.handle).trim()
    : `@${String(body.handle).trim()}`;

  const slug = cleanHandle
    .replace(/^@/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (db.stores.some((s) => s.slug === slug)) {
    return NextResponse.json(
      { ok: false, error: "Já existe um brechó com esse identificador" },
      { status: 409 }
    );
  }

  const created: Store = {
    slug,
    name: String(body.name).trim(),
    handle: cleanHandle,
    tagline:
      String(body.tagline || "").trim() ||
      "Curadoria autoral de moda urbana no BRECHOZADAS",
    bio:
      String(body.bio || "").trim() ||
      "Loja oficial cadastrada no BRECHOZADAS. Peças únicas, envio rápido para todo o Brasil e retirada combinada nas estações.",
    location: String(body.location || "São Paulo • SP").trim(),
    verified: true,
    isPro: Boolean(body.isPro),
    accentColor: body.accentColor || "#C93B1E",
    bannerGradient: "from-ink via-zinc-900 to-rust/85",
    followers: 1,
    soldCount: 0,
    rating: 5.0,
    responseTime: "Responde rápido",
    whatsapp: String(body.whatsapp || "5511999990000").replace(/\D/g, ""),
    instagram: `https://www.instagram.com/${cleanHandle.replace(/^@/, "")}/`,
    stations: body.stations?.length
      ? body.stations
      : ["Estações Metrô/CPTM SP & ABC"],
    specialties: body.specialties?.length
      ? body.specialties
      : ["Garimpo Urbano", "Peças Únicas"],
    highlights: [
      { title: "Primeiro Drop", subtitle: "Novidades no ar", emoji: "🔥" },
      { title: "Envios", subtitle: "Brasil + Estações SP", emoji: "🚝" },
    ],
  };

  db.stores.push(created);
  await writeDb(db);

  return NextResponse.json({ ok: true, store: created }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { storeSlug, accentColor, isPro, followDelta, tagline, bio } = body;

  const db = await readDb();
  const store = db.stores.find((s) => s.slug === storeSlug);
  if (!store) {
    return NextResponse.json(
      { ok: false, error: "Brechó não encontrado" },
      { status: 404 }
    );
  }

  if (accentColor) store.accentColor = accentColor;
  if (typeof isPro === "boolean") store.isPro = isPro;
  if (typeof followDelta === "number") {
    store.followers = Math.max(0, store.followers + followDelta);
  }
  if (typeof tagline === "string") store.tagline = tagline;
  if (typeof bio === "string") store.bio = bio;

  await writeDb(db);
  return NextResponse.json({ ok: true, store });
}
