# 📘 BRECHOZADAS V2 — Guia da Vercel, Custos Futuros, Inovações & Auditoria de Segurança

---

## 1. O que estudamos e trouxemos para o BRECHOZADAS V2

### 🔍 Pesquisa nas Páginas Relacionadas ao `@acervodoreliquia`
Inspecionamos o ecossistema real conectado ao perfil para deixar o marketplace fiel à cena:
- **`@bonfire_brecho` (Brechó Bonfire • 6,1 mil seg.):** Especialista em *Ed Hardy*, *Christian Audigier*, *Y2K*, *Jorts*, *Oakley* e envio nacional — inspirou a curadoria Y2K e os alertas de raridades.
- **`@brechodimil` (Brechó Dimil 💎⛏ • 13,2 mil seg. • República SP):** Famoso pelos *flat-lays* de looks completos (*"OutFit Hip-Hop"*), medidas em `cm` e aviso rigoroso de *"sem trocas"* — inspirou diretamente o **Montador de Kit Completo (`/kits`)** e o **Provador Virtual de Medidas**!
- **`@relicari.oz` (Relicari.Oz • `@estacao.202` Osasco):** Trabalha com **Drops toda Terça-feira** nos Stories e forte atuação em *Styling* — inspirou o **Radar de Drops com Contagem Regressiva** na Home!
- **`@gardebrecho_` (GARDÊ • 19,5 mil seg. • Desde 2009 em Osasco)** e **`@brechodosbari` (BDB 🥭 • IAPI Osasco):** Incorporados ao diretório oficial `/brechos` e às narrativas culturais da Revista!
- **`@1renas_tinho` & `@cruela__`:** Incorporamos os marcos reais de pesquisa (os 4 manequins das ondas do funk paulista no **Museu da Língua Portuguesa**, figurino no **CineSesc / Kinoforum**, movimento **`@fluxodasreliquias`** e collabs **KondZilla**).

### 🚀 As 5 Inovações Modernas Implementadas (Referências: Depop, Grailed, Vinted & Enjoei)
1. **📏 Provador Virtual `"Vai Servir em Mim?"` (na página de cada peça):**
   - O cliente informa sua **Altura**, **Peso** e **Caimento preferido** (*Justo*, *Certinho* ou *Largo*) e o sistema cruza automaticamente com os centímetros reais da peça única, avisando na hora se veste bem!
2. **🧩 Montador de Kit Completo (`/kits`):**
   - Permite combinar *Peça Base + Sobreposição + Pisante* num quadro visual ao vivo (ou escolher kits prontos dos stylists) já aplicando até **15% OFF automático da Sacolinha** em 1 clique.
3. **⏱️ Radar de Drops da Semana com Contagem Regressiva (na Home):**
   - Cronômetro ao vivo dos próximos lotes dos brechós com botão **"🔔 Me Avisar no Drop"**.
4. **📲 Gerador Automático de Card `9:16` pro Instagram Stories (nas peças):**
   - Renderiza em alta definição (`1080×1920`) uma arte pronta da peça com preço, tamanho e espaço tracejado reservado para colar o **Sticker de Link do Instagram**, baixando em `.png` na hora!
5. **✨ Auto-Preenchimento por Legenda do Instagram (`/vender`) + Oferta Relâmpago `-10%` (`/brecho/[slug]`):**
   - Inspirado no *Depop AI Listing* e *Send Offer to Likers*: cole qualquer legenda antiga do Instagram para preencher o anúncio sozinho e dispare promoções relâmpago para quem curtiu a peça!

---

## 2. Segurança & Auditoria Padrão Grandes Sites (`/seguranca`)

Implementamos múltiplas camadas de proteção seguindo o padrão **OWASP Top 10** e **LGPD**:

| Camada de Proteção | Como funciona no BRECHOZADAS |
| :--- | :--- |
| **Blindagem de Cabeçalhos HTTP (`src/middleware.ts`)** | `Content-Security-Policy (CSP)`, `Strict-Transport-Security (HSTS 2 anos)`, `X-Frame-Options: DENY` (anti-clickjacking), `X-Content-Type-Options: nosniff` e ocultação do `X-Powered-By`. |
| **Proteção Anti-CSRF & Rate Limiting** | Bloqueia requisições `POST/PATCH/DELETE` vindas de domínios externos maliciosos (`403`) e limita excesso de requisições por IP (`HTTP 429`) contra ataques de bots. |
| **Inspeção Binária de Imagens (*Magic Bytes*)** | O upload (`/api/upload`) não confia apenas no nome `.jpg`: lê os primeiros bytes binários reais (`FF D8 FF`, `89 50 4E 47`, etc.) e trava em `5 MB`, bloqueando scripts disfarçados. |
| **Cálculo Financeiro 100% no Servidor** | Nenhum valor ou desconto enviado pelo navegador é aceito cegamente: ofertas mínimas, descontos da Sacolinha e taxas (`10%` Direto vs `0%` PRO) são recalculados no backend. |
| **Trilha de Auditoria em Hash-Chain SHA-256 (`/seguranca`)** | Cada evento sensível gera um registro assinado com o hash SHA-256 do evento anterior (qualquer tentativa de adulterar o histórico quebra a corrente criptográfica) e **anonimiza o IP com salt (LGPD)**. |

