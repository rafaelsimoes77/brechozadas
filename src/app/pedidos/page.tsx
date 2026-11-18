"use client";

import React from "react";
import Link from "next/link";
import { Receipt, Sparkles, Train, Truck, ArrowRight } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function PedidosPage() {
  const { orders, offers, products } = useMarketplace();
  const offerEntries = Object.values(offers);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-concrete-300 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-rust font-bold">
            Central de Transações
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">
            Meus Pedidos, Ofertas & Repasses
          </h1>
          <p className="text-xs sm:text-sm text-concrete-500 mt-1">
            Acompanhe compras fechadas no PIX, propostas enviadas e o cálculo
            real de repasse (Modo Direto 10% vs BRECHOZADAS PRO 0%).
          </p>
        </div>
        <Link
          href="/explorar"
          className="px-5 py-2.5 rounded-full bg-ink text-neon text-xs font-bold inline-flex items-center gap-1.5 self-start"
        >
          Continuar Garimpando <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Ofertas Ativas */}
      <section className="space-y-4">
        <h2 className="font-display font-extrabold text-xl text-ink">
          Minhas Ofertas de Preço ({offerEntries.length})
        </h2>
        {offerEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-concrete-300 p-6 text-xs text-concrete-500">
            Você ainda não enviou ofertas. Entre em qualquer peça disponível e
            clique em <strong>Fazer Oferta</strong>!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offerEntries.map((of) => {
              const prod = products.find((p) => p.id === of.productId);
              if (!prod) return null;
              return (
                <div
                  key={of.productId}
                  className="bg-white rounded-2xl border border-concrete-300 p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-14 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/peca/${prod.slug}`}
                        className="text-xs font-bold text-ink hover:text-rust truncate block"
                      >
                        {prod.title}
                      </Link>
                      <p className="font-mono text-xs text-rust font-bold mt-0.5">
                        Proposta: R$ {of.amount},00
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-neon/60 text-ink font-mono text-[10px] font-bold uppercase">
                        Status: {of.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/brecho/${prod.storeSlug}`}
                    className="text-xs font-mono underline text-ink shrink-0"
                  >
                    Ver Loja →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Pedidos Concluídos */}
      <section className="space-y-4">
        <h2 className="font-display font-extrabold text-xl text-ink flex items-center gap-2">
          <Receipt className="w-5 h-5 text-rust" /> Pedidos Confirmados ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-concrete-300 p-8 text-center space-y-3">
            <p className="font-display font-bold text-lg">
              Nenhum pedido fechado ainda!
            </p>
            <p className="text-xs text-concrete-500">
              Adicione peças na Sacolinha e clique em{" "}
              <strong>Fechar Pedido no PIX</strong> para testar o fluxo completo
              de baixa automática e repasse aos brechós.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border-2 border-ink p-6 space-y-5 shadow-urban"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-concrete-200">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-ink text-neon font-mono text-xs font-extrabold px-3 py-1 rounded-full">
                      {ord.code}
                    </span>
                    <span className="text-xs font-mono text-concrete-500">
                      {ord.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    {ord.deliveryMethod === "estacao" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <Train className="w-4 h-4" /> {ord.deliveryDetail}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-ink">
                        <Truck className="w-4 h-4" /> {ord.deliveryDetail}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Itens Comprados */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase text-concrete-500 font-mono">
                      Peças do Pedido
                    </p>
                    {ord.items.map((it) => (
                      <div
                        key={it.productId}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-concrete-50"
                      >
                        <img
                          src={it.image}
                          alt={it.title}
                          className="w-12 h-14 rounded-lg object-cover"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-ink">{it.title}</p>
                          <p className="font-mono text-concrete-500">
                            {it.code} • TAM {it.size} • R$ {it.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Transparência de Repasse pros Brechós */}
                  <div className="bg-concrete-100 rounded-2xl p-4 space-y-3 text-xs">
                    <p className="font-mono text-[11px] uppercase font-bold text-ink">
                      Divisão Automática de Pagamento (Split)
                    </p>
                    {ord.sellerPayouts.map((sp) => (
                      <div
                        key={sp.storeSlug}
                        className="p-3 rounded-xl bg-white border border-concrete-200 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-bold text-ink flex items-center gap-1.5">
                            {sp.storeName}
                            {sp.isPro && (
                              <span className="bg-neon text-ink font-mono text-[9px] px-1.5 py-0.5 rounded font-extrabold inline-flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> PRO 0%
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] font-mono text-concrete-500">
                            Taxa plataforma:{" "}
                            {sp.isPro
                              ? "R$ 0 (Isento PRO)"
                              : `R$ ${sp.platformFee} (10% Modo Direto)`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-concrete-500 block">
                            Líquido Brechó
                          </span>
                          <strong className="text-sm text-emerald-700 font-mono">
                            R$ {sp.netSeller},00
                          </strong>
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-concrete-300 flex justify-between font-extrabold text-sm">
                      <span>Total Pago ({ord.paymentMethod})</span>
                      <span className="text-rust">R$ {ord.total},00</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
