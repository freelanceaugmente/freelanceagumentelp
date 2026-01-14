"use strict";exports.id=47,exports.ids=[47],exports.modules={6047:(e,s,t)=>{t.r(s),t.d(s,{GET:()=>r,POST:()=>o,slidesStore:()=>l});var a=t(7070),i=t(8547);let l=new Map;async function o(e){try{let{linkedinUrl:s,email:t}=await e.json();if(!s||!s.includes("linkedin.com"))return a.NextResponse.json({error:"URL LinkedIn invalide"},{status:400});if(!t||!t.includes("@"))return a.NextResponse.json({error:"Email invalide"},{status:400});let o=s.split("/"),r=o[o.length-1]||o[o.length-2]||"Utilisateur",n=(0,i.Z)(),p={id:n,linkedinUrl:s,userName:r.charAt(0).toUpperCase()+r.slice(1),userEmail:t,slides:[],createdAt:new Date().toISOString(),status:"pending"};if(l.set(n,p),process.env.MANUS_API_KEY){console.log("\uD83D\uDE80 Creating Manus task for:",p.userName);let e=process.env.WEBHOOK_URL||"",a=`Tu es un expert en analyse de profils LinkedIn et en g\xe9n\xe9ration de pr\xe9sentations HTML.

## MISSION
1. Va sur ce profil LinkedIn: ${s}
2. Analyse le profil complet (exp\xe9rience, comp\xe9tences, formation)
3. G\xe9n\xe8re 7 slides HTML personnalis\xe9es
4. ENVOIE le JSON via webhook ET par email

## LIVRAISON OBLIGATOIRE - 2 M\xc9THODES

### M\xe9thode 1: Webhook (PRIORITAIRE)
Ex\xe9cute cette commande curl pour envoyer les slides:
\`\`\`bash
curl -X POST "${e}" \\
  -H "Content-Type: application/json" \\
  -d '{"taskId": "TASK_ID_PLACEHOLDER", "slides": [...tes slides ici...]}'
\`\`\`
Remplace TASK_ID_PLACEHOLDER par ton task_id actuel.

### M\xe9thode 2: Email (backup)
Envoie aussi le fichier JSON \xe0 ${t}

## DESIGN SYSTEM
- Fond: #1A1A1A, Accent: #FF4500, Texte: #FFFFFF/#CCCCCC
- Dimensions: 1280px x 720px
- Police: 'Mersad' pour titres (@font-face src: url('/MersadBlack.otf')), 'Inter' pour corps
- Footer: "FreelanceAugment\xe9.fr • Vise la Lune" + num\xe9ro page

## LES 7 SLIDES \xc0 G\xc9N\xc9RER
1. COVER - "Analyse pour [Pr\xe9nom Nom]" + titre principal
2. PILLARS - 3 raisons personnalis\xe9es de r\xe9ussir bas\xe9es sur le profil
3. TIER1 - 3 apps SaaS adapt\xe9es (90-100% compatibilit\xe9) avec MRR
4. TIER2 - 3 apps compl\xe9mentaires (70-89%)
5. CARDS - Grille 3x2 des 6 apps avec d\xe9tails
6. ROADMAP - Plan 3 mois personnalis\xe9
7. CTA - Call to action final avec QR code

## FORMAT JSON
{"slides":["<!DOCTYPE html><html lang=\\"fr\\"><head>...</head><body>...</body></html>", ...]}

IMPORTANT: Ex\xe9cute le curl webhook ET envoie l'email.`;try{let e=await fetch("https://api.manus.ai/v1/tasks",{method:"POST",headers:{"Content-Type":"application/json",API_KEY:process.env.MANUS_API_KEY},body:JSON.stringify({prompt:a,agentProfile:"manus-1.6",mode:"agent",interactive:!1})});if(e.ok){let s=await e.json();console.log("✅ Manus task created:",s.task_id),p.manusTaskId=s.task_id,p.status="processing"}else{let s=await e.text();console.error("❌ Manus API error:",e.status,s),p.status="failed"}}catch(e){console.error("❌ Manus API fetch error:",e),p.status="failed"}}else console.log("⚠️ MANUS_API_KEY not set"),p.status="failed";return l.set(n,p),a.NextResponse.json({id:n,success:!0})}catch(e){return console.error("Generate error:",e),a.NextResponse.json({error:"Erreur lors de la g\xe9n\xe9ration"},{status:500})}}async function r(e){let{searchParams:s}=new URL(e.url),t=s.get("id");if(!t)return a.NextResponse.json({error:"ID manquant"},{status:400});let i=l.get(t);if(!i)return a.NextResponse.json({error:"Donn\xe9es non trouv\xe9es"},{status:404});if("processing"===i.status&&i.manusTaskId&&process.env.MANUS_API_KEY)try{let e=await fetch(`https://api.manus.ai/v1/tasks/${i.manusTaskId}`,{method:"GET",headers:{API_KEY:process.env.MANUS_API_KEY}});if(e.ok){let s=await e.json();if(console.log(`📊 Manus task ${i.manusTaskId} status:`,s.status),"completed"===s.status||"stopped"===s.status){console.log("\uD83D\uDCE6 Full Manus response keys:",Object.keys(s));let e=JSON.stringify(s);console.log("\uD83D\uDCE6 Response length:",e.length);let a=!1,o=e.match(/\{"slides"\s*:\s*\[[\s\S]*?\]\s*\}/g);if(o&&o.length>0){let e=o.reduce((e,s)=>e.length>s.length?e:s);console.log("\uD83D\uDD0D Found slides JSON pattern, length:",e.length);try{let s=e;(s.includes("\\n")||s.includes('\\"'))&&(s=s.replace(/\\n/g,"\n").replace(/\\"/g,'"').replace(/\\\\/g,"\\"));let t=JSON.parse(s);t.slides&&Array.isArray(t.slides)&&t.slides.length>0&&(i.slides=t.slides,i.status="completed",a=!0,console.log("✅ Successfully extracted",i.slides.length,"slides from Manus response"))}catch(e){console.log("⚠️ First JSON parse attempt failed, trying alternative...")}}if(!a){for(let e of["output","result","response","final_output","content","message","data"])if(s[e]){let t="string"==typeof s[e]?s[e]:JSON.stringify(s[e]);console.log(`🔍 Checking field '${e}', length:`,t.length);let l=t.match(/\{"slides"\s*:\s*\[[\s\S]*?\]\s*\}/);if(l)try{let s=l[0].replace(/\\n/g,"\n").replace(/\\"/g,'"').replace(/\\\\/g,"\\"),t=JSON.parse(s);if(t.slides&&Array.isArray(t.slides)&&t.slides.length>0){i.slides=t.slides,i.status="completed",a=!0,console.log(`✅ Found ${i.slides.length} slides in field '${e}'`);break}}catch(s){console.log(`⚠️ Parse error in field '${e}'`)}}}if(!a&&s.files&&Array.isArray(s.files))for(let e of(console.log("\uD83D\uDCC1 Checking",s.files.length,"files from Manus"),s.files)){let s="string"==typeof e?e:e.content||e.data||JSON.stringify(e);if(s.includes('"slides"')){let e=s.match(/\{"slides"\s*:\s*\[[\s\S]*?\]\s*\}/);if(e)try{let s=JSON.parse(e[0]);if(s.slides&&Array.isArray(s.slides)&&s.slides.length>0){i.slides=s.slides,i.status="completed",a=!0,console.log("✅ Found slides in Manus files");break}}catch(e){}}}a||(console.log("⚠️ No valid slides found in Manus response, using demo"),i.status="completed",i.slides=n(i.userName)),l.set(t,i)}else"failed"===s.status&&(console.error("❌ Manus task failed"),i.status="failed",i.slides=n(i.userName),l.set(t,i))}}catch(e){console.error("❌ Error checking Manus status:",e)}return a.NextResponse.json(i)}function n(e){return[`<!DOCTYPE html>
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
        <p class="subtitle">Analyse pour ${e}</p>
        <h1 class="main-title">VOTRE FEUILLE DE<br>ROUTE<br>VERS LES REVENUS<br>PASSIFS<br>AVEC L'IA</h1>
        <p class="description">6 Applications pr\xeates \xe0 \xeatre lanc\xe9es avec un agent IA qui dev \xe0 votre place</p>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugment\xe9.fr • Vise la Lune</span>
        </div>
        <div class="page-number">01 / 07</div>
    </div>
</body>
</html>`,`<!DOCTYPE html>
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
            <h1 class="main-title">Pourquoi Vous Allez R\xe9ussir</h1>
            <span class="subtitle">La Triade Gagnante</span>
        </div>
        <div class="pillars">
            <div class="pillar">
                <div class="pillar-icon">&lt;/&gt;</div>
                <h3 class="pillar-title">Tech & Vibecoding</h3>
                <p class="pillar-desc">Vous ne d\xe9pendez de personne pour construire. L\xe0 o\xf9 d'autres cherchent un CTO, vous codez et d\xe9ployez.</p>
                <p class="pillar-key">Vitesse d'ex\xe9cution</p>
            </div>
            <div class="pillar highlight">
                <div class="pillar-icon">🔄</div>
                <h3 class="pillar-title">Expertise Agile</h3>
                <p class="pillar-desc">Vous savez g\xe9rer l'incertitude et it\xe9rer. C'est l'essence m\xeame du lancement de SaaS : Build, Measure, Learn.</p>
                <p class="pillar-key">M\xe9thode \xe9prouv\xe9e</p>
            </div>
            <div class="pillar">
                <div class="pillar-icon">💡</div>
                <h3 class="pillar-title">Esprit Entrepreneur</h3>
                <p class="pillar-desc">Votre exp\xe9rience de coach montre que vous comprenez les besoins humains derri\xe8re la technique.</p>
                <p class="pillar-key">Vision produit</p>
            </div>
        </div>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugment\xe9.fr • Vise la Lune</span>
        </div>
        <div class="page-number">02 / 07</div>
    </div>
</body>
</html>`,`<!DOCTYPE html>
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
            <span class="subtitle">Compatibilit\xe9 90-100%</span>
        </div>
        <div class="apps">
            <div class="app">
                <div class="app-icon">🤖</div>
                <div class="app-content">
                    <h3>Agile Copilot (Assistant IA)</h3>
                    <p>Automatisez les t\xe2ches des Scrum Masters : r\xe9sum\xe9s de Daily, alertes retards, insights JIRA. Un "Scrum Master augment\xe9".</p>
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
                    <p>Plateforme SaaS guidant l'utilisateur de l'id\xe9e au d\xe9ploiement en 3h. Wizard interactif + Templates + D\xe9ploiement 1-clic.</p>
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
                    <p>G\xe9n\xe9rateur de roadmap produit intelligent. Priorisation automatique (RICE) et simulation de timeline r\xe9aliste.</p>
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
            <span class="brand-text">FreelanceAugment\xe9.fr • Vise la Lune</span>
        </div>
        <div class="page-number">03 / 07</div>
    </div>
</body>
</html>`,`<!DOCTYPE html>
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
            <h1 class="main-title">Tier 2 - Les 3 Applications Compl\xe9mentaires</h1>
            <span class="subtitle">Compatibilit\xe9 70-89%</span>
        </div>
        <div class="apps">
            <div class="app">
                <div class="app-icon">📊</div>
                <div class="app-content">
                    <h3>Sprint Pulse</h3>
                    <p>Dashboard analytics pour \xe9quipes Agile. Connect\xe9 \xe0 JIRA, il pr\xe9dit les retards et mesure la sant\xe9 de l'\xe9quipe en temps r\xe9el.</p>
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
                    <p>Plateforme d'achat/vente de templates SaaS pr\xe9-construits. D\xe9ploiement 1-clic pour les acheteurs, commission pour vous.</p>
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
                    <p>Assistant de transformation Agile. Diagnostic automatique de l'organisation et g\xe9n\xe9ration d'un plan d'action personnalis\xe9.</p>
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
            <span class="brand-text">FreelanceAugment\xe9.fr • Vise la Lune</span>
        </div>
        <div class="page-number">04 / 07</div>
    </div>
</body>
</html>`,`<!DOCTYPE html>
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
            <p class="header-subtitle">Comment lancer chaque outil d\xe8s demain</p>
        </div>
        <div class="cards-grid">
            <div class="card highlight">
                <div class="card-header">
                    <span class="card-title">Agile Copilot</span>
                    <span class="card-price">29€/mois</span>
                </div>
                <ul class="card-list">
                    <li>Connecter API JIRA + OpenAI.</li>
                    <li>Cr\xe9er prompt "Daily Summary".</li>
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
                    <li>Cr\xe9er wizard "Id\xe9e → Prompt".</li>
                    <li>Int\xe9grer templates Next.js.</li>
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
                    <li>Alerte email "Sprint \xe0 risque".</li>
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
                    <span class="card-price">99€/unit\xe9</span>
                </div>
                <ul class="card-list">
                    <li>Packager 3 templates SaaS.</li>
                    <li>Site vitrine (LemonSqueezy).</li>
                    <li>SEO "SaaS Boilerplate".</li>
                </ul>
                <div class="card-footer">
                    <span>Cible: D\xe9veloppeurs</span>
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
                    <li>Mode "Diagnostic d'\xe9quipe".</li>
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
            <span class="brand-text">FreelanceAugment\xe9.fr • Vise la Lune</span>
        </div>
        <div class="page-number">05 / 07</div>
    </div>
</body>
</html>`,`<!DOCTYPE html>
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
        <h1 class="main-title">VOTRE STRAT\xc9GIE OPTIMALE - L'IA DEV POUR VOUS</h1>
        <p class="subtitle">Roadmap d'ex\xe9cution sur 3 mois</p>
        <div class="phases">
            <div class="phase active">
                <p class="phase-label">Semaine 1</p>
                <h3 class="phase-title">BUILD MVP</h3>
                <ul class="phase-list">
                    <li>Cr\xe9er l'environnement (3h).</li>
                    <li>G\xe9n\xe9rer le code via IA (10h).</li>
                    <li>D\xe9ployer sur Coolify (2h).</li>
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
                    <li>R\xe9colter 10 premiers avis.</li>
                    <li>It\xe9rer sur les features cl\xe9s.</li>
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
                    <li>Publicit\xe9s cibl\xe9es (Ads).</li>
                </ul>
                <div class="phase-footer">
                    <p class="phase-footer-label">Objectif</p>
                    <p class="phase-footer-value">Traction R\xe9currente</p>
                </div>
            </div>
        </div>
        <p class="bottom-message">Vous avez l'expertise. Vous avez le plan. <span class="highlight">Lancez votre premi\xe8re application cette semaine.</span></p>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugment\xe9.fr • Vise la Lune</span>
        </div>
        <div class="page-number">06 / 07</div>
    </div>
</body>
</html>`,`<!DOCTYPE html>
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
            <p>Rejoignez la communaut\xe9 Freelance Augment\xe9 pour transformer vos comp\xe9tences en revenus r\xe9currents.</p>
            <ul class="benefits">
                <li>Acc\xe8s aux Templates & Outils No-Code</li>
                <li>Astuces pour lancer avec l'IA & g\xe9n\xe9rer des revenus passifs</li>
                <li>R\xe9seau d'entrepreneurs Tech & Support</li>
            </ul>
            <a href="https://freelanceaugmente.fr" class="cta-button">Rejoindre le Mouvement</a>
        </div>
        <div class="qr-section">
            <img src="/qr_code_orange.png" alt="QR Code" class="qr-code">
            <p class="scan-label">SCAN ME</p>
        </div>
        <div class="branding-footer">
            <div class="brand-logo"></div>
            <span class="brand-text">FreelanceAugment\xe9.fr • Vise la Lune</span>
        </div>
        <div class="page-number">07 / 07</div>
    </div>
</body>
</html>`]}}};