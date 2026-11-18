export interface Store {
  slug: string;
  name: string;
  handle: string;
  tagline: string;
  bio: string;
  location: string;
  verified: boolean;
  isPro: boolean;
  isFounder?: boolean;
  accentColor: string;
  bannerGradient: string;
  followers: number;
  soldCount: number;
  rating: number;
  responseTime: string;
  whatsapp: string;
  instagram: string;
  stations: string[];
  specialties: string[];
  highlights: { title: string; subtitle: string; emoji: string }[];
}

export interface ProductQuestion {
  id: string;
  user: string;
  text: string;
  answer?: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  code: string;
  title: string;
  brand: string;
  category:
    | "Polos & Camisas"
    | "Time & Esporte"
    | "Jaquetas & Racing"
    | "Streetwear 90s/00s"
    | "Quarto de Menina / Y2K"
    | "Pisantes"
    | "Acervo (Locação)";
  size: "PP" | "P" | "M" | "G" | "GG" | "38" | "40" | "41" | "42" | "Único";
  fit: "Justo (Baby Look)" | "Regular" | "Largo / Baggy (Chavoso)";
  measurements: {
    largura: string;
    comprimento: string;
    extra?: string;
  };
  condition: string;
  price: number;
  originalPrice?: number;
  rentalDailyPrice?: number;
  mode: "venda" | "acervo";
  isSold: boolean;
  isBoostedPro: boolean;
  acceptsOffers: boolean;
  minOfferRatio: number;
  likes: number;
  image: string;
  storyBehindPiece: string;
  credits?: {
    model?: string;
    photo?: string;
    styling?: string;
  };
  storeSlug: string;
  questions: ProductQuestion[];
}

export interface EditorialStory {
  slug: string;
  section: "Dissecando o Drop" | "Histórias da Quebrada";
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  location: string;
  author: string;
  coverImage: string;
  tags: string[];
  excerpt: string;
  paragraphs: string[];
  credits: string;
  relatedProductSlugs: string[];
}

export interface SceneMember {
  id: string;
  name: string;
  handle: string;
  role: "Brechó Parceiro" | "Styling & Direção" | "Foto & Handcam" | "Evento / Feira";
  region: string;
  bio: string;
  tags: string[];
  availableForCollab: boolean;
}

