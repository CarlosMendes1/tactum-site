import BrincosCatalog from "../../components/BrincosCatalog";
import { getEarrings } from "../../lib/earrings";

// A coleção é atualizada no Supabase; a página revalida a cada 60s
export const revalidate = 60;

export const metadata = {
  title: "Catálogo de brincos — tactum studio",
  description:
    "Brincos de argila feitos à mão em Portugal. Argolas, gotas, luas e mais — cada peça é única.",
};

export default async function BrincosPage() {
  const products = await getEarrings();
  return <BrincosCatalog products={products} />;
}
