import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { GenerationResult, AppIdea, LinkedInProfile } from "@/lib/types";
import { resultsStore } from "@/lib/stores"; // shared in-memory store (moved out of route to satisfy Next.js exports)

const OPENAI_SYSTEM_PROMPT = `Tu es un expert en génération d'idées d'applications SaaS personnalisées basées sur les profils LinkedIn.

Tu dois analyser le profil LinkedIn fourni et générer EXACTEMENT 6 idées d'applications SaaS pertinentes et personnalisées.

Pour chaque idée, tu dois fournir:
- name: Nom accrocheur de l'app EN FRANÇAIS (ex: "RevueCodeIA", "VisuDonnéesIA", "AssistantRH")
- tagline: Courte description en une phrase (ex: "Optimisez vos revues de code")
- description: Description détaillée de l'app en 1-2 phrases
- matchScore: Score de compatibilité entre 80 et 95 (entier)
- mrr: Revenu mensuel estimé (ex: "2K€")
- mrrClients: Nombre de clients pour atteindre ce MRR (ex: 40)
- mvpTime: Temps pour créer un MVP (ex: "1 semaine", "2 semaines")
- effort: Niveau d'effort "Faible", "Moyen" ou "Élevé"
- targetAudience: Public cible en quelques mots (ex: "Développeurs...", "PME et startup...")

Les idées doivent être:
1. Réalistes et réalisables avec un agent IA
2. Adaptées aux compétences et à l'expérience du profil
3. Variées (différents secteurs/problèmes)
4. Avec un potentiel de revenus récurrents

Réponds UNIQUEMENT avec un JSON valide contenant un tableau "apps" de 6 objets.`;

async function fetchLinkedInProfile(linkedinUrl: string): Promise<LinkedInProfile | null> {
  const UNIPILE_API_KEY = process.env.UNIPILE_API_KEY;
  const UNIPILE_DSN = process.env.UNIPILE_DSN || "api1.unipile.com:13111";
  
  if (!UNIPILE_API_KEY) {
    console.log("UNIPILE_API_KEY not set, using URL parsing fallback");
    return null;
  }

  try {
    const urlParts = linkedinUrl.split("/in/");
    const profileId = urlParts[1]?.split("/")[0]?.split("?")[0];
    
    if (!profileId) {
      console.error("Could not extract profile ID from URL");
      return null;
    }

    console.log("Fetching LinkedIn profile:", profileId);

    // First, get the account ID
    const accountsResponse = await fetch(`https://${UNIPILE_DSN}/api/v1/accounts`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-API-KEY": UNIPILE_API_KEY,
      },
    });

    if (!accountsResponse.ok) {
      console.error("Failed to fetch Unipile accounts");
      return null;
    }

    const accountsData = await accountsResponse.json();
    const linkedinAccount = accountsData.items?.find((acc: { type: string }) => acc.type === "LINKEDIN");
    
    if (!linkedinAccount) {
      console.error("No LinkedIn account connected to Unipile");
      return null;
    }

    const accountId = linkedinAccount.id;
    console.log("Using Unipile account:", accountId);

    // Fetch the profile with all sections
    const response = await fetch(`https://${UNIPILE_DSN}/api/v1/users/${profileId}?account_id=${accountId}&linkedin_sections=*`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-API-KEY": UNIPILE_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unipile API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log("LinkedIn profile fetched successfully:", data.first_name, data.last_name);
    console.log("Work experiences found:", data.work_experience_total_count);
    console.log("Education found:", data.education_total_count);

    // Extract education
    const education = data.education?.map((edu: { degree?: string; school?: string; field_of_study?: string }) => ({
      degree: edu.degree || "",
      school: edu.school || "",
      fieldOfStudy: edu.field_of_study || "",
    })) || [];

    // Extract work experiences (Unipile uses 'position' not 'title', and 'company' not 'company_name')
    const experiences = data.work_experience?.map((exp: { position?: string; company?: string; description?: string; location?: string }) => ({
      title: exp.position || "",
      company: exp.company || "",
      description: exp.description || exp.location || "",
    })) || [];

    // Extract skills
    const skills = data.skills?.map((s: { name?: string } | string) => 
      typeof s === "string" ? s : s.name || ""
    ) || [];

    return {
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      headline: data.headline || "",
      summary: data.summary || "",
      skills,
      experiences,
      education,
    };
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    return null;
  }
}

