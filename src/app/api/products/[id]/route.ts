import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const db = await readDb();

  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Peça não encontrada" }, { status: 404 });
  }

  const target = db.products[idx];

  if (body.action === "like") {
    const delta = Number(body.delta || 1);
    target.likes = Math.max(0, target.likes + delta);
  } else if (body.action === "question") {
    target.questions.unshift({
      id: `q-${Date.now()}`,
      user: String(body.user || "@visitante_reliquia").trim(),
      text: String(body.text || "").trim(),
      date: "agora mesmo",
    });
  } else if (body.action === "answer") {
    const q = target.questions.find((item) => item.id === body.questionId);
    if (q) {
      q.answer = String(body.answer || "").trim();
    }
  } else if (body.action === "toggleSold") {
    target.isSold = !target.isSold;
  }

  db.products[idx] = target;
  await writeDb(db);

  return NextResponse.json({ ok: true, product: target });
}
