"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Sparkles, RotateCcw } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductCard } from "@/components/ProductCard";
import { BRANDS_LIST, PRICE_RANGES } from "@/data/mockData";

const CATEGORIES = [
  "Todas",
  "Polos & Camisas",
  "Time & Esporte",
  "Jaquetas & Racing",
  "Quarto de Menina / Y2K",
  "Pisantes",
  "Acervo (Locação)",
];

function ExplorarContent() {
  const searchParams = useSearchParams();
  const { products, selectedSize, setSelectedSize, searchQuery, setSearchQuery } =
    useMarketplace();

  const [category, setCategory] = useState("Todas");
  const [brand, setBrand] = useState("Todas");
  const [priceRangeId, setPriceRangeId] = useState("todos");
  const [onlyPro, setOnlyPro] = useState(false);
  const [hideSold, setHideSold] = useState(false);
  const [modeFilter, setModeFilter] = useState<"todos" | "venda" | "acervo">(
    "todos"
  );
  const [sortBy, setSortBy] = useState<"recentes" | "menor" | "maior" | "likes">(
    "recentes"
  );

  useEffect(() => {
    const m = searchParams.get("marca");
    const pr = searchParams.get("preco");
    const dest = searchParams.get("destaque");
    if (m) setBrand(m);
    if (pr) setPriceRangeId(pr);
    if (dest === "pro") setOnlyPro(true);
  }, [searchParams]);

  const resetFilters = () => {
    setCategory("Todas");
    setBrand("Todas");
    setPriceRangeId("todos");
    setOnlyPro(false);
    setHideSold(false);
    setModeFilter("todos");
    setSelectedSize("Todos");
    setSearchQuery("");
  };

  const filtered = products
    .filter((p) => {
      if (category !== "Todas" && p.category !== category) return false;
      if (brand !== "Todas" && p.brand !== brand) return false;
      if (selectedSize !== "Todos" && p.size !== selectedSize) return false;
      if (onlyPro && !p.isBoostedPro) return false;
      if (hideSold && p.isSold) return false;
      if (modeFilter !== "todos" && p.mode !== modeFilter) return false;

      if (priceRangeId !== "todos") {
        const range = PRICE_RANGES.find((r) => r.id === priceRangeId);
        if (range && (p.price < range.min || p.price > range.max)) return false;
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const hay =
          `${p.title} ${p.brand} ${p.category} ${p.storeSlug} ${p.code}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "menor") return a.price - b.price;
      if (sortBy === "maior") return b.price - a.price;
      if (sortBy === "likes") return b.likes - a.likes;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-concrete-300">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-rust font-bold">
            Catálogo Inteligente
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-ink">
            Explorar Garimpos ({filtered.length})
          </h1>
          <p className="text-xs sm:text-sm text-concrete-500 mt-1">
            Separe facilmente por marcas, faixas de preço, destaques PRO e seu
            tamanho.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 px-3 rounded-xl bg-white border border-concrete-300 text-xs font-bold text-ink"
          >
            <option value="recentes">Ordenar: Mais Recentes</option>
            <option value="menor">Menor Preço</option>
            <option value="maior">Maior Preço</option>
            <option value="likes">Mais Reliquiados (♥)</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="h-10 px-3 rounded-xl bg-white border border-concrete-300 hover:border-ink text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Sidebar de Filtros */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-concrete-300 p-4 space-y-5">
            <div className="flex items-center gap-2 text-sm font-display font-extrabold text-ink pb-2 border-b border-concrete-200">
              <SlidersHorizontal className="w-4 h-4 text-rust" /> Filtros
            </div>

            {/* Destaques & Disponibilidade */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPro}
                  onChange={(e) => setOnlyPro(e.target.checked)}
                  className="accent-rust w-4 h-4"
                />
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rust" /> Apenas Destaques
                  PRO
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideSold}
                  onChange={(e) => setHideSold(e.target.checked)}
                  className="accent-rust w-4 h-4"
                />
                <span>Ocultar peças já vendidas</span>
              </label>
            </div>

            {/* Modalidade */}
            <div>
              <p className="font-mono text-[11px] uppercase text-concrete-500 font-bold mb-2">
                Modalidade
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "todos", label: "Tudo" },
                    { id: "venda", label: "Compra" },
                    { id: "acervo", label: "Locação" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModeFilter(m.id)}
                    className={`py-1.5 rounded-lg text-xs font-bold border ${
                      modeFilter === m.id
                        ? "bg-ink text-neon border-ink"
                        : "bg-concrete-50 text-ink border-concrete-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa de Preço */}
            <div>
              <p className="font-mono text-[11px] uppercase text-concrete-500 font-bold mb-2">
                Faixa de Preço
              </p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setPriceRangeId("todos")}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    priceRangeId === "todos"
                      ? "bg-rust text-white"
                      : "hover:bg-concrete-100"
                  }`}
                >
                  Qualquer valor
                </button>
                {PRICE_RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setPriceRangeId(r.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      priceRangeId === r.id
                        ? "bg-rust text-white"
                        : "hover:bg-concrete-100"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Marcas */}
            <div>
              <p className="font-mono text-[11px] uppercase text-concrete-500 font-bold mb-2">
                Marca
              </p>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-concrete-50 border border-concrete-300 text-xs font-semibold"
              >
                <option value="Todas">Todas as Marcas</option>
                {BRANDS_LIST.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
                <option value="Racionais MCs / Arquivo">
                  Racionais MCs / Arquivo
                </option>
              </select>
            </div>

            {/* Categoria */}
            <div>
              <p className="font-mono text-[11px] uppercase text-concrete-500 font-bold mb-2">
                Categoria
              </p>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      category === c
                        ? "bg-ink text-neon"
                        : "hover:bg-concrete-100 text-ink/80"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Grade Principal */}
        <div className="lg:col-span-9">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-concrete-300 p-12 text-center space-y-3">
              <h3 className="font-display font-bold text-xl">
                Nenhuma relíquia bateu com todos esses filtros juntos!
              </h3>
              <p className="text-xs text-concrete-500">
                Limpe os filtros para ver todo o garimpo disponível na cena.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-full bg-rust text-white text-xs font-bold"
              >
                Ver Todas as Peças
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-sm font-mono">
          Carregando vitrine...
        </div>
      }
    >
      <ExplorarContent />
    </Suspense>
  );
}
