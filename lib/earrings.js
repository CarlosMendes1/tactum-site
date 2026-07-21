import { supabase } from "./supabase";
import { EARRINGS, CLAY_TONES } from "./products";

// Tem de corresponder a SHAPE_PATHS em components/EarringVisual.jsx
const VALID_SHAPES = ["argola", "gota", "lua", "botao", "arco", "petala", "meialua", "barra"];

function normalizeRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    tone: CLAY_TONES[row.tone] ? row.tone : "creme",
    shape: VALID_SHAPES.includes(row.shape) ? row.shape : "botao",
    isNew: Boolean(row.is_new),
    desc: row.description ?? "",
    imageUrl: row.image_url || null,
    // stock null = não gerido (lista estática) → sempre disponível
    stock: Number.isFinite(row.stock) ? row.stock : null,
  };
}

/**
 * Coleção de brincos: vem da tabela `brincos` do Supabase quando as credenciais
 * estão configuradas; caso contrário (ou em caso de erro) usa a lista estática
 * de lib/products.js para o site nunca ficar vazio por engano.
 */
export async function getEarrings() {
  if (!supabase) return EARRINGS;

  const { data, error } = await supabase
    .from("brincos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar brincos do Supabase:", error.message);
    return EARRINGS;
  }

  return (data ?? []).map(normalizeRow);
}
