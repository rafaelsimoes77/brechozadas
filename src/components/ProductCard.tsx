"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Sparkles, CheckCircle2, Film } from "lucide-react";
import { Product } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";

export function ProductCard({ product }: { product: Product }) {
  const { likedIds, toggleLike, addToBag, stores, offers } = useMarketplace();
  const isLiked = likedIds.includes(product.id);
  const store = stores.find((s) => s.slug === product.storeSlug);
  const activeOffer = offers[product.id];

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-concrete-300 hover:border-ink transition-all duration-200 hover:shadow-urban flex flex-col overflow-hidden relative">
      {/* Área da Foto Vertical (Estilo Enjoei Modernizado) */}
      <div className="relative aspect-[3/4] w-full bg-concrete-100 overflow-hidden">
        <Link href={`/peca/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              product.isSold ? "grayscale opacity-65" : ""
            }`}
          />
        </Link>

        {/* Badges Superiores Esquerda: Tamanho + Destaque PRO / Acervo */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span className="bg-ink/90 backdrop-blur-sm text-concrete-100 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md">
            TAM {product.size}
          </span>

          {product.mode === "acervo" ? (
            <span className="bg-ink text-neon font-mono text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-neon/50">
              <Film className="w-3 h-3" /> ACERVO
            </span>
          ) : (
            product.isBoostedPro &&
            !product.isSold && (
              <span className="bg-neon text-ink font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-ink/20">
                <Sparkles className="w-2.5 h-2.5" /> PRO
              </span>
            )
          )}
        </div>

        {/* Botão Reliquiar (Equivalente ao Yeyezar do Enjoei) */}
        <button
          type="button"
          onClick={() => toggleLike(product.id)}
          aria-label="Reliquiar peça"
          className={`absolute top-2.5 right-2.5 h-8 px-2.5 rounded-full backdrop-blur-md border transition-all flex items-center gap-1 text-xs font-semibold ${
            isLiked
              ? "bg-rust text-white border-rust shadow-sm"
              : "bg-white/90 text-ink border-concrete-300 hover:border-ink"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
          <span>{product.likes}</span>
        </button>

        {/* Carimbo Automático VENDIDO (Fim do trabalho manual na legenda!) */}
        {product.isSold && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-ink/25">
            <span className="bg-ink text-neon border-2 border-neon font-display font-extrabold text-sm tracking-widest uppercase px-4 py-1.5 rounded-lg -rotate-6 shadow-urban">
              ✓ VENDIDO
            </span>
          </div>
        )}

        {/* Etiqueta Flutuante de Preço no Canto Inferior Esquerdo (Assinatura Enjoei!) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md border border-ink/15 px-2.5 py-1.5 rounded-xl shadow-sm">
            {product.mode === "acervo" ? (
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-extrabold text-ink">
                  R$ {product.rentalDailyPrice || product.price}
                </span>
                <span className="text-[10px] font-mono text-concrete-500">
                  /diária
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-extrabold text-rust">
                  R$ {product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[11px] text-concrete-500 line-through font-mono">
                    R$ {product.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          {discountPercent && !product.isSold && (
            <span className="bg-rust text-white font-mono text-[10px] font-bold px-2 py-1 rounded-lg">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-1 text-xs text-concrete-500 mb-1">
            <span className="font-bold uppercase tracking-wide text-ink/80 truncate">
              {product.brand}
            </span>
            <span className="text-[11px] font-semibold shrink-0">{product.code}</span>
          </div>

          <Link
            href={`/peca/${product.slug}`}
            className="text-sm sm:text-[15px] font-bold text-ink leading-snug line-clamp-2 hover:text-rust transition-colors"
          >
            {product.title}
          </Link>

          <p className="text-xs text-concrete-500 font-medium mt-1 truncate">
            {product.measurements.largura} × {product.measurements.comprimento}
          </p>
        </div>

        {/* Rodapé do Card: Lojinha + Botão Rápido Sacolinha */}
        <div className="pt-2.5 border-t border-concrete-200 flex items-center justify-between gap-2">
          {store ? (
            <Link
              href={`/brecho/${store.slug}`}
              className="flex items-center gap-1.5 min-w-0 group/store"
            >
              <span
                className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                style={{ backgroundColor: store.accentColor }}
              >
                {store.name.charAt(0)}
              </span>
              <span className="text-xs font-medium text-ink/80 truncate group-hover/store:text-rust">
                {store.handle}
              </span>
              {store.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-rust shrink-0" />
              )}
            </Link>
          ) : (
            <span />
          )}

          {!product.isSold && (
            <button
              type="button"
              onClick={() => addToBag(product.id)}
              title={
                product.mode === "acervo"
                  ? "Adicionar à Lista de Produção"
                  : "Colocar na Sacolinha"
              }
              className="h-7 px-2.5 rounded-lg bg-concrete-100 hover:bg-ink hover:text-white text-ink border border-concrete-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {activeOffer ? `Oferta R$${activeOffer.amount}` : "Sacola"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
