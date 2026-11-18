"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Flame,
  BookOpen,
  Store as StoreIcon,
  ShieldCheck,
  Train,
  Users,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductCard } from "@/components/ProductCard";
import { ScribbleUnderline } from "@/components/BrandLogo";
import { DropRadarSection } from "@/components/DropRadarSection";
import {
  BRANDS_LIST,
  PRICE_RANGES,
  EDITORIAL_STORIES,
} from "@/data/mockData";

const CATEGORIES = [
  "Todas",
  "Polos & Camisas",
  "Time & Esporte",
  "Jaquetas & Racing",
  "Quarto de Menina / Y2K",
  "Pisantes",
  "Acervo (Locação)",
];

export default function HomePage() {
  const { products, stores, selectedSize } = useMarketplace();
  const [activeCategory, setActiveCategory] = useState("Todas");

  // Filtra vitrine respeitando categoria e "Meu Tamanho" do topo
  const visibleProducts = products.filter((p) => {
    const catMatch =
      activeCategory === "Todas" || p.category === activeCategory;
    const sizeMatch =
      selectedSize === "Todos" || p.size === selectedSize;
    return catMatch && sizeMatch;
  });

  const boostedProducts = products
    .filter((p) => p.isBoostedPro && !p.isSold)
    .slice(0, 4);

  return (
    <div className="space-y-16 pb-8">
      {/* 1. HERO MODERNO, LIMPO & URBANO */}
      <section className="bg-concrete-grain border-b border-concrete-300">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-ink text-xs font-mono font-bold shadow-urban-sm">
              <span className="w-2 h-2 rounded-full bg-rust" />
              MARKETPLACE DA MODA DE QUEBRADA
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink leading-[1.06] tracking-tight">
              Garimpo pesado,{" "}
              <span className="inline-block relative">
                giro rápido
                <ScribbleUnderline />
              </span>{" "}
              & cultura viva.
            </h1>

            <p className="text-sm sm:text-base text-concrete-500 max-w-xl leading-relaxed">
              Compre peças únicas com segurança, mande sua proposta de preço,
              monte sua <strong>Sacolinha com até 15% OFF</strong> ou abra a
              página oficial do seu próprio brechó como uma extensão turbinada
              do Instagram.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/explorar"
                className="px-6 py-3.5 rounded-full bg-rust hover:bg-rust-hover text-white font-bold text-sm inline-flex items-center gap-2 shadow-urban transition-all"
              >
                <span>Garimpar Agora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/vender"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-ink hover:text-neon text-ink border border-ink font-bold text-sm inline-flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-rust" />
                <span>Criar Página do Meu Brechó</span>
              </Link>
            </div>

            {/* Pílulas de Confiança */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-concrete-300/80 text-xs">
              <div>
                <p className="font-display font-extrabold text-lg text-ink">
                  0% taxa
                </p>
                <p className="text-concrete-500 text-[11px]">
                  no plano BRECHOZADAS PRO
                </p>
              </div>
              <div>
                <p className="font-display font-extrabold text-lg text-ink">
                  Automático
                </p>
                <p className="text-concrete-500 text-[11px]">
                  carimbo VENDIDO no PIX
                </p>
              </div>
              <div>
                <p className="font-display font-extrabold text-lg text-ink">
                  SP + Brasil
                </p>
                <p className="text-concrete-500 text-[11px]">
                  Estações de trem ou Correios
                </p>
              </div>
            </div>
          </div>

          {/* Card Editorial Hero (@acervodoreliquia) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-ink bg-ink shadow-urban group">
              <img
                src="/images/hero-drop.jpg"
                alt="Drop Linha 15-Prata por @acervodoreliquia"
                className="w-full aspect-[16/10] object-cover group-hover:scale-103 transition-transform duration-700 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-neon text-ink font-mono text-[11px] font-extrabold px-3 py-1 rounded-full">
                  🚝 DROP LINHA 15-PRATA NO AR
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-concrete-100">
                <div>
                  <p className="font-mono text-[11px] text-neon uppercase tracking-wider">
                    Curadoria Fundadora • @acervodoreliquia
                  </p>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl leading-tight mt-0.5">
                    Polos Anos 2000, Racing & Futebol Retrô
                  </h2>
                  <p className="text-xs text-concrete-300 mt-0.5">
                    Peças a partir de R$ 38 • Compra direta, oferta ou locação de acervo
                  </p>
                </div>
                <Link
                  href="/brecho/acervodoreliquia"
                  className="px-4 py-2.5 rounded-xl bg-white text-ink font-bold text-xs hover:bg-neon transition-colors shrink-0 text-center"
                >
                  Ver Loja Oficial →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEPARAÇÃO POR FAIXA DE PREÇO & MARCAS (Pedido Direto do PLANO.md!) */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Por Preço */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-rust font-bold">
                Bolsos Reais
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                Garimpe por Faixa de Preço
              </h2>
            </div>
            <Link
              href="/explorar"
              className="text-sm font-bold text-rust hover:underline"
            >
              Ver todos os preços →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {PRICE_RANGES.map((range, idx) => (
              <Link
                key={range.id}
                href={`/explorar?preco=${range.id}`}
                className="group bg-white hover:bg-ink hover:text-concrete-100 p-5 rounded-2xl border border-concrete-300 hover:border-ink transition-all hover:shadow-urban flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-concrete-100 text-ink font-bold group-hover:bg-neon">
                    Faixa 0{idx + 1}
                  </span>
                  <Tag className="w-4 h-4 text-rust group-hover:text-neon" />
                </div>
                <div className="mt-4">
                  <h3 className="font-display font-extrabold text-xl text-ink group-hover:text-white leading-tight">
                    {range.label}
                  </h3>
                  <p className="text-sm text-concrete-500 group-hover:text-concrete-200 mt-1 leading-snug">
                    {range.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Por Marcas da Cena */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-rust font-bold">
                Curadoria por Etiqueta
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-0.5">
                Marcas Mais Buscadas na Cena
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {BRANDS_LIST.map((b) => (
              <Link
                key={b.name}
                href={`/explorar?marca=${encodeURIComponent(b.name)}`}
                className="bg-white hover:border-ink border border-concrete-300 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-urban-sm flex flex-col justify-between"
              >
                <span className="font-display font-bold text-base text-ink leading-snug">
                  {b.name}
                </span>
                <div className="mt-2.5 flex items-center justify-between gap-2 text-xs font-medium text-concrete-500">
                  <span>{b.tag}</span>
                  <span className="bg-rust-light text-rust font-bold px-2 py-0.5 rounded-full shrink-0">
                    {b.count} peças
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DESTAQUES IMPULSIONADOS (BRECHOZADAS PRO) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-concrete-300 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-neon border border-ink flex items-center justify-center">
                <Flame className="w-5 h-5 text-ink" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-ink">
                    Destaques da Semana
                  </h2>
                  <span className="bg-ink text-neon font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                    IMPULSO PRO
                  </span>
                </div>
                <p className="text-xs text-concrete-500">
                  Relíquias selecionadas pelos brechós verificados e assinantes BRECHOZADAS PRO
                </p>
              </div>
            </div>
            <Link
              href="/explorar?destaque=pro"
              className="text-xs font-bold text-rust hover:underline"
            >
              Ver todos os destaques →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {boostedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 RADAR DE DROPS AO VIVO + CHAMADA MONTADOR DE KITS */}
      <DropRadarSection />

      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-rust text-white rounded-3xl border-2 border-ink p-6 sm:p-8 shadow-urban flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-block bg-neon text-ink text-xs font-extrabold px-3 py-1 rounded-full">
              NOVO • PROVADOR DE OUTFITS DA CENA
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
              Monte o Kit Completo (Peça Base + Jaqueta + Pisante) com até 15% OFF!
            </h2>
            <p className="text-sm text-white/90">
              Visualize as peças lado a lado antes de comprar ou leve um dos kits prontos assinados pelos stylists.
            </p>
          </div>
          <Link
            href="/kits"
            className="px-6 py-3.5 rounded-full bg-ink text-neon font-bold text-sm shrink-0 hover:opacity-95 text-center shadow-urban-sm"
          >
            Abrir Montador de Kits →
          </Link>
        </div>
      </section>

      {/* 4. VITRINE PRINCIPAL ESTILO ENJOEI (FILTRÁVEL AO VIVO) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-rust font-bold">
              Garimpo Ao Vivo
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
              Acabaram de Subir na Vitrine
            </h2>
          </div>

          {selectedSize !== "Todos" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink text-neon font-mono text-xs">
              Filtrando por Meu Tamanho: <strong>{selectedSize}</strong>
            </span>
          )}
        </div>

        {/* Pílulas de Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  active
                    ? "bg-ink text-concrete-100 shadow-urban-sm"
                    : "bg-white text-ink/80 border border-concrete-300 hover:border-ink"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {visibleProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-concrete-300 p-10 text-center space-y-2">
            <p className="font-display font-bold text-lg">
              Nenhuma peça nesse filtro exato agora!
            </p>
            <p className="text-xs text-concrete-500">
              Experimente trocar o tamanho selecionado no topo ou ver todas as
              categorias.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. PÁGINAS PRÓPRIAS DOS BRECHÓS DA CENA (Extensão do Instagram!) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-rust font-bold">
              Comunidade & Lojas Oficiais
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
              Brechós da Cena (Explore cada Lojinha)
            </h2>
            <p className="text-xs sm:text-sm text-concrete-500 mt-1">
              Cada brechó tem sua própria página personalizada com cores, bio,
              destaques e controle total das vendas.
            </p>
          </div>
          <Link
            href="/brechos"
            className="text-xs font-bold text-rust hover:underline shrink-0"
          >
            Ver todos os brechós →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((st) => (
            <Link
              key={st.slug}
              href={`/brecho/${st.slug}`}
              className="group bg-white rounded-2xl border border-concrete-300 hover:border-ink overflow-hidden transition-all hover:shadow-urban flex flex-col justify-between"
            >
              <div>
                {/* Capa com identidade visual própria do brechó */}
                <div
                  className={`h-20 bg-gradient-to-r ${st.bannerGradient} p-3 flex items-start justify-between`}
                >
                  {st.isPro && (
                    <span className="bg-neon text-ink font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      BRECHOZADAS PRO
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-white/90 bg-black/35 px-2 py-0.5 rounded-full">
                    ★ {st.rating}
                  </span>
                </div>

                <div className="px-4 pb-4 -mt-6">
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-white font-display font-extrabold text-lg"
                    style={{ backgroundColor: st.accentColor }}
                  >
                    {st.name.charAt(0)}
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5">
                    <h3 className="font-display font-extrabold text-base text-ink group-hover:text-rust transition-colors">
                      {st.name}
                    </h3>
                    {st.verified && (
                      <CheckCircle2 className="w-4 h-4 text-rust shrink-0" />
                    )}
                  </div>
                  <p className="font-mono text-xs text-concrete-500">
                    {st.handle}
                  </p>
                  <p className="text-xs text-ink/80 line-clamp-2 mt-2 leading-relaxed">
                    {st.tagline}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-concrete-50 border-t border-concrete-200 flex items-center justify-between text-[11px] font-mono">
                <span className="text-concrete-500 truncate">{st.location}</span>
                <span className="font-bold text-ink shrink-0">
                  Entrar na Loja →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. REVISTA CULTURAL: DISSECANDO O DROP & HISTÓRIAS DA QUEBRADA */}
      <section className="bg-dark-grain text-concrete-100 py-14 border-y-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-neon uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5" /> Observatório & Revista Cultural
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl mt-1">
                Dissecando o Drop & Histórias da Quebrada
              </h2>
              <p className="text-xs sm:text-sm text-concrete-300 max-w-2xl mt-1">
                Memória visual, pesquisa de moda periférica e as histórias reais
                por trás das peças, bailes, estações e personagens da cena.
              </p>
            </div>
            <Link
              href="/revista"
              className="px-5 py-2.5 rounded-full bg-neon text-ink font-bold text-xs shrink-0 hover:opacity-90 transition-opacity"
            >
              Ler Revista Completa →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {EDITORIAL_STORIES.map((story) => (
              <Link
                key={story.slug}
                href={`/revista?artigo=${story.slug}`}
                className="group bg-zinc-900/90 border border-white/15 hover:border-neon rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        story.section === "Dissecando o Drop"
                          ? "bg-neon text-ink"
                          : "bg-rust text-white"
                      }`}
                    >
                      {story.section.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="font-mono text-[11px] text-concrete-300">
                      {story.location} • {story.readTime}
                    </p>
                    <h3 className="font-display font-extrabold text-lg leading-snug group-hover:text-neon transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-concrete-300 line-clamp-2 leading-relaxed">
                      {story.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-4 text-xs font-mono text-neon">
                  Ler matéria + ver peças citadas →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BANNER BRECHOZADAS PRO vs MODO DIRETO + REDE DA CENA */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-ink p-6 sm:p-8 shadow-urban flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <span className="bg-neon text-ink font-mono text-[11px] font-extrabold px-3 py-1 rounded-full border border-ink/20">
              VENDA DO SEU JEITO • ESTILO ENJOEI MELHORADO
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink pt-1">
              Modo Direto Grátis ou{" "}
              <span className="text-rust">BRECHOZADAS PRO</span> com 0% de taxa!
            </h2>
            <p className="text-xs sm:text-sm text-concrete-500 leading-relaxed">
              Quer desapegar uma peça avulsa? Anuncie grátis no{" "}
              <strong>Modo Direto</strong> (taxa justa de apenas 10% quando
              vender). Tem brechó ativo? No{" "}
              <strong>BRECHOZADAS PRO (R$ 29,90/mês ou R$ 69,90/trimestre)</strong>{" "}
              você ganha <strong>impulso na vitrine</strong>,{" "}
              <strong>página personalizada</strong> e{" "}
              <strong>100% do valor das vendas vai direto pro seu bolso!</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/vender"
              className="px-5 py-3 rounded-full bg-rust hover:bg-rust-hover text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2"
            >
              <StoreIcon className="w-4 h-4" /> Simular Meus Ganhos & Anunciar
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-concrete-200/70 rounded-3xl border border-concrete-300 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink uppercase">
              <Users className="w-4 h-4 text-rust" /> Fortalecendo a Cena Local
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-ink">
              Acervo p/ Produções + Rede de Stylists, Produtores & Feiras
            </h3>
            <p className="text-xs sm:text-sm text-concrete-500 leading-relaxed">
              Vai gravar videoclipe, curta ou editorial? Alugue peças históricas
              por diária e conecte-se com stylists, fotógrafos e feiras de
              brechó da quebrada.
            </p>
          </div>
          <div>
            <Link
              href="/acervo"
              className="px-5 py-3 rounded-full bg-ink text-neon font-bold text-xs sm:text-sm inline-flex items-center gap-2 hover:opacity-90"
            >
              Acessar Acervo & Rede da Cena →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
