import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const SYSTEM_PROMPT = `Tu es un expert en création de présentations professionnelles HTML/CSS pour SaaS.

## 🎯 CONTEXTE
Tu génères des slides HTML pour une plateforme de formation en entrepreneuriat et revenus passifs.
Chaque slide doit être autonome, responsive, et suivre un design system strict.

## 🎨 DESIGN SYSTEM

### Palette de Couleurs
- Fond principal : #1A1A1A (noir très foncé)
- Texte principal : #FFFFFF (blanc)
- Accent primaire : #FF4500 (orange vif)
- Texte secondaire : #CCCCCC (gris clair)
- Bordures : #333333 (gris foncé)
- Fond cartes : #222222 (noir légèrement plus clair)

### Typographie
- Titres : Police 'Mersad' (custom), 48-64px, text-transform: uppercase, font-weight: normal
- Sous-titres : Police 'Inter', 18-24px, color: #FF4500, uppercase, letter-spacing: 2px
- Corps : Police 'Inter', 14-20px, font-weight: 400-600, color: #CCCCCC ou #FFFFFF
- Tous les titres DOIVENT être en MAJUSCULES

### Dimensions Fixes
- Largeur : 1280px
- Hauteur : min-height 720px
- Padding standard : 60px 80px

Tu dois générer du contenu personnalisé basé sur le profil LinkedIn de l'utilisateur.
Retourne UNIQUEMENT le code HTML complet, sans explications.`;

