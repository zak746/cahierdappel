/**
 * Feuille de style des pages statiques — Cahier d'Appel.
 * Reprend pixel pour pixel le langage visuel de Coran Tajwid : fond #F5F5F7,
 * cartes blanches très arrondies, ombre douce, bleu Apple, titres serrés,
 * Plus Jakarta Sans. Seuls les composants propres au calculateur changent.
 */

export const CSS = `/* Cahier d'Appel — pages statiques (design aligné sur Coran Tajwid) */
:root{
  color-scheme:light;
  --bg:#f5f5f7;--card:#fff;--ink:#1d1d1f;--muted:#6b7280;--soft:#9ca3af;
  --line:#ececf0;--accent:#5856d6;--accent-ink:#5856d6;--shadow:0 8px 30px rgba(0,0,0,.04);
  --carte-bord:rgba(255,255,255,.5);--voile:rgba(255,255,255,.5);
  --accent-faible:#f1f0fd;--accent-bord:#dcdafa;
  --bon:#1c8a4b;--bon-bg:#e6f8ee;--mauvais:#d0342c;--mauvais-bg:#fdecea;
  --r-lg:3rem;--r-md:2rem;--r-sm:1.25rem;
  --sans:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  color-scheme:dark;
  --bg:#1f2125;--card:#212529;--ink:#e7e9ea;--muted:#a2a8ae;--soft:#777;
  --line:#464b50;--accent:#8785e8;--accent-ink:#8785e8;--shadow:0 8px 30px rgba(0,0,0,.35);
  --carte-bord:#33383d;--voile:rgba(255,255,255,.03);
  --accent-faible:#232244;--accent-bord:#3a3970;
  --bon:#5fcb8a;--bon-bg:#17281e;--mauvais:#e0837a;--mauvais-bg:#3a2420;
}}
:root[data-theme="dark"]{
  color-scheme:dark;
  --bg:#1f2125;--card:#212529;--ink:#e7e9ea;--muted:#a2a8ae;--soft:#777;
  --line:#464b50;--accent:#8785e8;--accent-ink:#8785e8;--shadow:0 8px 30px rgba(0,0,0,.35);
  --carte-bord:#33383d;--voile:rgba(255,255,255,.03);
  --accent-faible:#232244;--accent-bord:#3a3970;
  --bon:#5fcb8a;--bon-bg:#17281e;--mauvais:#e0837a;--mauvais-bg:#3a2420;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;padding:16px;background:var(--bg);color:var(--ink);
  font-family:var(--sans);
  line-height:1.65;font-size:17px;display:flex;flex-direction:column;gap:16px;min-height:100vh}
img{max-width:100%;height:auto}
a{color:var(--accent-ink);text-decoration:none}
a:hover{text-decoration:underline}
.skip{position:absolute;left:-9999px}
.skip:focus{left:20px;top:20px;background:var(--card);padding:10px 16px;border-radius:12px;z-index:99}
.shell{max-width:1280px;margin:0 auto;width:100%;min-width:0}
.shell-main{flex:1;display:flex;min-width:0}

header.site{background:var(--voile);border:1px solid var(--carte-bord);
  border-radius:var(--r-md);box-shadow:var(--shadow);min-height:5.5rem;padding:16px 34px;
  display:flex;align-items:center;flex-shrink:0}
.site-nav-row{display:flex;align-items:center;gap:20px;width:100%;min-width:0}
.site-brand{font-weight:800;letter-spacing:-.02em;font-size:22px;color:var(--ink);white-space:nowrap}
.site-brand:hover{text-decoration:none}
.site-brand span{color:var(--accent)}
.site-nav-sep{width:1px;height:18px;background:var(--line);flex-shrink:0}
.site-nav{display:flex;align-items:center;gap:26px;flex-wrap:wrap;min-width:0}
.site-nav a{font-size:15px;font-weight:600;color:var(--soft);white-space:nowrap;transition:color .2s}
.site-nav a:hover{color:var(--ink);text-decoration:none}
.site-nav a.site-nav-current{color:var(--ink)}

main.site{background:var(--card);border:1px solid var(--carte-bord);border-radius:var(--r-lg);
  box-shadow:var(--shadow);padding:56px 64px 64px;flex:1;min-width:0;overflow-wrap:break-word}
.crumb{font-size:12px;color:var(--soft);margin:0 0 22px;font-weight:600}
.crumb ol{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0}
.crumb li:not(:last-child)::after{content:"›";margin-left:8px;color:var(--soft)}
.crumb a{color:var(--soft)}
.crumb a:hover{color:var(--ink);text-decoration:none}

h1{font-size:clamp(2rem,4.6vw,2.9rem);line-height:1.1;letter-spacing:-.045em;margin:.2em 0 .35em;font-weight:800}
h2{font-size:clamp(1.3rem,2.8vw,1.6rem);letter-spacing:-.03em;margin:2.4em 0 .7em;font-weight:700}
h3{font-size:1.08rem;letter-spacing:-.02em;margin:1.9em 0 .4em;font-weight:700}
p{margin:0 0 1.1em}
.lede{font-size:1.14rem;color:var(--muted);line-height:1.7}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin:0}
ol,ul{padding-left:1.3em}
li{margin:.35em 0}

.card{background:var(--bg);border:1px solid var(--line);border-radius:var(--r-md);padding:28px 32px;margin:24px 0}
.callout{background:var(--accent-faible);border:1px solid var(--accent-bord);border-radius:var(--r-md);padding:22px 28px;margin:24px 0}
.callout p:last-child{margin-bottom:0}

/* ---- Réordonnancement mobile : calculateur avant le texte explicatif ----
   Le HTML garde l'ordre naturel (titre, description, calculateur) pour le SEO ;
   sur mobile on affiche visuellement le calculateur juste après le titre, la
   description passant après, pour que l'action soit immédiate sans perdre le
   texte (toujours présent dans le DOM, donc toujours indexé). */
.intro-calc{display:flex;flex-direction:column}
.intro-calc>.intro{order:1}
.intro-calc>.calc{order:2}
.intro-calc>.lede{order:3;margin-top:4px}
@media(min-width:641px){
  .intro-calc>.lede{order:2}
  .intro-calc>.calc{order:3}
}

/* ---- Calculateur ---- */
.calc{background:var(--bg);border:1px solid var(--line);border-radius:var(--r-md);padding:32px;margin:28px 0}
.calc-champs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px;margin-bottom:8px}
.calc-champ label{display:block;font-size:11px;font-weight:700;color:var(--soft);margin-bottom:6px;text-transform:uppercase;letter-spacing:.1em}
.calc-champ input{width:100%;padding:13px 16px;border:1.5px solid var(--line);border-radius:var(--r-sm);
  font-size:17px;font-weight:700;background:var(--card);color:var(--ink);font-family:var(--sans)}
.calc-champ input:focus{outline:none;border-color:var(--accent)}
.calc-resultats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-top:24px}
.calc-resultat{background:var(--card);border:1px solid var(--line);border-radius:var(--r-sm);padding:18px 20px;text-align:center}
.calc-resultat b{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--soft);font-weight:700;margin-bottom:6px}
.calc-resultat span{font-size:1.7rem;font-weight:800;letter-spacing:-.02em;color:var(--ink)}
.calc-resultat.accent{background:var(--accent);border-color:var(--accent)}
.calc-resultat.accent b{color:rgba(255,255,255,.75)}
.calc-resultat.accent span{color:#fff}

/* ---- Table par élève ---- */
.tableau-eleves{width:100%;border-collapse:collapse;margin:20px 0}
.tableau-eleves th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--soft);
  font-weight:700;padding:8px 10px;border-bottom:1px solid var(--line)}
.tableau-eleves td{padding:6px 10px;border-bottom:1px solid var(--line)}
.tableau-eleves input[type="text"],.tableau-eleves input[type="number"]{width:100%;padding:9px 10px;
  border:1.5px solid var(--line);border-radius:10px;font-size:16px;font-family:var(--sans);background:var(--card);color:var(--ink)}
.tableau-eleves input:focus{outline:none;border-color:var(--accent)}
.tableau-eleves .pct{font-weight:800;color:var(--ink);white-space:nowrap}
.tableau-eleves .suppr{background:none;border:none;color:var(--mauvais);cursor:pointer;font-size:18px;padding:4px 8px}
.calc-btn{background:var(--accent);color:#fff;border:none;border-radius:999px;padding:12px 24px;
  font-size:14px;font-weight:700;cursor:pointer;transition:opacity .15s;box-shadow:0 8px 20px rgba(88,86,214,.25)}
.calc-btn:hover{opacity:.9}
.calc-btn.secondaire{background:transparent;color:var(--accent);border:1.5px solid var(--accent-bord);box-shadow:none}
.calc-actions{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}

/* ---- Tableau des périodes (statistiques année) ----
   Même structure compacte que le tableau par élève : les intitulés vivent dans
   l'en-tête au lieu d'être répétés à chaque ligne. */
.tableau-annee th:nth-child(2),.tableau-annee td:nth-child(2),
.tableau-annee th:nth-child(3),.tableau-annee td:nth-child(3){width:140px}
.tableau-annee th:nth-child(4),.tableau-annee td:nth-child(4){width:90px}
.tableau-annee th:last-child,.tableau-annee td:last-child{width:40px}

/* ---- Grille de registre à imprimer ---- */
.grille-zone{margin:8px 0 28px}
.grille-entete{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:14px}
.grille-entete>div{display:flex;align-items:baseline;gap:8px}
.grille-entete span{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--soft);white-space:nowrap}
.grille-entete i{flex:1;border-bottom:1px solid var(--line);height:1.2em}
.scroll-x{overflow-x:auto}
.grille{border-collapse:collapse;font-size:11px;width:100%}
.grille th,.grille td{border:1px solid var(--line);text-align:center;padding:0}
.grille th{background:var(--bg);font-weight:700;color:var(--muted);font-size:9.5px;padding:3px 1px}
.grille td{height:22px;min-width:15px}
.grille .col-nom{min-width:120px;width:22%;text-align:left;padding-left:6px}
.grille .col-total{min-width:38px;background:var(--bg)}
.grille-note{font-size:12px;color:var(--soft);margin:10px 0 0;line-height:1.5}
@media(max-width:640px){
  .grille-entete{grid-template-columns:1fr;gap:9px;margin-bottom:11px}
  .grille{font-size:10px}
  .grille .col-nom{min-width:78px}
  .grille td{height:19px}
}

/* ---- FAQ ---- */
.faq details{background:var(--bg);border:1px solid var(--line);border-radius:var(--r-sm);padding:16px 20px;margin:10px 0}
.faq summary{font-weight:700;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-size:20px;color:var(--accent);flex-shrink:0}
.faq details[open] summary::after{content:"−"}
.faq details p{margin:12px 0 0;color:var(--muted)}

/* ---- Thème clair/sombre ---- */
.theme-toggle{margin-left:auto;flex:0 0 auto;width:36px;height:36px;border-radius:12px;
  border:1px solid var(--line);background:var(--card);color:var(--muted);cursor:pointer;
  display:flex;align-items:center;justify-content:center;padding:0;transition:all .2s}
.theme-toggle:hover{color:var(--ink);border-color:var(--accent)}
.theme-toggle svg{width:17px;height:17px}
.theme-toggle .lune{display:none}
:root[data-theme="dark"] .theme-toggle .lune{display:block}
:root[data-theme="dark"] .theme-toggle .soleil{display:none}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]) .theme-toggle .lune{display:block}
  :root:not([data-theme="light"]) .theme-toggle .soleil{display:none}
}

.nav-burger{display:none;flex:0 0 auto;width:38px;height:38px;border-radius:12px;
  border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer;
  align-items:center;justify-content:center;padding:0}
.nav-burger svg{width:19px;height:19px}
.nav-burger .fermer{display:none}
.nav-burger[aria-expanded="true"] .ouvrir{display:none}
.nav-burger[aria-expanded="true"] .fermer{display:block}

@media(max-width:900px){
  header.site{min-height:0;padding:10px 16px;border-radius:var(--r-sm)}
  .site-nav-row{flex-wrap:wrap;gap:8px}
  .site-brand{font-size:19px;order:1}
  .site-nav-sep{display:none}
  .theme-toggle{order:2;margin-left:auto;width:38px;height:38px}
  .nav-burger{display:flex;order:3}
  .site-nav{order:4;flex-basis:100%;display:none;flex-direction:column;gap:0;
    margin-top:8px;padding-top:6px;border-top:1px solid var(--line)}
  .site-nav.ouvert{display:flex}
  .site-nav a{padding:11px 2px;font-size:15px;color:var(--ink)}
  main.site{padding:26px 18px 32px;border-radius:var(--r-md)}
  footer.site{padding:26px 18px;border-radius:var(--r-sm)}
}

.pub{display:none}
@media (min-width:1600px){
  .pub{display:flex;position:fixed;top:104px;width:160px;height:600px;z-index:5;
    flex-direction:column;align-items:center;justify-content:center;gap:10px;
    background:var(--card);border:1px dashed var(--line);border-radius:var(--r-sm);
    color:var(--soft);text-align:center;padding:16px;overflow:hidden}
  .pub-gauche{left:calc(50% - 640px - 184px)}
  .pub-droite{right:calc(50% - 640px - 184px)}
}
.pub-etiquette{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--soft);opacity:.8}
.pub-creatif{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:8px;border-radius:12px;background:var(--bg);
  border:1px solid var(--line);transition:opacity .35s}
.pub-creatif.pub-transition{opacity:0}
.pub-titre{font-size:14px;font-weight:700;color:var(--ink);line-height:1.3;padding:0 10px}
.pub-sous{font-size:11px;color:var(--muted);padding:0 10px;line-height:1.4}
.pub-format{font-size:9px;color:var(--soft);letter-spacing:.08em}
.pub-compteur{font-size:9px;color:var(--soft);font-variant-numeric:tabular-nums}

/* ---- Bandeau de consentement ---- */
.consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:60;max-width:1280px;
  margin:0 auto;display:flex;align-items:center;gap:24px;flex-wrap:wrap;
  background:var(--card);border:1px solid var(--line);border-radius:var(--r-md);
  box-shadow:0 12px 40px rgba(0,0,0,.18);padding:20px 26px}
.consent[hidden]{display:none}
.consent-txt{flex:1;min-width:260px}
.consent-titre{font-size:1rem;font-weight:700;letter-spacing:-.02em;margin:0 0 4px}
.consent-txt p{font-size:.88rem;color:var(--muted);margin:0;line-height:1.5}
.consent-btns{display:flex;gap:10px;flex-shrink:0}
.consent-btns button{font-family:inherit;font-weight:700;font-size:.88rem;border-radius:999px;
  padding:12px 26px;cursor:pointer;border:1px solid var(--line);transition:all .2s}
.consent-refus{background:var(--bg);color:var(--ink)}
.consent-refus:hover{border-color:var(--ink)}
.consent-ok{background:var(--accent);color:#fff;border-color:var(--accent)}
.consent-ok:hover{filter:brightness(.92)}
@media(max-width:640px){
  .consent{left:12px;right:12px;bottom:12px;padding:18px;gap:14px}
  .consent-btns{width:100%}
  .consent-btns button{flex:1;padding:13px 10px}
}

.legal{margin:28px 0 0;padding-top:20px;border-top:1px solid var(--line);font-size:.8rem;color:var(--soft)}
footer.site{background:var(--voile);border:1px solid var(--carte-bord);border-radius:var(--r-md);
  box-shadow:var(--shadow);padding:40px 48px;font-size:.9rem;color:var(--muted);flex-shrink:0}
footer.site .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px}
footer.site h2{font-size:.7rem;text-transform:uppercase;letter-spacing:.14em;margin:0 0 12px;color:var(--ink);font-weight:700}
footer.site ul{list-style:none;margin:0;padding:0}
footer.site li{margin:6px 0}
footer.site a{color:var(--muted)}
footer.site a:hover{color:var(--ink);text-decoration:none}

@media(max-width:640px){
  body{padding:8px;gap:8px;font-size:16px}
  header.site{padding:8px 14px;min-height:0}
  .site-brand{font-size:17px}
  main.site{padding:16px 12px 22px}
  .eyebrow{font-size:9.5px;letter-spacing:.2em}
  h1{font-size:clamp(1.35rem,5.6vw,1.7rem);line-height:1.15;letter-spacing:-.03em;margin:.15em 0 .3em}
  h2{font-size:1.1rem;margin:1.5em 0 .5em}
  .lede{font-size:.96rem;line-height:1.55}
  p{margin:0 0 .8em}

  /* Calculateur : compact au maximum pour tenir dans le premier écran mobile
     sans scroll, tout en gardant les chiffres lisibles. */
  .intro-calc>.calc{margin:10px 0 16px}
  .calc{padding:14px}
  .calc-champs{grid-template-columns:1fr;gap:10px;margin-bottom:4px}
  .calc-champ label{font-size:10px;margin-bottom:4px;letter-spacing:.06em}
  .calc-champ input{padding:9px 12px;font-size:16px;border-radius:12px}
  .calc-resultats{grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
  .calc-resultat{padding:10px 8px}
  .calc-resultat b{font-size:9px;letter-spacing:.08em;margin-bottom:3px}
  .calc-resultat span{font-size:1.25rem}

  /* Tableau par élève : colonnes serrées, le nom prend la place restante. */
  .tableau-eleves{margin:12px 0;font-size:14px}
  .tableau-eleves th{font-size:8.5px;letter-spacing:.06em;padding:5px 4px}
  .tableau-eleves td{padding:4px}
  .tableau-eleves th:nth-child(2),.tableau-eleves td:nth-child(2){width:66px}
  .tableau-eleves th:nth-child(3),.tableau-eleves td:nth-child(3){width:50px}
  .tableau-eleves th:nth-child(4),.tableau-eleves td:nth-child(4){width:24px}
  .tableau-eleves input[type="number"]{text-align:center}
  /* 16px minimum : sous ce seuil, Safari iOS zoome automatiquement à la mise au
     point du champ et ne dézoome jamais ensuite. */
  .tableau-eleves input[type="text"],.tableau-eleves input[type="number"]{padding:7px 6px;font-size:16px;border-radius:9px}
  .tableau-eleves .pct{font-size:13px}
  .tableau-eleves .suppr{font-size:16px;padding:2px 4px}

  /* Tableau annuel : 5 colonnes serrées, le nom de période prend le reste. */
  .tableau-annee th:nth-child(2),.tableau-annee td:nth-child(2),
  .tableau-annee th:nth-child(3),.tableau-annee td:nth-child(3){width:60px}
  .tableau-annee th:nth-child(4),.tableau-annee td:nth-child(4){width:44px}
  .tableau-annee th:last-child,.tableau-annee td:last-child{width:22px}
  .tableau-annee input[type="number"]{padding:7px 3px}

  .calc-btn{padding:10px 18px;font-size:13.5px}
  .calc-actions{gap:8px;margin-top:12px}

  footer.site{padding:22px 16px}
  footer.site .cols{grid-template-columns:1fr 1fr;gap:18px 14px}
  footer.site h2{font-size:.64rem;margin:0 0 7px}
  footer.site li{margin:3px 0}
  footer.site a{font-size:.85rem;line-height:1.45}
  .legal{margin-top:18px;padding-top:14px;font-size:.72rem}
}

@media print{
  :root{--bg:#fff;--card:#fff;--ink:#111;--muted:#444;--soft:#666;--line:#999;
        --voile:#fff;--carte-bord:#ddd;--accent-faible:#f4f8ff;--accent-bord:#dde8f8}
  header.site,footer.site,.crumb,.cta,.skip,.theme-toggle,.nav-burger,.consent,.pub{display:none!important}
  body{background:#fff;padding:0;font-size:12pt;display:block}
  main.site{border:0;box-shadow:none;padding:0;border-radius:0}
  .card,.calc{border:0;border-bottom:1px solid #ddd;border-radius:0;padding:8pt 0;margin:0;break-inside:avoid;background:#fff}
  h1{font-size:20pt}h2{font-size:14pt;margin:14pt 0 6pt}
  a{color:inherit;text-decoration:none}

  /* Page « registre à imprimer » : seule la grille sort sur le papier, en paysage.
     Les traits sont en 1px noir et non en fractions de point : sous 1px, la
     plupart des navigateurs arrondissent la bordure à zéro et la grille sort
     vide. print-color-adjust force aussi le fond gris des en-têtes, que les
     navigateurs suppriment par défaut à l'impression. */
  .grille-zone~h2,.grille-zone~p,.grille-zone~.calc-actions,.grille-zone~.faq,
  .intro-calc,.lede{display:none!important}
  @page{size:landscape;margin:8mm}
  .grille-zone{margin:0}
  .scroll-x{overflow:visible}
  .grille{font-size:8pt;width:100%;border-collapse:collapse;
    -webkit-print-color-adjust:exact;print-color-adjust:exact}
  .grille th,.grille td{border:1px solid #000!important;background:transparent}
  .grille th{font-size:7pt;color:#000;background:#e8e8e8!important;padding:2px 1px}
  .grille td{height:7.4mm}
  .grille .col-nom{min-width:0;width:20%}
  .grille .col-total{background:#f2f2f2!important}
  .grille-note{font-size:7.5pt;color:#000;margin-top:3mm}
  .grille-entete{margin-bottom:4mm;display:grid;grid-template-columns:repeat(3,1fr);gap:8mm}
  .grille-entete span{color:#000;font-size:8pt}
  .grille-entete i{border-bottom:1px solid #000}
}
`;
