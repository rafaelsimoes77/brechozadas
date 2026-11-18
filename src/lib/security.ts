import crypto from "crypto";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action:
    | "SYSTEM_GENESIS"
    | "STORE_CREATED"
    | "STORE_UPDATED"
    | "PRODUCT_PUBLISHED"
    | "PRODUCT_INTERACTION"
    | "OFFER_SUBMITTED"
    | "OFFER_DECIDED"
    | "ORDER_COMPLETED_PIX"
    | "UPLOAD_VERIFIED"
    | "SECURITY_REJECTED"
    | "SCENE_MEMBER_ADDED";
  actor: string;
  target: string;
  details: string;
  ipAnonymized: string;
  prevHash: string;
  integrityHash: string;
}

/**
 * Sanitiza strings contra XSS, caracteres de controle e payloads excessivos (OWASP A03)
 */
export function sanitizeText(input: unknown, maxLength = 300): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Valida valores monetários impedindo NaN, Infinity, negativos ou valores irreais
 */
export function validatePrice(
  value: unknown,
  min = 1,
  max = 50000
): number | null {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  const rounded = Math.round(num);
  if (rounded < min || rounded > max) return null;
  return rounded;
}

/**
 * Garante cor hexadecimal estrita (#RRGGBB) evitando injeção de estilo
 */
export function validateHexColor(value: unknown, fallback = "#C93B1E"): string {
  if (typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}

/**
 * Verifica assinatura binária real (Magic Bytes) do arquivo de imagem
 * impedindo upload de scripts/executáveis renomeados para .jpg/.png
 */
export function verifyImageMagicBytes(buffer: Buffer): {
  valid: boolean;
  detectedExt: string;
  mime: string;
} {
  if (buffer.length < 12) {
    return { valid: false, detectedExt: "", mime: "" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedExt: "jpg", mime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, detectedExt: "png", mime: "image/png" };
  }

  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { valid: true, detectedExt: "gif", mime: "image/gif" };
  }

  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { valid: true, detectedExt: "webp", mime: "image/webp" };
  }

  return { valid: false, detectedExt: "", mime: "" };
}

/**
 * Anonimiza IP via SHA-256 truncado (Conformidade LGPD — minimização de dados pessoais)
 */
export function anonymizeIp(rawIp: string | null): string {
  const ip = (rawIp || "127.0.0.1").split(",")[0].trim();
  const digest = crypto
    .createHash("sha256")
    .update(`brz-lgpd-salt:${ip}`)
    .digest("hex")
    .slice(0, 10);
  return `ip-${digest}`;
}

/**
 * Calcula hash SHA-256 encadeado (Hash Chain imutável de auditoria)
 */
export function computeAuditHash(
  prevHash: string,
  payload: Omit<AuditLogEntry, "integrityHash">
): string {
  const canonical = `${prevHash}|${payload.id}|${payload.timestamp}|${payload.action}|${payload.actor}|${payload.target}|${payload.details}|${payload.ipAnonymized}`;
  return crypto.createHash("sha256").update(canonical).digest("hex");
}

export function createAuditEntry(
  prevHash: string,
  params: {
    action: AuditLogEntry["action"];
    actor: string;
    target: string;
    details: string;
    rawIp?: string | null;
  }
): AuditLogEntry {
  const base: Omit<AuditLogEntry, "integrityHash"> = {
    id: `aud-${crypto.randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    action: params.action,
    actor: sanitizeText(params.actor, 80) || "sistema",
    target: sanitizeText(params.target, 120),
    details: sanitizeText(params.details, 260),
    ipAnonymized: anonymizeIp(params.rawIp || null),
    prevHash,
  };

  return {
    ...base,
    integrityHash: computeAuditHash(prevHash, base),
  };
}

/**
 * Audita matematicamente toda a cadeia de logs verificando se algum registro foi adulterado
 */
export function verifyAuditChain(logs: AuditLogEntry[]): boolean {
  if (!Array.isArray(logs) || logs.length === 0) return true;
  // Os logs são ordenados do mais recente (índice 0) ao mais antigo (último índice)
  const chronological = [...logs].reverse();
  let expectedPrev = "0000000000000000000000000000000000000000000000000000000000000000";

  for (const item of chronological) {
    if (item.prevHash !== expectedPrev) return false;
    const { integrityHash, ...rest } = item;
    const recomputed = computeAuditHash(item.prevHash, rest);
    if (recomputed !== integrityHash) return false;
    expectedPrev = integrityHash;
  }
  return true;
}
