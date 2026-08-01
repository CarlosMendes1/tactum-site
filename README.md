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
1. Adiciona peças ao carrinho e clica "Finalizar compra"
2. Vais ser redirecionado para uma página segura do Stripe (checkout.stripe.com)
3. Usa um cartão de teste, por exemplo:
   - Número: `4242 4242 4242 4242`
   - Validade: qualquer data futura (ex: `12/34`)
   - CVC: qualquer 3 dígitos (ex: `123`)
   - Morada de envio e NIF: qualquer valor válido
4. Depois de pagar, és redirecionado de volta para `/success`, que mostra a morada de envio. Se cancelares, vais para `/cancel`.

Nenhum dinheiro real é movimentado em modo de teste.

## Portes de envio

Toda a regra de portes vive em [`lib/shipping.js`](lib/shipping.js) — é o único ficheiro a alterar se os preços mudarem, e tanto o carrinho como o checkout leem de lá.

| | Valor |
|---|---|
| Taxa fixa | 3,50 € |
| Portes grátis a partir de | 35,00 € |
| Países | Portugal (`SHIPPING_COUNTRIES`) |
| Prazo | 3–5 dias úteis |

A taxa cobre o correio registado dos CTT, que no tarifário de 2026 custa 3,20 € em entrega na caixa de correio e 3,75 € ao balcão para envios até 20 g. O limiar de 35 € (cerca de três peças) segue o que fazem lojas portuguesas comparáveis de brincos em argila polimérica.

Para passar a enviar para Espanha ou para o resto da UE, acrescenta o código do país a `SHIPPING_COUNTRIES` — mas define primeiro um porte próprio, porque o registado internacional é bastante mais caro que o nacional.

### Nota sobre preços riscados

O catálogo mostrava um preço "antes" riscado que era **calculado por fórmula** (sempre 25% acima do preço atual), não um preço real anterior. Foi removido: a Diretiva Omnibus obriga a que qualquer anúncio de redução mostre o preço mais baixo praticado nos 30 dias anteriores, e as coimas vão de 2 500 € a 50 000 €. Se quiseres voltar a fazer promoções, guarda na tabela `brincos` o preço real a que a peça esteve à venda e mostra esse.

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