export const STORES: Store[] = [
  {
    slug: "acervodoreliquia",
    name: "Acervo do Relíquia",
    handle: "@acervodoreliquia",
    tagline: "Observatório de Moda • Pesquisa e Produção - Moda de Quebrada",
    bio: "Brechó, acervo vivo de memória periférica e styling. Do Monotrilho São Mateus ao ABC Paulista, resgatando polos clássicas, camisas de time, racing e a estética real dos bailes e rolezinhos.",
    location: "São Mateus (ZL) & Mauá (ABC) • SP",
    verified: true,
    isPro: true,
    isFounder: true,
    accentColor: "#C93B1E",
    bannerGradient: "from-ink via-zinc-900 to-rust/90",
    followers: 6820,
    soldCount: 412,
    rating: 4.98,
    responseTime: "Responde em ~15 min",
    whatsapp: "5511999990000",
    instagram: "https://www.instagram.com/acervodoreliquia/",
    stations: [
      "Linha 15-Prata (São Mateus / Vila Prudente)",
      "Linha 10-Turquesa CPTM (Mauá / Santo André)",
      "Linha 2-Verde (Tamanduateí)",
    ],
    specialties: ["Polos Anos 2000", "Futebol Retrô", "Racing", "Acervo p/ Clipes"],
    highlights: [
      { title: "Drop Linha 15", subtitle: "Disponíveis da semana", emoji: "🚝" },
      { title: "Acervo & Clipes", subtitle: "Locação por diária", emoji: "🎬" },
      { title: "Quarto de Menina", subtitle: "Curadoria Y2K @cruela__", emoji: "💋" },
      { title: "Regras & Envios", subtitle: "Correios + Estações SP", emoji: "📦" },
    ],
  },
  {
    slug: "bonfire-brecho",
    name: "Bonfire Brechó",
    handle: "@bonfire_brecho",
    tagline: "Y2K, Cybershot vibes, jeans cintura baixa & achados anos 2000",
    bio: "Garimpo feminino e unissex inspirado na era Orkut, Fotolog e rolezinhos de shopping. Peças higienizadas, medidas reais e envio rápido para todo Brasil.",
    location: "Zona Leste • São Paulo, SP",
    verified: true,
    isPro: true,
    accentColor: "#B83280",
    bannerGradient: "from-zinc-900 via-fuchsia-950 to-pink-800",
    followers: 3490,
    soldCount: 228,
    rating: 4.92,
    responseTime: "Responde em ~30 min",
    whatsapp: "5511988881111",
    instagram: "https://www.instagram.com/bonfire_brecho/",
    stations: ["Linha 3-Vermelha (Tatuapé / Corinthians-Itaquera)", "Estação Brás"],
    specialties: ["Y2K Feminino", "Baby Tees", "Jeans Anos 2000", "Bolsas Vintage"],
    highlights: [
      { title: "Drop Y2K", subtitle: "Peças a partir de R$ 35", emoji: "✨" },
      { title: "Collab Relíquia", subtitle: "Editorial Quarto de Menina", emoji: "📸" },
    ],
  },
  {
    slug: "brecho-dimil",
    name: "Brechó DiMil",
    handle: "@brechodimil",
    tagline: "Streetwear pesado 90s, rap nacional, camisas largas & pisantes",
    bio: "Especialista em modelagem baggy, camisas de basquete/futebol, jaquetas corta-vento e clássicos da cultura hip-hop paulistana.",
    location: "Santo André • ABC Paulista",
    verified: true,
    isPro: true,
    accentColor: "#1D4ED8",
    bannerGradient: "from-slate-950 via-blue-950 to-zinc-900",
    followers: 4150,
    soldCount: 309,
    rating: 4.95,
    responseTime: "Responde em ~20 min",
    whatsapp: "5511977772222",
    instagram: "https://www.instagram.com/brechodimil/",
    stations: ["Estação Prefeito Saladino / Santo André (CPTM)", "Estação Tamanduateí"],
    specialties: ["FUBU & Ecko", "Calças Cargo", "Pisantes Anos 2010", "Rap 90s"],
    highlights: [
      { title: "Pesados GG/XGG", subtitle: "Modelagem chavosa", emoji: "🔥" },
      { title: "Pisantes", subtitle: "Molas & Runners", emoji: "👟" },
    ],
  },
  {
    slug: "relicario-oz",
    name: "Relicário OZ",
    handle: "@relicari.oz",
    tagline: "Garimpo esportivo de quebrada, corta-ventos & camisas históricas",
    bio: "Direto de Osasco conectando Oeste, Leste e ABC. Curadoria focada em Nike Total 90, Adidas vintage, Mizuno e agasalhos de clube.",
    location: "Osasco • Grande SP",
    verified: true,
    isPro: false,
    accentColor: "#15803D",
    bannerGradient: "from-neutral-950 via-emerald-950 to-neutral-900",
    followers: 2780,
    soldCount: 164,
    rating: 4.89,
    responseTime: "Responde em ~1h",
    whatsapp: "5511966663333",
    instagram: "https://www.instagram.com/relicari.oz/",
    stations: ["Estação Osasco (CPTM)", "Pinheiros (Linha 4-Amarela)"],
    specialties: ["Camisas de Time", "Nike Dri-Fit", "Agasalhos Europeus"],
    highlights: [
      { title: "Total 90", subtitle: "Futebol anos 2000", emoji: "⚽" },
    ],
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "polo-ecko-silver-collection-rinoceronte",
    code: "#BRZ-101",
    title: "Pólo Ecko Unltd. Silver Collection Listrada",
    brand: "Ecko Unltd.",
    category: "Polos & Camisas",
    size: "G",
    fit: "Largo / Baggy (Chavoso)",
    measurements: {
      largura: "61 cm",
      comprimento: "76 cm",
      extra: "Ombro 53 cm",
    },
    condition: "9.5/10 • Impecável",
    price: 60,
    originalPrice: 85,
    mode: "venda",
    isSold: false,
    isBoostedPro: true,
    acceptsOffers: true,
    minOfferRatio: 0.8,
    likes: 47,
    image: "/images/peca-polo-ecko.jpg",
    storyBehindPiece:
      "Clássico absoluto dos bailes e rolezinhos de SP na virada de 2010. Bordado do rinoceronte preservado na linha Silver Collection, malha encorpada que não deforma na gola.",
    credits: {
      model: "@ligeirohaniel",
      photo: "@1renas_tinho",
      styling: "@1renas_tinho",
    },
    storeSlug: "acervodoreliquia",
    questions: [
      {
        id: "q1",
        user: "@kaue_zl",
        text: "Salve! Ela tem algum desbotado na gola ou tá zero?",
        answer: "Salve relíquia! Tá zero bala, cor firme na gola e bordado intacto. Pronta pro baile!",
        date: "há 2 horas",
      },
    ],
  },
  {
    id: "p2",
    slug: "jaqueta-racing-alpinestars-vintage",
    code: "#BRZ-102",
    title: "Jaqueta Racing Motociclista Vintage Paddock",
    brand: "Alpinestars",
    category: "Jaquetas & Racing",
    size: "G",
    fit: "Regular",
    measurements: {
      largura: "60 cm",
      comprimento: "69 cm",
      extra: "Manga 65 cm",
    },
    condition: "9/10 • Relíquia Rara",
    price: 220,
    originalPrice: 280,
    mode: "venda",
    isSold: false,
    isBoostedPro: true,
    acceptsOffers: true,
    minOfferRatio: 0.82,
    likes: 94,
    image: "/images/peca-jaqueta-racing.jpg",
    storyBehindPiece:
      "Peça pesada de estética toque/grau e editorial urbano. Recortes contrastantes em preto, off-white e ferrugem, zíperes originais funcionando 100% e forro interno respirável.",
    credits: {
      model: "@1renas_tinho",
      photo: "@cruela__",
      styling: "@cruela__",
    },
    storeSlug: "acervodoreliquia",
    questions: [],
  },
  {
    id: "p3",
    slug: "camiseta-nike-dri-fit-mercurial-anos-2000",
    code: "#BRZ-103",
    title: "Camiseta Nike Dri-Fit Mercurial Total 90",
    brand: "Nike",
    category: "Time & Esporte",
    size: "M",
    fit: "Regular",
    measurements: {
      largura: "54 cm",
      comprimento: "71 cm",
    },
    condition: "9.5/10 • Sem fios puxados",
    price: 38,
    originalPrice: 55,
    mode: "venda",
    isSold: false,
    isBoostedPro: false,
    acceptsOffers: true,
    minOfferRatio: 0.8,
    likes: 63,
    image: "/images/peca-camisa-time.jpg",
    storyBehindPiece:
      "Garimpo raiz de São Mateus com preço acessível pra girar rápido! Linha Mercurial original dos anos 2000 com vivos em amarelo neon e tecido tecnológico super leve.",
    credits: {
      photo: "@1renas_tinho",
    },
    storeSlug: "acervodoreliquia",
    questions: [
      {
        id: "q2",
        user: "@gui.santoandre",
        text: "Consegue entregar na estação Tamanduateí ou São Mateus amanhã?",
        answer: "Consigo sim mano! Só fechar marcando a opção 'Trombar na Estação' na sacolinha que combinamos o horário.",
        date: "ontem",
      },
    ],
  },
  {
    id: "p4",
    slug: "polo-ralph-lauren-big-pony-3-verde",
    code: "#BRZ-104",
    title: "Pólo Ralph Lauren #3 Custom Fit Verde Escuro",
    brand: "Polo Ralph Lauren",
    category: "Polos & Camisas",
    size: "M",
    fit: "Regular",
    measurements: {
      largura: "55 cm",
      comprimento: "72 cm",
    },
    condition: "9.5/10 • Impecável",
    price: 60,
    originalPrice: 90,
    mode: "venda",
    isSold: false,
    isBoostedPro: true,
    acceptsOffers: true,
    minOfferRatio: 0.8,
    likes: 52,
    image: "/images/peca-polo-ralph.jpg",
    storyBehindPiece:
      "A clássica número 3 na manga que marcou época nos fluxos e editoriais de rua. Piquet 100% algodão encorpado, botões perolados originais.",
    credits: {
      model: "@mczoidegata",
      photo: "@cruela__",
      styling: "@mmarcelinhah",
    },
    storeSlug: "acervodoreliquia",
    questions: [],
  },
  {
    id: "p5",
    slug: "conjunto-quarto-de-menina-y2k-baby-tee-denim",
    code: "#BRZ-105",
    title: "Kit Y2K Quarto de Menina: Baby Tee + Mini Saia Jeans",
    brand: "Y2K Garimpo",
    category: "Quarto de Menina / Y2K",
    size: "P",
    fit: "Justo (Baby Look)",
    measurements: {
      largura: "43 cm (blusa) • Cintura 72 cm (saia)",
      comprimento: "48 cm (blusa) • 33 cm (saia)",
    },
    condition: "9.5/10 • Curadoria Especial",
    price: 75,
    originalPrice: 110,
    mode: "venda",
    isSold: false,
    isBoostedPro: true,
    acceptsOffers: true,
    minOfferRatio: 0.8,
    likes: 81,
    image: "/images/peca-y2k-feminino.jpg",
    storyBehindPiece:
      "Direto da estética do editorial 'Quarto de Menina': nostalgia Orkut, Cybershot na bolsa e lavagem escura anos 2000 que veste perfeitamente.",
    credits: {
      photo: "@cruela__",
      styling: "@bonfire_brecho",
    },
    storeSlug: "bonfire-brecho",
    questions: [],
  },
  {
    id: "p6",
    slug: "tenis-runner-wave-prata-neon-anos-2010",
    code: "#BRZ-106",
    title: "Pisante Wave Runner Prata Cromo & Neon Anos 2010",
    brand: "Mizuno",
    category: "Pisantes",
    size: "41",
    fit: "Regular",
    measurements: {
      largura: "Forma padrão 41 BR",
      comprimento: "Palmilha 27,5 cm",
    },
    condition: "8.8/10 • Amortecimento firme",
    price: 190,
    originalPrice: 260,
    mode: "venda",
    isSold: false,
    isBoostedPro: true,
    acceptsOffers: true,
    minOfferRatio: 0.82,
    likes: 112,
    image: "/images/peca-pisante-runner.jpg",
    storyBehindPiece:
      "Ícone máximo do funk paulista e da estética chavosa dos anos 2010. Cabedal refletivo prata com detalhes em neon, higienizado profissionalmente.",
    storeSlug: "brecho-dimil",
    questions: [],
  },
  {
    id: "p7",
    slug: "agasalho-adidas-hino-real-madrid-vintage",
    code: "#BRZ-107",
    title: "Agasalho Adidas Hino Real Madrid Clássico",
    brand: "Adidas",
    category: "Time & Esporte",
    size: "G",
    fit: "Largo / Baggy (Chavoso)",
    measurements: {
      largura: "62 cm",
      comprimento: "74 cm",
    },
    condition: "9.5/10 • Colecionador",
    price: 145,
    mode: "venda",
    isSold: true,
    isBoostedPro: false,
    acceptsOffers: false,
    minOfferRatio: 0.9,
    likes: 138,
    image: "/images/peca-agasalho-madrid.jpg",
    storyBehindPiece:
      "Exemplo real de peça com baixa automática no site: assim que o PIX confirma, o sistema carimba VENDIDO sozinho sem precisar editar legenda na mão!",
    storeSlug: "acervodoreliquia",
    questions: [],
  },
  {
    id: "p8",
    slug: "acervo-kit-racionais-mcs-1994-zimbabwe-boina",
    code: "#ACV-001",
    title: "[ACERVO] Camiseta Racionais 1994 (Zimbabwe) + Boina 2002",
    brand: "Racionais MCs / Arquivo",
    category: "Acervo (Locação)",
    size: "GG",
    fit: "Largo / Baggy (Chavoso)",
    measurements: {
      largura: "64 cm",
      comprimento: "79 cm",
      extra: "Boina Tamanho Único",
    },
    condition: "Peça de Museu • Preservação Histórica",
    price: 95,
    rentalDailyPrice: 95,
    mode: "acervo",
    isSold: false,
    isBoostedPro: true,
    acceptsOffers: false,
    minOfferRatio: 1,
    likes: 205,
    image: "/images/peca-acervo-rap.jpg",
    storyBehindPiece:
      "Patrimônio da memória visual preta e periférica: merch histórica da coletânea de 1994 (Zimbabwe Records) + boina da era 'Nada como Um Dia Após o Outro' (2002). Disponível exclusivamente para locação em videoclipes, cinema, exposições e editoriais.",
    credits: {
      photo: "@1renas_tinho",
      styling: "@cruela__",
    },
    storeSlug: "acervodoreliquia",
    questions: [],
  },
];

