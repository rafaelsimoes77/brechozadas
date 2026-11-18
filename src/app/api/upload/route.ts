import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { resolveProjectRoot } from "@/lib/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Nenhum arquivo enviado" },
      { status: 400 }
    );
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Formato inválido. Use JPG, PNG ou WEBP." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Em ambiente Serverless (Vercel), retorna Data URL direto sem gravar em /var/task
  if (process.env.VERCEL === "1") {
    const base64 = buffer.toString("base64");
    return NextResponse.json({
      ok: true,
      url: `data:${file.type};base64,${base64}`,
    });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `peca-${Date.now()}-${Math.floor(100 + Math.random() * 900)}.${ext}`;
  const uploadsDir = path.join(resolveProjectRoot(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, safeName), buffer);

  return NextResponse.json({
    ok: true,
    url: `/uploads/${safeName}`,
  });
}
