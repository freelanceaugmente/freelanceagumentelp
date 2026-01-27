'use client';

import React, { useState } from 'react';
import { useWheelStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { HexColorPicker } from 'react-colorful';

// Import dynamique pour éviter les problèmes SSR avec le canvas
const SmartWheel = dynamic(
  () => import('@/components/SmartWheel').then((mod) => mod.SmartWheel),
  { ssr: false }
);

export default function AdminPage() {
  const { config, updateConfig, addSegment, updateSegment, deleteSegment } = useWheelStore();
  const [activeTab, setActiveTab] = useState<'segments' | 'appearance' | 'behavior' | 'form'>('segments');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [liveUrl, setLiveUrl] = useState('');

  React.useEffect(() => {
    setLiveUrl(`${window.location.origin}/live`);
  }, []);

  const handleAddSegment = () => {
    const newSegment = {
      id: Date.now().toString(),
      label: `Segment ${config.segments.length + 1}`,
      value: `segment${config.segments.length + 1}`,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      textColor: '#FFFFFF',
      probability: 10,
      isWinning: false,
    };
    addSegment(newSegment);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎡 Administration - Roue de la Fortune</h1>
          <p className="text-gray-600">Configurez votre jeu de roue de la fortune</p>
        </div>

        {/* URL Live et iframe */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔗 Lien Live</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de la roue (pour les participants)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={liveUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(liveUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Copier
                </button>
                <a
                  href="/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Ouvrir
                </a>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code iframe (à intégrer sur votre site)</label>
              <textarea
                value={`<iframe src="${liveUrl}" width="100%" height="800" frameborder="0" allowfullscreen></iframe>`}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                rows={3}
              />
              <button
                onClick={() => copyToClipboard(`<iframe src="${liveUrl}" width="100%" height="800" frameborder="0" allowfullscreen></iframe>`)}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Copier le code iframe
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panneau de configuration */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex border-b mb-6">
              {(['segments', 'appearance', 'behavior', 'form'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab === 'segments' && '🎯 Segments'}
                  {tab === 'appearance' && '🎨 Apparence'}
                  {tab === 'behavior' && '⚙️ Comportement'}
                  {tab === 'form' && '📝 Formulaire'}
                </button>
              ))}
            </div>

            {/* Onglet Segments */}
            {activeTab === 'segments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Segments de la roue</h3>
                  <button
                    onClick={handleAddSegment}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    + Ajouter
                  </button>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {config.segments.map((segment, index) => (
                    <div key={segment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-medium text-gray-700">Segment {index + 1}</span>
                        <button
                          onClick={() => deleteSegment(segment.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={segment.label}
                          onChange={(e) => updateSegment(segment.id, { label: e.target.value })}
                          placeholder="Nom du segment"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Couleur</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={segment.color || '#FF6B6B'}
                                onChange={(e) => updateSegment(segment.id, { color: e.target.value })}
                                className="w-12 h-10 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={segment.color || '#FF6B6B'}
                                onChange={(e) => updateSegment(segment.id, { color: e.target.value })}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Probabilité (%)</label>
                            <input
                              type="number"
                              value={segment.probability || 0}
                              onChange={(e) => updateSegment(segment.id, { probability: Number(e.target.value) })}
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={segment.isWinning || false}
                            onChange={(e) => updateSegment(segment.id, { isWinning: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">Segment gagnant</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Apparence */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Personnalisation visuelle</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taille de la roue</label>
                  <input
                    type="range"
                    min="300"
                    max="600"
                    value={config.size}
                    onChange={(e) => updateConfig({ size: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{config.size}px</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style de bordure</label>
                  <select
                    value={config.borderStyle}
                    onChange={(e) => updateConfig({ borderStyle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="classic">Classique</option>
                    <option value="neon">Néon</option>
                    <option value="minimal">Minimal</option>
                    <option value="luxury">Luxe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur de bordure</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.customBorderColor || '#FFD700'}
                      onChange={(e) => updateConfig({ customBorderColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.customBorderColor || '#FFD700'}
                      onChange={(e) => updateConfig({ customBorderColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Largeur de bordure</label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={config.customBorderWidth || 20}
                    onChange={(e) => updateConfig({ customBorderWidth: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{config.customBorderWidth || 20}px</span>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.showBulbs || false}
                      onChange={(e) => updateConfig({ showBulbs: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Afficher les ampoules décoratives</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur primaire</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.brandColors.primary}
                      onChange={(e) => updateConfig({ brandColors: { ...config.brandColors, primary: e.target.value } })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.brandColors.primary}
                      onChange={(e) => updateConfig({ brandColors: { ...config.brandColors, primary: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={config.customButton.text}
                    onChange={(e) => updateConfig({ customButton: { ...config.customButton, text: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur du bouton</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.customButton.color}
                      onChange={(e) => updateConfig({ customButton: { ...config.customButton, color: e.target.value } })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.customButton.color}
                      onChange={(e) => updateConfig({ customButton: { ...config.customButton, color: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position du bouton</label>
                  <select
                    value={config.buttonPosition}
                    onChange={(e) => updateConfig({ buttonPosition: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="top">Haut</option>
                    <option value="bottom">Bas</option>
                    <option value="left">Gauche</option>
                    <option value="right">Droite</option>
                    <option value="center">Centre</option>
                  </select>
                </div>
              </div>
            )}

            {/* Onglet Comportement */}
            {activeTab === 'behavior' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Paramètres de jeu</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode de rotation</label>
                  <select
                    value={config.spinMode}
                    onChange={(e) => updateConfig({ spinMode: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="random">Aléatoire</option>
                    <option value="probability">Basé sur les probabilités</option>
                    <option value="instant_winner">Gagnant instantané</option>
                  </select>
                </div>

                {config.spinMode === 'instant_winner' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Probabilité de gagner (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.winProbability}
                      onChange={(e) => updateConfig({ winProbability: Number(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600">{config.winProbability}%</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vitesse de rotation</label>
                  <select
                    value={config.speed}
                    onChange={(e) => updateConfig({ speed: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="slow">Lente</option>
                    <option value="medium">Moyenne</option>
                    <option value="fast">Rapide</option>
                  </select>
                </div>
              </div>
            )}

            {/* Onglet Formulaire */}
            {activeTab === 'form' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Champs du formulaire de participation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configurez les champs que les participants devront remplir avant de jouer.
                </p>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {config.formFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => {
                            const newFields = [...config.formFields];
                            newFields[index].label = e.target.value;
                            updateConfig({ formFields: newFields });
                          }}
                          placeholder="Label du champ"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const newFields = [...config.formFields];
                            newFields[index].type = e.target.value as any;
                            updateConfig({ formFields: newFields });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="text">Texte</option>
                          <option value="email">Email</option>
                          <option value="tel">Téléphone</option>
                          <option value="textarea">Zone de texte</option>
                          <option value="checkbox">Case à cocher</option>
                        </select>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => {
                              const newFields = [...config.formFields];
                              newFields[index].required = e.target.checked;
                              updateConfig({ formFields: newFields });
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">Champ obligatoire</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prévisualisation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">👁️ Prévisualisation</h3>
            <div className="flex items-center justify-center min-h-[600px] bg-gray-50 rounded-lg">
              <SmartWheel
                segments={config.segments}
                theme={config.theme}
                size={config.size}
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
                isMode1={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