export const BRANDS_LIST = [
  { name: "Ecko Unltd.", tag: "Polos & Rap 00s", count: 18 },
  { name: "Polo Ralph Lauren", tag: "#3 & Clássicas", count: 24 },
  { name: "Nike", tag: "Total 90 & Dri-Fit", count: 31 },
  { name: "Adidas", tag: "Agasalhos de Time", count: 27 },
  { name: "Alpinestars", tag: "Racing & Grau", count: 9 },
  { name: "Mizuno", tag: "Pisantes & Wave", count: 14 },
  { name: "Y2K Garimpo", tag: "Quarto de Menina", count: 29 },
  { name: "FUBU", tag: "90s Baggy", count: 11 },
];

export const PRICE_RANGES = [
  { id: "ate-50", label: "Até R$ 50", subtitle: "Achadinhos e garimpo de giro rápido", min: 0, max: 50 },
  { id: "50-80", label: "R$ 50 a R$ 80", subtitle: "Polos icônicas e kits Y2K", min: 50, max: 80 },
  { id: "80-180", label: "R$ 80 a R$ 180", subtitle: "Agasalhos de time e conjuntos", min: 80, max: 180 },
  { id: "180-plus", label: "Acima de R$ 180", subtitle: "Jaquetas racing, pisantes e raridades", min: 180, max: 9999 },
];

