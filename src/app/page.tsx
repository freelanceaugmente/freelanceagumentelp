"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Rocket, Sparkles, TrendingUp, Loader2, Mail } from "lucide-react";

export default function Home() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!linkedinUrl.includes("linkedin.com")) {
      setError("Veuillez entrer un lien LinkedIn valide");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl, email }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const data = await response.json();
      router.push(`/slides/${data.id}`);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF4500] rounded-full flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            AppList<span className="text-[#FF4500]">Generator</span>
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF4500]/10 border border-[#FF4500]/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#FF4500]" />
            <span className="text-sm text-[#FF4500] font-medium">
              Propulsé par l&apos;IA
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            VOTRE FEUILLE DE ROUTE
            <br />
            <span className="text-[#FF4500]">VERS LES REVENUS PASSIFS</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Entrez votre profil LinkedIn et recevez{" "}
            <span className="text-white font-semibold">
              6 idées d&apos;applications personnalisées
            </span>{" "}
            à vibecoder pour générer des revenus récurrents.
          </p>

          {/* Form */}
          <Card className="max-w-xl mx-auto bg-[#222222] border-[#333333]">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/votre-profil"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="pl-12 h-14 bg-[#1A1A1A] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FF4500] focus:ring-[#FF4500]"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-[#1A1A1A] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FF4500] focus:ring-[#FF4500]"
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-left">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#FF4500] hover:bg-[#FF5722] text-white font-semibold text-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Générer ma feuille de route
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-[#222222] border border-[#333333]">
              <div className="w-12 h-12 bg-[#FF4500]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-[#FF4500]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyse IA</h3>
              <p className="text-gray-400 text-sm">
                Notre IA analyse votre profil pour identifier vos forces et
                compétences uniques.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#222222] border border-[#333333]">
              <div className="w-12 h-12 bg-[#FF4500]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-[#FF4500]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">6 Apps Personnalisées</h3>
              <p className="text-gray-400 text-sm">
                Recevez 6 idées d&apos;applications SaaS adaptées à votre profil
                avec estimation MRR.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#222222] border border-[#333333]">
              <div className="w-12 h-12 bg-[#FF4500]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Rocket className="w-6 h-6 text-[#FF4500]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Roadmap Prête</h3>
              <p className="text-gray-400 text-sm">
                Un plan d&apos;action sur 3 mois pour lancer votre première app
                et générer des revenus.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-[#333333]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-sm text-gray-400 uppercase tracking-wider">
              FreelanceAugmenté.fr • Vise la Lune
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 AppList Generator. Propulsé par l&apos;IA.
          </p>
        </div>
      </footer>
    </div>
  );
}
