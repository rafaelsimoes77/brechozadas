"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Store, ShoppingBag } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";

/**
 * Barra inferior fixa estilo App Nativo (Enjoei / Instagram) exclusiva para telas de celular
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { bagIds, setIsBagOpen } = useMarketplace();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-concrete-300 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center text-[10px] font-bold">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 ${
            pathname === "/" ? "text-rust" : "text-ink/70"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </Link>

        <Link
          href="/explorar"
          className={`flex flex-col items-center gap-0.5 py-1 ${
            pathname?.startsWith("/explorar") ? "text-rust" : "text-ink/70"
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Explorar</span>
        </Link>

        <Link
          href="/vender"
          className="flex flex-col items-center -mt-4"
        >
          <span className="w-11 h-11 rounded-full bg-rust text-white border-2 border-ink shadow-urban-sm flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </span>
          <span className="text-rust mt-0.5">Vender</span>
        </Link>

        <Link
          href="/brechos"
          className={`flex flex-col items-center gap-0.5 py-1 ${
            pathname?.startsWith("/brecho") ? "text-rust" : "text-ink/70"
          }`}
        >
          <Store className="w-5 h-5" />
          <span>Brechós</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsBagOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 text-ink/70 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {bagIds.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-neon text-ink border border-ink font-mono text-[9px] font-extrabold px-1 rounded-full">
                {bagIds.length}
              </span>
            )}
          </div>
          <span>Sacola</span>
        </button>
      </div>
    </nav>
  );
}
