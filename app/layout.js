import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header, MaterialStrip, Footer } from "../components/SiteChrome";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "tactum studio — brincos & chapinhas de argila",
  description:
    "Brincos e chapinhas de argila feitos à mão em Portugal. Personaliza a chapinha do teu animal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a href="#conteudo" className="skip-link">Saltar para o conteúdo</a>
        <Header />
        <MaterialStrip />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
