import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, appendAudit } from "@/lib/db";
import { sanitizeText } from "@/lib/security";
import { SceneMember } from "@/data/mockData";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cleanName = sanitizeText(body.name, 70);
  const rawHandle = sanitizeText(body.handle, 40);

  if (!cleanName || !rawHandle) {
    return NextResponse.json(
      { ok: false, error: "Informe nome e @handle válidos" },
      { status: 400 }
    );
  }

  const cleanHandle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;
  const db = await readDb();

  const created: SceneMember = {
    id: `s-${Date.now()}`,
    name: cleanName,
    handle: cleanHandle,
    role: body.role || "Styling & Direção",
    region: sanitizeText(body.region, 60) || "São Paulo • SP",
    bio:
      sanitizeText(body.bio, 260) ||
      "Talento cadastrado na Rede Criativa BRECHOZADAS disponível para collabs, editoriais e feiras.",
    tags: ["Membro da Rede", "Aberto p/ Collab"],
    availableForCollab: true,
  };

  db.sceneMembers.unshift(created);
  appendAudit(db, {
    action: "SCENE_MEMBER_ADDED",
    actor: cleanHandle,
    target: created.name,
    details: `Novo perfil adicionado à Rede Criativa (${created.role}).`,
    rawIp: req.headers.get("x-forwarded-for"),
  });
  await writeDb(db);

  return NextResponse.json({ ok: true, member: created }, { status: 201 });
}