interface SlideData {
  id: string;
  linkedinUrl: string;
  userName: string;
  userEmail: string;
  slides: string[];
  createdAt: string;
  manusTaskId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Shared store - exported for webhook access
export const slidesStore = new Map<string, SlideData>();

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl, email } = await request.json();

    if (!linkedinUrl || !linkedinUrl.includes("linkedin.com")) {
      return NextResponse.json(
        { error: "URL LinkedIn invalide" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // Extract username from LinkedIn URL
    const urlParts = linkedinUrl.split("/");
    const userName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || "Utilisateur";

    const id = uuidv4();

    const slideData: SlideData = {
      id,
      linkedinUrl,
      userName: userName.charAt(0).toUpperCase() + userName.slice(1),
      userEmail: email,
      slides: [],
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store the data (in production, use a database)
    slidesStore.set(id, slideData);

    // If MANUS_API_KEY is set, create Manus task (async - don't wait)
    if (process.env.MANUS_API_KEY) {
      console.log("🚀 Creating Manus task for:", slideData.userName);
      
      const notificationEmail = email;
      const webhookUrl = process.env.WEBHOOK_URL || "";
      
      const taskPrompt = `Tu es un expert en analyse de profils LinkedIn et en génération de présentations HTML.

## MISSION CRITIQUE - À EXÉCUTER AUTOMATIQUEMENT
1. Va sur ce profil LinkedIn: ${linkedinUrl}
2. Analyse le profil complet (expérience, compétences, formation)
3. Génère 7 slides HTML personnalisées
4. **EXÉCUTE AUTOMATIQUEMENT** l'envoi via webhook ET email - NE PAS JUSTE MONTRER LES COMMANDES

## ⚠️ LIVRAISON AUTOMATIQUE OBLIGATOIRE

### Étape FINALE 1: Webhook (EXÉCUTER IMMÉDIATEMENT)
Tu DOIS exécuter cette commande curl AUTOMATIQUEMENT à la fin de ta tâche:
\`\`\`bash
curl -X POST "${webhookUrl}" -H "Content-Type: application/json" -d @webhook_payload.json
\`\`\`

Crée d'abord le fichier webhook_payload.json avec ce format:
{"taskId": "${id}", "slides": ["<slide1 HTML>", "<slide2 HTML>", ...], "userName": "[Prénom Nom extrait]"}

### Étape FINALE 2: Email (ENVOYER AUTOMATIQUEMENT)
Envoie AUTOMATIQUEMENT le fichier slides.json par email à: ${notificationEmail}
Utilise la fonction d'envoi d'email intégrée.

## DESIGN SYSTEM
- Fond: #1A1A1A, Accent: #FF4500, Texte: #FFFFFF/#CCCCCC
- Dimensions: 1280px x 720px
- Police: 'Mersad' pour titres, 'Inter' pour corps
- Footer: "FreelanceAugmenté.fr • Vise la Lune" + numéro page

## LES 7 SLIDES HTML À GÉNÉRER
1. COVER - "Analyse pour [Prénom Nom]" + titre principal
2. PILLARS - 3 raisons personnalisées de réussir basées sur le profil
3. TIER1 - 3 apps SaaS adaptées (90-100% compatibilité) avec MRR
4. TIER2 - 3 apps complémentaires (70-89%)
5. CARDS - Grille 3x2 des 6 apps avec détails
6. ROADMAP - Plan 3 mois personnalisé
7. CTA - Call to action final avec QR code

## FORMAT JSON REQUIS
{"slides":["<!DOCTYPE html><html lang=\\"fr\\"><head>...</head><body>...</body></html>", ...]}

🚨 RAPPEL FINAL: Tu DOIS EXÉCUTER le curl ET envoyer l'email AUTOMATIQUEMENT. Ne termine pas sans avoir fait ces 2 actions.`;

      try {
        const createResponse = await fetch("https://api.manus.ai/v1/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.MANUS_API_KEY,
          },
          body: JSON.stringify({
            prompt: taskPrompt,
            agentProfile: "manus-1.6",
            mode: "agent",
            interactive: false, // Complete without follow-up questions
          }),
        });

        if (createResponse.ok) {
          const taskData = await createResponse.json();
          console.log("✅ Manus task created:", taskData.task_id);
          slideData.manusTaskId = taskData.task_id;
          slideData.status = 'processing';
        } else {
          const errorText = await createResponse.text();
          console.error("❌ Manus API error:", createResponse.status, errorText);
          slideData.status = 'failed';
        }
      } catch (error) {
        console.error("❌ Manus API fetch error:", error);
        slideData.status = 'failed';
      }
    } else {
      console.log("⚠️ MANUS_API_KEY not set");
      slideData.status = 'failed';
    }

    slidesStore.set(id, slideData);

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

  const data = slidesStore.get(id);

  if (!data) {
    return NextResponse.json({ error: "Données non trouvées" }, { status: 404 });
  }

  // If processing, check Manus task status
  if (data.status === 'processing' && data.manusTaskId && process.env.MANUS_API_KEY) {
    try {
      const statusResponse = await fetch(`https://api.manus.ai/v1/tasks/${data.manusTaskId}`, {
        method: "GET",
        headers: {
          "API_KEY": process.env.MANUS_API_KEY,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log(`📊 Manus task ${data.manusTaskId} status:`, statusData.status);

        if (statusData.status === "completed" || statusData.status === "stopped") {
          console.log("📦 Full Manus response keys:", Object.keys(statusData));
          
          let slidesFound = false;
          
          // Method 1: Check output array for files with fileUrl (Manus API format)
          if (statusData.output && Array.isArray(statusData.output)) {
            console.log("📁 Checking", statusData.output.length, "output items from Manus");
            
            for (const outputItem of statusData.output) {
              if (outputItem.content && Array.isArray(outputItem.content)) {
                for (const contentItem of outputItem.content) {
                  // Check for file with slides
                  if (contentItem.fileUrl && (contentItem.fileName?.includes('slides') || contentItem.fileName?.includes('webhook'))) {
                    console.log(`📥 Found file: ${contentItem.fileName} at ${contentItem.fileUrl}`);
                    
                    try {
                      const fileResponse = await fetch(contentItem.fileUrl);
                      if (fileResponse.ok) {
                        const fileContent = await fileResponse.text();
                        console.log(`📄 File content length: ${fileContent.length}`);
                        
                        // Try to parse as JSON
                        try {
                          const parsed = JSON.parse(fileContent);
                          if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                            data.slides = parsed.slides;
                            data.status = 'completed';
                            slidesFound = true;
                            console.log(`✅ Found ${data.slides.length} slides from file ${contentItem.fileName}`);
                            break;
                          }
                        } catch (e) {
                          console.log(`⚠️ Could not parse ${contentItem.fileName} as JSON`);
                        }
                      }
                    } catch (e) {
                      console.log(`❌ Error fetching file: ${e}`);
                    }
                  }
                  
                  // Check for text content with slides
                  if (contentItem.text && contentItem.text.includes('"slides"')) {
                    const match = contentItem.text.match(/\{"slides"\s*:\s*\[[\s\S]*?\]\}/);
                    if (match) {
                      try {
                        const parsed = JSON.parse(match[0]);
                        if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                          data.slides = parsed.slides;
                          data.status = 'completed';
                          slidesFound = true;
                          console.log(`✅ Found ${data.slides.length} slides in output text`);
                          break;
                        }
                      } catch (e) {}
                    }
                  }
                }
                if (slidesFound) break;
              }
            }
          }
          
          // Method 2: Search entire response for slides pattern
          if (!slidesFound) {
            const fullResponseStr = JSON.stringify(statusData);
            console.log("📦 Searching full response, length:", fullResponseStr.length);
            
            // Look for fileUrl patterns
            const fileUrlMatches = fullResponseStr.match(/"fileUrl"\s*:\s*"([^"]+)"/g);
            if (fileUrlMatches) {
              console.log(`🔗 Found ${fileUrlMatches.length} file URLs`);
              for (const match of fileUrlMatches) {
                const urlMatch = match.match(/"fileUrl"\s*:\s*"([^"]+)"/);
                if (urlMatch && urlMatch[1]) {
                  const fileUrl = urlMatch[1].replace(/\\/g, '');
                  if (fileUrl.includes('slides') || fileUrl.includes('webhook') || fileUrl.endsWith('.json')) {
                    console.log(`📥 Fetching: ${fileUrl}`);
                    try {
                      const fileResponse = await fetch(fileUrl);
                      if (fileResponse.ok) {
                        const fileContent = await fileResponse.text();
                        const parsed = JSON.parse(fileContent);
                        if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                          data.slides = parsed.slides;
                          data.status = 'completed';
                          slidesFound = true;
                          console.log(`✅ Found ${data.slides.length} slides from ${fileUrl}`);
                          break;
                        }
                      }
                    } catch (e) {
                      console.log(`⚠️ Error with ${fileUrl}: ${e}`);
                    }
                  }
                }
              }
            }
          }
          
          // Method 3: Direct JSON pattern search
          if (!slidesFound) {
            const fullResponseStr = JSON.stringify(statusData);
            const slidesJsonMatch = fullResponseStr.match(/\{"slides"\s*:\s*\[[\s\S]*?\]\s*\}/g);
            if (slidesJsonMatch && slidesJsonMatch.length > 0) {
              const longestMatch = slidesJsonMatch.reduce((a, b) => a.length > b.length ? a : b);
              try {
                let cleanJson = longestMatch.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                const parsed = JSON.parse(cleanJson);
                if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                  data.slides = parsed.slides;
                  data.status = 'completed';
                  slidesFound = true;
                  console.log("✅ Found slides via pattern matching");
                }
              } catch (e) {}
            }
          }
          
          if (!slidesFound) {
            console.log("⚠️ No valid slides found in Manus response, using demo");
            data.status = 'completed';
            data.slides = generateDemoSlides(data.userName);
          }
          
          slidesStore.set(id, data);
        } else if (statusData.status === "failed") {
          console.error("❌ Manus task failed");
          data.status = 'failed';
          data.slides = generateDemoSlides(data.userName);
          slidesStore.set(id, data);
        }
        // If still running, status stays 'processing'
      }
    } catch (error) {
      console.error("❌ Error checking Manus status:", error);
    }
  }

  return NextResponse.json(data);
}

