import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  showSubtitle?: boolean;
}

/**
 * Novo Logo Oficial BRECHOZADAS por @acervodoreliquia
 * 
 * Conceito Visual:
 * - Selo de Autenticidade Urbana / Lacre de Garimpo
 * - Emblema em Squircle com pesponto vintage de costura (referência aos brechós)
 * - Estrela Relíquia de 4 pontas afiada (Y2K / Streetwear de Quebrada) com corte Z dinâmico em Rust
 * - Tipografia limpa, geométrica e de alto impacto (Plus Jakarta Sans)
 */
export function BrandLogo({
  size = "md",
  inverted = false,
  showSubtitle = true,
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <div className="inline-flex items-center gap-2.5 sm:gap-3 select-none group">
      {/* Emblema Lacre Relíquia */}
      <div
        className={`${iconSizes[size]} relative shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${
          inverted
            ? "bg-white text-ink border border-white/20 shadow-sm"
            : "bg-ink text-white shadow-sm"
        }`}
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          className="w-full h-full p-1"
          aria-hidden="true"
        >
          {/* Linha de pesponto / costura de brechó */}
          <rect
            x="4"
            y="4"
            width="36"
            height="36"
            rx="9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2.5 2.5"
            strokeOpacity={inverted ? "0.35" : "0.25"}
          />

          {/* Rebite/Lacre de canto (tag industrial) */}
          <circle
            cx="8.5"
            cy="8.5"
            r="1.2"
            fill={inverted ? "#121212" : "#D4F829"}
            opacity="0.8"
          />
          <circle
            cx="35.5"
            cy="35.5"
            r="1.2"
            fill={inverted ? "#C93B1E" : "#C93B1E"}
          />

          {/* Estrela Relíquia 4 Pontas (Símbolo de Jóia Rara / Garimpo de Rua) */}
          <path
            d="M22 8L24.8 18.2L35 21L24.8 23.8L22 34L19.2 23.8L9 21L19.2 18.2L22 8Z"
            fill="currentColor"
            opacity={inverted ? "0.95" : "0.9"}
          />

          {/* Corte Z relâmpago de identidade urbana no núcleo da estrela */}
          <path
            d="M20 16.5H25L21.5 21H25L20 26.5L21.5 22H18.5L20 16.5Z"
            fill="#C93B1E"
          />

          {/* Ponto de brilho / diamante no centro */}
          <circle cx="22" cy="21" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Tipografia da Marca */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center tracking-tight">
          <span
            className={`font-display font-extrabold ${textSizes[size]} tracking-tight ${
              inverted ? "text-white" : "text-ink"
            }`}
          >
            BRECHO<span className="text-rust">ZADAS</span>
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5 truncate max-w-[150px] sm:max-w-none">
            <span
              className={`text-[10px] font-bold tracking-wider uppercase truncate ${
                inverted ? "text-concrete-300" : "text-concrete-500"
              }`}
            >
              por @acervodoreliquia
            </span>
            <span className="hidden xs:inline-block w-1 h-1 rounded-full bg-rust shrink-0" />
            <span
              className={`hidden xs:inline-block text-[9px] font-mono tracking-wider ${
                inverted ? "text-neon" : "text-rust"
              }`}
            >
              SP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Sublinhado sutil e fluido para dar destaque a títulos sem poluir a leitura */
export function ScribbleUnderline({
  className = "text-rust",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 180 10"
      fill="none"
      className={`w-full h-2.5 -mt-1 ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 7C45 2.5 120 2.2 178 6.5C130 5.2 60 6.2 12 8.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
