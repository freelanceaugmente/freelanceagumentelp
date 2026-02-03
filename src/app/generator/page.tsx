"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Rocket, Loader2, Search, BarChart3, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Generator() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
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

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const data = await response.json();
      router.push(`/results/${data.id}`);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1F2937]" style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}>
      <Navbar />
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif", paddingTop: '13%' }}>
            Trouve ton{" "}
            <span className="text-[#ef5a13]">idée d&apos;app</span>
            <br />
            en 60 secondes
          </h1>

          <p
            className="text-base md:text-lg text-[#1F2937] mb-10 max-w-2xl mx-auto"
            style={{ fontFamily: "Garet, 'Manrope', sans-serif" }}
          >
            Colle ton profil LinkedIn. Notre IA génère 6 idées d&apos;apps adaptées à tes compétences, avec estimation de revenus et roadmap.
          </p>

          {/* Form */}
          <div className="relative max-w-xl mx-auto">
            <img
              src="/media1.svg"
              alt="Décor"
              className="absolute -left-10 -top-10 w-36 h-36 drop-shadow-sm opacity-90 pointer-events-none z-0 hidden md:block"
            />
            <Card className="relative z-10 bg-white border border-dashed border-[#dcdcdc] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-none">
              <CardContent className="px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <Input
                      type="url"
                      placeholder="https://linkedin.com/in/votre-profil"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="pl-12 h-14 bg-white border-[#f0e3d6] text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#ef5a13] focus:ring-[#ef5a13] rounded-xl"
                      style={{ backgroundColor: '#ffffff' }}
                      required
                    />
                  </div>

                  {/* Name field removed per request */}

                  {error && (
                    <p className="text-red-500 text-sm text-left">{error}</p>
                  )}

                  <div className="flex justify-center" style={{ marginTop: '10%' }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 h-14 bg-gradient-to-r from-[#ef5a13] to-[#e7000e] hover:from-[#e7000e] hover:to-[#ef5a13] text-white font-medium text-lg transition-all duration-300 rounded-[16px] shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5 mr-2" />
                          Générer mes 6 idées d&apos;apps
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-none bg-white border border-dashed border-[#dcdcdc] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-center mb-4 mx-auto">
                <Search className="w-7 h-7 text-[#ef5a13]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#1F2937]" style={{ fontFamily: "'Playfair Display', serif" }}>Analyse de ton profil</h3>
              <p className="text-[#6B7280] text-sm">
                L&apos;IA scanne ton LinkedIn et identifie tes forces, ton expertise et ton marché cible.
              </p>
            </div>

            <div className="p-6 rounded-none bg-white border border-dashed border-[#dcdcdc] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-7 h-7 text-[#ef5a13]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#1F2937]" style={{ fontFamily: "'Playfair Display', serif" }}>6 idées avec MRR estimé</h3>
              <p className="text-[#6B7280] text-sm">
                Reçois 6 concepts d&apos;apps réalisables en 1-2 semaines, avec potentiel de revenus récurrents.
              </p>
            </div>

            <div className="p-6 rounded-none bg-white border border-dashed border-[#dcdcdc] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-7 h-7 text-[#ef5a13]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#1F2937]" style={{ fontFamily: "'Playfair Display', serif" }}>Roadmap de lancement</h3>
              <p className="text-[#6B7280] text-sm">
                Un plan d&apos;action concret sur 3 mois pour passer de l&apos;idée aux premiers revenus.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Same as landing page */}
      <footer className="bg-white border-t border-black/5 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4">
            <nav className="flex items-center gap-4 flex-wrap justify-center text-sm">
              <a href="/#features" className="text-[#1F2937] hover:text-[#ef5a13] transition-colors">Programmes</a>
              <span className="text-[#9CA3AF]">|</span>
              <a href="/#about" className="text-[#1F2937] hover:text-[#ef5a13] transition-colors">À propos</a>
              <span className="text-[#9CA3AF]">|</span>
              <a href="/#testimonials" className="text-[#1F2937] hover:text-[#ef5a13] transition-colors">Témoignages</a>
              <span className="text-[#9CA3AF]">|</span>
              <a href="#" className="text-[#1F2937] hover:text-[#ef5a13] transition-colors">Mentions légales</a>
              <span className="text-[#9CA3AF]">|</span>
              <a href="#" className="text-[#1F2937] hover:text-[#ef5a13] transition-colors">CGV</a>
            </nav>
            <p className="text-sm text-[#6B7280] flex items-center gap-2">
              <img src="/logo-navbar.svg" alt="FreelanceAugmenté" className="h-5 w-5" />
              © 2025 FreelanceAugmenté. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
