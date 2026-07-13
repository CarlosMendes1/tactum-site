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

### 5. Correr em modo de desenvolvimento
```bash
npm run dev
```

Abre o browser em **http://localhost:3000** — deves ver o site com o toggle "BRINCOS / PETS" no topo, e o customizador completo dentro da área Pets.

### 6. Testar o pagamento (Stripe modo teste)
1. Clica em "Comprar" num brinco, ou personaliza uma chapinha em Pets e clica "Encomendar"
2. Vais ser redirecionado para uma página seria do Stripe (checkout.stripe.com)
3. Usa um cartão de teste, por exemplo:
   - Número: `4242 4242 4242 4242`
   - Validade: qualquer data futura (ex: `12/34`)
   - CVC: qualquer 3 dígitos (ex: `123`)
   - Nome/código postal: qualquer valor
4. Depois de pagar, és redirecionado de volta para `/success`. Se cancelares, vais para `/cancel`.

Nenhum dinheiro real é movimentado em modo de teste.

### 7. Testar o build de produção (opcional, mas recomendado antes de publicar)
```bash
npm run build
npm run start
```
Isto simula exatamente o que vai correr depois de publicado. Precisas da mesma variável `STRIPE_SECRET_KEY` definida em `.env.local`.

## Estrutura do projeto

```
tactum-site/
├── app/
│   ├── layout.js            # layout raiz (título da página, etc.)
│   ├── page.js              # página inicial — renderiza o site
│   ├── globals.css          # reset de estilos
│   ├── api/checkout/route.js  # cria a sessão de Stripe Checkout
│   ├── success/page.js      # página depois de pagamento bem-sucedido
│   └── cancel/page.js       # página se o cliente cancelar o pagamento
├── components/
│   └── TactumStudioSite.jsx   # todo o site: nav, área Brincos, área Pets + customizador
├── lib/
│   └── stripe.js            # cliente Stripe (servidor)
├── .env.local.example       # modelo da variável STRIPE_SECRET_KEY
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
4. **Base de dados de encomendas** — Supabase, para guardar cada pedido (forma, cor, texto, preço)
5. **Emails automáticos** — Resend ou SendGrid, para confirmar a encomenda ao cliente e avisar-vos do que produzir
6. **Parte legal** — atividade aberta nas Finanças + fatura-recibo por venda (Vendus ou InvoiceXpress)

Este README cobre a parte 1 (correr localmente) e a parte 3 (testar pagamentos Stripe em modo teste). Quando quiseres avançar para o deploy real ou ligar a Supabase, é só dizer.