export const EDITORIAL_STORIES: EditorialStory[] = [
  {
    slug: "dissecando-o-drop-racionais-1994-memoria-vestida",
    section: "Dissecando o Drop",
    title: "Racionais MCs (1994–2002): Quando uma camiseta guarda a história inteira da quebrada",
    subtitle: "Da gravadora Zimbabwe ao álbum 'Nada como Um Dia Após o Outro', como o garimpo preserva o arquivo vivo do rap nacional.",
    readTime: "4 min de leitura",
    date: "Edição #01 • Arquivo Vivo",
    location: "Zona Leste & Centro, SP",
    author: "Renato Simões (@1renas_tinho) & Mayara Kerly (@cruela__)",
    coverImage: "/images/peca-acervo-rap.jpg",
    tags: ["Rap Nacional", "Arquivo 90s", "Pesquisa de Moda"],
    excerpt:
      "Garimpar na periferia nunca foi só sobre comprar roupa barata: é impedir que a nossa própria estética e memória visual sejam apagadas.",
    paragraphs: [
      "Quando seguramos uma camiseta original da época da Zimbabwe Records de 1994 ao lado de uma boina que marcou o imaginário de 'Nada como Um Dia Após o Outro' (2002), estamos olhando para documentos históricos que não aparecem nos livros tradicionais de moda brasileira.",
      "No projeto 'Dissecando o Drop', reunimos acervos parceiros da cena — como @brechodimil, @brechodosbari, @relicari.oz e @gardebrecho_ — para provar que os brechós de quebrada funcionam como verdadeiros museus vivos e descentralizados.",
      "Por isso criamos dentro do BRECHOZADAS a modalidade ACERVO: peças que não precisam ser vendidas e perdidas de vista, mas que podem vestir novos clipes, curtas-metragens e editoriais dirigidos por criadores da própria periferia.",
    ],
    credits: "Acervo colaborativo: @acervodoreliquia, @brechodimil, @relicari.oz • Direção: @1renas_tinho & @cruela__",
    relatedProductSlugs: ["acervo-kit-racionais-mcs-1994-zimbabwe-boina", "polo-ecko-silver-collection-rinoceronte"],
  },
  {
    slug: "historias-da-quebrada-monotrilho-sao-mateus-rolezinhos",
    section: "Histórias da Quebrada",
    title: "Das plataformas do Monotrilho São Mateus aos Rolezinhos do ABC: a passarela real de SP",
    subtitle: "Como as estações de trem, batalhas de rima e bailes criaram a identidade que hoje pauta as grandes revistas.",
    readTime: "5 min de leitura",
    date: "Edição #02 • Território",
    location: "São Mateus, Vila Prudente & Mauá",
    author: "Redação BRECHOZADAS",
    coverImage: "/images/hero-drop.jpg",
    tags: ["Linha 15-Prata", "Funk Paulista", "ABC & ZL"],
    excerpt:
      "Muito antes de qualquer semana de moda olhar para o streetwear nacional, o vagão das seis da tarde e a escadaria da estação já ditavam código de vestimenta.",
    paragraphs: [
      "Quem viveu os primeiros drops do @acervodoreliquia lembra das fotos clicadas na correria entre uma estação e outra do Monotrilho Linha 15-Prata, de Vila Prudente até São Mateus, ou nas ruas de Mauá e Santo André.",
      "A polo listrada bem passada, o corta-vento de time europeu, o pisante de mola reluzindo no flash da câmera digital e a troca de ideia rápida na catraca formaram uma linguagem própria — comunitária, criativa e orgulhosa de suas raízes.",
      "Na seção 'Histórias da Quebrada', abrimos o microfone para estilistas, MCs, donos de brechó e frequentadores contarem as memórias dos picos que construíram a cena urbana de São Paulo.",
    ],
    credits: "Fotografia & Memória: Comunidade @acervodoreliquia & Batalha da Matrix",
    relatedProductSlugs: ["camiseta-nike-dri-fit-mercurial-anos-2000", "tenis-runner-wave-prata-neon-anos-2010"],
  },
  {
    slug: "dissecando-o-drop-quarto-de-menina-cybershot-orkut",
    section: "Dissecando o Drop",
    title: "Quarto de Menina: Cybershot, estampa de zebra, Orkut e o protagonismo feminino no funk",
    subtitle: "Por trás do editorial em parceria com @bonfire_brecho que resgatou a estética anos 2000 das meninas da periferia.",
    readTime: "3 min de leitura",
    date: "Edição #03 • Estética Y2K",
    location: "Zona Leste, SP",
    author: "Mayara Kerly (@cruela__)",
    coverImage: "/images/editorial-quebrada.jpg",
    tags: ["Y2K", "Protagonismo Feminino", "Editorial"],
    excerpt:
      "Recriar o quarto com pôsteres na parede, telefone com fio e câmera compacta foi um jeito de celebrar a autoestima e a inventividade das meninas de quebrada.",
    paragraphs: [
      "Muito do que hoje o mercado internacional chama de 'Y2K' já era dominado com muito mais personalidade pelas meninas das periferias brasileiras nos anos 2000: a baby tee customizada, a argola marcante, o jeans de cintura baixa e o gloss sempre no bolso.",
      "Em parceria com brechós comandados por mulheres da cena, conectamos memória afetiva com economia circular — fortalecendo quem garimpa, modela, fotografa e dirige arte dentro do nosso próprio território.",
    ],
    credits: "Direção Criativa & Styling: @cruela__ • Acervo Parceiro: @bonfire_brecho",
    relatedProductSlugs: ["conjunto-quarto-de-menina-y2k-baby-tee-denim", "jaqueta-racing-alpinestars-vintage"],
  },
];

