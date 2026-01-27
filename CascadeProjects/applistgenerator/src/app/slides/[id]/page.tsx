"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Loader2, Home } from "lucide-react";
import Link from "next/link";

interface SlideData {
  id: string;
  linkedinUrl: string;
  userName: string;
  slides: string[];
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  manusTaskId?: string;
}

export default function SlidesPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<SlideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/generate?id=${id}`);
        if (!response.ok) {
          throw new Error("Données non trouvées");
        }
        const result = await response.json();
        setData(result);
        
        // If still processing, start polling
        if (result.status === 'processing') {
          setLoading(false); // Show processing UI
          
          pollInterval = setInterval(async () => {
            try {
              const pollResponse = await fetch(`/api/generate?id=${id}`);
              if (pollResponse.ok) {
                const pollResult = await pollResponse.json();
                setData(pollResult);
                
                if (pollResult.status === 'completed' || pollResult.status === 'failed') {
                  if (pollInterval) clearInterval(pollInterval);
                }
              }
            } catch (err) {
              console.error("Polling error:", err);
            }
          }, 5000); // Poll every 5 seconds
        } else {
          setLoading(false);
        }
      } catch {
        setError("Impossible de charger les slides. Veuillez réessayer.");
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [id]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    if (data) {
      setCurrentSlide((prev) => Math.min(data.slides.length - 1, prev + 1));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevSlide();
    } else if (e.key === "ArrowRight") {
      handleNextSlide();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    // Create a new window with all slides for printing
    const printWindow = window.open('', '_blank');
    if (printWindow && data) {
      const allSlidesHtml = data.slides.map((slide, index) => {
        // Inject print styles into each slide
        const slideWithPrintStyles = slide.replace('</head>', `
          <style>
            @media print {
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
              body { background-color: inherit !important; }
              .slide-container, body { page-break-after: always; }
            }
            @page { size: 1280px 720px landscape; margin: 0; }
          </style>
        </head>`);
        return `<div class="slide-page" style="page-break-after: always; width: 1280px; height: 720px; overflow: hidden;">${slideWithPrintStyles}</div>`;
      }).join('');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Slides - ${data.userName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
            @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf') format('opentype'); }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #1A1A1A; }
            .slide-page { width: 1280px; height: 720px; overflow: hidden; page-break-after: always; }
            .slide-page iframe { width: 100%; height: 100%; border: none; }
            @media print {
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
              @page { size: 1280px 720px landscape; margin: 0; }
              body { background: transparent !important; }
            }
          </style>
        </head>
        <body>
          ${data.slides.map((slide, i) => `
            <div class="slide-page">
              <iframe srcdoc="${slide.replace(/"/g, '&quot;')}" style="width:1280px;height:720px;border:none;"></iframe>
            </div>
          `).join('')}
          <script>
            setTimeout(() => { window.print(); }, 1500);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
    
    setTimeout(() => setIsExporting(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF4500] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement de vos slides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link href="/">
            <Button className="bg-[#FF4500] hover:bg-[#FF5722]">
              <Home className="w-4 h-4 mr-2" />
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Processing state - Manus is analyzing the LinkedIn profile
  if (data && (data.status === 'processing' || data.status === 'pending')) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-[#333] border-t-[#FF4500] rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <h2 className="text-white text-2xl font-semibold mb-4">
            Analyse en cours...
          </h2>
          <p className="text-gray-400 mb-2">
            Notre IA analyse le profil LinkedIn de <span className="text-[#FF4500] font-semibold">{data.userName}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Extraction des compétences, expériences et génération des slides personnalisées.
            <br />Cela peut prendre 2-3 minutes.
          </p>
          <div className="bg-[#222] rounded-lg p-4 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#FF4500] rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Visite du profil LinkedIn</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#333] rounded-full"></div>
              <span className="text-gray-500 text-sm">Analyse des compétences</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#333] rounded-full"></div>
              <span className="text-gray-500 text-sm">Génération des idées d&apos;apps</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#333] rounded-full"></div>
              <span className="text-gray-500 text-sm">Création des slides HTML</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.slides.length === 0) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Aucune slide disponible</p>
          <Link href="/">
            <Button className="bg-[#FF4500] hover:bg-[#FF5722]">
              <Home className="w-4 h-4 mr-2" />
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#333] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-white font-semibold">
                Feuille de route pour {data.userName}
              </h1>
              <p className="text-gray-500 text-sm">
                {data.slides.length} slides • Générée le{" "}
                {new Date(data.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-[#FF4500] hover:bg-[#FF5722]"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Exporter PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Slide Container */}
        <div className="relative w-full max-w-[1280px] aspect-[16/9] bg-[#1A1A1A] rounded-lg overflow-hidden shadow-2xl">
          <iframe
            ref={iframeRef}
            srcDoc={data.slides[currentSlide]}
            className="w-full h-full border-0"
            title={`Slide ${currentSlide + 1}`}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className="w-12 h-12 rounded-full border-[#333] bg-[#1A1A1A] hover:bg-[#222] disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2">
            {data.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-[#FF4500] scale-125"
                    : "bg-[#333] hover:bg-[#555]"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextSlide}
            disabled={currentSlide === data.slides.length - 1}
            className="w-12 h-12 rounded-full border-[#333] bg-[#1A1A1A] hover:bg-[#222] disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Slide Counter */}
        <p className="text-gray-500 mt-4 text-sm">
          Slide {currentSlide + 1} / {data.slides.length} • Utilisez les flèches ← → pour naviguer
        </p>
      </main>

      {/* Thumbnails */}
      <div className="bg-[#1A1A1A] border-t border-[#333] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {data.slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`flex-shrink-0 w-40 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentSlide
                    ? "border-[#FF4500] shadow-lg shadow-[#FF4500]/20"
                    : "border-transparent hover:border-[#333]"
                }`}
              >
                <iframe
                  srcDoc={slide}
                  className="w-[640px] h-[360px] scale-[0.0625] origin-top-left pointer-events-none"
                  title={`Thumbnail ${index + 1}`}
                  style={{ transform: "scale(0.25)", transformOrigin: "top left", width: "160px", height: "90px" }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