async function generateAppIdeas(profile: LinkedInProfile | null, linkedinUrl: string): Promise<AppIdea[]> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY not set, using demo data");
    return generateDemoApps();
  }

  const profileContext = profile
    ? `Prénom: ${profile.firstName}
Nom: ${profile.lastName}
Titre actuel: ${profile.headline || "Non spécifié"}
Résumé: ${profile.summary || "Non spécifié"}
Compétences: ${profile.skills?.join(", ") || "Non spécifiées"}

HISTORIQUE COMPLET DES EXPÉRIENCES PROFESSIONNELLES (${profile.experiences?.length || 0} postes):
${profile.experiences?.map((e, i) => `${i + 1}. ${e.title} chez ${e.company}`).join("\n") || "Non spécifiées"}

FORMATIONS ET DIPLÔMES (${profile.education?.length || 0}):
${profile.education?.map((e, i) => `${i + 1}. ${e.degree} - ${e.school}`).join("\n") || "Non spécifiées"}

IMPORTANT: Base tes idées d'apps sur L'ENSEMBLE de la carrière et des formations, pas seulement le poste actuel.`
    : `URL LinkedIn: ${linkedinUrl} (profil non accessible, génère des idées génériques pour un professionnel tech)`;
  
  console.log("Profile context sent to OpenAI:", profileContext);

  try {
    console.log("Generating app ideas with OpenAI...");
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: OPENAI_SYSTEM_PROMPT },
          { role: "user", content: `Analyse ce profil LinkedIn et génère 6 idées d'applications SaaS personnalisées:\n\n${profileContext}` },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return generateDemoApps();
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in OpenAI response");
      return generateDemoApps();
    }

    const parsed = JSON.parse(content);
    console.log("Generated", parsed.apps?.length || 0, "app ideas");
    
    return parsed.apps || generateDemoApps();
  } catch (error) {
    console.error("Error generating app ideas:", error);
    return generateDemoApps();
  }
}

function generateDemoApps(): AppIdea[] {
  return [
    {
      name: "RevueCodeIA",
      tagline: "Optimisez vos revues de code",
      description: "Une plateforme qui utilise l'IA pour améliorer la qualité des revues de code.",
      matchScore: 90,
      mrr: "2K€",
      mrrClients: 40,
      mvpTime: "1 semaine",
      effort: "Faible",
      targetAudience: "Développeurs...",
    },
    {
      name: "CréateurCV",
      tagline: "Créez un CV qui attire l'attention",
      description: "Un outil qui génère des CV optimisés par l'IA pour les chercheurs d'emploi.",
      matchScore: 89,
      mrr: "2K€",
      mrrClients: 40,
      mvpTime: "1 semaine",
      effort: "Faible",
      targetAudience: "Chercheurs d'...",
    },
    {
      name: "FormationIA",
      tagline: "Apprenez l'IA à votre rythme",
      description: "Une plateforme d'apprentissage en ligne pour les développeurs souhaitant se former à l'IA.",
      matchScore: 88,
      mrr: "2K€",
      mrrClients: 40,
      mvpTime: "2 semaines",
      effort: "Moyen",
      targetAudience: "Développeurs...",
    },
    {
      name: "DétecteurBugs",
      tagline: "Détectez et corrigez les bugs plus rapidement",
      description: "Une application qui utilise l'IA pour identifier et prioriser les bugs dans le code.",
      matchScore: 87,
      mrr: "2K€",
      mrrClients: 40,
      mvpTime: "1 semaine",
      effort: "Faible",
      targetAudience: "Développeurs...",
    },
    {
      name: "VisuDonnées",
      tagline: "Visualisez vos données intelligemment",
      description: "Une plateforme qui génère des visualisations de données dynamiques grâce à l'IA.",
      matchScore: 86,
      mrr: "2K€",
      mrrClients: 40,
      mvpTime: "2 semaines",
      effort: "Moyen",
      targetAudience: "Analystes de d...",
    },
    {
      name: "AssistantChat",
      tagline: "Un assistant intelligent pour vos utilisateurs",
      description: "Créez des chatbots alimentés par l'IA pour améliorer l'engagement client.",
      matchScore: 85,
      mrr: "2K€",
      mrrClients: 40,
      mvpTime: "2 semaines",
      effort: "Moyen",
      targetAudience: "PME et startup...",
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json();

    if (!linkedinUrl || !linkedinUrl.includes("linkedin.com")) {
      return NextResponse.json(
        { error: "URL LinkedIn invalide" },
        { status: 400 }
      );
    }

    const id = uuidv4();

    // Determine name from LinkedIn profile or URL slug
    let userName = "Utilisateur";

    // Always try to fetch profile for app idea generation
    const profile = await fetchLinkedInProfile(linkedinUrl);

    if (profile?.firstName) {
      userName = `${profile.firstName} ${profile.lastName}`.trim();
    } else {
      const slug = linkedinUrl.split("/").filter(Boolean).pop() || "";
      userName = slug.replace(/[-_]/g, " ").split("?")[0] || "Utilisateur";
      userName = userName
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
        .replace(/[0-9]+/g, "")
        .trim();
      if (!userName) userName = "Utilisateur";
    }

    // Initialize result
    const result: GenerationResult = {
      id,
      linkedinUrl,
      userName,
      apps: [],
      createdAt: new Date().toISOString(),
      status: "processing",
      profileSummary: profile?.headline,
    };

    resultsStore.set(id, result);

    // Generate app ideas
    const apps = await generateAppIdeas(profile, linkedinUrl);
    result.apps = apps;
    result.status = "completed";

    resultsStore.set(id, result);

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const data = resultsStore.get(id);

  if (!data) {
    return NextResponse.json({ error: "Données non trouvées" }, { status: 404 });
  }

  return NextResponse.json(data);
}
