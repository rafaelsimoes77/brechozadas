"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Sliders } from "lucide-react";
import { Product } from "@/data/mockData";

export function SmartFitMatcher({ product }: { product: Product }) {
  const [heightCm, setHeightCm] = useState<number>(174);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [prefFit, setPrefFit] = useState<"justo" | "regular" | "baggy">("baggy");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("brz_fit_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.heightCm) setHeightCm(parsed.heightCm);
        if (parsed.weightKg) setWeightKg(parsed.weightKg);
        if (parsed.prefFit) setPrefFit(parsed.prefFit);
      }
    } catch {}
  }, []);

  const saveProfile = (h: number, w: number, f: "justo" | "regular" | "baggy") => {
    setHeightCm(h);
    setWeightKg(w);
    setPrefFit(f);
    try {
      localStorage.setItem(
        "brz_fit_profile",
        JSON.stringify({ heightCm: h, weightKg: w, prefFit: f })
      );
    } catch {}
  };

  // Se for calçado (Pisantes), mostra guia de palmilha
  if (product.category === "Pisantes") {
    return (
      <div className="p-4 rounded-2xl bg-concrete-50 border border-concrete-300 space-y-1.5">
        <p className="text-xs font-bold text-ink flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-rust" /> Dica do Provador (Pisantes):
        </p>
        <p className="text-xs text-concrete-500 leading-relaxed">
          Meça a palmilha de um tênis confortável seu com uma régua e compare com{" "}
          <strong className="text-ink">{product.measurements.comprimento}</strong>{" "}
          desta peça para compra 100% certeira sem erro de forma.
        </p>
      </div>
    );
  }

  // Extrai largura numérica da peça em cm (ex: "61 cm" -> 61)
  const rawWidth = parseFloat(
    product.measurements.largura.replace(",", ".").replace(/[^\d.]/g, "")
  );

  // Estima meia-circunferência ideal de camiseta/casaco conforme peso/altura + estilo desejado
  const baseBodyHalfChest = 42 + (weightKg - 55) * 0.28 + (heightCm - 165) * 0.08;
  const easeBonus = prefFit === "justo" ? 2 : prefFit === "regular" ? 5.5 : 9.5;
  const idealGarmentWidth = Math.round(baseBodyHalfChest + easeBonus);
  const diff = rawWidth ? Math.round(rawWidth - idealGarmentWidth) : 0;

  let verdictTitle = "Veste Perfeito no seu Estilo!";
  let verdictDesc = `A peça tem ${rawWidth} cm de largura (ideal estimado p/ você: ~${idealGarmentWidth} cm).`;
  let verdictTone: "good" | "warn" = "good";

  if (diff < -4) {
    verdictTitle = "Atenção: Pode ficar justa / curta em você";
    verdictDesc = `Esta peça tem ${rawWidth} cm de largura (${Math.abs(
      diff
    )} cm menor que o ideal pro caimento que você escolheu). Confira com uma peça sua!`;
    verdictTone = "warn";
  } else if (diff > 6) {
    verdictTitle = "Caimento Bem Largo / Super Oversized!";
    verdictDesc = `Esta peça tem ${rawWidth} cm de largura (+${diff} cm além do seu padrão), garantindo visual bem solto no corpo.`;
    verdictTone = "good";
  }

  return (
    <div className="rounded-2xl border-2 border-ink bg-concrete-50 p-4 space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-neon border border-ink flex items-center justify-center">
            <Sliders className="w-3.5 h-3.5 text-ink" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-ink leading-tight">
              Provador Virtual: Vai servir em mim?
            </h3>
            <p className="text-xs text-concrete-500">
              Compara a fita métrica real da peça com o seu corpo
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-rust hover:underline"
        >
          {isOpen ? "Recolher" : "Ajustar medidas"}
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-concrete-300">
            <label className="block text-[11px] font-semibold text-concrete-500">
              Sua Altura: <strong className="text-ink">{heightCm} cm</strong>
            </label>
            <input
              type="range"
              min={150}
              max={198}
              value={heightCm}
              onChange={(e) =>
                saveProfile(Number(e.target.value), weightKg, prefFit)
              }
              className="w-full accent-rust mt-1"
            />
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-concrete-300">
            <label className="block text-[11px] font-semibold text-concrete-500">
              Seu Peso: <strong className="text-ink">{weightKg} kg</strong>
            </label>
            <input
              type="range"
              min={45}
              max={125}
              value={weightKg}
              onChange={(e) =>
                saveProfile(heightCm, Number(e.target.value), prefFit)
              }
              className="w-full accent-rust mt-1"
            />
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-concrete-300">
            <label className="block text-[11px] font-semibold text-concrete-500 mb-1">
              Como gosta de usar?
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  { id: "justo", label: "Justo" },
                  { id: "regular", label: "Certinho" },
                  { id: "baggy", label: "Largo" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => saveProfile(heightCm, weightKg, opt.id)}
                  className={`py-1 rounded font-bold text-[11px] ${
                    prefFit === opt.id
                      ? "bg-ink text-neon"
                      : "bg-concrete-100 text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {rawWidth > 0 && (
        <div
          className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            verdictTone === "good"
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-amber-50 border-amber-300 text-amber-950"
          }`}
        >
          {verdictTone === "good" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-extrabold">{verdictTitle}</p>
            <p className="opacity-90 mt-0.5 leading-snug">{verdictDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
