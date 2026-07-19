# tactum studio

Site em Next.js com duas áreas — **Brincos** e **Pets** (com customizador de chapinhas).

## Como correr localmente

### 1. Requisitos
- Node.js 18 ou superior instalado (`node -v` para confirmar)
- npm (vem com o Node)

### 2. Obter o projeto
Se estiveres a clonar do teu repositório GitHub:

```bash
git clone https://github.com/CarlosMendes1/tactum-site.git
cd tactum-site
git checkout develop
```

Se recebeste este projeto como ficheiros soltos, copia-os todos para uma pasta `tactum-site` e abre o terminal nessa pasta.

### 3. Instalar dependências
```bash
npm install
```

### 4. Configurar a chave Stripe (modo teste)
Os botões "Comprar" (Brincos) e "Encomendar" (Pets) criam uma sessão de Stripe Checkout através de uma rota interna (`/api/checkout`). Para isso funcionar localmente precisas de uma chave secreta de teste:

1. Cria conta em [dashboard.stripe.com](https://dashboard.stripe.com) (ou usa a existente)
2. Confirma que estás em **modo de teste** (toggle no canto superior direito do dashboard)
3. Vai a **Developers → API keys** e copia a **Secret key** (começa por `sk_test_...`)
4. Copia o ficheiro de exemplo e cola a tua chave:
   ```bash
   cp .env.local.example .env.local
   ```
   Edita `.env.local` e substitui pelo valor real:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```
   Este ficheiro nunca é enviado para o GitHub (está no `.gitignore`).

### 5. Configurar o Supabase (coleção de brincos)
A listagem de brincos (homepage e `/brincos`) pode vir de uma tabela no Supabase — é aí que geres a coleção (adicionar peças, mudar preços, esconder peças esgotadas) **sem tocar no código**. Enquanto não configurares, o site usa a lista estática de `lib/products.js`.

1. Cria conta/projeto em [supabase.com](https://supabase.com) (plano gratuito chega)
2. No dashboard do projeto: **SQL Editor → New query**, cola o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clica **Run** — isto cria a tabela `brincos` e insere a coleção inicial
3. Vai a **Project Settings → API** e copia o **Project URL** e a **anon public key**
4. Acrescenta ao `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. Reinicia o `npm run dev`

**Para gerir a coleção no dia a dia**: dashboard do Supabase → **Table Editor → brincos**. Cada linha é uma peça:
- `name`, `price`, `description` — o que aparece no site
- `tone` — um de: `terracota`, `salvia`, `rosa`, `manteiga`, `creme`, `grafite`
- `shape` — um de: `argola`, `gota`, `lua`, `botao`, `arco`, `petala`, `meialua`, `barra` (define a ilustração)
- `is_new` — mostra a etiqueta "Novo"
- `is_active` — desliga para esconder a peça do site (ex: esgotada) sem a apagar
- `sort_order` — ordem no catálogo (menor primeiro)

O site atualiza sozinho até 60 segundos depois de alterares a tabela.

### 6. Correr em modo de desenvolvimento
```bash
npm run dev
```

Abre o browser em **http://localhost:3000** — deves ver o site com o toggle "BRINCOS / PETS" no topo, e o customizador completo dentro da área Pets.

### 7. Testar o pagamento (Stripe modo teste)
1. Clica em "Comprar" num brinco, ou personaliza uma chapinha em Pets e clica "Encomendar"
2. Vais ser redirecionado para uma página seria do Stripe (checkout.stripe.com)
3. Usa um cartão de teste, por exemplo:
   - Número: `4242 4242 4242 4242`
   - Validade: qualquer data futura (ex: `12/34`)
   - CVC: qualquer 3 dígitos (ex: `123`)
   - Nome/código postal: qualquer valor
4. Depois de pagar, és redirecionado de volta para `/success`. Se cancelares, vais para `/cancel`.

Nenhum dinheiro real é movimentado em modo de teste.

### 8. Testar o build de produção (opcional, mas recomendado antes de publicar)
```bash
npm run build
npm run start
```
Isto simula exatamente o que vai correr depois de publicado. Precisas da mesma variável `STRIPE_SECRET_KEY` definida em `.env.local`.

## Estrutura do projeto

```
tactum-site/
├── app/
│   ├── layout.js            # layout raiz: fontes, header, footer
│   ├── page.js              # página inicial (hero + destaques)
│   ├── globals.css          # design tokens + todos os estilos
│   ├── brincos/page.js      # catálogo de brincos (filtros + vista rápida)
│   ├── pets/page.js         # customizador de chapinhas
│   ├── api/checkout/route.js  # cria a sessão de Stripe Checkout
│   ├── success/page.js      # página depois de pagamento bem-sucedido
│   └── cancel/page.js       # página se o cliente cancelar o pagamento
├── components/
│   ├── SiteChrome.jsx       # header (navegação), material strip e footer
│   ├── BrincosCatalog.jsx   # grelha do catálogo, filtros, modal de produto
│   ├── PetsCustomizer.jsx   # customizador completo da área Pets
│   └── EarringVisual.jsx    # ilustração SVG de cada brinco
├── lib/
│   ├── stripe.js            # cliente Stripe (servidor)
│   ├── checkout.js          # helper que chama /api/checkout (browser)
│   ├── products.js          # catálogo estático (fallback) + tons de argila
│   ├── supabase.js          # cliente Supabase (null se não configurado)
│   └── earrings.js          # busca a coleção ao Supabase, com fallback
├── supabase/
│   └── schema.sql           # cria a tabela `brincos` + coleção inicial
├── .env.local.example       # modelo das variáveis (Stripe + Supabase)
├── package.json
├── next.config.mjs
└── .gitignore
```

## Publicar as alterações no GitHub

```bash
git add .
git commit -m "Site inicial: áreas Brincos e Pets com customizador"
git push origin develop
```

## Próximos passos (para ficar pronto para encomendas reais)

1. **Domínio** — registar `tactumstudio.pt` ou `.com`
2. **Hosting** — ligar este repositório à Vercel (vercel.com → Import Project → escolher o repo). Cada push para `develop` ou `main` gera um deploy automático. Define lá também a variável `STRIPE_SECRET_KEY`.
3. **Pagamentos** — ✅ Stripe Checkout já está integrado (modo teste). Para produção: ativa a conta Stripe (dados da empresa), ativa Multibanco/MB WAY no dashboard e troca a chave de teste pela chave real (`sk_live_...`)
4. **Base de dados** — ✅ a coleção de brincos já vem do Supabase (ver passo 5). Falta: guardar cada encomenda (forma, cor, texto, preço) numa tabela de pedidos
5. **Emails automáticos** — Resend ou SendGrid, para confirmar a encomenda ao cliente e avisar-vos do que produzir
6. **Parte legal** — atividade aberta nas Finanças + fatura-recibo por venda (Vendus ou InvoiceXpress)

Este README cobre a parte 1 (correr localmente) e a parte 3 (testar pagamentos Stripe em modo teste). Quando quiseres avançar para o deploy real ou ligar a Supabase, é só dizer.
