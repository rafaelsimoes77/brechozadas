"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
  Server,
} from "lucide-react";
import type { AuditLogEntry } from "@/lib/security";

interface AuditResponse {
  ok: boolean;
  chainValid: boolean;
  algorithm: string;
  totalEvents: number;
  protections: string[];
  logs: AuditLogEntry[];
}

export default function SegurancaAuditoriaPage() {
  const [audit, setAudit] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit", { cache: "no-store" });
      const data = await res.json();
      setAudit(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadAudit();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* Banner Principal */}
      <section className="bg-ink text-concrete-100 rounded-3xl border-2 border-ink p-7 sm:p-10 shadow-urban grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-neon text-ink text-xs font-extrabold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" /> ARQUITETURA ENTERPRISE • OWASP & LGPD
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-tight">
            Central de Segurança, Anti-Fraude & Auditoria
          </h1>
          <p className="text-sm sm:text-base text-concrete-300 leading-relaxed">
            O BRECHOZADAS opera com os mesmos padrões técnicos dos grandes
            marketplaces: cabeçalhos rígidos de segurança (CSP/HSTS), validação
            binária de arquivos, cálculo de preços isolado no servidor e trilha
            de auditoria criptográfica encadeada em SHA-256.
          </p>
        </div>

        <div className="lg:col-span-5 bg-zinc-900 border border-white/15 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-concrete-300 uppercase">
              Integridade da Cadeia Criptográfica
            </span>
            {audit?.chainValid !== false ? (
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% ÍNTEGRA
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full text-xs font-bold">
                <AlertOctagon className="w-3.5 h-3.5" /> ALERTA DE ADULTERAÇÃO
              </span>
            )}
          </div>
          <p className="text-xs text-concrete-300">
            Cada evento grava o hash SHA-256 do registro anterior (modelo{" "}
            <em>Hash Chain</em> bancário), impedindo exclusão ou edição silenciosa
            de transações.
          </p>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span>Eventos auditados: <strong>{audit?.totalEvents || 1}</strong></span>
            <button
              type="button"
              onClick={loadAudit}
              className="inline-flex items-center gap-1 text-neon font-bold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Revalidar Agora
            </button>
          </div>
        </div>
      </section>

      {/* Camadas de Segurança Ativas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-concrete-300 p-5 space-y-2">
          <Lock className="w-6 h-6 text-rust" />
          <h3 className="font-display font-bold text-base text-ink">
            Blindagem HTTP (CSP + HSTS)
          </h3>
          <p className="text-xs text-concrete-500 leading-relaxed">
            Bloqueio contra Clickjacking (<code>X-Frame-Options: DENY</code>),
            injeção de scripts externos (CSP), sniffing MIME e HTTPS forçado por
            2 anos.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-concrete-300 p-5 space-y-2">
          <FileCheck2 className="w-6 h-6 text-rust" />
          <h3 className="font-display font-bold text-base text-ink">
            Inspeção Binária de Uploads
          </h3>
          <p className="text-xs text-concrete-500 leading-relaxed">
            Não confiamos só na extensão do arquivo: lemos os <em>Magic Bytes</em>{" "}
            reais (JPEG, PNG, WEBP, GIF) e limitamos a 5 MB para barrar arquivos
            maliciosos.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-concrete-300 p-5 space-y-2">
          <Server className="w-6 h-6 text-rust" />
          <h3 className="font-display font-bold text-base text-ink">
            Anti-Fraude & Rate Limit
          </h3>
          <p className="text-xs text-concrete-500 leading-relaxed">
            Preços, descontos da Sacolinha e repasses PRO/Direto são recalculados
            100% no servidor, com proteção Anti-CSRF e limite de requisições por IP.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-concrete-300 p-5 space-y-2">
          <EyeOff className="w-6 h-6 text-rust" />
          <h3 className="font-display font-bold text-base text-ink">
            Privacidade & LGPD Nativa
          </h3>
          <p className="text-xs text-concrete-500 leading-relaxed">
            Endereços IP nunca são gravados puros no disco: passam por hash
            criptográfico com salt antes do registro nos logs de auditoria.
          </p>
        </div>
      </section>

      {/* Livro-Razão de Auditoria em Tempo Real */}
      <section className="bg-white rounded-3xl border border-concrete-300 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-ink">
              Trilha de Auditoria em Tempo Real (SHA-256)
            </h2>
            <p className="text-xs text-concrete-500">
              Todas as criações de lojas, anúncios, ofertas, uploads e pedidos
              ficam registrados com assinatura verificável.
            </p>
          </div>
          {loading && (
            <span className="text-xs font-semibold text-rust">
              Carregando registros...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-ink text-ink">
                <th className="py-2.5 pr-4">Data / Hora (UTC)</th>
                <th className="py-2.5 pr-4">Evento</th>
                <th className="py-2.5 pr-4">Ator</th>
                <th className="py-2.5 pr-4">Alvo & Detalhes</th>
                <th className="py-2.5 pr-4">IP (LGPD)</th>
                <th className="py-2.5">Assinatura SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {(audit?.logs || []).map((log) => (
                <tr key={log.id} className="hover:bg-concrete-50">
                  <td className="py-3 pr-4 whitespace-nowrap text-concrete-500">
                    {new Date(log.timestamp).toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        log.action === "SECURITY_REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-concrete-100 text-ink"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-ink whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3 pr-4 text-concrete-500 max-w-md">
                    <strong className="text-ink">{log.target}:</strong>{" "}
                    {log.details}
                  </td>
                  <td className="py-3 pr-4 text-concrete-500 whitespace-nowrap">
                    {log.ipAnonymized}
                  </td>
                  <td className="py-3 font-semibold text-emerald-800 whitespace-nowrap">
                    {log.integrityHash.slice(0, 14)}…
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
