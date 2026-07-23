#!/usr/bin/env node
/**
 * Gera o SQL para inserir uma linha na tabela `brincos` por cada foto em
 * photos-ready/, já com o image_url correto (URL público do Storage do Supabase).
 *
 * Uso:
 *   1. faz upload das MESMAS fotos de photos-ready/ para o bucket `brincos`
 *      (Supabase → Storage → brincos → Upload)
 *   2. corre:  npm run gerar-sql
 *   3. abre  supabase/seed-brincos.sql , copia tudo e corre no SQL Editor
 *   4. no Table Editor, ajusta nome, preço, tom e forma de cada peça
 *
 * Nota: os nomes dos ficheiros no Storage têm de ser EXATAMENTE os de
 * photos-ready/. Se otimizares as fotos (npm run fotos), volta a correr isto.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRINCOS_META } from "./brincos-meta.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PHOTOS_DIR = path.join(ROOT, "photos-ready");
const OUT_FILE = path.join(ROOT, "supabase", "seed-brincos.sql");
const BUCKET = "brincos";
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// preço único para toda a coleção
const PRICE = 11.90;
const DEFAULT_STOCK = 3;
// usado quando uma foto não está no brincos-meta.mjs
const FALLBACK = { name: "Brinco", tone: "creme", shape: "botao" };

// todos os tons válidos (tem de bater com CLAY_TONES em lib/products.js)
const TONES = [
  "terracota", "salvia", "rosa", "manteiga", "creme", "grafite",
  "amarelo", "turquesa", "azeitona", "coral", "laranja", "vermelho", "magenta", "multicor",
];

function getSupabaseUrl() {
  const env = readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const m = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*"?([^"\s]+)"?/);
  if (!m) throw new Error("NEXT_PUBLIC_SUPABASE_URL não encontrado em .env.local");
  return m[1].replace(/\/$/, "");
}

const sqlStr = (s) => `'${String(s).replace(/'/g, "''")}'`;

function main() {
  const baseUrl = getSupabaseUrl();

  const files = readdirSync(PHOTOS_DIR)
    .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.error(`\n  Sem fotos em ${path.relative(ROOT, PHOTOS_DIR)}/\n`);
    process.exit(1);
  }

  const rows = files.map((file, i) => {
    const meta = BRINCOS_META[file] ?? FALLBACK;
    const imageUrl = `${baseUrl}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(file)}`;
    return "  (" +
      [
        sqlStr(meta.name),               // name
        PRICE,                           // price
        sqlStr(meta.tone),               // tone (cor)
        sqlStr(meta.shape),              // shape
        sqlStr(""),                      // description
        sqlStr(imageUrl),                // image_url
        DEFAULT_STOCK,                   // stock
        "true",                          // is_new
        (i + 1) * 10,                    // sort_order
      ].join(", ") + ")";
  });

  const sql =
`-- Gerado por scripts/generate-brincos-sql.mjs
-- ${files.length} peça(s), uma por foto em photos-ready/  ·  preço ${PRICE.toFixed(2)} €
-- Faz upload das mesmas fotos para o bucket "${BUCKET}" ANTES de correr isto.

-- 1) alarga o CHECK do tom para aceitar as cores novas da coleção
alter table public.brincos drop constraint if exists brincos_tone_check;
alter table public.brincos add constraint brincos_tone_check
  check (tone in (${TONES.map(sqlStr).join(", ")}));

-- 2) insere as peças (cor/nome/forma já atribuídos por foto)
insert into public.brincos
  (name, price, tone, shape, description, image_url, stock, is_new, sort_order)
values
${rows.join(",\n")};
`;

  mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, sql, "utf8");

  console.log(`\n  ${files.length} linha(s) geradas → ${path.relative(ROOT, OUT_FILE)}`);
  console.log(`  Base do Storage: ${baseUrl}/storage/v1/object/public/${BUCKET}/\n`);
}

main();
