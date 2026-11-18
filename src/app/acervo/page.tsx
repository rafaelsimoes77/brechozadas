"use client";

import React, { useState } from "react";
import {
  Film,
  Users,
  Sparkles,
  Camera,
  Calendar,
  Handshake,
  CheckCircle2,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductCard } from "@/components/ProductCard";
import { SCENE_NETWORK, SceneMember } from "@/data/mockData";

export default function AcervoAndScenePage() {
  const { products, sceneMembers, addSceneMember, showToast } = useMarketplace();
  const [roleFilter, setRoleFilter] = useState<string>("Todos");
  const [collabName, setCollabName] = useState("");
  const [collabHandle, setCollabHandle] = useState("");
  const [collabRole, setCollabRole] =
    useState<SceneMember["role"]>("Styling & Direção");
  const [collabRegion, setCollabRegion] = useState("");

  const acervoProducts = products.filter((p) => p.mode === "acervo");

  const visibleMembers = sceneMembers.filter(
    (m) => roleFilter === "Todos" || m.role === roleFilter
  );

  const handleJoinNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabName.trim() || !collabHandle.trim()) return;
    await addSceneMember({
      name: collabName.trim(),
      handle: collabHandle.trim(),
      role: collabRole,
      region: collabRegion.trim() || "São Paulo • SP",
    });
    setCollabName("");
    setCollabHandle("");
    setCollabRegion("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
      {/* 1. HERO ACERVO & STYLING */}
      <section className="bg-dark-grain text-concrete-100 rounded-3xl border-2 border-ink p-7 sm:p-12 shadow-urban grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-neon text-ink font-mono text-xs font-extrabold px-3 py-1 rounded-full">
            <Film className="w-3.5 h-3.5" /> ACERVO • FIGURINO • STYLING
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-tight">
            Aluguel de Peças Históricas & Conexão da Cena Criativa
          </h1>
          <p className="text-xs sm:text-base text-concrete-300 leading-relaxed">
            Vai produzir um videoclipe de funk/rap, curta-metragem, campanha ou
            editorial? Alugue peças raras de arquivo por diária — gerando renda
            para os brechós locais sem desfalcar o patrimônio cultural da quebrada.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-zinc-900/90 border border-white/15 p-4 rounded-2xl space-y-1.5">
            <Camera className="w-5 h-5 text-neon" />
            <h3 className="font-display font-bold text-sm">
              Crédito nas Peças
            </h3>
            <p className="text-concrete-300 text-[11px]">
              Modelos, stylists e fotógrafos aparecem creditados nos produtos.
            </p>
          </div>
          <div className="bg-zinc-900/90 border border-white/15 p-4 rounded-2xl space-y-1.5">
            <Handshake className="w-5 h-5 text-neon" />
            <h3 className="font-display font-bold text-sm">
              Bolsa Colaborativa
            </h3>
            <p className="text-concrete-300 text-[11px]">
              Junte peças de vários brechós parceiros em uma única produção.
            </p>
          </div>
          <div className="bg-zinc-900/90 border border-white/15 p-4 rounded-2xl space-y-1.5">
            <Calendar className="w-5 h-5 text-neon" />
            <h3 className="font-display font-bold text-sm">
              Feiras & Mutirões
            </h3>
            <p className="text-concrete-300 text-[11px]">
              Agenda aberta de feiras presenciais e ensaios coletivos na ZL/ABC.
            </p>
          </div>
          <div className="bg-zinc-900/90 border border-white/15 p-4 rounded-2xl space-y-1.5">
            <Sparkles className="w-5 h-5 text-neon" />
            <h3 className="font-display font-bold text-sm">
              Personal Styling
            </h3>
            <p className="text-concrete-300 text-[11px]">
              Contrate curadores da cena para montar looks completos de artistas.
            </p>
          </div>
        </div>
      </section>

      {/* 2. PEÇAS DISPONÍVEIS PARA LOCAÇÃO DE ACERVO */}
      <section className="space-y-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-rust font-bold">
            Locação por Diária
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
            Arquivo Vivo Disponível para Produções
          </h2>
          <p className="text-xs sm:text-sm text-concrete-500">
            Adicione na sacolinha para reservar diárias de produção com seguro incluso.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {acervoProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 3. REDE CRIATIVA DA CENA (Estratégia de Fortalecimento Comunitário!) */}
      <section id="rede" className="space-y-8 pt-6 border-t border-concrete-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-rust font-bold">
              <Users className="w-4 h-4" /> Ecossistema Moda de Quebrada
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mt-1">
              Rede de Stylists, Fotógrafos, Produtores & Feiras
            </h2>
            <p className="text-xs sm:text-sm text-concrete-500 max-w-2xl mt-1">
              Conectamos quem garimpa com quem fotografa, veste artistas e
              organiza eventos locais para fazer o dinheiro e a visibilidade
              girarem dentro da própria cena.
            </p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              "Todos",
              "Styling & Direção",
              "Foto & Handcam",
              "Evento / Feira",
            ].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold shrink-0 ${
                  roleFilter === r
                    ? "bg-ink text-neon"
                    : "bg-white border border-concrete-300 text-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cards dos Profissionais/Eventos */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleMembers.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-concrete-300 p-5 flex flex-col justify-between gap-4 hover:border-ink transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-concrete-100 text-ink font-mono text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {m.role}
                    </span>
                    {m.availableForCollab && (
                      <span className="text-[11px] font-mono text-emerald-700 inline-flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aberto p/ Collab
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-lg text-ink">
                      {m.name}
                    </h3>
                    <p className="font-mono text-xs text-rust">
                      {m.handle} • {m.region}
                    </p>
                  </div>

                  <p className="text-xs text-concrete-500 leading-relaxed">
                    {m.bio}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono bg-concrete-50 border border-concrete-200 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        `⚡ Convite de collab enviado para ${m.handle}!`
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-ink text-neon text-xs font-bold hover:opacity-90"
                  >
                    Conectar / Propor Collab
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Formulário: Cadastrar Meu Corre na Rede */}
          <form
            onSubmit={handleJoinNetwork}
            className="lg:col-span-4 bg-white rounded-3xl border-2 border-ink p-6 space-y-4 shadow-urban"
          >
            <div>
              <span className="font-mono text-[11px] uppercase text-rust font-bold">
                Fortaleça a Comunidade
              </span>
              <h3 className="font-display font-extrabold text-xl text-ink">
                Cadastre seu Corre na Rede
              </h3>
              <p className="text-xs text-concrete-500 mt-1">
                É stylist, fotógrafo, modelo, produtor ou organiza feira de
                brechó? Apareça de graça para os brechós do site!
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nome ou Coletivo</label>
                <input
                  type="text"
                  required
                  value={collabName}
                  onChange={(e) => setCollabName(e.target.value)}
                  placeholder="Ex: Estúdio Flash ZL"
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Instagram (@)</label>
                <input
                  type="text"
                  required
                  value={collabHandle}
                  onChange={(e) => setCollabHandle(e.target.value)}
                  placeholder="@seuinsta"
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Área de Atuação</label>
                <select
                  value={collabRole}
                  onChange={(e) =>
                    setCollabRole(e.target.value as SceneMember["role"])
                  }
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-semibold"
                >
                  <option value="Styling & Direção">Styling & Direção</option>
                  <option value="Foto & Handcam">Foto & Handcam</option>
                  <option value="Brechó Parceiro">Brechó Parceiro</option>
                  <option value="Evento / Feira">Evento / Feira</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Quebrada / Região</label>
                <input
                  type="text"
                  value={collabRegion}
                  onChange={(e) => setCollabRegion(e.target.value)}
                  placeholder="Ex: São Mateus, Mauá, Capão..."
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rust hover:bg-rust-hover text-white font-bold text-xs shadow-urban-sm"
              >
                Entrar no Mural da Cena
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
