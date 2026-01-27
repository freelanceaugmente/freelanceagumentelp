import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AppList Generator - Vos idées d'apps pour revenus passifs",
  description: "Générez votre feuille de route personnalisée avec 6 applications à vibecoder pour créer des revenus passifs grâce à l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${manrope.variable} ${playfair.variable} antialiased`}
        style={{ paddingTop: '80px', backgroundColor: '#f5f5f5' }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
