"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Trash2,
  Train,
  Truck,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  QrCode,
  Heart,
  Receipt,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import type { OrderRecord } from "@/lib/db";

const SP_STATIONS = [
  "Linha 15-Prata • Estação São Mateus",
  "Linha 2-Verde • Estação Vila Prudente",
  "Linha 10-Turquesa CPTM • Mauá / Santo André",
  "Linha 3-Vermelha • Estação Tatuapé / Sé",
];

export function BagDrawer() {
  const {
    products,
    bagIds,
    isBagOpen,
    setIsBagOpen,
    removeFromBag,
    completeCheckout,
  } = useMarketplace();

  const [deliveryMethod, setDeliveryMethod] = useState<"estacao" | "correios">(
    "estacao"
  );
  const [selectedStation, setSelectedStation] = useState(SP_STATIONS[0]);
  const [cep, setCep] = useState("");
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isBagOpen) return null;

  const bagProducts = products.filter(
    (p) => bagIds.includes(p.id) && !p.isSold
  );
  const subtotal = bagProducts.reduce((acc, p) => acc + p.price, 0);

  const discountRate =
    bagProducts.length >= 3 ? 0.15 : bagProducts.length === 2 ? 0.1 : 0;
  const discountValue = Math.round(subtotal * discountRate);
  const shippingCost =
    bagProducts.length === 0 ? 0 : deliveryMethod === "estacao" ? 0 : 16;
  const total = Math.max(0, subtotal - discountValue + shippingCost);

  const handlePay = async () => {
    setSubmitting(true);
    const detail =
      deliveryMethod === "estacao"
        ? selectedStation
        : `Correios CEP ${cep || "03940-000"}`;
    const ord = await completeCheckout(
      bagProducts.map((p) => p.id),
      deliveryMethod,
      detail,
      "PIX"
    );
    setSubmitting(false);
    if (ord) {
      setCompletedOrder(ord);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-concrete-100 h-full flex flex-col border-l-2 border-ink shadow-2xl">
        <div className="p-4 bg-ink text-concrete-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-lg flex items-center gap-2">
              🛍️ Minha Sacolinha{" "}
              <span className="bg-neon text-ink font-mono text-xs px-2 py-0.5 rounded-full">
                {bagProducts.length}
              </span>
            </h2>
            <p className="text-[11px] text-concrete-300 font-mono">
              Junte peças e ganhe até 15% OFF automático
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCompletedOrder(null);
              setIsBagOpen(false);
            }}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Desconto */}
        <div className="bg-white px-4 py-3 border-b border-concrete-300">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            {bagProducts.length === 0 && (
              <span>Adicione 2 peças para liberar 10% OFF!</span>
            )}
            {bagProducts.length === 1 && (
              <span>
                Falta só <strong className="text-rust">+1 peça</strong> para{" "}
                <strong>10% OFF</strong> na Sacolinha!
              </span>
            )}
            {bagProducts.length === 2 && (
              <span className="text-rust">
                🔥 10% OFF ativo! Adicione +1 peça para chegar em 15% OFF!
              </span>
            )}
            {bagProducts.length >= 3 && (
              <span className="text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Desconto máximo de 15% OFF
                ativado!
              </span>
            )}
            <span className="font-mono text-[11px]">
              {Math.min(bagProducts.length, 3)}/3
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-concrete-200 overflow-hidden">
            <div
              className="h-full bg-rust transition-all duration-300"
              style={{
                width: `${Math.min(100, (bagProducts.length / 3) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {completedOrder ? (
            <div className="bg-white border-2 border-ink rounded-2xl p-6 text-center space-y-4 my-4 shadow-urban">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <span className="font-mono text-xs bg-neon text-ink font-extrabold px-2.5 py-0.5 rounded-full">
                  {completedOrder.code}
                </span>
                <h3 className="font-display font-extrabold text-xl text-ink mt-2">
                  Salve! Garimpo Confirmado!
                </h3>
              </div>
              <p className="text-xs text-concrete-500 leading-relaxed">
                O pedido foi gravado no banco de dados e as peças únicas já
                receberam carimbo automático de <strong>VENDIDO</strong>!
              </p>
              <div className="p-3 rounded-xl bg-concrete-50 text-left text-[11px] font-mono space-y-1">
                <p>
                  <strong>Total pago:</strong> R$ {completedOrder.total},00 (PIX)
                </p>
                <p>
                  <strong>Entrega:</strong> {completedOrder.deliveryDetail}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/pedidos"
                  onClick={() => {
                    setCompletedOrder(null);
                    setIsBagOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-ink text-neon text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" /> Ver Meus Pedidos
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setCompletedOrder(null);
                    setIsBagOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-concrete-300 text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : bagProducts.length === 0 ? (
            <div className="text-center py-14 space-y-3">
              <p className="font-display font-bold text-lg text-ink">
                Sua sacolinha tá vazia, relíquia!
              </p>
              <p className="text-xs text-concrete-500 max-w-xs mx-auto">
                Garimpe polos anos 2000, camisas de time, kits Y2K ou peças de
                acervo antes que alguém leve (cada peça é única).
              </p>
              <div className="flex justify-center gap-2">
                <Link
                  href="/explorar"
                  onClick={() => setIsBagOpen(false)}
                  className="inline-flex px-5 py-2.5 rounded-full bg-ink text-neon text-xs font-bold"
                >
                  Explorar Vitrine
                </Link>
                <Link
                  href="/pedidos"
                  onClick={() => setIsBagOpen(false)}
                  className="inline-flex px-4 py-2.5 rounded-full bg-white border border-concrete-300 text-xs font-bold"
                >
                  Meus Pedidos
                </Link>
              </div>
            </div>
          ) : (
            <>
              {bagProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-concrete-300 flex gap-3 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-20 rounded-lg object-cover shrink-0 border border-concrete-200"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-concrete-100 text-ink">
                      TAM {item.size} •{" "}
                      {item.mode === "acervo" ? "DIÁRIA" : "ÚNICA"}
                    </span>
                    <Link
                      href={`/peca/${item.slug}`}
                      onClick={() => setIsBagOpen(false)}
                      className="block text-xs font-bold text-ink truncate mt-1 hover:text-rust"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-extrabold text-rust mt-0.5">
                      R$ {item.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromBag(item.id)}
                    aria-label="Remover"
                    className="p-2 text-concrete-500 hover:text-rust"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="bg-white p-3.5 rounded-xl border border-concrete-300 space-y-3 mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink">
                  Como prefere receber?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("estacao")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === "estacao"
                        ? "border-ink bg-neon/35 font-bold"
                        : "border-concrete-300 bg-concrete-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-ink">
                      <Train className="w-4 h-4 text-rust" /> Trombar Estação
                    </div>
                    <p className="text-[10px] font-mono text-emerald-700 mt-0.5">
                      GRÁTIS • SP & ABC
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("correios")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === "correios"
                        ? "border-ink bg-neon/35 font-bold"
                        : "border-concrete-300 bg-concrete-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-ink">
                      <Truck className="w-4 h-4 text-rust" /> Correios Brasil
                    </div>
                    <p className="text-[10px] font-mono text-concrete-500 mt-0.5">
                      R$ 16,00 • Seguro
                    </p>
                  </button>
                </div>

                {deliveryMethod === "estacao" ? (
                  <div>
                    <label className="block text-[11px] font-mono text-concrete-500 mb-1">
                      Ponto de encontro nas linhas:
                    </label>
                    <select
                      value={selectedStation}
                      onChange={(e) => setSelectedStation(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-concrete-300 text-xs bg-concrete-50 text-ink"
                    >
                      {SP_STATIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="Digite seu CEP (ex: 03940-000)"
                      className="flex-1 h-9 px-3 rounded-lg border border-concrete-300 text-xs bg-concrete-50"
                    />
                    <span className="h-9 px-3 rounded-lg bg-concrete-200 text-xs font-mono flex items-center">
                      2–4 dias
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {bagProducts.length > 0 && !completedOrder && (
          <div className="p-4 bg-white border-t border-concrete-300 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-concrete-500">
                <span>Subtotal ({bagProducts.length} peças)</span>
                <span>R$ {subtotal},00</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Desconto Sacolinha ({discountRate * 100}% OFF)</span>
                  <span>- R$ {discountValue},00</span>
                </div>
              )}
              <div className="flex justify-between text-concrete-500">
                <span>Entrega</span>
                <span>
                  {shippingCost === 0
                    ? "Grátis (Estação)"
                    : `R$ ${shippingCost},00`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-ink pt-2 border-t border-concrete-200">
                <span>Total no PIX / Cartão</span>
                <span className="text-rust">R$ {total},00</span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handlePay}
              className="w-full py-3.5 rounded-xl bg-rust hover:bg-rust-hover disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-urban-sm transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>
                {submitting
                  ? "Confirmando PIX..."
                  : "Fechar Pedido no PIX (Baixa Automática)"}
              </span>
            </button>

            <p className="text-[11px] text-concrete-500 flex items-center justify-center gap-1.5 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              Compra Protegida BRECHOZADAS: o vendedor só recebe quando a peça
              chega pra você.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function FavoritesDrawer() {
  const {
    products,
    likedIds,
    isFavoritesOpen,
    setIsFavoritesOpen,
    toggleLike,
    addToBag,
  } = useMarketplace();

  if (!isFavoritesOpen) return null;

  const likedProducts = products.filter((p) => likedIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-concrete-100 h-full flex flex-col border-l-2 border-ink shadow-2xl">
        <div className="p-4 bg-ink text-concrete-100 flex items-center justify-between">
          <h2 className="font-display font-extrabold text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-rust fill-rust" /> Minhas Reliquiadas
          </h2>
          <button
            type="button"
            onClick={() => setIsFavoritesOpen(false)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {likedProducts.length === 0 ? (
            <p className="text-center text-xs text-concrete-500 py-12">
              Você ainda não curtiu nenhuma relíquia. Clique no ♥ nas peças para
              acompanhar quedas de preço!
            </p>
          ) : (
            likedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded-xl border border-concrete-300 flex gap-3 items-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/peca/${item.slug}`}
                    onClick={() => setIsFavoritesOpen(false)}
                    className="text-xs font-bold text-ink hover:text-rust line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm font-extrabold text-rust mt-1">
                    R$ {item.price} •{" "}
                    <span className="font-mono text-xs text-ink">
                      TAM {item.size}
                    </span>
                  </p>
                  <div className="flex gap-2 mt-2">
                    {!item.isSold && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsFavoritesOpen(false);
                          addToBag(item.id);
                        }}
                        className="px-2.5 py-1 rounded-md bg-ink text-neon text-[11px] font-bold"
                      >
                        + Sacolinha
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      className="px-2 py-1 rounded-md text-[11px] text-concrete-500 hover:text-ink"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
