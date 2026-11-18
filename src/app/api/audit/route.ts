import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { verifyAuditChain } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await readDb();
  const logs = db.auditLogs || [];
  const chainValid = verifyAuditChain(logs);

  return NextResponse.json(
    {
      ok: true,
      chainValid,
      algorithm: "SHA-256 Hash Chain + LGPD IP Salted Anonymization",
      totalEvents: logs.length,
      protections: [
        "Content-Security-Policy (CSP)",
        "Strict-Transport-Security (HSTS 2 anos + preload)",
        "X-Frame-Options: DENY (Anti-Clickjacking)",
        "X-Content-Type-Options: nosniff",
        "Anti-CSRF Origin Verification",
        "API Sliding-Window Rate Limiter (429 Throttling)",
        "Binary Magic-Byte Image Verification (5MB limit)",
        "Server-Side Price & Split Escrow Calculation",
      ],
      logs: logs.slice(0, 50),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
