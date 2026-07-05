import "./globals.css";

export const metadata = {
  title: "tactum studio — brincos & chapinhas de argila",
  description:
    "Brincos e chapinhas de argila feitos à mão em Portugal. Personaliza a chapinha do teu animal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
