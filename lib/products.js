export const CLAY_TONES = {
  terracota: {
    label: "Terracota",
    hex: "#C1633B",
    dark: "#9B4B2B",
    tile: "linear-gradient(165deg,#F4E7DC 0%,#EBCDB8 100%)",
  },
  salvia: {
    label: "Sálvia",
    hex: "#8A9A7E",
    dark: "#6B7A5F",
    tile: "linear-gradient(165deg,#ECF0E5 0%,#D3DCC8 100%)",
  },
  rosa: {
    label: "Rosa argila",
    hex: "#E3A9A0",
    dark: "#C98077",
    tile: "linear-gradient(165deg,#F7EAE7 0%,#F0D3CD 100%)",
  },
  manteiga: {
    label: "Manteiga",
    hex: "#E8B04B",
    dark: "#C88F2E",
    tile: "linear-gradient(165deg,#F8EDD6 0%,#F0DCAC 100%)",
  },
  creme: {
    label: "Creme",
    hex: "#EFE7D4",
    dark: "#C9BB99",
    tile: "linear-gradient(165deg,#F8F3E9 0%,#EAE0CA 100%)",
  },
  grafite: {
    label: "Grafite",
    hex: "#4A463D",
    dark: "#2E2B26",
    tile: "linear-gradient(165deg,#EBE7DD 0%,#D7D1C3 100%)",
  },

  // ── cores vivas da coleção de sardinhas & flores ──
  amarelo: {
    label: "Amarelo",
    hex: "#CBAE1F",
    dark: "#9C8514",
    tile: "linear-gradient(165deg,#F6EFC9 0%,#ECDC93 100%)",
  },
  turquesa: {
    label: "Turquesa",
    hex: "#16A79A",
    dark: "#0E7A70",
    tile: "linear-gradient(165deg,#DCEEEC 0%,#A9D8D2 100%)",
  },
  azeitona: {
    label: "Azeitona",
    hex: "#6E7830",
    dark: "#545C22",
    tile: "linear-gradient(165deg,#ECEDD8 0%,#CDD2A3 100%)",
  },
  coral: {
    label: "Coral",
    hex: "#DE5236",
    dark: "#B23F27",
    tile: "linear-gradient(165deg,#F8E4DC 0%,#F2C2B0 100%)",
  },
  laranja: {
    label: "Laranja",
    hex: "#E9863A",
    dark: "#C26A23",
    tile: "linear-gradient(165deg,#F9E8D6 0%,#F3CFA6 100%)",
  },
  vermelho: {
    label: "Vermelho",
    hex: "#D5372E",
    dark: "#A62620",
    tile: "linear-gradient(165deg,#F7DEDB 0%,#EEB3AE 100%)",
  },
  magenta: {
    label: "Magenta",
    hex: "#BC275F",
    dark: "#8E1C48",
    tile: "linear-gradient(165deg,#F5DDE6 0%,#E7AEC4 100%)",
  },
  multicor: {
    label: "Multicor",
    hex: "linear-gradient(135deg,#E9863A 0%,#BC275F 100%)",
    dark: "#8E1C48",
    tile: "linear-gradient(135deg,#F9E8D6 0%,#F5DDE6 100%)",
  },
};

export const EARRINGS = [
  {
    id: "argola-terra",
    name: "Argola Terra",
    price: 18,
    tone: "terracota",
    shape: "argola",
    isNew: true,
    desc: "Argola aberta em tons de terracota, leve e escultural. A peça de assinatura do estúdio — presença sem peso.",
  },
  {
    id: "arco-grafite",
    name: "Arco Grafite",
    price: 17,
    tone: "grafite",
    shape: "arco",
    isNew: true,
    desc: "Um arco sóbrio em grafite, de linhas arquitetónicas. Combina com tudo, do linho ao blazer.",
  },
  {
    id: "gota-salvia",
    name: "Gota Sálvia",
    price: 16,
    tone: "salvia",
    shape: "gota",
    desc: "Gota alongada num verde sálvia calmo. Movimento suave a cada passo.",
  },
  {
    id: "petala-rosa",
    name: "Pétala Rosa",
    price: 15,
    tone: "rosa",
    shape: "petala",
    desc: "Inspirada nas pétalas do fim do verão, em rosa argila. Delicada mas com carácter.",
  },
  {
    id: "meia-lua-manteiga",
    name: "Meia-Lua Manteiga",
    price: 15,
    tone: "manteiga",
    shape: "meialua",
    desc: "Meia-lua num amarelo manteiga quente. O toque de luz de qualquer conjunto.",
  },
  {
    id: "lua-creme",
    name: "Lua Creme",
    price: 14,
    tone: "creme",
    shape: "lua",
    desc: "Crescente em creme suave, quase neutro. Para os dias em que menos é mais.",
  },
  {
    id: "barra-salvia",
    name: "Barra Sálvia",
    price: 13,
    tone: "salvia",
    shape: "barra",
    desc: "Barra vertical minimal em sálvia. Geometria simples, feita à mão.",
  },
  {
    id: "botao-terracota",
    name: "Botão Terracota",
    price: 12,
    tone: "terracota",
    shape: "botao",
    desc: "O botão clássico em terracota — pequeno, confortável, para todos os dias.",
  },
];

export const formatPrice = (n) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
