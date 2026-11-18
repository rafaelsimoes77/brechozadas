# 🏴 BRECHOZADAS — Aplicação Completa (Web + API + CLI)

> Plataforma marketplace de moda urbana e periférica idealizada a partir do [`@acervodoreliquia`](https://www.instagram.com/acervodoreliquia/), combinando a mecânica comercial ágil do **Enjoei** com o DNA cultural da cena de SP e ABC.

---

## 🚀 Como abrir o projeto (1 Clique!)

### Opção 1 — Abrir no Computador
Basta dar **dois cliques** no arquivo:
- **`RODAR_BRECHOZADAS.bat`**
Ele inicia o servidor Web + API e já abre automaticamente **`http://localhost:3000`** no seu navegador!

### Opção 2 — Testar no Celular + Gerar Link Público na Internet (4G/5G/Wi-Fi)
Basta dar **dois cliques** no arquivo:
- **`TESTAR_NO_CELULAR.bat`**
Ele liga o site otimizado para celular (com barra inferior estilo App + suporte PWA para *"Adicionar à Tela de Início"*) e gera na hora **um link público `https://...` com QR Code** para abrir de qualquer celular na internet!

### Opção 3 — Enviar pro seu GitHub + Deploy Automático na Vercel (Controle de Versões)
Basta dar **dois cliques** no arquivo:
- **`PUBLICAR_NO_GITHUB.bat`**
Na primeira vez, ele abre a tela do seu GitHub já preenchida para você gerar um Token (`ghp_...`). Depois disso, **com 1 clique ele cria o repositório `brechozadas` na sua conta e sobe cada nova versão (commits completos com código + fotos)** — conectando esse repositório em `vercel.com/new`, toda versão enviada atualiza o site no ar em ~30 segundos!

### Opção 4 — Pelo terminal
```powershell
cd "c:\Users\Rpatetti\Downloads\Sites\acervo-do-reliquia"
npm run dev
```
Acesse: **`http://localhost:3000`**

---

## 🛠️ Como usar a Automação / CLI (`BRECHOZADAS CLI`)

Dê dois cliques em **`BRECHOZADAS_CLI.bat`** ou rode no terminal:

```powershell
# Ver resumo executivo de vendas, peças e brechós PRO
node cli/brechozadas.mjs status

# Listar todas as peças e status (DISPONÍVEL / VENDIDO / ACERVO)
node cli/brechozadas.mjs pecas

# Listar páginas de brechós cadastradas
node cli/brechozadas.mjs brechos

# AUTOMAÇÃO INSTAGRAM: transformar legenda de post em anúncio no site!
node cli/brechozadas.mjs importar-legenda "👕🦏 Pólo Ecko Silver | Tamanho G | 💸 R$ 60,00"

# Dar baixa rápida numa peça pelo código
node cli/brechozadas.mjs vender #BRZ-101
```

---

## ✨ Tudo o que foi construído para você

1. **Identidade `"BRECHOZADAS"` Limpa, Moderna & Urbana:**
   - Paleta **Off-White Concreto (`#F6F4EF`)**, **Preto Nanquim (`#121212`)**, **Ferrugem/Terracota (`#C93B1E`)** e **Amarelo Neon (`#EEFF33`)**, textura discreta de concreto e selo em traço autoral inspirado no logo do `@acervodoreliquia`.
2. **Separação por Marcas, Faixas de Preço e Destaques PRO:**
   - Navegação direta na Home (`/`) e catálogo completo filtrável em `/explorar` + trava rápida **"Meu Tamanho"** fixa no topo.
3. **Páginas Próprias para Cada Brechó (`/brecho/[slug]`):**
   - Extensão turbinada do Instagram: capa própria, cor personalizável em tempo real, bio, destaques, botão **Seguir**, link para Bio, botão **WhatsApp/DM** e **Painel Administrativo do Dono** (aceitar/recusar ofertas, responder dúvidas nas peças e alternar plano PRO).
   - Qualquer novo brechó pode criar sua própria página em `/vender` → aba **"Criar Nova Página de Brechó"**.
4. **Planos `Modo Direto (10% taxa)` vs `BRECHOZADAS PRO (0% taxa)` (`/vender`):**
   - **Modo Direto (Grátis):** `R$ 0` para anunciar + `10%` por venda concluída.
   - **BRECHOZADAS PRO (`R$ 29,90/mês` ou `R$ 69,90/trimestre`):** **0% de taxa nas vendas** (`100%` do valor vai pro brechó!), impulso nos Destaques e calculadora interativa de ganhos + **upload real de fotos do computador**!
5. **Mecânica Enjoei + Baixa Automática no PIX:**
   - Botão **Reliquiar (♥)**, modal **Fazer Oferta**, **Perguntas & Respostas no site**, **Botão WhatsApp/DM**, **Sacolinha Turbinada** (`10%` a `15% OFF`), opção **Trombar na Estação SP/ABC** ou **Correios**, e **carimbo automático de `VENDIDO`** salvo em banco (`data/db.json`) + recibo completo de repasse (split) em `/pedidos`.
6. **Cultura & Fortalecimento da Cena (`/revista` e `/acervo`):**
   - **Revista Cultural** com as editorias **Dissecando o Drop** e **Histórias da Quebrada**.
   - **Acervo & Styling** com locação de peças históricas por diária + **Rede Criativa** conectando brechós, stylists, fotógrafos e feiras locais.
7. **Inovações V2 + Segurança Enterprise (`/kits` e `/seguranca`):**
   - **Provador Virtual `"Vai Servir em Mim?"`**, **Montador de Kits (`/kits`)**, **Radar de Drops com Contagem Regressiva**, **Gerador PNG `9:16` p/ Stories** e **Auto-Preenchimento por Legenda do Instagram**.
   - **Central de Segurança & Auditoria (`/seguranca`):** cabeçalhos OWASP (CSP, HSTS, Anti-CSRF, Rate Limit), inspeção binária de uploads (*Magic Bytes*) e trilha criptográfica **Hash-Chain SHA-256** com anonimização LGPD.
   - Consulte também o manual completo em **`GUIA_VERCEL_CUSTOS_E_SEGURANCA.md`**.
