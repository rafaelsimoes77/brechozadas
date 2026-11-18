"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_PRODUCTS,
  STORES,
  SCENE_NETWORK,
  Product,
  Store,
  SceneMember,
} from "@/data/mockData";
import type { OfferRecord, OrderRecord } from "@/lib/db";

interface MarketplaceContextType {
  products: Product[];
  stores: Store[];
  sceneMembers: SceneMember[];
  orders: OrderRecord[];
  likedIds: string[];
  bagIds: string[];
  followedStoreSlugs: string[];
  offers: Record<string, OfferRecord>;
  selectedSize: string;
  searchQuery: string;
  isBagOpen: boolean;
  isFavoritesOpen: boolean;
  toast: string | null;
  setSelectedSize: (size: string) => void;
  setSearchQuery: (q: string) => void;
  setIsBagOpen: (open: boolean) => void;
  setIsFavoritesOpen: (open: boolean) => void;
  toggleLike: (productId: string) => void;
  addToBag: (productId: string) => void;
  removeFromBag: (productId: string) => void;
  toggleFollowStore: (storeSlug: string) => void;
  submitOffer: (productId: string, amount: number, buyerHandle?: string) => Promise<void>;
  respondOfferAsSeller: (
    productId: string,
    decision: "aceita" | "recusada" | "contraproposta",
    counterAmount?: number
  ) => Promise<void>;
  addQuestion: (productId: string, user: string, text: string) => Promise<void>;
  answerQuestionAsSeller: (
    productId: string,
    questionId: string,
    answer: string
  ) => Promise<void>;
  triggerFlashPromo: (productId: string) => Promise<void>;
  publishProduct: (
    newProduct: Omit<Product, "id" | "slug" | "code" | "likes" | "questions" | "isSold">
  ) => Promise<string>;
  createStore: (payload: {
    name: string;
    handle: string;
    tagline: string;
    bio: string;
    location: string;
    accentColor: string;
    isPro: boolean;
    whatsapp: string;
  }) => Promise<string | null>;
  completeCheckout: (
    productIds: string[],
    deliveryMethod: "estacao" | "correios",
    deliveryDetail: string,
    paymentMethod?: "PIX" | "Cartão"
  ) => Promise<OrderRecord | null>;
  updateStoreSettings: (
    storeSlug: string,
    patch: { accentColor?: string; isPro?: boolean; tagline?: string }
  ) => Promise<void>;
  addSceneMember: (payload: {
    name: string;
    handle: string;
    role: SceneMember["role"];
    region: string;
  }) => Promise<void>;
  showToast: (msg: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(
  undefined
);

export function MarketplaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<Store[]>(STORES);
  const [sceneMembers, setSceneMembers] =
    useState<SceneMember[]>(SCENE_NETWORK);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>(["p1", "p2"]);
  const [bagIds, setBagIds] = useState<string[]>(["p1"]);
  const [followedStoreSlugs, setFollowedStoreSlugs] = useState<string[]>([
    "acervodoreliquia",
  ]);
  const [offers, setOffers] = useState<Record<string, OfferRecord>>({});
  const [selectedSize, setSelectedSize] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);