function generateDemoSlides(userName: string): string[] {
  return [
    // Slide 1: Cover
    `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf'); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #1A1A1A; color: #FFFFFF; }
        .slide-container { width: 1280px; min-height: 720px; background-color: #1A1A1A; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 80px; }
        .subtitle { font-size: 18px; color: #CCCCCC; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 20px; }
        .main-title { font-family: 'Mersad', sans-serif; font-size: 56px; text-transform: uppercase; color: #FF4500; text-align: center; line-height: 1.2; margin-bottom: 30px; }
        .description { font-size: 20px; color: #CCCCCC; text-align: center; max-width: 700px; }
        .moon { position: absolute; top: 40px; right: 60px; width: 150px; height: 150px; }
        .branding-footer { position: absolute; bottom: 30px; left: 80px; display: flex; align-items: center; gap: 10px; }
        .brand-logo { width: 20px; height: 20px; background: #FF4500; border-radius: 50%; }
        .brand-text { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .page-number { position: absolute; bottom: 30px; right: 80px; font-size: 14px; color: #333; font-weight: 700; }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="/lune_orange.png" alt="Lune" class="moon">
        <p class="subtitle">Analyse pour ${userName}</p>
        <h1 class="main-title">VOTRE FEUILLE DE<br>ROUTE<br>VERS LES REVENUS<br>PASSIFS<br>AVEC L'IA</h1>
        <p class="description">6 Applications prêtes à être lancées avec un agent IA qui dev à votre place</p>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugmenté.fr • Vise la Lune</span>
        </div>
        <div class="page-number">01 / 07</div>
    </div>
</body>
</html>`,

    // Slide 2: Pillars
    `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf'); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #1A1A1A; color: #FFFFFF; }
        .slide-container { width: 1280px; min-height: 720px; background-color: #1A1A1A; position: relative; padding: 60px 80px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .main-title { font-family: 'Mersad', sans-serif; font-size: 42px; }
        .subtitle { font-size: 18px; color: #FF4500; text-transform: uppercase; letter-spacing: 2px; }
        .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 40px; }
        .pillar { background: #F5F5F5; border-radius: 8px; padding: 40px 30px; text-align: center; color: #1A1A1A; }
        .pillar.highlight { border-top: 4px solid #FF4500; }
        .pillar-icon { font-size: 36px; margin-bottom: 20px; }
        .pillar-title { font-size: 20px; font-weight: 700; margin-bottom: 15px; }
        .pillar-desc { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 30px; }
        .pillar-key { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #DDD; padding-top: 20px; }
        .branding-footer { position: absolute; bottom: 30px; left: 80px; display: flex; align-items: center; gap: 10px; }
        .brand-logo { width: 20px; height: 20px; background: #FF4500; border-radius: 50%; }
        .brand-text { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .page-number { position: absolute; bottom: 30px; right: 80px; font-size: 14px; color: #333; font-weight: 700; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header">
            <h1 class="main-title">Pourquoi Vous Allez Réussir</h1>
            <span class="subtitle">La Triade Gagnante</span>
        </div>
        <div class="pillars">
            <div class="pillar">
                <div class="pillar-icon">&lt;/&gt;</div>
                <h3 class="pillar-title">Tech & Vibecoding</h3>
                <p class="pillar-desc">Vous ne dépendez de personne pour construire. Là où d'autres cherchent un CTO, vous codez et déployez.</p>
                <p class="pillar-key">Vitesse d'exécution</p>
            </div>
            <div class="pillar highlight">
                <div class="pillar-icon">🔄</div>
                <h3 class="pillar-title">Expertise Agile</h3>
                <p class="pillar-desc">Vous savez gérer l'incertitude et itérer. C'est l'essence même du lancement de SaaS : Build, Measure, Learn.</p>
                <p class="pillar-key">Méthode éprouvée</p>
            </div>
            <div class="pillar">
                <div class="pillar-icon">💡</div>
                <h3 class="pillar-title">Esprit Entrepreneur</h3>
                <p class="pillar-desc">Votre expérience de coach montre que vous comprenez les besoins humains derrière la technique.</p>
                <p class="pillar-key">Vision produit</p>
            </div>
        </div>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugmenté.fr • Vise la Lune</span>
        </div>
        <div class="page-number">02 / 07</div>
    </div>
</body>
</html>`,

    // Slide 3: Tier 1 Apps
    `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf'); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #F5F5F5; color: #1A1A1A; }
        .slide-container { width: 1280px; min-height: 720px; background-color: #F5F5F5; position: relative; padding: 60px 80px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .main-title { font-family: 'Mersad', sans-serif; font-size: 42px; }
        .subtitle { font-size: 16px; color: #FF4500; text-transform: uppercase; letter-spacing: 2px; }
        .apps { display: flex; flex-direction: column; gap: 20px; }
        .app { background: #FFFFFF; border-radius: 8px; padding: 30px; display: grid; grid-template-columns: 60px 1fr 150px; gap: 30px; align-items: center; border-left: 4px solid #FF4500; }
        .app-icon { font-size: 32px; background: #F5F5F5; width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .app-content h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .app-content p { font-size: 14px; color: #666; }
        .app-stats { text-align: right; }
        .stat-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 18px; font-weight: 700; color: #FF4500; }
        .stat-effort { font-size: 12px; color: #666; margin-top: 10px; }
        .branding-footer { position: absolute; bottom: 30px; left: 80px; display: flex; align-items: center; gap: 10px; }
        .brand-logo { width: 20px; height: 20px; background: #FF4500; border-radius: 50%; }
        .brand-text { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .page-number { position: absolute; bottom: 30px; right: 80px; font-size: 14px; color: #333; font-weight: 700; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header">
            <h1 class="main-title">Tier 1 - Les 3 Meilleures Applications</h1>
            <span class="subtitle">Compatibilité 90-100%</span>
        </div>
        <div class="apps">
            <div class="app">
                <div class="app-icon">🤖</div>
                <div class="app-content">
                    <h3>Agile Copilot (Assistant IA)</h3>
                    <p>Automatisez les tâches des Scrum Masters : résumés de Daily, alertes retards, insights JIRA. Un "Scrum Master augmenté".</p>
                </div>
                <div class="app-stats">
                    <p class="stat-label">MRR Potentiel</p>
                    <p class="stat-value">5k - 50k€</p>
                    <p class="stat-effort">Effort MVP: 8-12 heures</p>
                </div>
            </div>
            <div class="app">
                <div class="app-icon">🚀</div>
                <div class="app-content">
                    <h3>Vibecoding Studio</h3>
                    <p>Plateforme SaaS guidant l'utilisateur de l'idée au déploiement en 3h. Wizard interactif + Templates + Déploiement 1-clic.</p>
                </div>
                <div class="app-stats">
                    <p class="stat-label">MRR Potentiel</p>
                    <p class="stat-value">10k - 100k€</p>
                    <p class="stat-effort">Effort MVP: 10-15 heures</p>
                </div>
            </div>
            <div class="app">
                <div class="app-icon">🗺️</div>
                <div class="app-content">
                    <h3>Roadmap AI</h3>
                    <p>Générateur de roadmap produit intelligent. Priorisation automatique (RICE) et simulation de timeline réaliste.</p>
                </div>
                <div class="app-stats">
                    <p class="stat-label">MRR Potentiel</p>
                    <p class="stat-value">3k - 30k€</p>
                    <p class="stat-effort">Effort MVP: 5-8 heures</p>
                </div>
            </div>
        </div>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugmenté.fr • Vise la Lune</span>
        </div>
        <div class="page-number">03 / 07</div>
    </div>
</body>
</html>`,

    // Slide 4: Tier 2 Apps
    `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf'); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #F5F5F5; color: #1A1A1A; }
        .slide-container { width: 1280px; min-height: 720px; background-color: #F5F5F5; position: relative; padding: 60px 80px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .main-title { font-family: 'Mersad', sans-serif; font-size: 36px; }
        .subtitle { font-size: 16px; color: #FF4500; text-transform: uppercase; letter-spacing: 2px; }
        .apps { display: flex; flex-direction: column; gap: 20px; }
        .app { background: #FFFFFF; border-radius: 8px; padding: 30px; display: grid; grid-template-columns: 60px 1fr 150px; gap: 30px; align-items: center; border-left: 4px solid #333; }
        .app-icon { font-size: 32px; background: #F5F5F5; width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .app-content h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .app-content p { font-size: 14px; color: #666; }
        .app-stats { text-align: right; }
        .stat-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 18px; font-weight: 700; color: #FF4500; }
        .stat-effort { font-size: 12px; color: #666; margin-top: 10px; }
        .branding-footer { position: absolute; bottom: 30px; left: 80px; display: flex; align-items: center; gap: 10px; }
        .brand-logo { width: 20px; height: 20px; background: #FF4500; border-radius: 50%; }
        .brand-text { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .page-number { position: absolute; bottom: 30px; right: 80px; font-size: 14px; color: #333; font-weight: 700; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header">
            <h1 class="main-title">Tier 2 - Les 3 Applications Complémentaires</h1>
            <span class="subtitle">Compatibilité 70-89%</span>
        </div>
        <div class="apps">
            <div class="app">
                <div class="app-icon">📊</div>
                <div class="app-content">
                    <h3>Sprint Pulse</h3>
                    <p>Dashboard analytics pour équipes Agile. Connecté à JIRA, il prédit les retards et mesure la santé de l'équipe en temps réel.</p>
                </div>
                <div class="app-stats">
                    <p class="stat-label">MRR Potentiel</p>
                    <p class="stat-value">2k - 20k€</p>
                    <p class="stat-effort">Effort MVP: 6-10 heures</p>
                </div>
            </div>
            <div class="app">
                <div class="app-icon">🏪</div>
                <div class="app-content">
                    <h3>Templates Marketplace</h3>
                    <p>Plateforme d'achat/vente de templates SaaS pré-construits. Déploiement 1-clic pour les acheteurs, commission pour vous.</p>
                </div>
                <div class="app-stats">
                    <p class="stat-label">MRR Potentiel</p>
                    <p class="stat-value">5k - 50k€</p>
                    <p class="stat-effort">Effort MVP: 8-12 heures</p>
                </div>
            </div>
            <div class="app">
                <div class="app-icon">👥</div>
                <div class="app-content">
                    <h3>Agile Buddy</h3>
                    <p>Assistant de transformation Agile. Diagnostic automatique de l'organisation et génération d'un plan d'action personnalisé.</p>
                </div>
                <div class="app-stats">
                    <p class="stat-label">MRR Potentiel</p>
                    <p class="stat-value">3k - 25k€</p>
                    <p class="stat-effort">Effort MVP: 5-8 heures</p>
                </div>
            </div>
        </div>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugmenté.fr • Vise la Lune</span>
        </div>
        <div class="page-number">04 / 07</div>
    </div>
</body>
</html>`,

    // Slide 5: 6 Cards Grid
    `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf'); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #F5F5F5; color: #1A1A1A; }
        .slide-container { width: 1280px; min-height: 720px; background-color: #F5F5F5; position: relative; padding: 50px 60px; }
        .header { margin-bottom: 30px; }
        .main-title { font-family: 'Mersad', sans-serif; font-size: 36px; margin-bottom: 8px; }
        .header-subtitle { font-size: 16px; color: #666; }
        .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .card { background: #FFFFFF; border-radius: 8px; padding: 24px; }
        .card.highlight { border-top: 3px solid #FF4500; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card-title { font-size: 16px; font-weight: 700; }
        .card-price { font-size: 14px; color: #FF4500; font-weight: 600; }
        .card-list { list-style: none; margin-bottom: 16px; }
        .card-list li { font-size: 12px; color: #666; margin-bottom: 8px; padding-left: 16px; position: relative; }
        .card-list li::before { content: "→"; position: absolute; left: 0; color: #FF4500; }
        .card-footer { display: flex; justify-content: space-between; font-size: 11px; color: #999; text-transform: uppercase; border-top: 1px solid #EEE; padding-top: 12px; }
        .card-footer-value { color: #FF4500; font-weight: 600; }
        .branding-footer { position: absolute; bottom: 20px; left: 60px; display: flex; align-items: center; gap: 10px; }
        .brand-logo { width: 20px; height: 20px; background: #FF4500; border-radius: 50%; }
        .brand-text { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .page-number { position: absolute; bottom: 20px; right: 60px; font-size: 14px; color: #333; font-weight: 700; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header">
            <h1 class="main-title">Vos 6 Apps Compatibles</h1>
            <p class="header-subtitle">Comment lancer chaque outil dès demain</p>
        </div>
        <div class="cards-grid">
            <div class="card highlight">
                <div class="card-header">
                    <span class="card-title">Agile Copilot</span>
                    <span class="card-price">29€/mois</span>
                </div>
                <ul class="card-list">
                    <li>Connecter API JIRA + OpenAI.</li>
                    <li>Créer prompt "Daily Summary".</li>
                    <li>Lancer sur LinkedIn.</li>
                </ul>
                <div class="card-footer">
                    <span>Cible: Scrum Masters</span>
                    <span class="card-footer-value">5k - 50k€ MRR</span>
                </div>
            </div>
            <div class="card highlight">
                <div class="card-header">
                    <span class="card-title">Vibecoding Studio</span>
                    <span class="card-price">49€/mois</span>
                </div>
                <ul class="card-list">
                    <li>Créer wizard "Idée → Prompt".</li>
                    <li>Intégrer templates Next.js.</li>
                    <li>Partenariat influenceurs NoCode.</li>
                </ul>
                <div class="card-footer">
                    <span>Cible: Solopreneurs</span>
                    <span class="card-footer-value">10k - 100k€ MRR</span>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Roadmap AI</span>
                    <span class="card-price">19€/mois</span>
                </div>
                <ul class="card-list">
                    <li>Algo de scoring RICE simple.</li>
                    <li>Export PDF/PNG propre.</li>
                    <li>Cibler Product Managers.</li>
                </ul>
                <div class="card-footer">
                    <span>Cible: Product Managers</span>
                    <span class="card-footer-value">3k - 30k€ MRR</span>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Sprint Pulse</span>
                    <span class="card-price">39€/mois</span>
                </div>
                <ul class="card-list">
                    <li>Dashboard KPI simple.</li>
                    <li>Alerte email "Sprint à risque".</li>
                    <li>Vendre aux CTOs de scale-ups.</li>
                </ul>
                <div class="card-footer">
                    <span>Cible: CTOs / Tech Leads</span>
                    <span class="card-footer-value">2k - 20k€ MRR</span>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Templates Market</span>
                    <span class="card-price">99€/unité</span>
                </div>
                <ul class="card-list">
                    <li>Packager 3 templates SaaS.</li>
                    <li>Site vitrine (LemonSqueezy).</li>
                    <li>SEO "SaaS Boilerplate".</li>
                </ul>
                <div class="card-footer">
                    <span>Cible: Développeurs</span>
                    <span class="card-footer-value">5k - 50k€ MRR</span>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title">Agile Buddy</span>
                    <span class="card-price">15€/mois</span>
                </div>
                <ul class="card-list">
                    <li>Chatbot Guide Scrum.</li>
                    <li>Mode "Diagnostic d'équipe".</li>
                    <li>Lancer sur Slack Agile.</li>
                </ul>
                <div class="card-footer">
                    <span>Cible: Coachs Agiles</span>
                    <span class="card-footer-value">3k - 25k€ MRR</span>
                </div>
            </div>
        </div>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugmenté.fr • Vise la Lune</span>
        </div>
        <div class="page-number">05 / 07</div>
    </div>
</body>
</html>`,

    // Slide 6: Roadmap
    `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf'); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #1A1A1A; color: #FFFFFF; }
        .slide-container { width: 1280px; min-height: 720px; background-color: #1A1A1A; position: relative; padding: 60px 80px; }
        .main-title { font-family: 'Mersad', sans-serif; font-size: 42px; color: #FF4500; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #FF4500; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 50px; }
        .phases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .phase { background: #222; border-radius: 8px; padding: 30px; border-top: 4px solid #333; }
        .phase.active { border-top-color: #FF4500; }
        .phase-label { font-size: 12px; color: #FF4500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .phase-title { font-family: 'Mersad', sans-serif; font-size: 28px; margin-bottom: 20px; }
        .phase-list { list-style: none; margin-bottom: 30px; }
        .phase-list li { font-size: 14px; color: #CCC; margin-bottom: 12px; padding-left: 20px; position: relative; }
        .phase-list li::before { content: "→"; position: absolute; left: 0; color: #FF4500; }
        .phase-footer { border-top: 1px solid #333; padding-top: 20px; }
        .phase-footer-label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
        .phase-footer-value { font-size: 16px; color: #FF4500; font-weight: 600; }
        .bottom-message { text-align: center; margin-top: 40px; font-size: 16px; color: #CCC; }
        .bottom-message .highlight { color: #FF4500; }
        .branding-footer { position: absolute; bottom: 30px; left: 80px; display: flex; align-items: center; gap: 10px; }
        .brand-logo { width: 20px; height: 20px; background: #FF4500; border-radius: 50%; }
        .brand-text { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .page-number { position: absolute; bottom: 30px; right: 80px; font-size: 14px; color: #333; font-weight: 700; }
    </style>
</head>
<body>
    <div class="slide-container">
        <h1 class="main-title">VOTRE STRATÉGIE OPTIMALE - L'IA DEV POUR VOUS</h1>
        <p class="subtitle">Roadmap d'exécution sur 3 mois</p>
        <div class="phases">
            <div class="phase active">
                <p class="phase-label">Semaine 1</p>
                <h3 class="phase-title">BUILD MVP</h3>
                <ul class="phase-list">
                    <li>Créer l'environnement (3h).</li>
                    <li>Générer le code via IA (10h).</li>
                    <li>Déployer sur Coolify (2h).</li>
                </ul>
                <div class="phase-footer">
                    <p class="phase-footer-label">Objectif</p>
                    <p class="phase-footer-value">Produit En Ligne</p>
                </div>
            </div>
            <div class="phase">
                <p class="phase-label">Semaines 2-6</p>
                <h3 class="phase-title">FEEDBACK LOOP</h3>
                <ul class="phase-list">
                    <li>Lancer sur Reddit / Twitter.</li>
                    <li>Récolter 10 premiers avis.</li>
                    <li>Itérer sur les features clés.</li>
                </ul>
                <div class="phase-footer">
                    <p class="phase-footer-label">Objectif</p>
                    <p class="phase-footer-value">10 Premiers Clients</p>
                </div>
            </div>
            <div class="phase">
                <p class="phase-label">Semaines 7-12</p>
                <h3 class="phase-title">SCALE & GROWTH</h3>
                <ul class="phase-list">
                    <li>Campagnes Lemlist (Cold Email).</li>
                    <li>Enrichissement Jipup.</li>
                    <li>Publicités ciblées (Ads).</li>
                </ul>
                <div class="phase-footer">
                    <p class="phase-footer-label">Objectif</p>
                    <p class="phase-footer-value">Traction Récurrente</p>
                </div>
            </div>
        </div>
        <p class="bottom-message">Vous avez l'expertise. Vous avez le plan. <span class="highlight">Lancez votre première application cette semaine.</span></p>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugmenté.fr • Vise la Lune</span>
        </div>
        <div class="page-number">06 / 07</div>
    </div>
</body>
</html>`,

    // Slide 7: CTA
    `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        @font-face { font-family: 'Mersad'; src: url('/MersadBlack.otf'); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: #1A1A1A; color: #FFFFFF; }
        .slide-container { width: 1280px; min-height: 720px; background-color: #1A1A1A; position: relative; padding: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .content h1 { font-family: 'Mersad', sans-serif; font-size: 48px; line-height: 1.2; margin-bottom: 20px; }
        .content h1 .highlight { color: #FF4500; }
        .content p { font-size: 18px; color: #CCC; margin-bottom: 30px; max-width: 500px; }
        .benefits { list-style: none; margin-bottom: 40px; }
        .benefits li { font-size: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
        .benefits li::before { content: "✓"; color: #FF4500; font-weight: bold; }
        .cta-button { display: inline-block; background: #FF4500; color: white; font-size: 18px; font-weight: 700; padding: 18px 40px; border-radius: 8px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; }
        .qr-section { text-align: center; }
        .qr-code { width: 280px; height: 280px; border: 4px solid #FF4500; border-radius: 10px; margin-bottom: 20px; }
        .scan-label { font-family: 'Mersad', sans-serif; font-size: 24px; color: #FF4500; text-transform: uppercase; }
        .branding-footer { position: absolute; bottom: 30px; left: 80px; display: flex; align-items: center; gap: 10px; }
        .brand-logo { width: 20px; height: 20px; background: #FF4500; border-radius: 50%; }
        .brand-text { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .page-number { position: absolute; bottom: 30px; right: 80px; font-size: 14px; color: #333; font-weight: 700; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="content">
            <h1>VOUS AVEZ L'EXPERTISE.<br><span class="highlight">NOUS AVONS LE PLAN.</span></h1>
            <p>Rejoignez la communauté Freelance Augmenté pour transformer vos compétences en revenus récurrents.</p>
            <ul class="benefits">
                <li>Accès aux Templates & Outils No-Code</li>
                <li>Astuces pour lancer avec l'IA & générer des revenus passifs</li>
                <li>Réseau d'entrepreneurs Tech & Support</li>
            </ul>
            <a href="https://freelanceaugmente.fr" class="cta-button">Rejoindre le Mouvement</a>
        </div>
        <div class="qr-section">
            <img src="/qr_code_orange.png" alt="QR Code" class="qr-code">
            <p class="scan-label">SCAN ME</p>
        </div>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugmenté.fr • Vise la Lune</span>
        </div>
        <div class="page-number">07 / 07</div>
    </div>
</body>
</html>`,
  ];
}
