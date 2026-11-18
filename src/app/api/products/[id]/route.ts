import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, appendAudit } from "@/lib/db";
import { sanitizeText } from "@/lib/security";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const db = await readDb();

  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json(
      { ok: false, error: "Peça não encontrada" },
      { status: 404 }
    );
  }

  const target = db.products[idx];

  if (body.action === "like") {
    const delta = Number(body.delta) >= 0 ? 1 : -1;
    target.likes = Math.max(0, target.likes + delta);
  } else if (body.action === "question") {
    const cleanText = sanitizeText(body.text, 280);
    const cleanUser = sanitizeText(body.user, 40) || "@visitante_reliquia";
    if (!cleanText) {
      return NextResponse.json(
        { ok: false, error: "Pergunta vazia ou inválida" },
        { status: 400 }
      );
    }
    target.questions.unshift({
      id: `q-${Date.now()}`,
      user: cleanUser,
      text: cleanText,
      date: "agora mesmo",
    });
    appendAudit(db, {
      action: "PRODUCT_INTERACTION",
      actor: cleanUser,
      target: target.code,
      details: `Nova pergunta pública registrada na peça.`,
      rawIp: req.headers.get("x-forwarded-for"),
    });
  } else if (body.action === "answer") {
    const cleanAnswer = sanitizeText(body.answer, 320);
    const q = target.questions.find((item) => item.id === body.questionId);
    if (q && cleanAnswer) {
      q.answer = cleanAnswer;
      appendAudit(db, {
        action: "PRODUCT_INTERACTION",
        actor: `@${target.storeSlug}`,
        target: target.code,
        details: `Resposta oficial do brechó registrada na dúvida ${q.id}.`,
        rawIp: req.headers.get("x-forwarded-for"),
      });
    }
  } else if (body.action === "toggleSold") {
    target.isSold = !target.isSold;
    appendAudit(db, {
      action: "PRODUCT_INTERACTION",
      actor: `@${target.storeSlug}`,
      target: target.code,
      details: `Status alterado para ${target.isSold ? "VENDIDO" : "DISPONÍVEL"}.`,
      rawIp: req.headers.get("x-forwarded-for"),
    });
  } else if (body.action === "flashPromo") {
    target.originalPrice = target.originalPrice || target.price;
    target.price = Math.max(15, Math.round(target.price * 0.9));
    appendAudit(db, {
      action: "PRODUCT_INTERACTION",
      actor: `@${target.storeSlug}`,
      target: target.code,
      details: `Oferta Relâmpago (-10%) ativada: novo preço R$ ${target.price}.`,
      rawIp: req.headers.get("x-forwarded-for"),
    });
  }

  db.products[idx] = target;
  await writeDb(db);

  return NextResponse.json({ ok: true, product: target });
}
