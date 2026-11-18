import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

/**
 * Selo autoral inspirado no traço manual/rabiscado do @acervodoreliquia
 * combinado com tipografia moderna e limpa para a plataforma BRECHOZADAS.
 */
export function BrandLogo({ size = "md", inverted = false }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <div className="inline-flex items-center gap-2.5 select-none group">
      {/* Selo Circular Rabisco Urbano */}
      <div
        className={`${iconSizes[size]} rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:-rotate-6 ${
          inverted
            ? "bg-concrete-100 border-concrete-100 text-ink"
            : "bg-ink border-ink text-concrete-100"
        }`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          className="w-4/5 h-4/5"
          aria-hidden="true"
        >
          {/* Círculo rabiscado interno */}
          <path
            d="M20 4.5C28.8 4.2 35.8 11.3 35.5 20.1C35.2 28.7 28.3 35.6 19.8 35.4C11.1 35.2 4.3 28.4 4.6 19.7C4.8 11.5 11.4 4.8 20 4.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeDasharray="3 1.5"
          />
          {/* Estrela/Flecha urbana em traço manual */}
          <path
            d="M20 8L23.2 16.4L32 16.8L25 22.1L27.6 30.8L20 25.6L12.4 30.8L15 22.1L8 16.8L16.8 16.4L20 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Ponto central neon/rust */}
          <circle cx="20" cy="20.5" r="2.5" fill="#C93B1E" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-display font-extrabold tracking-tight ${textSizes[size]} ${
              inverted ? "text-concrete-100" : "text-ink"
            }`}
          >
            BRECHO<span className="text-rust">ZADAS</span>
          </span>
        </div>
        <span
          className={`text-[11px] font-semibold tracking-wide ${
            inverted ? "text-concrete-300" : "text-concrete-500"
          }`}
        >
          por @acervodoreliquia
        </span>
      </div>
    </div>
  );
}

/** Sublinhado sutil em traço manual para dar personalidade sem poluir */
export function ScribbleUnderline({ className = "text-rust" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 10"
      fill="none"
      className={`w-full h-2.5 -mt-1 ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 7.5C44 2.2 118 1.8 178 6.2C132 4.8 62 5.9 14 8.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
