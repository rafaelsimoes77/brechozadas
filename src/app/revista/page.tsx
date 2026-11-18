"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, MapPin, Clock } from "lucide-react";
import { EDITORIAL_STORIES } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductCard } from "@/components/ProductCard";

function RevistaContent() {
  const searchParams = useSearchParams();
  const { products } = useMarketplace();

  const [activeSection, setActiveSection] = useState<
    "Todas" | "Dissecando o Drop" | "Histórias da Quebrada"
  >("Todas");
  const [selectedSlug, setSelectedSlug] = useState<string>(
    EDITORIAL_STORIES[0].slug
  );

  useEffect(() => {
    const aba = searchParams.get("aba");
    const art = searchParams.get("artigo");
    if (aba === "historias") setActiveSection("Histórias da Quebrada");
    if (art) setSelectedSlug(art);
  }, [searchParams]);

  const filteredStories = EDITORIAL_STORIES.filter(
    (s) => activeSection === "Todas" || s.section === activeSection
  );

  const activeStory =
    EDITORIAL_STORIES.find((s) => s.slug === selectedSlug) ||
    filteredStories[0] ||
    EDITORIAL_STORIES[0];

  const citedProducts = products.filter((p) =>
    activeStory.relatedProductSlugs.includes(p.slug)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Cabeçalho da Revista */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-concrete-300">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-rust font-bold">
            <BookOpen className="w-4 h-4" /> Revista & Observatório Cultural
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink mt-1">
            Dissecando o Drop & Histórias da Quebrada
          </h1>
          <p className="text-xs sm:text-sm text-concrete-500 max-w-2xl mt-1">
            A narrativa cultural por trás das roupas, dos bailes, das estações e
            das pessoas que constroem a estética urbana.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(
            ["Todas", "Dissecando o Drop", "Histórias da Quebrada"] as const
          ).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setActiveSection(sec)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 ${
                activeSection === sec
                  ? "bg-ink text-neon"
                  : "bg-white border border-concrete-300 text-ink"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Leitor Principal da Matéria Selecionada */}
      <article className="bg-white rounded-3xl border-2 border-ink overflow-hidden shadow-urban">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto bg-ink relative">
            <img
              src={activeStory.coverImage}
              alt={activeStory.title}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 left-4 font-mono text-xs font-extrabold px-3 py-1 rounded-full ${
                activeStory.section === "Dissecando o Drop"
                  ? "bg-neon text-ink"
                  : "bg-rust text-white"
              }`}
            >
              {activeStory.section}
            </span>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-concrete-500">
              <span>{activeStory.date}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rust" />{" "}
                {activeStory.location}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeStory.readTime}
              </span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink leading-tight">
              {activeStory.title}
            </h2>
            <p className="text-sm font-semibold text-rust">
              {activeStory.subtitle}
            </p>

            <div className="space-y-3.5 text-sm text-ink/85 leading-relaxed pt-2 border-t border-concrete-200">
              {activeStory.paragraphs.map((par, i) => (
                <p key={i}>{par}</p>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-concrete-100 font-mono text-xs text-concrete-500">
              <strong className="text-ink">Ficha & Pesquisa:</strong>{" "}
              {activeStory.credits}
            </div>
          </div>
        </div>
      </article>

      {/* Peças Citadas na Matéria */}
      {citedProducts.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-display font-extrabold text-xl text-ink">
            Peças Conectadas a Esta História
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {citedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Outras Edições da Revista */}
      <section className="space-y-4 pt-6 border-t border-concrete-300">
        <h3 className="font-display font-extrabold text-xl text-ink">
          Todas as Matérias ({filteredStories.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredStories.map((st) => {
            const isSelected = st.slug === activeStory.slug;
            return (
              <button
                key={st.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(st.slug);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-left bg-white rounded-2xl border p-4 space-y-3 transition-all ${
                  isSelected
                    ? "border-2 border-rust shadow-urban-sm"
                    : "border-concrete-300 hover:border-ink"
                }`}
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden">
                  <img
                    src={st.coverImage}
                    alt={st.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-mono text-[10px] uppercase text-rust font-bold block">
                  {st.section} • {st.location}
                </span>
                <h4 className="font-display font-extrabold text-base text-ink line-clamp-2">
                  {st.title}
                </h4>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function RevistaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 font-mono text-sm">
          Carregando revista...
        </div>
      }
    >
      <RevistaContent />
    </Suspense>
  );
}