export const SCENE_NETWORK: SceneMember[] = [
  {
    id: "s1",
    name: "Mayara Kerly (Cruela)",
    handle: "@cruela__",
    role: "Styling & Direção",
    region: "Zona Leste & ABC • SP",
    bio: "Pesquisadora de moda periférica, cofundadora do @acervodoreliquia e diretora criativa para videoclipes, cinema e editoriais.",
    tags: ["Personal Styling", "Direção de Arte", "Figurino Funk/Rap"],
    availableForCollab: true,
  },
  {
    id: "s2",
    name: "Renato Simões",
    handle: "@1renas_tinho",
    role: "Styling & Direção",
    region: "São Mateus & Mauá • SP",
    bio: "Curador de acervo, fotógrafo de rua e pesquisador da estética anos 2000/2010. Conecta brechós a produções audiovisuais.",
    tags: ["Curadoria", "Fotografia Flash", "Pesquisa Cultural"],
    availableForCollab: true,
  },
  {
    id: "s3",
    name: "Feira Fluxo das Relíquias",
    handle: "@acervodoreliquia",
    role: "Evento / Feira",
    region: "Itinerante • ZL & ABC Paulista",
    bio: "Encontro presencial reunindo mais de 15 brechós de quebrada, DJs de funk/rap, exposição de peças raras e flash photoshoot.",
    tags: ["Inscrições Abertas p/ Brechós", "Economia Circular", "Entrada Grátis"],
    availableForCollab: true,
  },
  {
    id: "s4",
    name: "Coletivo Lente de Rua",
    handle: "@lentedequebrada_sp",
    role: "Foto & Handcam",
    region: "Grande São Paulo",
    bio: "Dupla de fotógrafos e videomakers especializada em ensaios de drop para brechós independentes com Cybershot, VHS e luz natural.",
    tags: ["Fotos p/ Brechós", "Reels de Drop", "Preços Acessíveis p/ Cena"],
    availableForCollab: true,
  },
];
