import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY manquant" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("image");
    const style = (form.get("style") || "professionnel").toString();

    if (!file) {
      return NextResponse.json({ error: "Image requise" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const client = new OpenAI({ apiKey });

    const prompt = `Analyse l’image fournie, extrais les informations clés (sans recopier mot à mot), puis rédige un post LinkedIn original en français.\n- Ton: ${style}.\n- Style clair et concret (5–10 lignes).\n- Utilise des émojis avec parcimonie.\n- Ajoute 3–6 hashtags pertinents à la fin.\n- Si le contenu est technique, vulgarise brièvement.\n- Évite toute donnée sensible ou confidentielle.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: "Tu es un copywriter LinkedIn concis et percutant." },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || "";
    return NextResponse.json({ post: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
