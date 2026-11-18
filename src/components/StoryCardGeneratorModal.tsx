"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, Download, Link2, Instagram } from "lucide-react";
import { Product, Store } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";

interface StoryCardGeneratorModalProps {
  product: Product;
  store?: Store;
  onClose: () => void;
}

/**
 * Gera uma arte 1080x1920 pronta pro Instagram Stories via HTML5 Canvas,
 * com espaço reservado para colar o Sticker de Link da peça!
 */
export function StoryCardGeneratorModal({
  product,
  store,
  onClose,
}: StoryCardGeneratorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { showToast } = useMarketplace();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = product.image;

    img.onload = () => {
      // Fundo Dark Urbano 1080x1920
      ctx.fillStyle = "#141414";
      ctx.fillRect(0, 0, 1080, 1920);

      // Pontilhado sutil
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      for (let x = 30; x < 1080; x += 36) {
        for (let y = 30; y < 1920; y += 36) {
          ctx.fillRect(x, y, 3, 3);
        }
      }

      // Topo: Pílula Neon
      ctx.fillStyle = "#EEFF33";
      ctx.beginPath();
      ctx.roundRect(80, 90, 920, 78, 39);
      ctx.fill();

      ctx.fillStyle = "#141414";
      ctx.font = "800 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `⚡ DISPONÍVEL NO BRECHOZADAS • ${(store?.handle || "@acervodoreliquia").toUpperCase()}`,
        540,
        140
      );

      // Card Central Branco
      ctx.fillStyle = "#F6F4EF";
      ctx.beginPath();
      ctx.roundRect(80, 210, 920, 1340, 44);
      ctx.fill();

      // Foto da Peça (corte proporcional central)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(120, 250, 840, 940, 32);
      ctx.clip();

      const scale = Math.max(840 / img.width, 940 / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const dx = 120 + (840 - drawW) / 2;
      const dy = 250 + (940 - drawH) / 2;
      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();

      // Etiqueta de Tamanho na Foto
      ctx.fillStyle = "#141414";
      ctx.beginPath();
      ctx.roundRect(155, 285, 220, 66, 18);
      ctx.fill();
      ctx.fillStyle = "#EEFF33";
      ctx.font = "800 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`TAM ${product.size}`, 265, 329);

      // Etiqueta de Preço Flutuante
      ctx.fillStyle = "#C93B1E";
      ctx.beginPath();
      ctx.roundRect(155, 1085, 310, 80, 22);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 42px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`R$ ${product.price},00`, 310, 1140);

      // Textos da Peça
      ctx.textAlign = "left";
      ctx.fillStyle = "#C93B1E";
      ctx.font = "700 28px sans-serif";
      ctx.fillText(
        `${product.brand.toUpperCase()} • ${product.condition.toUpperCase()}`,
        130,
        1255
      );

      ctx.fillStyle = "#141414";
      ctx.font = "800 42px sans-serif";
      const shortTitle =
        product.title.length > 36
          ? product.title.slice(0, 35) + "…"
          : product.title;
      ctx.fillText(shortTitle, 130, 1320);

      ctx.fillStyle = "#4A463F";
      ctx.font = "600 30px sans-serif";
      ctx.fillText(
        `Medidas: ${product.measurements.largura} × ${product.measurements.comprimento} • Peça Única`,
        130,
        1380
      );

      ctx.fillStyle = "#141414";
      ctx.font = "700 28px sans-serif";
      ctx.fillText(
        "✓ PIX c/ baixa automática • Sacolinha até 15% OFF",
        130,
        1480
      );

      // Área Inferior tracejada p/ colar o Sticker de Link do Instagram!
      ctx.strokeStyle = "#EEFF33";
      ctx.lineWidth = 4;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.roundRect(140, 1610, 800, 190, 36);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#EEFF33";
      ctx.font = "800 34px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🔗 COLE O STICKER DE LINK AQUI NO STORY", 540, 1690);
      ctx.fillStyle = "#EAE6DC";
      ctx.font = "600 26px sans-serif";
      ctx.fillText("brechozadas.vercel.app • Garimpe antes que acabe!", 540, 1745);

      setReady(true);
    };
  }, [product, store]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `story-${product.slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("📲 Imagem PNG salva! Agora é só postar nos Stories.");
  };

  const handleCopyUrl = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    showToast("🔗 Link direto desta peça copiado para o Sticker do Story!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-2 border-ink max-w-md w-full p-5 space-y-4 shadow-urban max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-rust" />
            <h3 className="font-display font-extrabold text-lg text-ink">
              Gerador de Arte p/ Stories
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-concrete-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-concrete-500">
          Baixe o card em alta definição (formato 9:16) já com espaço marcado
          para colar o <strong>Sticker de Link</strong> do Instagram!
        </p>

        <div className="bg-ink rounded-2xl p-2 flex justify-center">
          <canvas
            ref={canvasRef}
            width={1080}
            height={1920}
            className="w-56 sm:w-64 aspect-[9/16] rounded-xl shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={!ready}
            onClick={handleDownload}
            className="py-3 px-4 rounded-xl bg-rust hover:bg-rust-hover disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-urban-sm"
          >
            <Download className="w-4 h-4" /> Baixar PNG (Story)
          </button>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="py-3 px-4 rounded-xl bg-ink text-neon font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Link2 className="w-4 h-4" /> Copiar Link da Peça
          </button>
        </div>
      </div>
    </div>
  );
}
