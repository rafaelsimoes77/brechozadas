"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  HandCoins,
  MessageCircle,
  Send,
  Ruler,
  ShieldCheck,
  Train,
  CheckCircle2,
  Camera,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductCard } from "@/components/ProductCard";
import { SmartFitMatcher } from "@/components/SmartFitMatcher";
import { StoryCardGeneratorModal } from "@/components/StoryCardGeneratorModal";
import { Instagram } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    products,
    stores,
    likedIds,
    offers,
    toggleLike,
    addToBag,
    submitOffer,
    addQuestion,
  } = useMarketplace();

  const product = products.find((p) => p.slug === slug);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [questionText, setQuestionText] = useState("");
  const [questionUser, setQuestionUser] = useState("");

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-extrabold text-2xl">
          Peça não encontrada!
        </h1>
        <Link
          href="/explorar"
          className="inline-flex px-5 py-2.5 rounded-full bg-rust text-white text-xs font-bold"
        >
          Voltar para a Vitrine
        </Link>
      </div>
    );
  }

  const store = stores.find((s) => s.slug === product.storeSlug);
  const isLiked = likedIds.includes(product.id);
  const currentOffer = offers[product.id];
  const minAllowedOffer = Math.round(product.price * product.minOfferRatio);

  const openOfferModal = () => {
    setOfferAmount(Math.round(product.price * 0.9));
    setOfferModalOpen(true);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount < minAllowedOffer || offerAmount >= product.price) return;
    submitOffer(product.id, offerAmount);
    setOfferModalOpen(false);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    addQuestion(product.id, questionUser.trim(), questionText.trim());
    setQuestionText("");
  };

  const whatsappMessage = encodeURIComponent(
    `Salve ${store?.name || ""}! Vi a peça "${product.title}" (${product.code}) no BRECHOZADAS e queria tirar uma dúvida!`
  );

  const related = products
    .filter((p) => p.id !== product.id && !p.isSold)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-concrete-500 hover:text-ink"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para Explorar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Foto Grande */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-white border-2 border-ink shadow-urban aspect-[3/4]">
            <img
              src={product.image}
              alt={product.title}
              className={`w-full h-full object-cover ${
                product.isSold ? "grayscale opacity-70" : ""
              }`}
            />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-ink text-concrete-100 font-mono text-xs font-bold px-3 py-1 rounded-full">
                {product.code}
              </span>
              {product.isBoostedPro && (
                <span className="bg-neon text-ink font-mono text-xs font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> DESTAQUE PRO
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => toggleLike(product.id)}
              className={`absolute top-4 right-4 h-10 px-4 rounded-full font-bold text-xs flex items-center gap-1.5 border transition-all ${
                isLiked
                  ? "bg-rust text-white border-rust"
                  : "bg-white/95 text-ink border-ink"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>Reliquiar ({product.likes})</span>
            </button>

            {product.isSold && (
              <div className="absolute inset-0 bg-ink/35 flex items-center justify-center">
                <span className="bg-ink text-neon border-2 border-neon font-display font-extrabold text-2xl px-6 py-2.5 rounded-xl -rotate-6 shadow-urban">
                  ✓ PEÇA VENDIDA
                </span>
              </div>
            )}
          </div>

          {/* Ficha Técnica do Ensaio Cultural */}
          {product.credits && (
            <div className="bg-white rounded-2xl border border-concrete-300 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Camera className="w-4 h-4 text-rust" /> Ficha Técnica do Ensaio:
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-concrete-500">
                {product.credits.model && (
                  <span className="bg-concrete-100 px-2.5 py-1 rounded-md">
                    Modelo: <strong className="text-ink">{product.credits.model}</strong>
                  </span>
                )}
                {product.credits.photo && (
                  <span className="bg-concrete-100 px-2.5 py-1 rounded-md">
                    Foto: <strong className="text-ink">{product.credits.photo}</strong>
                  </span>
                )}
                {product.credits.styling && (
                  <Link
                    href="/acervo#rede"
                    className="bg-concrete-100 hover:bg-neon px-2.5 py-1 rounded-md transition-colors"
                  >
                    Styling: <strong className="text-ink">{product.credits.styling}</strong>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Preço, Medidas, Oferta, WhatsApp/DM & Sacolinha */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-concrete-300 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rust">
                {product.brand} • {product.category}
              </span>
              <span className="text-xs font-mono bg-concrete-100 px-2.5 py-1 rounded-full font-bold">
                {product.condition}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink leading-tight">
              {product.title}
            </h1>

            {/* Bloco de Preço */}
            <div className="p-4 rounded-2xl bg-concrete-100 border border-concrete-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                {product.mode === "acervo" ? (
                  <>
                    <p className="text-[11px] font-mono uppercase text-concrete-500">
                      Locação p/ Clipes, Cinema & Styling
                    </p>
                    <p className="font-display font-extrabold text-3xl text-ink">
                      R$ {product.rentalDailyPrice || product.price}{" "}
                      <span className="text-sm font-mono font-normal text-concrete-500">
                        / diária
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <p className="text-xs font-mono text-concrete-500 line-through">
                          de R$ {product.originalPrice},00
                        </p>
                      )}
                    <p className="font-display font-extrabold text-3xl text-rust">
                      R$ {product.price},00
                    </p>
                    <p className="text-[11px] text-concrete-500">
                      no PIX com baixa imediata ou em até 3x no cartão
                    </p>
                  </>
                )}
              </div>

              <span className="bg-ink text-neon font-mono text-xs font-extrabold px-3 py-1.5 rounded-xl">
                TAMANHO {product.size}
              </span>
            </div>

            {/* Banner se o usuário já mandou Oferta */}
            {currentOffer && (
              <div className="p-3.5 rounded-xl bg-neon/40 border border-ink text-xs flex items-center justify-between">
                <span>
                  🤝 Sua proposta de <strong>R$ {currentOffer.amount},00</strong>{" "}
                  está <strong>{currentOffer.status}</strong>!
                </span>
                <span className="font-mono text-[11px]">{currentOffer.createdAt}</span>
              </div>
            )}

            {/* Botões Principais Estilo Enjoei + Contato Direto WhatsApp/DM */}
            {!product.isSold ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => addToBag(product.id)}
                    className="py-3.5 px-5 rounded-xl bg-rust hover:bg-rust-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-urban-sm transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {product.mode === "acervo"
                        ? "Reservar no Acervo"
                        : "Colocar na Sacolinha"}
                    </span>
                  </button>

                  {product.acceptsOffers && product.mode === "venda" && (
                    <button
                      type="button"
                      onClick={openOfferModal}
                      className="py-3.5 px-5 rounded-xl bg-white hover:bg-ink hover:text-neon text-ink border-2 border-ink font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <HandCoins className="w-4 h-4" />
                      <span>Fazer Oferta</span>
                    </button>
                  )}
                </div>

                {/* Botão Híbrido WhatsApp / DM + Gerador de Card p/ Stories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {store && (
                    <a
                      href={`https://wa.me/${store.whatsapp}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-4 rounded-xl bg-concrete-100 hover:bg-emerald-700 hover:text-white text-ink border border-concrete-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate">WhatsApp / DM {store.handle}</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setStoryModalOpen(true)}
                    className="py-3 px-4 rounded-xl bg-ink text-neon hover:opacity-90 text-xs font-bold flex items-center justify-center gap-1.5 transition-opacity"
                  >
                    <Instagram className="w-4 h-4 shrink-0" />
                    <span>Gerar Card p/ Story (PNG)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-concrete-100 text-center text-xs font-mono text-concrete-500">
                Essa relíquia era peça única e já encontrou novo dono!
              </div>
            )}

            {/* Medidas Reais + Termômetro de Caimento */}
            <div className="pt-4 border-t border-concrete-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-rust" /> Medidas Reais na Fita
                </span>
                <span className="text-xs font-mono text-rust font-bold">
                  Caimento: {product.fit}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-concrete-50 border border-concrete-200">
                  <span className="text-[10px] text-concrete-500 block">
                    LARGURA (TÓRAX)
                  </span>
                  <strong className="text-ink">
                    {product.measurements.largura}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-concrete-50 border border-concrete-200">
                  <span className="text-[10px] text-concrete-500 block">
                    COMPRIMENTO
                  </span>
                  <strong className="text-ink">
                    {product.measurements.comprimento}
                  </strong>
                </div>
                {product.measurements.extra && (
                  <div className="p-2.5 rounded-xl bg-concrete-50 border border-concrete-200">
                    <span className="text-[10px] text-concrete-500 block">
                      DETALHE EXTRA
                    </span>
                    <strong className="text-ink">
                      {product.measurements.extra}
                    </strong>
                  </div>
                )}
              </div>

              {/* Provador Virtual Inteligente */}
              <SmartFitMatcher product={product} />
            </div>

            {/* História da Peça */}
            <div className="pt-3 border-t border-concrete-200 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                A Visão Dessa Relíquia
              </h3>
              <p className="text-xs sm:text-sm text-concrete-500 leading-relaxed">
                {product.storyBehindPiece}
              </p>
            </div>

            {/* Garantias */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-concrete-500">
              <div className="flex items-center gap-1.5">
                <Train className="w-4 h-4 text-rust shrink-0" />
                <span>Entrega Estações SP/ABC ou Correios</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Garantia BRECHOZADAS até receber</span>
              </div>
            </div>
          </div>

          {/* Card do Brechó Vendedor */}
          {store && (
            <div className="bg-white rounded-2xl border border-concrete-300 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-12 h-12 rounded-2xl text-white font-display font-extrabold text-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: store.accentColor }}
                >
                  {store.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-ink truncate">
                      {store.name}
                    </h3>
                    {store.verified && (
                      <CheckCircle2 className="w-4 h-4 text-rust shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-mono text-concrete-500">
                    {store.handle} • ★ {store.rating} • {store.soldCount} vendas
                  </p>
                  <p className="text-[11px] text-concrete-500 truncate">
                    {store.responseTime}
                  </p>
                </div>
              </div>
              <Link
                href={`/brecho/${store.slug}`}
                className="px-4 py-2 rounded-xl bg-ink text-neon text-xs font-bold shrink-0 hover:opacity-90"
              >
                Ver Página do Brechó
              </Link>
            </div>
          )}

          {/* Perguntas e Respostas Públicas dentro do Site (Estilo Enjoei!) */}
          <div className="bg-white rounded-2xl border border-concrete-300 p-5 space-y-4">
            <h3 className="font-display font-extrabold text-base text-ink">
              Perguntas na Peça ({product.questions.length})
            </h3>

            <form onSubmit={handleQuestionSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={questionUser}
                  onChange={(e) => setQuestionUser(e.target.value)}
                  placeholder="Seu @ (opcional)"
                  className="sm:w-36 h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 text-xs"
                />
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Pergunte sobre medidas, tecido ou entrega na estação..."
                  className="flex-1 h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 text-xs"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-xl bg-ink text-neon text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> Perguntar
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {product.questions.length === 0 ? (
                <p className="text-xs text-concrete-500">
                  Nenhuma dúvida ainda. Mande a primeira pergunta acima!
                </p>
              ) : (
                product.questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-concrete-50 border border-concrete-200 space-y-2 text-xs"
                  >
                    <div className="flex justify-between text-concrete-500 font-mono text-[11px]">
                      <strong className="text-ink">{q.user}</strong>
                      <span>{q.date}</span>
                    </div>
                    <p className="text-ink font-medium">{q.text}</p>
                    {q.answer && (
                      <div className="pl-3 border-l-2 border-rust text-concrete-500 pt-1">
                        <strong className="text-rust">{store?.handle}: </strong>
                        {q.answer}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mais Relíquias */}
      <section className="pt-6 border-t border-concrete-300">
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-ink mb-5">
          Outras Relíquias pra Juntar na Sacolinha (Até 15% OFF)
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Modal Gerador de Arte 9:16 p/ Stories */}
      {storyModalOpen && (
        <StoryCardGeneratorModal
          product={product}
          store={store}
          onClose={() => setStoryModalOpen(false)}
        />
      )}

      {/* Modal Interativo "Fazer Oferta" (Estilo Enjoei) */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-ink max-w-md w-full p-6 space-y-5 shadow-urban">
            <div>
              <span className="font-mono text-[11px] uppercase text-rust font-bold">
                Negociação Direta no Site
              </span>
              <h3 className="font-display font-extrabold text-2xl text-ink mt-0.5">
                Mandar Proposta na Relíquia
              </h3>
              <p className="text-xs text-concrete-500 mt-1">
                Preço atual: <strong>R$ {product.price},00</strong> • Proposta
                mínima aceita pelo brechó: <strong>R$ {minAllowedOffer},00</strong>
              </p>
            </div>

            {/* Atalhos de Desconto */}
            <div className="grid grid-cols-3 gap-2">
              {[0.95, 0.9, 0.85].map((ratio) => {
                const val = Math.max(
                  minAllowedOffer,
                  Math.round(product.price * ratio)
                );
                return (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setOfferAmount(val)}
                    className={`py-2 rounded-xl border text-xs font-mono font-bold ${
                      offerAmount === val
                        ? "bg-ink text-neon border-ink"
                        : "bg-concrete-50 text-ink border-concrete-300"
                    }`}
                  >
                    R$ {val} (-{Math.round((1 - ratio) * 100)}%)
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Sua oferta em R$:
                </label>
                <input
                  type="number"
                  min={minAllowedOffer}
                  max={product.price - 1}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full h-12 px-4 rounded-xl border-2 border-ink font-display font-extrabold text-xl text-rust"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-concrete-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rust text-white text-xs font-bold shadow-urban-sm"
                >
                  Enviar Oferta Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
