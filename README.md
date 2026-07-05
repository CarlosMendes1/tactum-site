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

### 4. Correr em modo de desenvolvimento
```bash
npm run dev
```

Abre o browser em **http://localhost:3000** — deves ver o site com o toggle "BRINCOS / PETS" no topo, e o customizador completo dentro da área Pets.

### 5. Testar o build de produção (opcional, mas recomendado antes de publicar)
```bash
npm run build
npm run start
```
Isto simula exatamente o que vai correr depois de publicado.

## Estrutura do projeto

```
tactum-site/
├── app/
│   ├── layout.js       # layout raiz (título da página, etc.)
│   ├── page.js         # página inicial — renderiza o site
│   └── globals.css     # reset de estilos
├── components/
│   └── TactumStudioSite.jsx   # todo o site: nav, área Brincos, área Pets + customizador
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
2. **Hosting** — ligar este repositório à Vercel (vercel.com → Import Project → escolher o repo). Cada push para `develop` ou `main` gera um deploy automático
3. **Pagamentos** — criar conta Stripe e ativar MB WAY e Multibanco
4. **Base de dados de encomendas** — Supabase, para guardar cada pedido (forma, cor, texto, preço)
5. **Emails automáticos** — Resend ou SendGrid, para confirmar a encomenda ao cliente e avisar-vos do que produzir
6. **Parte legal** — atividade aberta nas Finanças + fatura-recibo por venda (Vendus ou InvoiceXpress)

Este README cobre só a parte 1 (correr localmente). Quando quiseres avançar para o deploy real com Stripe/Supabase, é só dizer.
