"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  MessageCircle,
  Sparkles,
  Share2,
  Train,
  Settings,
  Palette,
  HandCoins,
  PlusCircle,
  MessageSquareReply,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductCard } from "@/components/ProductCard";

const CUSTOM_COLORS = [
  "#C93B1E",
  "#121212",
  "#B83280",
  "#1D4ED8",
  "#15803D",
  "#CA8A04",
];

export default function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    stores,
    products,
    followedStoreSlugs,
    toggleFollowStore,
    offers,
    respondOfferAsSeller,
    answerQuestionAsSeller,
    updateStoreSettings,
    showToast,
  } = useMarketplace();

  const store = stores.find((s) => s.slug === slug);
  const [activeTab, setActiveTab] = useState<
    "disponiveis" | "destaques" | "acervo" | "vendidos"
  >("disponiveis");
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  if (!store) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-extrabold text-2xl">
          Brechó não encontrado!
        </h1>
        <Link
          href="/brechos"
          className="inline-flex px-5 py-2.5 rounded-full bg-rust text-white text-xs font-bold"
        >
          Ver todos os brechós
        </Link>
      </div>
    );
  }

  const isFollowing = followedStoreSlugs.includes(store.slug);
  const allStoreProducts = products.filter((p) => p.storeSlug === store.slug);

  const tabProducts = allStoreProducts.filter((p) => {
    if (activeTab === "disponiveis") return !p.isSold && p.mode === "venda";
    if (activeTab === "destaques") return p.isBoostedPro && !p.isSold;
    if (activeTab === "acervo") return p.mode === "acervo";
    if (activeTab === "vendidos") return p.isSold;
    return true;
  });

  const storeOffers = allStoreProducts
    .map((p) => ({ product: p, offer: offers[p.id] }))
    .filter((x) => Boolean(x.offer));

  const unansweredQuestions = allStoreProducts.flatMap((p) =>
    p.questions
      .filter((q) => !q.answer)
      .map((q) => ({ product: p, question: q }))
  );

  const copyBioLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    showToast(
      `🔗 Link brechozadas.com.br/brecho/${store.slug} copiado pra colocar na Bio!`
    );
  };

  return (
    <div className="pb-14">
      <div
        className={`h-40 sm:h-52 bg-gradient-to-r ${store.bannerGradient} relative border-b-2 border-ink`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-start justify-between pt-5">
          <div className="flex flex-wrap gap-2">
            {store.isFounder && (
              <span className="bg-white text-ink font-mono text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                ★ LOJA OFICIAL FUNDADORA
              </span>
            )}
            {store.isPro ? (
              <span className="bg-neon text-ink font-mono text-xs font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> BRECHOZADAS PRO • 0% TAXA
              </span>
            ) : (
              <span className="bg-black/60 text-white font-mono text-xs px-3 py-1 rounded-full">
                MODO DIRETO (10% TAXA)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOwnerPanelOpen(!ownerPanelOpen)}
            className="px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-black text-neon border border-neon/40 font-mono text-xs font-bold inline-flex items-center gap-1.5 backdrop-blur-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>
              {ownerPanelOpen
                ? "Fechar Painel do Lojista"
                : "Painel do Dono do Brechó"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl border-2 border-ink p-5 sm:p-8 -mt-14 relative z-10 shadow-urban space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 border-ink text-white font-display font-extrabold text-3xl flex items-center justify-center shrink-0 shadow-urban-sm"
                style={{ backgroundColor: store.accentColor }}
              >
                {store.name.charAt(0)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
                    {store.name}
                  </h1>
                  {store.verified && (
                    <CheckCircle2 className="w-5 h-5 text-rust" />
                  )}
                </div>
                <p className="font-mono text-xs sm:text-sm text-concrete-500">
                  {store.handle} •{" "}
                  <MapPin className="w-3.5 h-3.5 inline text-rust" />{" "}
                  {store.location}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-ink pt-0.5">
                  {store.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleFollowStore(store.slug)}
                style={
                  !isFollowing ? { backgroundColor: store.accentColor } : undefined
                }
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  isFollowing
                    ? "bg-concrete-200 text-ink border border-ink"
                    : "text-white shadow-urban-sm"
                }`}
              >
                {isFollowing ? "✓ Seguindo no BRECHOZADAS" : "+ Seguir Brechó"}
              </button>

              <a
                href={`https://wa.me/${store.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-full bg-white hover:bg-emerald-700 hover:text-white text-ink border border-concrete-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp / DM
              </a>

              <button
                type="button"
                onClick={copyBioLink}
                className="px-3.5 py-2.5 rounded-full bg-concrete-100 hover:bg-ink hover:text-neon text-ink text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Link da Bio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-concrete-200">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs sm:text-sm text-concrete-500 leading-relaxed">
                {store.bio}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-ink">
                <span className="inline-flex items-center gap-1 bg-concrete-100 px-2.5 py-1 rounded-md">
                  <Train className="w-3.5 h-3.5 text-rust" />{" "}
                  {store.stations.join(" • ")}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-concrete-50 border border-concrete-200">
                <p className="font-display font-extrabold text-lg sm:text-xl text-ink">
                  {store.followers.toLocaleString("pt-BR")}
                </p>
                <p className="text-[11px] font-mono text-concrete-500">
                  Seguidores
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-concrete-50 border border-concrete-200">
                <p className="font-display font-extrabold text-lg sm:text-xl text-ink">
                  {store.soldCount}
                </p>
                <p className="text-[11px] font-mono text-concrete-500">
                  Vendidas
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-concrete-50 border border-concrete-200">
                <p className="font-display font-extrabold text-lg sm:text-xl text-rust">
                  ★ {store.rating}
                </p>
                <p className="text-[11px] font-mono text-concrete-500">
                  Avaliação
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-2">
            {store.highlights.map((hl) => (
              <div
                key={hl.title}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-concrete-50 border border-concrete-200 shrink-0"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base border-2"
                  style={{ borderColor: store.accentColor }}
                >
                  {hl.emoji}
                </span>
                <div>
                  <p className="text-xs font-bold text-ink leading-tight">
                    {hl.title}
                  </p>
                  <p className="text-[10px] font-mono text-concrete-500">
                    {hl.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAINEL DO DONO DO BRECHÓ (Salvo em data/db.json via API!) */}
        {ownerPanelOpen && (
          <div className="mt-6 bg-ink text-concrete-100 rounded-3xl border-2 border-neon p-6 space-y-6 shadow-urban">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div>
                <span className="font-mono text-[11px] text-neon uppercase">
                  Gestão Persistente do Brechó • Salvo na API
                </span>
                <h2 className="font-display font-extrabold text-xl">
                  Painel Administrativo de {store.name}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateStoreSettings(store.slug, { isPro: !store.isPro })
                  }
                  className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold border border-white/15"
                >
                  {store.isPro
                    ? "Plano Atual: PRO (0% taxa) • Alternar"
                    : "Ativar BRECHOZADAS PRO (0% taxa)"}
                </button>
                <Link
                  href="/vender"
                  className="px-4 py-2 rounded-full bg-neon text-ink font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Subir Nova Peça
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* 1. Identidade Visual */}
              <div className="bg-zinc-900 p-4 rounded-2xl border border-white/10 space-y-3">
                <p className="text-xs font-bold flex items-center gap-2 text-neon">
                  <Palette className="w-4 h-4" /> Cor da Identidade Visual
                </p>
                <p className="text-xs text-concrete-300">
                  Escolha a cor oficial dos botões, selos e avatar da sua loja:
                </p>
                <div className="flex items-center gap-2.5 pt-1">
                  {CUSTOM_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() =>
                        updateStoreSettings(store.slug, { accentColor: hex })
                      }
                      style={{ backgroundColor: hex }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        store.accentColor === hex
                          ? "border-neon scale-110"
                          : "border-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Ofertas Recebidas */}
              <div className="bg-zinc-900 p-4 rounded-2xl border border-white/10 space-y-3">
                <p className="text-xs font-bold flex items-center gap-2 text-neon">
                  <HandCoins className="w-4 h-4" /> Ofertas Recebidas (
                  {storeOffers.length})
                </p>
                {storeOffers.length === 0 ? (
                  <p className="text-xs text-concrete-300">
                    Nenhuma proposta pendente. Envie uma oferta na página de uma
                    peça para gerenciá-la aqui!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {storeOffers.map(({ product, offer }) => (
                      <div
                        key={product.id}
                        className="p-2.5 rounded-xl bg-black/50 space-y-2 text-xs"
                      >
                        <div className="flex justify-between gap-2">
                          <span className="font-bold truncate">
                            {product.title}
                          </span>
                          <span className="font-mono text-neon shrink-0">
                            R$ {offer.amount}
                          </span>
                        </div>
                        {offer.status === "pendente" ? (
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                respondOfferAsSeller(product.id, "aceita")
                              }
                              className="flex-1 py-1.5 rounded-lg bg-neon text-ink font-bold text-[11px]"
                            >
                              Aceitar
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                respondOfferAsSeller(product.id, "recusada")
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-concrete-300 text-[11px]"
                            >
                              Recusar
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-[10px] text-concrete-300 uppercase">
                            Status: {offer.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Perguntas Sem Resposta */}
              <div className="bg-zinc-900 p-4 rounded-2xl border border-white/10 space-y-3">
                <p className="text-xs font-bold flex items-center gap-2 text-neon">
                  <MessageSquareReply className="w-4 h-4" /> Responder Clientes (
                  {unansweredQuestions.length})
                </p>
                {unansweredQuestions.length === 0 ? (
                  <p className="text-xs text-concrete-300">
                    Todas as dúvidas nas peças estão respondidas em dia!
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {unansweredQuestions.map(({ product, question }) => (
                      <div
                        key={question.id}
                        className="p-2.5 rounded-xl bg-black/50 space-y-2 text-xs"
                      >
                        <p className="text-[11px] text-concrete-300">
                          <strong>{question.user}:</strong> {question.text}
                        </p>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={replyDrafts[question.id] || ""}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({
                                ...prev,
                                [question.id]: e.target.value,
                              }))
                            }
                            placeholder="Digite sua resposta..."
                            className="flex-1 h-8 px-2 rounded bg-zinc-800 text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const txt = replyDrafts[question.id];
                              if (!txt?.trim()) return;
                              answerQuestionAsSeller(
                                product.id,
                                question.id,
                                txt.trim()
                              );
                            }}
                            className="px-2.5 h-8 rounded bg-neon text-ink font-bold text-[11px]"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Abas do Catálogo */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-concrete-300 pb-3">
          {(
            [
              {
                id: "disponiveis",
                label: `Disponíveis (${
                  allStoreProducts.filter(
                    (p) => !p.isSold && p.mode === "venda"
                  ).length
                })`,
              },
              {
                id: "destaques",
                label: `Destaques PRO (${
                  allStoreProducts.filter((p) => p.isBoostedPro && !p.isSold)
                    .length
                })`,
              },
              {
                id: "acervo",
                label: `Acervo / Locação (${
                  allStoreProducts.filter((p) => p.mode === "acervo").length
                })`,
              },
              {
                id: "vendidos",
                label: `Já Vendidos (${
                  allStoreProducts.filter((p) => p.isSold).length
                })`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={
                activeTab === tab.id
                  ? { backgroundColor: store.accentColor, color: "#fff" }
                  : undefined
              }
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? "shadow-sm"
                  : "bg-white text-ink border border-concrete-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tabProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-concrete-300 p-10 text-center text-xs text-concrete-500">
              Nenhum item nesta aba no momento.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {tabProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
