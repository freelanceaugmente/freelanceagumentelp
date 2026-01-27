import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Développez vos revenus en devenant Freelance Augmenté",
  description: "Passez de freelance débordé à entrepreneur augmenté en 2 semaines",
  openGraph: {
    title: "Développez vos revenus en devenant Freelance Augmenté",
    description: "Passez de freelance débordé à entrepreneur augmenté en 2 semaines",
    images: ["/landing-assets/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Développez vos revenus en devenant Freelance Augmenté",
    description: "Passez de freelance débordé à entrepreneur augmenté en 2 semaines",
    images: ["/landing-assets/images/og-image.png"],
  },
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
