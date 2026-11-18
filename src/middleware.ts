import { NextRequest, NextResponse } from "next/server";

// Janela deslizante em memória por IP para proteção contra abuso/bots nas rotas de escrita
const rateLimitBucket = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_WRITES_PER_WINDOW = 45;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();
  const requestId = crypto.randomUUID();

  // 1. Proteção Anti-CSRF e Rate Limiting nas rotas mutáveis da API
  if (
    pathname.startsWith("/api/") &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(method)
  ) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            {
              ok: false,
              error: "Bloqueio de segurança CSRF: origem externa não autorizada.",
            },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { ok: false, error: "Cabeçalho Origin inválido." },
          { status: 400 }
        );
      }
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const now = Date.now();
    const bucket = rateLimitBucket.get(ip);

    if (!bucket || now > bucket.resetAt) {
      rateLimitBucket.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      bucket.count += 1;
      if (bucket.count > MAX_WRITES_PER_WINDOW) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Muitas requisições seguidas. Aguarde alguns segundos e tente novamente.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": "60",
              "X-Request-Id": requestId,
            },
          }
        );
      }
    }
  }

  const res = NextResponse.next();

  // 2. Cabeçalhos de Segurança Padrão Enterprise (OWASP)
  res.headers.set("X-Request-Id", requestId);
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
