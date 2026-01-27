'use client';

import React from 'react';

export default function TestIframePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🧪 Test d'intégration iframe
        </h1>
        <p className="text-gray-600 mb-8">
          Cette page simule l'intégration de la roue de la fortune sur un site externe via iframe.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exemple d'intégration</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <code className="text-sm">
              {`<iframe src="http://localhost:3000/live" width="100%" height="900" frameborder="0" allowfullscreen></iframe>`}
            </code>
          </div>
          
          <div className="border-4 border-dashed border-gray-300 rounded-lg p-4">
            <p className="text-center text-gray-500 mb-4 text-sm">
              ⬇️ Voici comment la roue apparaîtra sur votre site ⬇️
            </p>
            <iframe
              src="/live"
              width="100%"
              height="900"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Roue de la Fortune"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-3">✅ Avantages de l'iframe</h3>
            <ul className="space-y-2 text-green-700">
              <li>• Isolation complète du contenu</li>
              <li>• Pas de conflit CSS avec votre site</li>
              <li>• Mise à jour automatique du contenu</li>
              <li>• Facile à intégrer (copier-coller)</li>
              <li>• Sécurisé et sandboxé</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🔒 Sécurité</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• L'interface admin n'est jamais visible</li>
              <li>• Seule la partie live est accessible</li>
              <li>• Configuration protégée</li>
              <li>• Données isolées par domaine</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-yellow-800 mb-3">💡 Conseils d'intégration</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• Ajustez la hauteur de l'iframe selon vos besoins (recommandé : 800-1000px)</li>
            <li>• Utilisez <code className="bg-yellow-100 px-2 py-1 rounded">width="100%"</code> pour un design responsive</li>
            <li>• Testez sur mobile et desktop</li>
            <li>• Configurez d'abord dans l'interface admin avant de publier</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
