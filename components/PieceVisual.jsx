import EarringVisual from "./EarringVisual";

// Mostra a foto real (image_url do Supabase) quando existe; caso contrário
// desenha a ilustração SVG da forma. Assim o site nunca fica sem imagem.
export default function PieceVisual({ item, size = 150, idSuffix = "" }) {
  if (item.imageUrl) {
    return <img src={item.imageUrl} alt={item.name} className="piece-photo" loading="lazy" />;
  }
  return <EarringVisual product={item} size={size} idSuffix={idSuffix} />;
}
