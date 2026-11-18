"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Sparkles, ShoppingBag, Check } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { CURATED_KITS } from "@/data/mockData";

export default function MontadorDeKitsPage() {
  const { products, addToBag, setIsBagOpen, showToast } = useMarketplace();
  const available = products.filter((p) => !p.isSold && p.mode === "venda");

  const tops = available.filter(
    (p) =>
      p.category === "Polos & Camisas" ||
      p.category === "Time & Esporte" ||
      p.category === "Quarto de Menina / Y2K"
  );
  const layers = available.filter(
    (p) => p.category === "Jaquetas & Racing" || p.category === "Polos & Camisas"
  );
  const kicks = available.filter((p) => p.category === "Pisantes");

  const [selectedTopId, setSelectedTopId] = useState(tops[0]?.id || "");
  const [selectedLayerId, setSelectedLayerId] = useState(layers[0]?.id || "");
  const [selectedKickId, setSelectedKickId] = useState(kicks[0]?.id || "");

  // Evita duplicar a mesma peça nos dois primeiros slots
  const chosenIds = Array.from(
    new Set([selectedTopId, selectedLayerId, selectedKickId].filter(Boolean))
  );
  const chosenProducts = chosenIds
    .map((id) => available.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const rawTotal = chosenProducts.reduce((acc, p) => acc + p.price, 0);
  const discountRate =
    chosenProducts.length >= 3 ? 0.15 : chosenProducts.length === 2 ? 0.1 : 0;
  const discountSaved = Math.round(rawTotal * discountRate);
  const finalKitPrice = rawTotal - discountSaved;

  const handleAddFullKit = (ids: string[], kitName: string) => {
    ids.forEach((id) => addToBag(id));
    setIsBagOpen(true);
    showToast(`🔥 ${kitName} adicionado inteiro na Sacolinha com desconto!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-14">
      {/* Cabeçalho */}
      <div className="bg-white rounded-3xl border-2 border-ink p-6 sm:p-10 shadow-urban space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rust">
          <Layers className="w-4 h-4" /> Inovação BRECHOZADAS • Inspirado nos OutFits da Cena
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
          Montador de Kit Completo (Com até 15% OFF)
        </h1>
        <p className="text-sm sm:text-base text-concrete-500 max-w-2xl leading-relaxed">
          Combine peças de diferentes brechós pra montar a beca inteira no quadro
          visual ou leve um dos kits assinados pelos stylists da quebrada em 1
          clique!
        </p>
      </div>

      {/* 1. MONTADOR INTERATIVO PASSO A PASSO */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-concrete-300 p-6 space-y-6">
          <h2 className="font-display font-extrabold text-xl text-ink">
            1. Escolha as Peças da Sua Beca
          </h2>

          {/* Slot 1 */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-rust block">
              Peça Base (Polos, Time ou Y2K)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {tops.map((item) => {
                const active = selectedTopId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTopId(item.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      active
                        ? "border-2 border-rust bg-rust-light/50"
                        : "border-concrete-300 hover:border-ink"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full aspect-[4/4] object-cover rounded-xl mb-2"
                    />
                    <p className="text-xs font-bold text-ink line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs font-extrabold text-rust">
                      R$ {item.price} • {item.size}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot 2 */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-rust block">
              Sobreposição / Segunda Peça
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {layers.map((item) => {
                const active = selectedLayerId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLayerId(item.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      active
                        ? "border-2 border-rust bg-rust-light/50"
                        : "border-concrete-300 hover:border-ink"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full aspect-[4/4] object-cover rounded-xl mb-2"
                    />
                    <p className="text-xs font-bold text-ink line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs font-extrabold text-rust">
                      R$ {item.price} • {item.size}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot 3 */}
          {kicks.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-rust block">
                Pisante no Pé
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {kicks.map((item) => {
                  const active = selectedKickId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedKickId(item.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        active
                          ? "border-2 border-rust bg-rust-light/50"
                          : "border-concrete-300 hover:border-ink"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full aspect-[4/4] object-cover rounded-xl mb-2"
                      />
                      <p className="text-xs font-bold text-ink line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs font-extrabold text-rust">
                        R$ {item.price} • {item.size}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quadro Visual do Kit Montado */}
        <div className="lg:col-span-5 bg-ink text-concrete-100 rounded-3xl border-2 border-ink p-6 space-y-5 shadow-urban sticky top-28">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-xl">
              Seu Quadro de Styling ({chosenProducts.length} peças)
            </h3>
            {discountRate > 0 && (
              <span className="bg-neon text-ink text-xs font-extrabold px-2.5 py-1 rounded-full">
                -{discountRate * 100}% NO KIT
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {chosenProducts.map((p) => (
              <Link
                key={p.id}
                href={`/peca/${p.slug}`}
                className="bg-zinc-900 rounded-2xl p-2 border border-white/10 block"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full aspect-[3/4] object-cover rounded-xl mb-1.5"
                />
                <p className="text-[11px] font-bold truncate">{p.title}</p>
                <p className="text-xs text-neon font-extrabold">R$ {p.price}</p>
              </Link>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 space-y-1.5 text-sm">
            <div className="flex justify-between text-concrete-300 text-xs">
              <span>Soma das peças avulsas:</span>
              <span className="line-through">R$ {rawTotal},00</span>
            </div>
            <div className="flex justify-between text-neon text-xs font-bold">
              <span>Desconto Sacolinha ({discountRate * 100}% OFF):</span>
              <span>- R$ {discountSaved},00</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-white/10">
              <span>Kit Completo:</span>
              <span className="text-neon">R$ {finalKitPrice},00</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAddFullKit(chosenIds, "Seu Kit Personalizado")}
            className="w-full py-3.5 rounded-xl bg-rust hover:bg-rust-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-urban-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Levar Kit Inteiro na Sacolinha
          </button>
        </div>
      </section>

      {/* 2. KITS ASSINADOS PELOS CURADORES */}
      <section className="space-y-5 pt-6 border-t border-concrete-300">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rust">
            Curadoria Pronta pra Usar
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Kits Assinados pelos Stylists da Cena
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CURATED_KITS.map((kit) => {
            const kitItems = kit.productIds
              .map((id) => products.find((p) => p.id === id))
              .filter(
                (p): p is NonNullable<typeof p> => p !== undefined && !p.isSold
              );
            const sum = kitItems.reduce((a, b) => a + b.price, 0);
            const rate = kitItems.length >= 3 ? 0.15 : 0.1;
            const discounted = Math.round(sum * (1 - rate));

            return (
              <div
                key={kit.id}
                className="bg-white rounded-3xl border border-concrete-300 hover:border-ink p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-urban"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-concrete-100 text-ink text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-rust" /> {kit.curator}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      -{rate * 100}% OFF
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-lg text-ink">
                    {kit.title}
                  </h3>
                  <p className="text-xs text-concrete-500 leading-relaxed">
                    {kit.vibe}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {kitItems.map((it) => (
                      <img
                        key={it.id}
                        src={it.image}
                        alt={it.title}
                        className="w-full aspect-[3/4] object-cover rounded-xl border border-concrete-200"
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-concrete-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-concrete-500 line-through block">
                      R$ {sum},00
                    </span>
                    <strong className="text-lg font-extrabold text-rust">
                      R$ {discounted},00
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddFullKit(
                        kitItems.map((i) => i.id),
                        kit.title
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-ink text-neon text-xs font-bold inline-flex items-center gap-1.5 hover:opacity-90"
                  >
                    <Check className="w-3.5 h-3.5" /> Levar Kit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
