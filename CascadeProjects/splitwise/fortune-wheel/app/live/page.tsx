'use client';

import React, { useState } from 'react';
import { useWheelStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';

// Import dynamique pour éviter les problèmes SSR avec le canvas
const SmartWheel = dynamic(
  () => import('@/components/SmartWheel').then((mod) => mod.SmartWheel),
  { ssr: false }
);

export default function LivePage() {
  const { config } = useWheelStore();
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const handleResult = (segment: any) => {
    setResult(segment);
    setShowResult(true);

    // Confetti si c'est un segment gagnant
    if (segment.isWinning) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePlayAgain = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="w-full max-w-4xl">
        {!showResult ? (
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                🎡 Roue de la Fortune
              </h1>
              <p className="text-lg text-gray-600">
                Tentez votre chance et gagnez des prix incroyables !
              </p>
            </div>

            <SmartWheel
              segments={config.segments}
              theme={config.theme}
              size={Math.min(config.size, 500)}
              borderStyle={config.borderStyle}
              customBorderColor={config.customBorderColor}
              customBorderWidth={config.customBorderWidth}
              showBulbs={config.showBulbs}
              brandColors={config.brandColors}
              customButton={config.customButton}
              buttonPosition={config.buttonPosition}
              spinMode={config.spinMode}
              winProbability={config.winProbability}
              speed={config.speed}
              isMode1={false}
              formFields={config.formFields}
              onResult={handleResult}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-auto">
            <div className="mb-6">
              {result?.isWinning ? (
                <>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">
                    Félicitations !
                  </h2>
                  <p className="text-xl text-gray-700 mb-4">
                    Vous avez gagné :
                  </p>
                  <div
                    className="text-2xl font-bold py-4 px-6 rounded-lg inline-block"
                    style={{
                      backgroundColor: result.color || '#FF6B6B',
                      color: result.textColor || '#FFFFFF',
                    }}
                  >
                    {result.label}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">😔</div>
                  <h2 className="text-3xl font-bold text-gray-600 mb-2">
                    Dommage !
                  </h2>
                  <p className="text-xl text-gray-700 mb-4">
                    Vous avez obtenu :
                  </p>
                  <div
                    className="text-2xl font-bold py-4 px-6 rounded-lg inline-block"
                    style={{
                      backgroundColor: result.color || '#95E1D3',
                      color: result.textColor || '#000000',
                    }}
                  >
                    {result.label}
                  </div>
                  <p className="text-gray-600 mt-4">
                    Retentez votre chance !
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handlePlayAgain}
              className="px-8 py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: config.customButton.color,
                color: config.customButton.textColor,
              }}
            >
              Rejouer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
