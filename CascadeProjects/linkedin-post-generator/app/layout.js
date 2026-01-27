import "./globals.css";

export const metadata = {
  title: "LinkedIn Post Generator",
  description: "Génère des posts LinkedIn à partir d’images (screenshots)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
