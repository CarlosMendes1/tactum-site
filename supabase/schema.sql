-- Tabela da coleção de brincos do tactum studio
-- Corre este script no Supabase: Dashboard → SQL Editor → New query → colar → Run

create table public.brincos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(8,2) not null check (price >= 0),
  tone text not null check (tone in ('terracota','salvia','rosa','manteiga','creme','grafite')),
  shape text not null check (shape in ('argola','gota','lua','botao','arco','petala','meialua','barra')),
  description text not null default '',
  is_new boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Leitura pública apenas das peças ativas; escrita só pelo dashboard do Supabase
alter table public.brincos enable row level security;

create policy "Leitura pública de brincos ativos"
  on public.brincos for select
  using (is_active);

-- Coleção inicial (igual à lista estática do site)
insert into public.brincos (name, price, tone, shape, description, is_new, sort_order) values
  ('Argola Terra', 18, 'terracota', 'argola', 'Argola aberta em tons de terracota, leve e escultural. A peça de assinatura do estúdio — presença sem peso.', true, 1),
  ('Arco Grafite', 17, 'grafite', 'arco', 'Um arco sóbrio em grafite, de linhas arquitetónicas. Combina com tudo, do linho ao blazer.', true, 2),
  ('Gota Sálvia', 16, 'salvia', 'gota', 'Gota alongada num verde sálvia calmo. Movimento suave a cada passo.', false, 3),
  ('Pétala Rosa', 15, 'rosa', 'petala', 'Inspirada nas pétalas do fim do verão, em rosa argila. Delicada mas com carácter.', false, 4),
  ('Meia-Lua Manteiga', 15, 'manteiga', 'meialua', 'Meia-lua num amarelo manteiga quente. O toque de luz de qualquer conjunto.', false, 5),
  ('Lua Creme', 14, 'creme', 'lua', 'Crescente em creme suave, quase neutro. Para os dias em que menos é mais.', false, 6),
  ('Barra Sálvia', 13, 'salvia', 'barra', 'Barra vertical minimal em sálvia. Geometria simples, feita à mão.', false, 7),
  ('Botão Terracota', 12, 'terracota', 'botao', 'O botão clássico em terracota — pequeno, confortável, para todos os dias.', false, 8);
