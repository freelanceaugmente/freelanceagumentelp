import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Développez vos revenus en devenant Freelance Augmenté",
  description: "Passez de freelance débordé à entrepreneur augmenté en 2 semaines",
  keywords: ["freelance", "IA", "revenus passifs", "SaaS", "applications", "productivité", "automatisation"],
  authors: [{ name: "FreelanceAugmenté" }],
  creator: "FreelanceAugmenté",
  publisher: "FreelanceAugmenté",
  metadataBase: new URL("https://freelanceaugmente.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://freelanceaugmente.com",
    title: "Développez vos revenus en devenant Freelance Augmenté",
    description: "Passez de freelance débordé à entrepreneur augmenté en 2 semaines",
    siteName: "FreelanceAugmenté",
    images: [
      {
        url: "/landing-assets/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "FreelanceAugmenté - Générez vos idées d'apps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Développez vos revenus en devenant Freelance Augmenté",
    description: "Passez de freelance débordé à entrepreneur augmenté en 2 semaines",
    images: ["/landing-assets/images/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/landing-assets/images/logos/logo-favicon2.svg", type: "image/svg+xml" },
    ],
    shortcut: "/landing-assets/images/logos/logo-favicon2.svg",
    apple: "/landing-assets/images/logos/logo-favicon2.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
