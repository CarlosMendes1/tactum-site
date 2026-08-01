/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // não anunciar "X-Powered-By: Next.js"

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Impede que o site seja embebido noutro domínio (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // O browser respeita o Content-Type em vez de o adivinhar.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Não enviar o URL completo para domínios externos.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // O site não precisa de câmara, microfone nem localização.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Força HTTPS depois da primeira visita (só tem efeito em produção).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