---

## 3. Dicas Práticas: Como Usar a Vercel como um Profissional

Hoje seu fluxo já está configurado no padrão das startups de tecnologia:
**`Seu PC → PUBLICAR_NO_GITHUB.bat → GitHub → Deploy Automático na Vercel (brechozadas.vercel.app)`**

1. **Voltando atrás em 1 segundo (*Instant Rollback*):**
   - Se algum dia subir uma alteração que você não gostou, entre no painel da Vercel → aba **Deployments** → clique nos `...` da versão anterior e clique em **Instant Rollback**. O site volta ao estado anterior imediatamente sem tirar do ar!
2. **Testando ideias sem mexer no site oficial (*Preview Deployments*):**
   - No GitHub, se criar uma *branch* de teste (ex.: `teste-black-friday`), a Vercel gera um link secreto exclusivo só pra aquela branch, sem alterar `brechozadas.vercel.app` até você aprovar.
3. **Ativando Métricas Reais de Visitas:**
   - No painel do projeto na Vercel, clique na aba **Analytics** → **Enable**. Você verá quantos acessos vieram do Instagram, de quais cidades e quais páginas de brechó mais bombam.
4. **Colocando Domínio Próprio (`brechozadas.com.br`):**
   - Registre o domínio direto no órgão oficial brasileiro (**Registro.br**, nunca pague caro em intermediários!) → na Vercel vá em **Settings > Domains** → digite `brechozadas.com.br` e copie os 2 registros DNS que a Vercel mostrar lá no Registro.br. O cadeado `HTTPS` é gerado de graça e renovado sozinho!

---

## 4. Quanto Você Vai Pagar Hoje e no Futuro? (Conta Real e Sem Surpresas)

### 🟢 Fase 1 — Hoje (Testes, Validação e Demonstração): **R$ 0,00 / mês**
- **Vercel Hobby (Grátis):** inclui `100 GB` de tráfego/mês e `1 milhão` de execuções de API — aguenta tranquilamente milhares de visitas de teste no celular e computador sem cobrar nada (nem pede cartão).
- **GitHub:** Grátis.

> ⚠️ **Regra importante sobre o Banco de Dados na Nuvem:**
> Hoje, em `brechozadas.vercel.app`, o banco temporário roda em memória Serverless (ótimo para testar todas as telas na hora, mas zera quando o servidor hiberna). Quando for cadastrar produtos definitivos para vender de verdade, conectaremos um banco gratuito **Supabase** ou **Neon Postgres** (também **R$ 0/mês** até `500 MB` de dados + `1 GB` de fotos!).

---

### 🟡 Fase 2 — Lançamento Comercial Real (Primeiros 5 a 30 Brechós Vendendo)

*Observação honesta sobre os Termos da Vercel:* o plano gratuito *Hobby* da Vercel é destinado a projetos pessoais/testes; quando o marketplace passar a operar comercialmente faturando vendas contínuas, o plano comercial oficial é o **Vercel Pro** (ou você pode hospedar na **Railway** se quiser começar pagando ~4x menos!). Veja as duas opções:

| Item | Opção Enxuta (Railway + Supabase Free) | Opção Oficial Vercel Pro | Quando paga? |
| :--- | :--- | :--- | :--- |
| **Domínio `.com.br` (Registro.br)** | R$ 40 / ano (~**R$ 3,33/mês**) | R$ 40 / ano (~**R$ 3,33/mês**) | Fixo anual |
| **Hospedagem do Site + API** | US$ 5/mês (~**R$ 29/mês** na Railway) | US$ 20/mês (~**R$ 115/mês** na Vercel Pro, com 1 TB de banda) | Fixo mensal |
| **Banco de Dados + Fotos (Supabase)** | **R$ 0/mês** (Plano Free aguenta +5.000 peças) | **R$ 0/mês** (Plano Free) | Grátis no início |
| **Pagamentos PIX (Mercado Pago / Asaas)** | **R$ 0 de mensalidade** (`~0,99%` só quando vender!) | **R$ 0 de mensalidade** (`~0,99%` só quando vender!) | Só desconta se vender |
| **Custo Fixo Total da Plataforma** | **~R$ 32 / mês** | **~R$ 118 / mês** | — |

💡 **A Matemática que Faz o Site se Pagar Sozinho Logo na Largada:**
- Com apenas **1 brechó** assinando o `BRECHOZADAS PRO` (`R$ 29,90/mês`), você já empata a opção enxuta!
- Com apenas **4 brechós** no `BRECHOZADAS PRO` (`4 × R$ 29,90 = R$ 119,60/mês`), **a assinatura deles já paga 100% da Vercel Pro + domínio**, e todas as demais assinaturas + todas as taxas de `10%` do Modo Direto viram lucro líquido do negócio!

---

### 🔥 Fase 3 — Escala Grande (+100 Brechós e +50.000 visitas/mês)
- **Vercel Pro:** ~R$ 115/mês (`1 TB` incluso).
- **Supabase Pro (8 GB banco + 100 GB fotos + backups diários):** US$ 25/mês (~R$ 145/mês).
- **Custo Total em Escala:** **~R$ 265/mês** — num cenário onde 50 brechós PRO já geram **R$ 1.495/mês** fixos em assinaturas + comissões sobre centenas de vendas mensais!
