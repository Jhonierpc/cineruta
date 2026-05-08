import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineRuta — Tu guía cronológica del cine",
  description:
    "Descubre el orden cronológico correcto de sagas, franquicias y universos cinematográficos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
