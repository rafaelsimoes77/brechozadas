import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { SceneMember } from "@/data/mockData";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.handle) {
    return NextResponse.json(
      { ok: false, error: "Informe nome e @handle" },
      { status: 400 }
    );
  }

  const db = await readDb();
  const created: SceneMember = {
    id: `s-${Date.now()}`,
    name: String(body.name).trim(),
    handle: String(body.handle).startsWith("@")
      ? String(body.handle).trim()
      : `@${String(body.handle).trim()}`,
    role: body.role || "Styling & Direção",
    region: String(body.region || "São Paulo • SP").trim(),
    bio:
      String(body.bio || "").trim() ||
      "Talento cadastrado na Rede Criativa BRECHOZADAS disponível para collabs, editoriais e feiras.",
    tags: ["Membro da Rede", "Aberto p/ Collab"],
    availableForCollab: true,
  };

  db.sceneMembers.unshift(created);
  await writeDb(db);

  return NextResponse.json({ ok: true, member: created }, { status: 201 });
}
