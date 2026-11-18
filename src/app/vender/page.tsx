"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Check,
  Calculator,
  Upload,
  Store as StoreIcon,
  PlusCircle,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Product } from "@/data/mockData";

const SAMPLE_PHOTOS = [
  { label: "Polo Listrada Anos 2000", url: "/images/peca-polo-ecko.jpg" },
  { label: "Jaqueta Racing Vintage", url: "/images/peca-jaqueta-racing.jpg" },
  { label: "Camisa de Time / Dri-Fit", url: "/images/peca-camisa-time.jpg" },
  { label: "Kit Y2K Quarto de Menina", url: "/images/peca-y2k-feminino.jpg" },
  { label: "Pisante Runner Prata", url: "/images/peca-pisante-runner.jpg" },
];

const STORE_COLORS = ["#C93B1E", "#121212", "#B83280", "#1D4ED8", "#15803D"];

export default function VenderAndProPage() {
  const router = useRouter();
  const { publishProduct, createStore, stores, showToast } = useMarketplace();

  // Simulador Financeiro Modo Direto (10%) vs BRECHOZADAS PRO (0%)
  const [monthlySales, setMonthlySales] = useState<number>(600);
  const [billingCycle, setBillingCycle] = useState<"mensal" | "trimestral">(
    "trimestral"
  );

  const proMonthlyCost = billingCycle === "mensal" ? 29.9 : 23.3;
  const directFee = Math.round(monthlySales * 0.1);
  const netDirect = monthlySales - directFee;
  const netPro = Math.round(monthlySales - proMonthlyCost);
  const proSavings = netPro - netDirect;

  // Abas de Ação: Anunciar Peça vs Criar Nova Página de Brechó
  const [formTab, setFormTab] = useState<"peca" | "brecho">("peca");

  // Estado Publicar Peça
  const [selectedPlan, setSelectedPlan] = useState<"direto" | "pro">("pro");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Nike");
  const [category, setCategory] =
    useState<Product["category"]>("Polos & Camisas");
  const [size, setSize] = useState<Product["size"]>("G");
  const [fit, setFit] = useState<Product["fit"]>("Largo / Baggy (Chavoso)");
  const [largura, setLargura] = useState("59 cm");
  const [comprimento, setComprimento] = useState("74 cm");
  const [price, setPrice] = useState<number>(65);
  const [mode, setMode] = useState<"venda" | "acervo">("venda");
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [storeSlug, setStoreSlug] = useState(stores[0]?.slug || "acervodoreliquia");
  const [story, setStory] = useState("");

  // Estado Criar Página de Brechó
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreHandle, setNewStoreHandle] = useState("");
  const [newStoreLocation, setNewStoreLocation] = useState("Zona Leste • SP");
  const [newStoreTagline, setNewStoreTagline] = useState("");
  const [newStoreBio, setNewStoreBio] = useState("");
  const [newStoreWhatsapp, setNewStoreWhatsapp] = useState("5511999999999");
  const [newStoreAccent, setNewStoreAccent] = useState("#C93B1E");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok && data.url) {
        setPhotoUrl(data.url);
        showToast("📸 Foto enviada do seu computador com sucesso!");
      } else {
        showToast(data.error || "Erro ao subir foto.");
      }
    } catch {
      showToast("Não foi possível enviar a foto.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSlug = await publishProduct({
      title: title.trim(),
      brand,
      category,
      size,
      fit,
      measurements: { largura, comprimento },
      condition: "9.5/10 • Recém-Cadastrada",
      price,
      rentalDailyPrice: mode === "acervo" ? price : undefined,
      mode,
      isBoostedPro: selectedPlan === "pro",
      acceptsOffers: true,
      minOfferRatio: 0.8,
      image: photoUrl,
      storyBehindPiece:
        story.trim() ||
        "Relíquia garimpada e higienizada, pronta para envio imediato ou encontro nas estações de SP/ABC.",
      storeSlug,
    });

    if (newSlug) {
      router.push(`/peca/${newSlug}`);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim() || !newStoreHandle.trim()) return;
    const createdSlug = await createStore({
      name: newStoreName.trim(),
      handle: newStoreHandle.trim(),
      tagline: newStoreTagline.trim(),
      bio: newStoreBio.trim(),
      location: newStoreLocation.trim(),
      accentColor: newStoreAccent,
      isPro: selectedPlan === "pro",
      whatsapp: newStoreWhatsapp,
    });
    if (createdSlug) {
      router.push(`/brecho/${createdSlug}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
      {/* 1. PLANOS MODO DIRETO (10%) vs BRECHOZADAS PRO (0% TAXA) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-rust font-bold">
            Transparência Total • Sem Taxas Abusivas
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink">
            Escolha Como Vender no BRECHOZADAS
          </h1>
          <p className="text-xs sm:text-sm text-concrete-500">
            Comece grátis pagando apenas 10% quando vender ou assine o{" "}
            <strong>BRECHOZADAS PRO</strong> para ficar isento da taxa (100% do
            valor vai pra você!) e ganhar destaque na página inicial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            onClick={() => setSelectedPlan("direto")}
            className={`cursor-pointer bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all flex flex-col justify-between space-y-6 ${
              selectedPlan === "direto"
                ? "border-ink shadow-urban"
                : "border-concrete-300"
            }`}
          >
            <div className="space-y-3">
              <span className="bg-concrete-200 text-ink font-mono text-xs font-bold px-3 py-1 rounded-full">
                MODO DIRETO (GRÁTIS)
              </span>
              <h2 className="font-display font-extrabold text-2xl text-ink pt-1">
                R$ 0{" "}
                <span className="text-sm font-normal text-concrete-500">
                  para anunciar
                </span>
              </h2>
              <p className="text-xs text-concrete-500">
                Ideal pra quem está começando ou quer desapegar peças pontuais do
                guarda-roupa em casa.
              </p>

              <ul className="space-y-2.5 pt-3 text-xs text-ink">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rust shrink-0" />
                  <span>
                    Taxa simples de <strong>10% por venda concluída</strong>{" "}
                    (vendeu R$ 100 → recebe <strong>R$ 90</strong>)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rust shrink-0" />
                  <span>Página própria para sua lojinha</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rust shrink-0" />
                  <span>Recebe propostas de preço e Sacolinha</span>
                </li>
              </ul>
            </div>

            <span
              className={`block w-full text-center py-3 rounded-xl font-bold text-xs ${
                selectedPlan === "direto"
                  ? "bg-ink text-white"
                  : "bg-concrete-100 text-ink"
              }`}
            >
              {selectedPlan === "direto"
                ? "✓ Selecionado: Modo Direto (10%)"
                : "Usar Modo Direto"}
            </span>
          </div>

          <div
            onClick={() => setSelectedPlan("pro")}
            className={`cursor-pointer bg-ink text-concrete-100 rounded-3xl p-6 sm:p-8 border-2 transition-all flex flex-col justify-between space-y-6 ${
              selectedPlan === "pro"
                ? "border-neon shadow-urban"
                : "border-ink"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-neon text-ink font-mono text-xs font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> BRECHOZADAS PRO
                </span>
                <div className="flex bg-zinc-800 rounded-full p-0.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBillingCycle("mensal");
                    }}
                    className={`px-2.5 py-1 rounded-full ${
                      billingCycle === "mensal"
                        ? "bg-neon text-ink font-bold"
                        : "text-concrete-300"
                    }`}
                  >
                    Mensal
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBillingCycle("trimestral");
                    }}
                    className={`px-2.5 py-1 rounded-full ${
                      billingCycle === "trimestral"
                        ? "bg-neon text-ink font-bold"
                        : "text-concrete-300"
                    }`}
                  >
                    Trimestral (-22%)
                  </button>
                </div>
              </div>

              <div className="pt-1">
                {billingCycle === "mensal" ? (
                  <h2 className="font-display font-extrabold text-3xl text-neon">
                    R$ 29,90
                    <span className="text-sm font-normal text-concrete-300">
                      {" "}
                      / mês
                    </span>
                  </h2>
                ) : (
                  <div>
                    <h2 className="font-display font-extrabold text-3xl text-neon">
                      R$ 69,90
                      <span className="text-sm font-normal text-concrete-300">
                        {" "}
                        / trimestre
                      </span>
                    </h2>
                    <p className="text-[11px] font-mono text-concrete-300">
                      Sai apenas R$ 23,30 por mês!
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-concrete-300">
                Feito para brechós ativos que querem escalar vendas e ficar com
                100% do lucro de cada peça.
              </p>

              <ul className="space-y-2.5 pt-3 text-xs text-concrete-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neon shrink-0" />
                  <span>
                    <strong className="text-neon">0% de taxa nas vendas:</strong>{" "}
                    vendeu R$ 100 → recebe <strong>R$ 100 inteiros!</strong>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neon shrink-0" />
                  <span>
                    <strong>Impulso automático</strong> nos Destaques da Home e
                    topo das buscas
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-neon shrink-0" />
                  <span>
                    Página exclusiva com cores personalizadas, destaques e Selo
                    PRO
                  </span>
                </li>
              </ul>
            </div>

            <span
              className={`block w-full text-center py-3 rounded-xl font-bold text-xs ${
                selectedPlan === "pro"
                  ? "bg-rust text-white"
                  : "bg-zinc-800 text-neon"
              }`}
            >
              {selectedPlan === "pro"
                ? "✓ Selecionado: BRECHOZADAS PRO (0% taxa)"
                : "Escolher Plano PRO"}
            </span>
          </div>
        </div>

        {/* Simulador */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-concrete-300 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-rust" />
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-ink">
              Simulador de Bolso: Quanto você vende por mês?
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span>Vendas mensais estimadas:</span>
              <strong className="text-base text-rust">
                R$ {monthlySales},00 / mês
              </strong>
            </div>
            <input
              type="range"
              min={100}
              max={2500}
              step={50}
              value={monthlySales}
              onChange={(e) => setMonthlySales(Number(e.target.value))}
              className="w-full accent-rust"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-concrete-50 border border-concrete-200">
              <p className="text-concrete-500 font-mono">No Modo Direto (10%)</p>
              <p className="font-display font-extrabold text-xl text-ink mt-1">
                R$ {netDirect},00
              </p>
              <p className="text-[11px] text-concrete-500">
                (R$ {directFee} em taxas)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ink text-concrete-100">
              <p className="text-neon font-mono">No BRECHOZADAS PRO (0%)</p>
              <p className="font-display font-extrabold text-xl text-neon mt-1">
                R$ {netPro},00
              </p>
              <p className="text-[11px] text-concrete-300">
                (já descontando a assinatura)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rust-light border border-rust/30 flex flex-col justify-center">
              {proSavings > 0 ? (
                <>
                  <p className="font-bold text-rust">
                    Você lucra +R$ {proSavings}/mês no PRO!
                  </p>
                  <p className="text-[11px] text-ink/80 mt-0.5">
                    Acima de R$ 240/mês em vendas, o PRO já se paga sozinho e
                    ainda impulsiona suas peças!
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-ink">
                    Para vendas até R$ 230/mês:
                  </p>
                  <p className="text-[11px] text-concrete-500 mt-0.5">
                    Comece no Modo Direto grátis e migre pro PRO quando girar
                    mais peças!
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SELETOR DE AÇÃO: ANUNCIAR PEÇA OU CRIAR NOVA PÁGINA DE BRECHÓ */}
      <section className="pt-8 border-t border-concrete-300 space-y-6">
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setFormTab("peca")}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all ${
              formTab === "peca"
                ? "bg-ink text-neon shadow-urban-sm"
                : "bg-white border border-concrete-300 text-ink"
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Publicar Nova Peça
          </button>
          <button
            type="button"
            onClick={() => setFormTab("brecho")}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all ${
              formTab === "brecho"
                ? "bg-ink text-neon shadow-urban-sm"
                : "bg-white border border-concrete-300 text-ink"
            }`}
          >
            <StoreIcon className="w-4 h-4" /> Criar Nova Página de Brechó
          </button>
        </div>

        {formTab === "peca" ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handlePublish}
              className="lg:col-span-7 bg-white rounded-3xl border-2 border-ink p-6 sm:p-8 space-y-5 shadow-urban"
            >
              <div>
                <span className="font-mono text-xs uppercase text-rust font-bold">
                  Cadastro Real Salvo no Banco
                </span>
                <h2 className="font-display font-extrabold text-2xl text-ink">
                  Cadastrar Nova Relíquia na Vitrine
                </h2>
                <p className="text-xs text-concrete-500 mt-0.5">
                  Suba uma foto direto do seu computador (ou escolha uma foto de
                  demonstração) e publique!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">
                    Publicar em qual Página de Brechó?
                  </label>
                  <select
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-bold"
                  >
                    {stores.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name} ({s.handle})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">
                    Título da Peça *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Pólo Ecko Unltd. Listrada Anos 2000"
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Marca</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as Product["category"])
                    }
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                  >
                    <option value="Polos & Camisas">Polos & Camisas</option>
                    <option value="Time & Esporte">Time & Esporte</option>
                    <option value="Jaquetas & Racing">Jaquetas & Racing</option>
                    <option value="Quarto de Menina / Y2K">
                      Quarto de Menina / Y2K
                    </option>
                    <option value="Pisantes">Pisantes</option>
                    <option value="Acervo (Locação)">Acervo (Locação)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Tamanho</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as Product["size"])}
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-mono"
                  >
                    {[
                      "PP",
                      "P",
                      "M",
                      "G",
                      "GG",
                      "38",
                      "40",
                      "41",
                      "42",
                      "Único",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Caimento</label>
                  <select
                    value={fit}
                    onChange={(e) => setFit(e.target.value as Product["fit"])}
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                  >
                    <option value="Justo (Baby Look)">Justo (Baby Look)</option>
                    <option value="Regular">Regular</option>
                    <option value="Largo / Baggy (Chavoso)">
                      Largo / Baggy (Chavoso)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Largura (cm)</label>
                  <input
                    type="text"
                    value={largura}
                    onChange={(e) => setLargura(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    Comprimento (cm)
                  </label>
                  <input
                    type="text"
                    value={comprimento}
                    onChange={(e) => setComprimento(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Modalidade</label>
                  <select
                    value={mode}
                    onChange={(e) =>
                      setMode(e.target.value as "venda" | "acervo")
                    }
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-bold"
                  >
                    <option value="venda">Venda Direta (Brechó)</option>
                    <option value="acervo">Locação por Diária (Acervo)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    {mode === "acervo" ? "Valor da Diária (R$)" : "Preço (R$)"}
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-extrabold text-rust text-sm"
                  />
                </div>

                {/* Upload Real do Computador + Fotos Demo */}
                <div className="sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-concrete-50 border border-concrete-300">
                  <label className="block font-bold flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-rust" /> Enviar Foto da
                    Peça do seu Computador:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-ink file:text-neon file:font-bold cursor-pointer"
                  />
                  {uploadingPhoto && (
                    <p className="text-[11px] font-mono text-rust">
                      Enviando foto...
                    </p>
                  )}
                  <div className="pt-1">
                    <span className="text-[11px] text-concrete-500 block mb-1">
                      Ou escolha uma foto pronta do estúdio para testar rápido:
                    </span>
                    <select
                      value={
                        SAMPLE_PHOTOS.some((p) => p.url === photoUrl)
                          ? photoUrl
                          : SAMPLE_PHOTOS[0].url
                      }
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-white border border-concrete-300"
                    >
                      {SAMPLE_PHOTOS.map((ph) => (
                        <option key={ph.url} value={ph.url}>
                          {ph.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">
                    História / Detalhes da Peça
                  </label>
                  <textarea
                    rows={2}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Conte de qual época é a peça, estado de conservação..."
                    className="w-full p-3 rounded-xl bg-concrete-50 border border-concrete-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-rust hover:bg-rust-hover text-white font-bold text-sm shadow-urban-sm transition-all"
              >
                Publicar Peça na Vitrine Agora →
              </button>
            </form>

            {/* Preview */}
            <div className="lg:col-span-5 space-y-3">
              <p className="font-mono text-xs uppercase text-concrete-500 font-bold">
                Preview Ao Vivo na Vitrine:
              </p>
              <div className="max-w-xs bg-white rounded-2xl border-2 border-ink overflow-hidden shadow-urban">
                <div className="relative aspect-[3/4] bg-concrete-100">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-ink text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                      TAM {size}
                    </span>
                    {selectedPlan === "pro" && (
                      <span className="bg-neon text-ink font-mono text-[10px] font-extrabold px-2 py-0.5 rounded">
                        PRO 0% TAXA
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-xl border border-ink/15">
                    <span className="text-base font-extrabold text-rust">
                      R$ {price}
                    </span>
                    {mode === "acervo" && (
                      <span className="text-[10px] font-mono text-concrete-500">
                        {" "}
                        /diária
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-ink/70">
                    {brand}
                  </span>
                  <h3 className="font-bold text-sm text-ink">
                    {title || "Título da sua relíquia aparece aqui"}
                  </h3>
                  <p className="text-[11px] font-mono text-concrete-500">
                    {largura} × {comprimento} • Recebe{" "}
                    <strong className="text-emerald-700">
                      R${" "}
                      {selectedPlan === "pro"
                        ? price
                        : Math.round(price * 0.9)}
                    </strong>{" "}
                    líquidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Formulário Criar Nova Página Exclusiva de Brechó */
          <form
            onSubmit={handleCreateStore}
            className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-ink p-6 sm:p-8 space-y-5 shadow-urban"
          >
            <div>
              <span className="font-mono text-xs uppercase text-rust font-bold">
                Sua Vitrine Própria • Como Extensão do Instagram
              </span>
              <h2 className="font-display font-extrabold text-2xl text-ink">
                Criar Página Oficial do Meu Brechó
              </h2>
              <p className="text-xs text-concrete-500 mt-0.5">
                Gera instantaneamente sua URL exclusiva{" "}
                <code>/brecho/seu-nome</code> com identidade visual própria e
                painel administrativo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Nome do Brechó *</label>
                <input
                  type="text"
                  required
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="Ex: Garimpo da Leste"
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">
                  @ do Instagram / URL *
                </label>
                <input
                  type="text"
                  required
                  value={newStoreHandle}
                  onChange={(e) => setNewStoreHandle(e.target.value)}
                  placeholder="@garimpodaleste"
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">
                  Território / Cidade
                </label>
                <input
                  type="text"
                  value={newStoreLocation}
                  onChange={(e) => setNewStoreLocation(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">
                  WhatsApp p/ Dúvidas
                </label>
                <input
                  type="text"
                  value={newStoreWhatsapp}
                  onChange={(e) => setNewStoreWhatsapp(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">
                  Frase de Destaque (Tagline)
                </label>
                <input
                  type="text"
                  value={newStoreTagline}
                  onChange={(e) => setNewStoreTagline(e.target.value)}
                  placeholder="Ex: Camisas de time anos 2000, jaquetas & pisantes raros"
                  className="w-full h-10 px-3 rounded-xl bg-concrete-50 border border-concrete-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">Bio Completa</label>
                <textarea
                  rows={2}
                  value={newStoreBio}
                  onChange={(e) => setNewStoreBio(e.target.value)}
                  placeholder="Apresente seu brechó, formas de envio e curadoria..."
                  className="w-full p-3 rounded-xl bg-concrete-50 border border-concrete-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-2">
                  Cor Principal da Identidade Visual:
                </label>
                <div className="flex gap-3">
                  {STORE_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setNewStoreAccent(hex)}
                      style={{ backgroundColor: hex }}
                      className={`w-9 h-9 rounded-full border-2 ${
                        newStoreAccent === hex
                          ? "border-ink scale-110 shadow-urban-sm"
                          : "border-transparent opacity-75"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-rust hover:bg-rust-hover text-white font-bold text-sm shadow-urban-sm"
            >
              Criar Minha Página no BRECHOZADAS →
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
