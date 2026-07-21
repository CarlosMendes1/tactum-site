#!/usr/bin/env node
/**
 * Prepara as fotos dos brincos para upload no Supabase Storage.
 *
 * O que faz a cada imagem de `photos-raw/`:
 *   - recorta/redimensiona para 1000×1250 (o formato 4:5 vertical do catálogo)
 *   - converte para .webp (leve, com boa qualidade)
 *   - limpa o nome do ficheiro (minúsculas, sem espaços nem acentos)
 * e grava o resultado em `photos-ready/`, pronto a arrastar para o Storage.
 *
 * Uso:
 *   1. mete as fotos originais na pasta  tactum-site/photos-raw/
 *   2. corre  npm run fotos
 *   3. faz upload de tudo o que aparecer em  tactum-site/photos-ready/
 *
 * Formatos aceites: jpg, jpeg, png, webp, tiff, avif.
 * (Fotos .heic do iPhone: exporta/partilha como "JPEG" primeiro — o Mac faz isso
 *  em Fotos → Exportar, ou muda em Definições → Câmara → Formatos → "Mais compatível".)
 */

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INPUT_DIR = path.join(ROOT, "photos-raw");
const OUTPUT_DIR = path.join(ROOT, "photos-ready");

const WIDTH = 1000;
const HEIGHT = 1250;
const QUALITY = 80;
const ACCEPTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);

// "Argola Terra (1).JPG" -> "argola-terra-1"
function slugify(name) {
  return name
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")                       // tudo o resto vira hífen
    .replace(/^-+|-+$/g, "");                          // sem hífens nas pontas
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function main() {
  let files;
  try {
    files = await readdir(INPUT_DIR);
  } catch {
    console.error(`\n  Falta a pasta com as fotos originais.\n  Cria-a e mete lá as imagens:  ${path.relative(ROOT, INPUT_DIR)}/\n`);
    process.exit(1);
  }

  const images = files.filter((f) => ACCEPTED.has(path.extname(f).toLowerCase()));
  if (images.length === 0) {
    console.error(`\n  Nenhuma imagem em  ${path.relative(ROOT, INPUT_DIR)}/ .\n  Formatos aceites: ${[...ACCEPTED].join(", ")}\n`);
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`\n  A preparar ${images.length} foto(s) → ${WIDTH}×${HEIGHT} .webp\n`);

  const usedNames = new Map();
  let ok = 0;

  for (const file of images) {
    let base = slugify(path.basename(file, path.extname(file))) || "brinco";
    // evita colisões se dois ficheiros derem o mesmo slug
    const seen = usedNames.get(base) ?? 0;
    usedNames.set(base, seen + 1);
    if (seen > 0) base = `${base}-${seen + 1}`;

    const outName = `${base}.webp`;
    const inPath = path.join(INPUT_DIR, file);
    const outPath = path.join(OUTPUT_DIR, outName);

    try {
      await sharp(inPath)
        .rotate() // respeita a orientação EXIF (fotos de telemóvel)
        .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
        .webp({ quality: QUALITY })
        .toFile(outPath);

      const { size } = await stat(outPath);
      console.log(`  ✓ ${file}  →  ${outName}  (${kb(size)})`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${file}  —  ${err.message}`);
    }
  }

  console.log(`\n  Pronto: ${ok}/${images.length} em  ${path.relative(ROOT, OUTPUT_DIR)}/\n  Agora é só fazer upload dessas no Supabase → Storage → brincos.\n`);
}

main();
