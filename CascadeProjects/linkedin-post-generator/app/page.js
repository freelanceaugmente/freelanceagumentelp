"use client";
import { useState } from "react";

const STYLES = [
  { value: "professionnel", label: "Professionnel" },
  { value: "inspirant", label: "Inspirant" },
  { value: "humoristique", label: "Humoristique" },
  { value: "storytelling", label: "Storytelling" },
];

export default function Home() {
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState("professionnel");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onFiles = (files) => {
    const f = files?.[0];
    if (f && f.type.startsWith("image/")) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    onFiles(dt.files);
  };

  const onPaste = (e) => {
    const items = e.clipboardData?.files;
    if (items && items.length > 0) onFiles(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult("");
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("style", style);
      const res = await fetch("/api/generate", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.post || "");
    } catch (err) {
      setResult("Erreur: " + (err?.message || "inconnue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">LinkedIn Post Generator</h1>
        <p className="text-sm text-gray-600 mb-6">
          Uploadez un screenshot, choisissez un style, et générez un post.
        </p>

        <form onSubmit={handleSubmit} onPaste={onPaste}>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-white"
          >
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <label
              htmlFor="image"
              className="cursor-pointer px-4 py-2 rounded bg-gray-900 text-white"
            >
              Choisir une image
            </label>
            <p className="text-sm text-gray-500">
              ou glissez-déposez, ou collez (Cmd/Ctrl+V)
            </p>
            {file && (
              <div className="mt-3 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{file.name}</span>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => setFile(null)}
                  >
                    Retirer
                  </button>
                </div>
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="max-h-60 rounded"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Style d’écriture
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white"
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!file || loading}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              >
                {loading ? "Génération…" : "Générer"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Résultat</label>
          <textarea
            readOnly
            value={result}
            className="w-full h-56 border rounded p-3 bg-white"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1.5 rounded bg-gray-200"
            >
              Copier
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
