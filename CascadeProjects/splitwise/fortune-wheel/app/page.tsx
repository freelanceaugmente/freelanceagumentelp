import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <main className="flex flex-col items-center justify-center gap-8 text-center p-8">
        <div className="text-8xl mb-4">🎡</div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Roue de la Fortune
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Créez et configurez votre jeu de roue de la fortune personnalisé avec une interface d'administration complète et une interface live intégrable en iframe.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/admin"
            className="px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            🔧 Interface d'Administration
          </Link>
          <Link
            href="/live"
            className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            🎮 Interface Live (Joueurs)
          </Link>
          <Link
            href="/test-iframe"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            🧪 Test Iframe
          </Link>
        </div>
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">✨ Fonctionnalités</h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li>✅ Configuration complète des segments (lots, couleurs, probabilités)</li>
            <li>✅ Personnalisation visuelle (bordures, couleurs, boutons)</li>
            <li>✅ Formulaire de participation personnalisable</li>
            <li>✅ Interface live intégrable en iframe</li>
            <li>✅ Modes de jeu multiples (aléatoire, probabilités, gagnant instantané)</li>
            <li>✅ Design responsive et moderne</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
