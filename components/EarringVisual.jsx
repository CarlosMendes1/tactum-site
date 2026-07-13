import { CLAY_TONES } from "../lib/products";

// Cada forma é desenhada num viewBox 0 0 100 140; a peça pendura do gancho a partir de y≈36.
const SHAPE_PATHS = {
  argola:
    "M50,44 C69,44 82,58 82,78 C82,98 69,112 50,112 C31,112 18,98 18,78 C18,58 31,44 50,44 Z " +
    "M50,58 C39,58 32,66 32,78 C32,90 39,98 50,98 C61,98 68,90 68,78 C68,66 61,58 50,58 Z",
  gota:
    "M50,40 C64,58 73,72 73,88 C73,105 63,116 50,116 C37,116 27,105 27,88 C27,72 36,58 50,40 Z",
  lua:
    "M64,42 C46,49 35,64 35,82 C35,100 46,112 62,117 C58,119 53,120 48,120 C29,120 20,103 20,84 C20,62 37,44 58,41 C60,41 62,41 64,42 Z",
  botao:
    "M50,42 C66,42 77,53 77,69 C77,85 66,96 50,96 C34,96 23,85 23,69 C23,53 34,42 50,42 Z",
  arco:
    "M22,100 C22,74 34,58 50,58 C66,58 78,74 78,100 L62,100 C62,83 57,74 50,74 C43,74 38,83 38,100 Z",
  petala:
    "M50,40 C68,52 76,72 68,94 C63,108 55,116 50,118 C45,116 37,108 32,94 C24,72 32,52 50,40 Z",
  meialua:
    "M22,66 L78,66 C78,86 66,102 50,102 C34,102 22,86 22,66 Z",
  barra:
    "M42,42 C42,38 46,36 50,36 C54,36 58,38 58,42 L58,102 C58,108 54,112 50,112 C46,112 42,108 42,102 Z",
};

// Ponto onde o gancho encontra a peça, por forma (para o anel de metal).
const RING_Y = { argola: 46, gota: 44, lua: 44, botao: 44, arco: 62, petala: 44, meialua: 68, barra: 40 };

export default function EarringVisual({ product, size = 180, idSuffix = "" }) {
  const tone = CLAY_TONES[product.tone];
  const path = SHAPE_PATHS[product.shape];
  const ringY = RING_Y[product.shape];
  const filterId = `grain-${product.id}${idSuffix ? `-${idSuffix}` : ""}`;

  return (
    <svg
      viewBox="0 0 100 140"
      width={size}
      height={size * 1.4}
      className="earring-svg"
      role="img"
      aria-label={`${product.name} — brinco de argila em tom ${tone.label.toLowerCase()}`}
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"
            result="grain"
          />
          <feComposite in="grain" in2="SourceAlpha" operator="in" result="grainClipped" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grainClipped" />
          </feMerge>
        </filter>
      </defs>

      {/* gancho francês */}
      <path
        d="M38,22 C38,9 60,7 61,18 C62,26 55,30 50,32"
        fill="none"
        stroke="#8A8574"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* anel de ligação */}
      <ellipse
        cx="50"
        cy={(32 + ringY) / 2 + 1}
        rx="3.4"
        ry="4.6"
        fill="none"
        stroke="#8A8574"
        strokeWidth="2.2"
      />

      {/* sombra da peça */}
      <path d={path} fill={tone.dark} transform="translate(1.6,2.6)" opacity="0.3" fillRule="evenodd" />
      {/* peça de argila */}
      <path
        d={path}
        fill={tone.hex}
        stroke={tone.dark}
        strokeWidth="0.6"
        fillRule="evenodd"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}
