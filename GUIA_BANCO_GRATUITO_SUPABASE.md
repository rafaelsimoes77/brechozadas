# 🗄️ Guia de Conexão do Banco de Dados Permanente Gratuito (Supabase)
### BRECHOZADAS por @acervodoreliquia

Este guia ensina como conectar o **banco de dados PostgreSQL na nuvem 100% gratuito** (Supabase Free Tier) para que seus produtos, ofertas, brechós e pedidos nunca mais se percam quando a Vercel reiniciar seus servidores serverless.

---

## ⚡ Por que o Supabase?
- **100% Gratuito Para Sempre**: Não pede cartão de crédito.
- **500 MB de Armazenamento**: Espaço para mais de 100.000 peças cadastradas e histórico de pedidos.
- **Requisições Ilimitadas**: Agiliza a navegação sem limite de acessos diários.
- **PostgreSQL Nativo**: Padrão de segurança bancária e auditoria.

---

## 🚀 Passo a Passo (Leva menos de 3 minutos)

### 1. Criar o Projeto Gratuito
1. Acesse: **[https://supabase.com](https://supabase.com)** e clique em **"Start your project"**.
2. Faça login com seu GitHub ou crie uma conta com e-mail.
3. Clique em **"New Project"**:
   - **Name**: `brechozadas-db`
   - **Database Password**: Escolha uma senha segura e anote.
   - **Region**: Selecione **"São Paulo (sa-east-1)"** (para máxima velocidade no Brasil) ou a mais próxima.
   - **Pricing Plan**: Selecione **Free Plan ($0/mês)**.
4. Clique em **"Create new project"** e aguarde 1 minuto até o banco provisionar.

---

### 2. Rodar o Script de Tabelas (1 Clique)
1. No menu lateral esquerdo do Supabase, clique no ícone **SQL Editor** (ícone `>_`).
2. Clique em **"New Query"**.
3. Abra o arquivo `supabase/schema.sql` deste projeto, copie todo o conteúdo e cole no editor do Supabase.
4. Clique no botão verde **"Run"** (ou aperte `Ctrl + Enter`).
5. Aparecerá a mensagem: `Success. No rows returned`. Suas tabelas já estão criadas com proteção RLS ativada!

---

### 3. Copiar as Chaves de Acesso
1. No menu lateral esquerdo do Supabase, clique na engrenagem **Project Settings** -> **API**.
2. Você verá duas informações cruciais:
   - **Project URL**: algo como `https://abcdefghijklm.supabase.co`
   - **Project API Keys**:
     - `anon` `public` (chave pública)
     - `service_role` `secret` (chave secreta com permissão total)

---

### 4. Configurar no Projeto Local e na Vercel

#### No seu computador (desenvolvimento local):
Abra o arquivo `.env.local` na pasta do projeto e adicione:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
```

Depois dê um clique duplo em **`CONECTAR_BANCO_GRATIS.bat`** (ou rode `node scripts/setup-supabase.mjs`). Todas as 8 peças atuais, 6 brechós e trilha de auditoria serão automaticamente enviadas para o Supabase!

#### Na Vercel (Produção online):
1. Acesse seu painel: **[https://vercel.com/dashboard](https://vercel.com/dashboard)**
2. Entre no projeto **brechozadas**.
3. Vá na aba **Settings** -> **Environment Variables**.
4. Adicione as 3 variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL` = (sua URL do Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (sua chave anon)
   - `SUPABASE_SERVICE_ROLE_KEY` = (sua chave service_role)
5. Marque as opções **Production**, **Preview** e **Development**.
6. Clique em **Save**.
7. Vá na aba **Deployments** e clique em **Redeploy** no último deploy.

---

## 🔍 Como Testar e Confirmar que está Conectado
Basta abrir no navegador:
👉 **`https://brechozadas.vercel.app/api/db-status`** (ou `http://localhost:3000/api/db-status`)

Você verá a confirmação em tempo real:
```json
{
  "success": true,
  "database": {
    "provider": "supabase",
    "isConfigured": true,
    "status": "connected",
    "latencyMs": 42,
    "message": "Banco de dados permanente Supabase PostgreSQL conectado com sucesso!"
  }
}
```

Se as chaves ainda não tiverem sido configuradas, o sistema continua funcionando perfeitamente em modo fallback sem travar nada!
