"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, MapPin, PlusCircle, Sparkles } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function BrechosDirectoryPage() {
  const { stores, products } = useMarketplace();
  const [regionFilter, setRegionFilter] = useState("Todas");

  const filteredStores = stores.filter((st) => {
    if (regionFilter === "Todas") return true;
    return st.location.toLowerCase().includes(regionFilter.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div className="bg-white rounded-3xl border-2 border-ink p-6 sm:p-10 shadow-urban flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-rust font-bold">
            Páginas Oficiais • Extensão do Instagram
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">
            Brechós & Lojinhas da Cena
          </h1>
          <p className="text-xs sm:text-sm text-concrete-500 leading-relaxed">
            No BRECHOZADAS, cada brechó cadastrado ganha sua própria página com
            identidade visual própria, destaques, controle de ofertas, estoque
            automático e link pronto pra colocar na bio do Instagram.
          </p>
        </div>
        <Link
          href="/vender"
          className="px-6 py-3.5 rounded-full bg-rust hover:bg-rust-hover text-white font-bold text-sm inline-flex items-center gap-2 shrink-0 shadow-urban-sm"
        >
          <PlusCircle className="w-4 h-4" /> Cadastrar Meu Brechó
        </Link>
      </div>

      {/* Filtro de Território */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {["Todas", "ZL", "ABC", "Osasco"].map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => setRegionFilter(reg)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              regionFilter === reg
                ? "bg-ink text-neon"
                : "bg-white border border-concrete-300 text-ink"
            }`}
          >
            {reg === "Todas" ? "Todos os Territórios" : `Região ${reg}`}
          </button>
        ))}
      </div>

      {/* Lista de Brechós */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStores.map((st) => {
          const storeProducts = products.filter(
            (p) => p.storeSlug === st.slug && !p.isSold
          );

          return (
            <div
              key={st.slug}
              className="bg-white rounded-3xl border border-concrete-300 hover:border-ink overflow-hidden transition-all hover:shadow-urban flex flex-col justify-between"
            >
              <div>
                <div
                  className={`h-28 bg-gradient-to-r ${st.bannerGradient} p-4 flex items-start justify-between`}
                >
                  <div className="flex gap-2">
                    {st.isFounder && (
                      <span className="bg-white text-ink font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                        ★ CURADORIA FUNDADORA
                      </span>
                    )}
                    {st.isPro && (
                      <span className="bg-neon text-ink font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> PRO
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-white bg-black/40 px-2.5 py-1 rounded-full">
                    ★ {st.rating} ({st.soldCount} vendas)
                  </span>
                </div>

                <div className="px-6 pb-6 -mt-8 space-y-3">
                  <div className="flex items-end justify-between">
                    <div
                      className="w-16 h-16 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white font-display font-extrabold text-2xl"
                      style={{ backgroundColor: st.accentColor }}
                    >
                      {st.name.charAt(0)}
                    </div>
                    <Link
                      href={`/brecho/${st.slug}`}
                      className="px-4 py-2 rounded-full bg-ink text-neon text-xs font-bold hover:opacity-90"
                    >
                      Abrir Página do Brechó →
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-display font-extrabold text-xl text-ink">
                        {st.name}
                      </h2>
                      {st.verified && (
                        <CheckCircle2 className="w-4 h-4 text-rust" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-concrete-500">
                      {st.handle} • {st.followers.toLocaleString("pt-BR")} seguidores
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                    {st.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {st.specialties.map((sp) => (
                      <span
                        key={sp}
                        className="text-[11px] font-mono bg-concrete-100 px-2.5 py-1 rounded-md text-ink"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-concrete-50 border-t border-concrete-200 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-concrete-500">
                  <MapPin className="w-3.5 h-3.5 text-rust" /> {st.location}
                </span>
                <span className="font-mono font-bold text-ink">
                  {storeProducts.length} disponíveis agora
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
