"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  DollarSign, Clock, Zap, Users, Loader2, Lightbulb
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { GenerationResult, AppIdea } from "@/lib/types";

function stringToDarkColor(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 28%)`;
}

function AppCard({ app, index }: { app: AppIdea; index: number }) {
  const initial = app.name.trim().charAt(0).toUpperCase();
  const badgeStyle = {
    backgroundColor: stringToDarkColor(app.name + index),
  } as const;

  return (
    <div className="relative bg-white rounded-none p-6 border border-dashed border-[#dcdcdc] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-[11px] flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden"
          style={badgeStyle}
          aria-label={`Logo ${app.name}`}
        >
          <span className="app-initial" aria-hidden="true">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1F2937] text-[19px] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {app.name}
          </h3>
          <p className="text-sm text-[#6B7280] mt-1">{app.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#4B5563] mb-5 leading-relaxed line-clamp-2">
        {app.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3 pt-4 border-t border-dashed border-[#e5e5e5]">
        <div className="flex items-center gap-2 min-w-0">
          <DollarSign className="w-4 h-4 text-[#ef5a13] flex-shrink-0" />
          <span className="text-xs truncate">
            <span className="font-semibold text-[#1F2937]">MRR:</span>{" "}
            <span className="text-[#ef5a13] font-bold">{app.mrr}</span>
            <span className="text-[#9CA3AF]"> ({app.mrrClients})</span>
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
          <span className="text-xs truncate">
            <span className="font-semibold text-[#1F2937]">MVP:</span>{" "}
            <span className="text-[#4B5563]">{app.mvpTime}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Zap className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
          <span className="text-xs truncate">
            <span className="font-semibold text-[#1F2937]">Effort:</span>{" "}
            <span className="text-[#4B5563]">{app.effort}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <Users className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
          <span className="text-xs truncate block">
            <span className="font-semibold text-[#1F2937]">Cible:</span>{" "}
            <span className="text-[#4B5563]">{app.targetAudience}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const [data, setData] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/generate?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Données non trouvées");
        }
        const result = await response.json();
        setData(result);
        
        if (result.status === "processing") {
          setTimeout(fetchData, 2000);
        }
      } catch (err) {
        setError("Impossible de charger les résultats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ef5a13] animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">Chargement de vos idées d&apos;apps...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Erreur inconnue"}</p>
          <a href="/generator" className="text-[#ef5a13] hover:underline">
            Retour au générateur
          </a>
        </div>
      </div>
    );
  }

  if (data.status === "processing") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ef5a13] animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">Génération en cours...</p>
          <p className="text-sm text-[#9CA3AF] mt-2">Analyse de votre profil LinkedIn</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] text-[#1F2937]"
      style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&display=swap');

        .underline-brush {
          position: relative;
          display: inline-block;
          padding-bottom: 4px;
          z-index: 0;
        }

        .underline-brush::after {
          content: "";
          position: absolute;
          left: -4%;
          right: -4%;
          bottom: -6px;
          height: 12px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 200, 0, 0.9) 8%, rgba(255, 200, 0, 0.9) 92%, transparent 100%);
          border-radius: 999px;
          transform: rotate(-2deg);
          z-index: -1;
          opacity: 0.9;
          pointer-events: none;
        }

        .text-gradient-orange {
          background: linear-gradient(90deg, #ef5a13 0%, #e7000e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          display: inline-block;
        }

        .app-initial {
          font-family: 'Baloo 2', cursive;
          font-size: 38px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          letter-spacing: 0.2px;
        }
      `}</style>
      <Navbar />

      <main className="container mx-auto px-6 py-8 max-w-6xl" style={{ paddingTop: "120px" }}>
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#1F2937] text-sm font-semibold uppercase tracking-wider mb-1">
            VOS IDÉES D&apos;APPS
          </p>
          <div className="flex items-center gap-3">
            <h1
              className="text-[29px] md:text-[35px] font-bold leading-tight relative inline-block"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="underline-brush text-gradient-orange">{data.userName}</span>
            </h1>
          </div>
        </div>

        {/* AI Agent Banner */}
        <div className="bg-[#fff8ee] border border-dashed border-[#dcdcdc] rounded-none p-5 mb-8 flex items-center gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="w-12 h-12 rounded-none bg-gradient-to-br from-[#ef5a13] to-[#e7000e] flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#1F2937]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Toutes ces apps peuvent être codées avec un agent IA
            </h3>
            <p className="text-sm text-[#6B7280]">
              Pas besoin de développeur • MVP livré en 1 semaine • Stack moderne : Next.js + Supabase
            </p>
          </div>
        </div>

        <div
          className="mt-4"
          style={{
            backgroundImage: "url('/landing-assets/images/backgrounds/heromedia.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% auto",
            backgroundPosition: "center top",
            paddingTop: "32px",
            paddingBottom: "160px",
          }}
        >
          {/* Apps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.apps.map((app, index) => (
              <AppCard key={index} app={app} index={index} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="/generator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ef5a13] to-[#e7000e] hover:from-[#e7000e] hover:to-[#ef5a13] text-white font-medium text-lg transition-all duration-300 rounded-[16px] shadow-lg hover:shadow-xl"
            >
              <img src="/WhatsApp.png" alt="WhatsApp" className="w-5 h-5" />
              Discutons de votre projet
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
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
