import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { readDb, writeDb, resolveProjectRoot, appendAudit } from "@/lib/db";
import { verifyImageMagicBytes } from "@/lib/security";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Nenhum arquivo enviado" },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Arquivo muito grande. Limite máximo de segurança: 5 MB." },
      { status: 413 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validação binária real (Magic Bytes) — impede scripts/executáveis disfarçados
  const magic = verifyImageMagicBytes(buffer);
  if (!magic.valid) {
    const db = await readDb();
    appendAudit(db, {
      action: "SECURITY_REJECTED",
      actor: "upload-guard",
      target: file.name || "arquivo-desconhecido",
      details: "Upload bloqueado: assinatura binária (magic bytes) não corresponde a imagem válida.",
      rawIp: req.headers.get("x-forwarded-for"),
    });
    await writeDb(db);

    return NextResponse.json(
      {
        ok: false,
        error:
          "Arquivo bloqueado pelo filtro de segurança: envie uma imagem real (JPG, PNG, WEBP ou GIF).",
      },
      { status: 400 }
    );
  }

  const db = await readDb();
  appendAudit(db, {
    action: "UPLOAD_VERIFIED",
    actor: "lojista",
    target: `imagem.${magic.detectedExt}`,
    details: `Imagem verificada por assinatura binária (${magic.mime}, ${Math.round(
      buffer.length / 1024
    )} KB).`,
    rawIp: req.headers.get("x-forwarded-for"),
  });
  await writeDb(db);

  if (process.env.VERCEL === "1") {
    const base64 = buffer.toString("base64");
    return NextResponse.json({
      ok: true,
      url: `data:${magic.mime};base64,${base64}`,
    });
  }

  const safeName = `peca-${crypto.randomUUID()}.${magic.detectedExt}`;
  const uploadsDir = path.join(resolveProjectRoot(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, safeName), buffer);

  return NextResponse.json({
    ok: true,
    url: `/uploads/${safeName}`,
  });
}
