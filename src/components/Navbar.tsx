"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  PlusCircle,
  Sparkles,
  Menu,
  X,
  Ruler,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useMarketplace } from "@/context/MarketplaceContext";

const ROTATING_HINTS = [
  'busque "Pólo Ecko 🦏"...',
  'busque "Nike Mercurial"...',
  'busque "Jaqueta Alpinestars"...',
  'busque "Quarto de Menina Y2K"...',
  'busque "Pisante Mizuno"...',
  'busque "@acervodoreliquia"...',
];

const QUICK_SIZES = ["Todos", "P", "M", "G", "GG", "41"];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    likedIds,
    bagIds,
    selectedSize,
    setSelectedSize,
    searchQuery,
    setSearchQuery,
    setIsBagOpen,
    setIsFavoritesOpen,
  } = useMarketplace();

  const [hintIdx, setHintIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIdx((prev) => (prev + 1) % ROTATING_HINTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== "/explorar") {
      router.push("/explorar");
    }
  };

  const navLinks = [
    { href: "/explorar", label: "Explorar" },
    { href: "/kits", label: "Montar Kit" },
    { href: "/brechos", label: "Brechós" },
    { href: "/acervo", label: "Acervo & Rede" },
    { href: "/revista", label: "Revista" },
    { href: "/pedidos", label: "Pedidos" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-concrete-100/95 backdrop-blur-md border-b border-concrete-300">
      {/* Topbar Limpa & Urbana */}
      <div className="bg-ink text-concrete-100 text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <p className="font-mono truncate">
            <span className="text-neon font-bold">⚡ DROP NO PENTE:</span>{" "}
            Sacolinha com até <strong className="text-neon">15% OFF</strong> •
            Envio Brasil ou{" "}
            <span className="underline decoration-rust">
              Trombar na Estação SP/ABC
            </span>
          </p>
          <Link
            href="/vender"
            className="hidden md:inline-flex items-center gap-1 text-neon hover:underline font-mono shrink-0"
          >
            <Sparkles className="w-3 h-3" /> BRECHOZADAS PRO: 0% de taxa nas vendas
          </Link>
        </div>
      </div>

      {/* Linha Principal do Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 sm:gap-5">
        <Link href="/" className="shrink-0">
          <BrandLogo size="md" />
        </Link>

        {/* Barra de Busca Pílula Estilo Enjoei */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md relative items-center"
        >
          <Search className="w-4 h-4 text-concrete-500 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (pathname !== "/explorar" && e.target.value.trim().length > 1) {
                router.push("/explorar");
              }
            }}
            placeholder={ROTATING_HINTS[hintIdx]}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-white border border-concrete-300 focus:border-ink focus:outline-none text-sm text-ink placeholder:text-concrete-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-xs text-concrete-500 hover:text-ink"
            >
              limpar
            </button>
          )}
        </form>

        {/* Links Desktop */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition-colors ${
                  active ? "text-rust" : "text-ink/80 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Ações: Reliquiados, Sacolinha e Quero Vender */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFavoritesOpen(true)}
            aria-label="Peças Reliquiadas"
            className="relative h-10 px-3 rounded-full bg-white border border-concrete-300 hover:border-ink inline-flex items-center gap-1.5 text-ink transition-colors"
          >
            <Heart className="w-4 h-4 text-rust fill-rust/15" />
            <span className="text-xs font-bold">{likedIds.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            aria-label="Abrir Sacolinha"
            className="relative h-10 px-3 rounded-full bg-white border border-concrete-300 hover:border-ink inline-flex items-center gap-1.5 text-ink transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">{bagIds.length}</span>
            {bagIds.length >= 2 && (
              <span className="hidden sm:inline-block bg-neon text-ink font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                OFF
              </span>
            )}
          </button>

          <Link
            href="/vender"
            className="hidden sm:inline-flex h-10 px-4 rounded-full bg-rust hover:bg-rust-hover text-white text-xs sm:text-sm font-bold items-center gap-1.5 shadow-urban-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Quero Vender</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="lg:hidden h-10 w-10 rounded-full bg-white border border-concrete-300 flex items-center justify-center text-ink"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sub-barra Rápida: Busca Mobile + Trava "Meu Tamanho" */}
      <div className="border-t border-concrete-200 bg-concrete-50/80">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Busca Mobile */}
          <form onSubmit={handleSearchSubmit} className="md:hidden relative flex items-center">
            <Search className="w-4 h-4 text-concrete-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ROTATING_HINTS[hintIdx]}
              className="w-full h-9 pl-9 pr-3 rounded-full bg-white border border-concrete-300 text-xs text-ink"
            />
          </form>

          {/* Filtro Rápido Meu Tamanho */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-concrete-500 shrink-0 mr-1">
              <Ruler className="w-3.5 h-3.5 text-rust" /> Meu Tamanho:
            </span>
            {QUICK_SIZES.map((sz) => {
              const active = selectedSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all shrink-0 ${
                    active
                      ? "bg-ink text-neon shadow-sm"
                      : "bg-white text-ink/75 border border-concrete-300 hover:border-ink"
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>

          {/* Atalhos Rápidos de Destaque */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-concrete-500 shrink-0">
            <Link href="/explorar?destaque=pro" className="hover:text-rust">
              ⚡ Destaques PRO
            </Link>
            <span>•</span>
            <Link href="/explorar?preco=ate-50" className="hover:text-rust">
              💸 Até R$ 50
            </Link>
            <span>•</span>
            <Link href="/brecho/acervodoreliquia" className="hover:text-rust font-semibold text-ink">
              ★ Loja @acervodoreliquia
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-concrete-300 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-concrete-100 text-sm font-bold text-ink hover:bg-rust hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/vender"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-xl bg-rust text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Quero Vender / Planos PRO
          </Link>
        </div>
      )}
    </header>
  );
}
