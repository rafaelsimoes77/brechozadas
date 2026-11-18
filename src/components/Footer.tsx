import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Instagram, Sparkles, Train, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-concrete-100 border-t-2 border-ink mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <BrandLogo inverted size="md" />
          <p className="text-xs text-concrete-300 leading-relaxed">
            O marketplace da moda de quebrada. Conectando brechós independentes,
            acervo de figurino, produtores, stylists e quem vive a cultura de rua
            em SP, ABC e todo o Brasil.
          </p>
          <a
            href="https://www.instagram.com/acervodoreliquia/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-neon hover:underline pt-1"
          >
            <Instagram className="w-4 h-4" /> @acervodoreliquia
          </a>
        </div>

        <div>
          <h4 className="font-display font-bold text-sm text-neon mb-3 uppercase tracking-wider">
            Garimpar
          </h4>
          <ul className="space-y-2 text-xs text-concrete-300">
            <li>
              <Link href="/explorar" className="hover:text-white">
                Explorar Catálogo Completo
              </Link>
            </li>
            <li>
              <Link href="/explorar?destaque=pro" className="hover:text-white">
                Destaques BRECHOZADAS PRO
              </Link>
            </li>
            <li>
              <Link href="/explorar?preco=ate-50" className="hover:text-white">
                Achadinhos até R$ 50
              </Link>
            </li>
            <li>
              <Link href="/brechos" className="hover:text-white">
                Páginas dos Brechós da Cena
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-sm text-neon mb-3 uppercase tracking-wider">
            Cultura & Cena
          </h4>
          <ul className="space-y-2 text-xs text-concrete-300">
            <li>
              <Link href="/revista" className="hover:text-white">
                Revista: Dissecando o Drop
              </Link>
            </li>
            <li>
              <Link href="/revista?aba=historias" className="hover:text-white">
                Histórias da Quebrada
              </Link>
            </li>
            <li>
              <Link href="/acervo" className="hover:text-white">
                Acervo p/ Clipes & Styling
              </Link>
            </li>
            <li>
              <Link href="/acervo#rede" className="hover:text-white">
                Rede de Produtores & Estilistas
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-neon uppercase tracking-wider">
            Venda no BRECHOZADAS
          </h4>
          <p className="text-xs text-concrete-300 leading-relaxed">
            Anuncie no Modo Direto grátis (10% só quando vender) ou assine o{" "}
            <strong className="text-white">BRECHOZADAS PRO</strong> com{" "}
            <strong className="text-neon">0% de taxa</strong> e impulso na home!
          </p>
          <Link
            href="/vender"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rust hover:bg-rust-hover text-white text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Abrir Meu Brechó Online
          </Link>
          <div className="pt-2 flex flex-col gap-1.5 text-[11px] font-mono text-concrete-300">
            <span className="inline-flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-neon" /> Entrega Estações SP/ABC + Correios
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neon" /> PIX Seguro & Baixa Automática
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4 text-center text-[11px] font-mono text-concrete-500">
        © {new Date().getFullYear()} BRECHOZADAS • Idealizado a partir do{" "}
        <span className="text-concrete-300">@acervodoreliquia</span> (São Mateus • ZL & ABC Paulista)
      </div>
    </footer>
  );
}