  // Hidrata do Backend Real (/api/state) + preferências locais do navegador
  useEffect(() => {
    fetch("/api/state", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data.products)) setProducts(data.products);
        if (Array.isArray(data.stores)) setStores(data.stores);
        if (data.offers) setOffers(data.offers);
        if (Array.isArray(data.orders)) setOrders(data.orders);
        if (Array.isArray(data.sceneMembers)) setSceneMembers(data.sceneMembers);
      })
      .catch(() => {});

    try {
      const savedLikes = localStorage.getItem("brz_likes");
      const savedBag = localStorage.getItem("brz_bag");
      const savedFollows = localStorage.getItem("brz_follows");
      if (savedLikes) setLikedIds(JSON.parse(savedLikes));
      if (savedBag) setBagIds(JSON.parse(savedBag));
      if (savedFollows) setFollowedStoreSlugs(JSON.parse(savedFollows));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("brz_likes", JSON.stringify(likedIds));
    } catch {}
  }, [likedIds]);

  useEffect(() => {
    try {
      localStorage.setItem("brz_bag", JSON.stringify(bagIds));
    } catch {}
  }, [bagIds]);

  useEffect(() => {
    try {
      localStorage.setItem("brz_follows", JSON.stringify(followedStoreSlugs));
    } catch {}
  }, [followedStoreSlugs]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleLike = (productId: string) => {
    const alreadyLiked = likedIds.includes(productId);
    const delta = alreadyLiked ? -1 : 1;
    setLikedIds((prev) =>
      alreadyLiked ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, likes: Math.max(0, p.likes + delta) }
          : p
      )
    );
    fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like", delta }),
    }).catch(() => {});
    showToast(
      alreadyLiked
        ? "Removido dos seus Reliquiados"
        : "★ Peça salva nos seus Reliquiados!"
    );
  };

  const addToBag = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    if (target.isSold) {
      showToast("Essa relíquia já foi vendida (peça única)!");
      return;
    }
    if (bagIds.includes(productId)) {
      setIsBagOpen(true);
      showToast("Essa peça já está na sua Sacolinha!");
      return;
    }
    const nextCount = bagIds.length + 1;
    setBagIds((prev) => [...prev, productId]);
    setIsBagOpen(true);
    if (nextCount === 2) {
      showToast("🔥 2 peças na Sacolinha: você desbloqueou 10% OFF!");
    } else if (nextCount >= 3) {
      showToast("⚡ 3+ peças na Sacolinha: desconto máximo de 15% OFF liberado!");
    } else {
      showToast("🛍️ Na Sacolinha! Adicione +1 peça para ganhar 10% OFF.");
    }
  };

  const removeFromBag = (productId: string) => {
    setBagIds((prev) => prev.filter((id) => id !== productId));
  };

  const toggleFollowStore = (storeSlug: string) => {
    const isFollowing = followedStoreSlugs.includes(storeSlug);
    const followDelta = isFollowing ? -1 : 1;
    setFollowedStoreSlugs((prev) =>
      isFollowing ? prev.filter((s) => s !== storeSlug) : [...prev, storeSlug]
    );
    setStores((prev) =>
      prev.map((st) =>
        st.slug === storeSlug
          ? { ...st, followers: Math.max(0, st.followers + followDelta) }
          : st
      )
    );
    fetch("/api/stores", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeSlug, followDelta }),
    }).catch(() => {});
    showToast(
      isFollowing
        ? "Você deixou de seguir este brechó."
        : "✅ Seguindo brechó! Você será avisado nos próximos drops."
    );
  };

  const submitOffer = async (
    productId: string,
    amount: number,
    buyerHandle?: string
  ) => {
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, amount, buyerHandle }),
    });
    const data = await res.json();
    if (data.ok && data.offer) {
      setOffers((prev) => ({ ...prev, [productId]: data.offer }));
    }
    showToast(
      `🤝 Proposta de R$ ${amount} registrada! O brechó tem 24h para responder.`
    );
  };

  const respondOfferAsSeller = async (
    productId: string,
    decision: "aceita" | "recusada" | "contraproposta",
    counterAmount?: number
  ) => {
    const res = await fetch("/api/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, decision, counterAmount }),
    });
    const data = await res.json();
    if (data.ok) {
      setOffers((prev) => ({ ...prev, [productId]: data.offer }));
      if (Array.isArray(data.products)) setProducts(data.products);
      showToast(
        decision === "aceita"
          ? "✅ Oferta aceita! O preço da peça já atualizou para o comprador."
          : decision === "contraproposta"
          ? `💬 Contraproposta de R$ ${counterAmount} enviada!`
          : "Oferta recusada."
      );
    }
  };

  const addQuestion = async (productId: string, user: string, text: string) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "question", user, text }),
    });
    const data = await res.json();
    if (data.ok && data.product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? data.product : p))
      );
    }
    showToast("💬 Pergunta publicada na página da peça!");
  };

  const answerQuestionAsSeller = async (
    productId: string,
    questionId: string,
    answer: string
  ) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer", questionId, answer }),
    });
    const data = await res.json();
    if (data.ok && data.product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? data.product : p))
      );
      showToast("✅ Resposta do brechó publicada na peça!");
    }
  };

  const triggerFlashPromo = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "flashPromo" }),
    });
    const data = await res.json();
    if (data.ok && data.product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? data.product : p))
      );
      showToast(
        `⚡ Oferta Relâmpago (-10% → R$ ${data.product.price}) disparada para os ${data.product.likes} interessados!`
      );
    }
  };

  const publishProduct = async (
    newProd: Omit<
      Product,
      "id" | "slug" | "code" | "likes" | "questions" | "isSold"
    >
  ) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProd),
    });
    const data = await res.json();
    if (data.ok && data.product) {
      setProducts((prev) => [data.product, ...prev]);
      showToast("🚀 Relíquia salva no banco e publicada na vitrine!");
      return data.product.slug as string;
    }
    return "";
  };

  const createStore = async (payload: {
    name: string;
    handle: string;
    tagline: string;
    bio: string;
    location: string;
    accentColor: string;
    isPro: boolean;
    whatsapp: string;
  }) => {
    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok && data.store) {
      setStores((prev) => [...prev, data.store]);
      showToast(`🏪 Página do brechó ${data.store.name} criada com sucesso!`);
      return data.store.slug as string;
    }
    showToast(data.error || "Não foi possível criar o brechó.");
    return null;
  };

  const completeCheckout = async (
    productIds: string[],
    deliveryMethod: "estacao" | "correios",
    deliveryDetail: string,
    paymentMethod: "PIX" | "Cartão" = "PIX"
  ) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productIds,
        deliveryMethod,
        deliveryDetail,
        paymentMethod,
      }),
    });
    const data = await res.json();
    if (data.ok && data.order) {
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.stores)) setStores(data.stores);
      setOrders((prev) => [data.order, ...prev]);
      setBagIds((prev) => prev.filter((id) => !productIds.includes(id)));
      showToast(
        `✅ Pedido ${data.order.code} confirmado! Peças carimbadas como VENDIDO automaticamente.`
      );
      return data.order as OrderRecord;
    }
    return null;
  };

  const updateStoreSettings = async (
    storeSlug: string,
    patch: { accentColor?: string; isPro?: boolean; tagline?: string }
  ) => {
    const res = await fetch("/api/stores", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeSlug, ...patch }),
    });
    const data = await res.json();
    if (data.ok && data.store) {
      setStores((prev) =>
        prev.map((s) => (s.slug === storeSlug ? data.store : s))
      );
      showToast("🎨 Configurações do brechó salvas no servidor!");
    }
  };

  const addSceneMember = async (payload: {
    name: string;
    handle: string;
    role: SceneMember["role"];
    region: string;
  }) => {
    const res = await fetch("/api/scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok && data.member) {
      setSceneMembers((prev) => [data.member, ...prev]);
      showToast("🤝 Seu perfil foi salvo na Rede Criativa da Cena!");
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        stores,
        sceneMembers,
        orders,
        likedIds,
        bagIds,
        followedStoreSlugs,
        offers,
        selectedSize,
        searchQuery,
        isBagOpen,
        isFavoritesOpen,
        toast,
        setSelectedSize,
        setSearchQuery,
        setIsBagOpen,
        setIsFavoritesOpen,
        toggleLike,
        addToBag,
        removeFromBag,
        toggleFollowStore,
        submitOffer,
        respondOfferAsSeller,
        addQuestion,
        answerQuestionAsSeller,
        triggerFlashPromo,
        publishProduct,
        createStore,
        completeCheckout,
        updateStoreSettings,
        addSceneMember,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm bg-ink text-concrete-100 border-2 border-neon px-4 py-3 rounded-xl shadow-urban flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-neon shrink-0" />
          <p className="text-xs sm:text-sm font-medium leading-snug">{toast}</p>
        </div>
      )}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error("useMarketplace must be used inside MarketplaceProvider");
  }
  return ctx;
}
