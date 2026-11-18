"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, BellRing, Clock, Flame } from "lucide-react";
import { UPCOMING_DROPS } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";

export function DropRadarSection() {
  const { showToast } = useMarketplace();
  const [remindedIds, setRemindedIds] = useState<string[]>([]);
  const [secondsTick, setSecondsTick] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("brz_drop_reminders");
      if (saved) setRemindedIds(JSON.parse(saved));
    } catch {}

    const timer = setInterval(() => {
      setSecondsTick((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleReminder = (id: string, handle: string) => {
    const active = remindedIds.includes(id);
    const next = active
      ? remindedIds.filter((x) => x !== id)
      : [...remindedIds, id];
    setRemindedIds(next);
    try {
      localStorage.setItem("brz_drop_reminders", JSON.stringify(next));
    } catch {}
    showToast(
      active
        ? `Alerta removido para o drop de ${handle}.`
        : `🔔 Alerta VIP ativado! Vamos te avisar assim que ${handle} soltar o drop.`
    );
  };

  const formatCountdown = (hoursBase: number) => {
    const totalSecs = Math.max(0, hoursBase * 3600 - secondsTick);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(
      2,
      "0"
    )}m ${String(s).padStart(2, "0")}s`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="bg-ink text-concrete-100 rounded-3xl border-2 border-ink p-6 sm:p-8 shadow-urban space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neon">
              <Flame className="w-4 h-4" /> Radar de Drops da Cena (Ao Vivo)
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">
              Próximos Lançamentos no Pente
            </h2>
            <p className="text-sm text-concrete-300 mt-0.5">
              Ative o lembrete para não perder peças únicas quando os brechós
              abrirem o lote da semana.
            </p>
          </div>
          <Link
            href="/brechos"
            className="text-xs font-bold text-neon hover:underline shrink-0"
          >
            Ver agenda completa dos brechós →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING_DROPS.map((drop) => {
            const isReminded = remindedIds.includes(drop.id);
            return (
              <div
                key={drop.id}
                className="bg-zinc-900 border border-white/15 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-neon/60 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: drop.accentColor }}
                    >
                      {drop.themeTag}
                    </span>
                    <span className="text-xs font-semibold text-concrete-300">
                      +{drop.previewCount} peças
                    </span>
                  </div>

                  <Link
                    href={`/brecho/${drop.storeSlug}`}
                    className="text-xs font-bold text-neon hover:underline block"
                  >
                    {drop.storeHandle} • {drop.dayLabel}
                  </Link>

                  <h3 className="font-display font-bold text-base text-white leading-snug">
                    {drop.title}
                  </h3>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-concrete-300 inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neon" /> Abre em:
                    </span>
                    <strong className="font-bold text-neon tabular-nums">
                      {formatCountdown(drop.hoursFromNow)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReminder(drop.id, drop.storeHandle)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isReminded
                        ? "bg-neon text-ink"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {isReminded ? (
                      <>
                        <BellRing className="w-3.5 h-3.5" /> Alerta Ativado ✓
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" /> Me Avisar no Drop
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
