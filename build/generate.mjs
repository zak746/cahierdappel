/**
 * Générateur statique — Cahier d'Appel.
 *
 *   node build/generate.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, url, layout, CSS, BUILD_ID } from './site.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = ROOT;

function ecrire(relPath, html) {
  const dest = path.join(OUT, relPath, 'index.html');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html, 'utf8');
}

/* ================= FAQ commune (schema.org FAQPage) ================= */
const FAQ = [
  {
    q: 'Comment calculer le pourcentage de présence dans le cahier d’appel ?',
    r: 'On divise le nombre de demi-journées de présence réelle par le nombre de demi-journées possibles (nombre d’élèves × nombre de demi-journées de la période), puis on multiplie par 100. On peut aussi faire 100 − le pourcentage d’absence.'
  },
  {
    q: 'Comment calculer le pourcentage d’absence dans le cahier d’appel ?',
    r: 'On divise le nombre total de demi-journées d’absence par le nombre de demi-journées possibles, puis on multiplie par 100. Une journée d’absence complète compte pour 2 demi-journées.'
  },
  {
    q: 'Qu’est-ce qu’une « demi-journée possible » ?',
    r: 'C’est le nombre d’élèves multiplié par le nombre de demi-journées de classe sur la période concernée (en général 2 demi-journées par jour d’école). C’est le nombre maximum théorique de présences si personne n’était absent.'
  },
  {
    q: 'Faut-il compter les retards comme des absences ?',
    r: 'Non : un retard n’est pas une demi-journée d’absence tant que l’élève est bien présent en classe ce jour-là. Seule une absence complète sur la demi-journée doit être comptée.'
  },
  {
    q: 'À quelle fréquence dois-je remplir ces statistiques ?',
    r: 'La plupart des académies demandent un calcul en fin de mois et un cumul en fin d’année scolaire. Utilisez l’outil « Statistiques de l’année » pour cumuler plusieurs périodes automatiquement.'
  }
];

function faqHtml() {
  return `<div class="faq">
${FAQ.map((f) => `<details><summary>${f.q}</summary><p>${f.r}</p></details>`).join('\n')}
</div>`;
}

function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.r }
    }))
  };
}

/* ================= ACCUEIL / Calcul classe entière ================= */
function pageAccueil() {
  const body = `<p class="eyebrow">CALCUL DE PRÉSENCE ET D’ABSENCE</p>
<h1>Calcul cahier d’appel : pourcentage de présence en 5 secondes</h1>
<p class="lede">Entre le nombre d’élèves, la période concernée et le nombre de demi-journées d’absence :
le pourcentage de présence et d’absence de ta classe s’affiche instantanément, avec le détail du calcul.</p>

<div class="calc" id="calc-classe">
  <div class="calc-champs">
    <div class="calc-champ">
      <label for="cc-eleves">Nombre d’élèves</label>
      <input type="number" id="cc-eleves" min="1" value="25" inputmode="numeric">
    </div>
    <div class="calc-champ">
      <label for="cc-demijournees">Demi-journées de classe sur la période</label>
      <input type="number" id="cc-demijournees" min="1" value="40" inputmode="numeric">
    </div>
    <div class="calc-champ">
      <label for="cc-absences">Total des demi-journées d’absence</label>
      <input type="number" id="cc-absences" min="0" value="0" inputmode="numeric">
    </div>
  </div>
  <div class="calc-resultats">
    <div class="calc-resultat"><b>Demi-journées possibles</b><span id="cc-possibles">1000</span></div>
    <div class="calc-resultat"><b>Présences réelles</b><span id="cc-reelles">1000</span></div>
    <div class="calc-resultat accent"><b>% de présence</b><span id="cc-pct-presence">100 %</span></div>
    <div class="calc-resultat"><b>% d’absence</b><span id="cc-pct-absence">0 %</span></div>
  </div>
</div>

<h2>Le suivi par élève ou sur l’année</h2>
<p>Pour calculer le pourcentage de chaque élève individuellement, ou cumuler plusieurs mois pour les
statistiques de fin d’année, deux outils dédiés :</p>
<div class="calc-actions">
  <a class="calc-btn" href="/par-eleve/">Calcul par élève →</a>
  <a class="calc-btn secondaire" href="/statistiques-annee/">Statistiques de l’année →</a>
</div>

<h2>Questions fréquentes</h2>
${faqHtml()}

<p class="lede" style="margin-top:2em"><a href="/formule-cahier-appel/">Voir le détail de la formule officielle et un exemple pas à pas →</a></p>

<script>
(function () {
  var e = document.getElementById('cc-eleves'), d = document.getElementById('cc-demijournees'), a = document.getElementById('cc-absences');
  var possibles = document.getElementById('cc-possibles'), reelles = document.getElementById('cc-reelles'),
      pctP = document.getElementById('cc-pct-presence'), pctA = document.getElementById('cc-pct-absence');
  function calc() {
    var nE = Math.max(0, parseInt(e.value, 10) || 0);
    var nD = Math.max(0, parseInt(d.value, 10) || 0);
    var nA = Math.max(0, parseInt(a.value, 10) || 0);
    var poss = nE * nD;
    var reel = Math.max(0, poss - nA);
    var pa = poss > 0 ? (nA / poss) * 100 : 0;
    var pp = poss > 0 ? 100 - pa : 100;
    possibles.textContent = poss.toLocaleString('fr-FR');
    reelles.textContent = reel.toLocaleString('fr-FR');
    pctA.textContent = pa.toFixed(2).replace('.00', '') + ' %';
    pctP.textContent = pp.toFixed(2).replace('.00', '') + ' %';
  }
  [e, d, a].forEach(function (el) { el.addEventListener('input', calc); });
  calc();
})();
</script>`;

  return layout({
    path: '/',
    title: 'Calcul cahier d’appel : pourcentage de présence et d’absence gratuit',
    description: 'Calculateur gratuit pour le cahier d’appel : pourcentage de présence et d’absence de la classe, calcul par élève et statistiques de fin d’année.',
    body,
    ogType: 'website',
    jsonLd: [faqJsonLd()]
  });
}

/* ================= PAR ÉLÈVE ================= */
function pageParEleve() {
  const body = `<p class="eyebrow">SUIVI INDIVIDUEL</p>
<h1>Calcul du pourcentage d’absence par élève</h1>
<p class="lede">Ajoute chaque élève avec son nombre de demi-journées d’absence sur la période : le
pourcentage individuel se calcule automatiquement, ainsi que la moyenne de la classe.</p>

<div class="calc">
  <div class="calc-champs" style="grid-template-columns:1fr">
    <div class="calc-champ">
      <label for="pe-demijournees">Demi-journées de classe sur la période (identique pour tous les élèves)</label>
      <input type="number" id="pe-demijournees" min="1" value="40" inputmode="numeric" style="max-width:220px">
    </div>
  </div>

  <table class="tableau-eleves" id="pe-tableau">
    <thead>
      <tr><th>Élève</th><th>Demi-journées d’absence</th><th>% de présence</th><th></th></tr>
    </thead>
    <tbody id="pe-corps"></tbody>
  </table>
  <div class="calc-actions">
    <button type="button" class="calc-btn secondaire" id="pe-ajouter">+ Ajouter un élève</button>
  </div>

  <div class="calc-resultats" style="margin-top:28px">
    <div class="calc-resultat"><b>Élèves suivis</b><span id="pe-n">0</span></div>
    <div class="calc-resultat accent"><b>% de présence moyen</b><span id="pe-moyenne">—</span></div>
  </div>
</div>

<h2>Pourquoi suivre l’absentéisme élève par élève ?</h2>
<p>Le calcul global de la classe masque parfois des situations individuelles préoccupantes. Le suivi par
élève permet de repérer tôt un absentéisme récurrent et de le signaler selon la procédure de ton
académie, en complément des statistiques globales de la classe.</p>

<h2>Questions fréquentes</h2>
${faqHtml()}

<script>
(function () {
  var corps = document.getElementById('pe-corps');
  var demiJ = document.getElementById('pe-demijournees');
  var compteur = 0;

  function ligne(nom) {
    compteur++;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><input type="text" class="pe-nom" placeholder="Nom de l’élève" value="' + (nom || '') + '"></td>' +
      '<td><input type="number" class="pe-absences" min="0" value="0" inputmode="numeric"></td>' +
      '<td class="pct pe-pct">100 %</td>' +
      '<td><button type="button" class="suppr" aria-label="Supprimer">×</button></td>';
    corps.appendChild(tr);
    tr.querySelector('.pe-absences').addEventListener('input', recalc);
    tr.querySelector('.suppr').addEventListener('click', function () { tr.remove(); recalc(); });
  }

  function recalc() {
    var lignes = corps.querySelectorAll('tr');
    var nD = Math.max(0, parseInt(demiJ.value, 10) || 0);
    var total = 0, n = 0;
    lignes.forEach(function (tr) {
      var abs = Math.max(0, parseInt(tr.querySelector('.pe-absences').value, 10) || 0);
      var pct = nD > 0 ? Math.max(0, 100 - (abs / nD) * 100) : 100;
      tr.querySelector('.pe-pct').textContent = pct.toFixed(1).replace('.0', '') + ' %';
      total += pct; n++;
    });
    document.getElementById('pe-n').textContent = n;
    document.getElementById('pe-moyenne').textContent = n > 0 ? (total / n).toFixed(1).replace('.0', '') + ' %' : '—';
  }

  document.getElementById('pe-ajouter').addEventListener('click', function () { ligne(''); recalc(); });
  demiJ.addEventListener('input', recalc);

  ['Élève 1', 'Élève 2', 'Élève 3'].forEach(ligne);
  recalc();
})();
</script>`;

  return layout({
    path: '/par-eleve/',
    title: 'Calcul du pourcentage d’absence par élève — cahier d’appel',
    description: 'Calcule le pourcentage de présence et d’absence de chaque élève individuellement, avec la moyenne de la classe.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Par élève', href: '/par-eleve/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= STATISTIQUES ANNÉE ================= */
function pageStatsAnnee() {
  const body = `<p class="eyebrow">CUMUL SUR L’ANNÉE</p>
<h1>Statistiques de présence cumulées sur l’année</h1>
<p class="lede">Ajoute une ligne par mois ou par période (avec ses demi-journées possibles et ses
absences) : le cumul et le pourcentage annuel se calculent automatiquement.</p>

<div class="calc">
  <div id="an-periodes"></div>
  <div class="calc-actions">
    <button type="button" class="calc-btn secondaire" id="an-ajouter">+ Ajouter une période</button>
  </div>

  <div class="calc-resultats" style="margin-top:28px">
    <div class="calc-resultat"><b>Demi-journées possibles (année)</b><span id="an-possibles">0</span></div>
    <div class="calc-resultat"><b>Absences (année)</b><span id="an-absences">0</span></div>
    <div class="calc-resultat accent"><b>% de présence annuel</b><span id="an-pct-presence">100 %</span></div>
    <div class="calc-resultat"><b>% d’absence annuel</b><span id="an-pct-absence">0 %</span></div>
  </div>
</div>

<h2>Pourquoi cumuler par période plutôt que tout compter d’un coup ?</h2>
<p>La plupart des enseignants remplissent leur registre d’appel chaque fin de mois. Garder le détail par
période permet de vérifier une valeur suspecte, et de fournir le détail mensuel si l’administration le
demande, en plus du total annuel.</p>

<h2>Questions fréquentes</h2>
${faqHtml()}

<script>
(function () {
  var zone = document.getElementById('an-periodes');
  var compteur = 0;

  function ligne(nom) {
    compteur++;
    var div = document.createElement('div');
    div.className = 'periode';
    div.innerHTML =
      '<div><label>Période</label><input type="text" class="an-nom" value="' + (nom || 'Période ' + compteur) + '"></div>' +
      '<div><label>Demi-j. possibles</label><input type="number" class="an-possibles" min="0" value="0" inputmode="numeric"></div>' +
      '<div><label>Absences</label><input type="number" class="an-absences" min="0" value="0" inputmode="numeric"></div>' +
      '<div><button type="button" class="suppr" aria-label="Supprimer">×</button></div>';
    zone.appendChild(div);
    div.querySelectorAll('input').forEach(function (i) { i.addEventListener('input', recalc); });
    div.querySelector('.suppr').addEventListener('click', function () { div.remove(); recalc(); });
  }

  function recalc() {
    var lignes = zone.querySelectorAll('.periode');
    var totalPoss = 0, totalAbs = 0;
    lignes.forEach(function (div) {
      totalPoss += Math.max(0, parseInt(div.querySelector('.an-possibles').value, 10) || 0);
      totalAbs += Math.max(0, parseInt(div.querySelector('.an-absences').value, 10) || 0);
    });
    var pa = totalPoss > 0 ? (totalAbs / totalPoss) * 100 : 0;
    var pp = totalPoss > 0 ? 100 - pa : 100;
    document.getElementById('an-possibles').textContent = totalPoss.toLocaleString('fr-FR');
    document.getElementById('an-absences').textContent = totalAbs.toLocaleString('fr-FR');
    document.getElementById('an-pct-absence').textContent = pa.toFixed(2).replace('.00', '') + ' %';
    document.getElementById('an-pct-presence').textContent = pp.toFixed(2).replace('.00', '') + ' %';
  }

  document.getElementById('an-ajouter').addEventListener('click', function () { ligne(); recalc(); });
  ['Septembre', 'Octobre', 'Novembre'].forEach(ligne);
  recalc();
})();
</script>`;

  return layout({
    path: '/statistiques-annee/',
    title: 'Statistiques de présence cahier d’appel sur l’année — cumul automatique',
    description: 'Cumule les demi-journées possibles et les absences de plusieurs périodes pour obtenir le pourcentage de présence annuel du cahier d’appel.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Statistiques de l’année', href: '/statistiques-annee/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= FORMULE (page explicative) ================= */
function pageFormule() {
  const body = `<p class="eyebrow">MÉTHODE</p>
<h1>La formule officielle du cahier d’appel, expliquée</h1>
<p class="lede">Le calcul repose sur une seule notion à bien comprendre : la demi-journée. Voici la
méthode complète, avec un exemple chiffré.</p>

<h2>1. Compter les demi-journées possibles</h2>
<p>Une journée de classe compte pour <strong>2 demi-journées</strong> (matin + après-midi). Le nombre de
demi-journées possibles sur une période, c’est :</p>
<div class="callout"><p><strong>Demi-journées possibles = nombre d’élèves × nombre de demi-journées de classe sur la période</strong></p></div>

<h2>2. Compter les demi-journées d’absence</h2>
<p>On additionne toutes les demi-journées d’absence de tous les élèves sur la période. Un élève absent
une journée complète compte pour 2 ; absent seulement l’après-midi, il compte pour 1.</p>

<h2>3. Calculer les pourcentages</h2>
<div class="callout">
<p><strong>% d’absence = (demi-journées d’absence ÷ demi-journées possibles) × 100</strong></p>
<p><strong>% de présence = 100 − % d’absence</strong></p>
</div>

<h2>Exemple pas à pas</h2>
<p>Une classe de <strong>25 élèves</strong>, sur une période de <strong>20 jours de classe</strong> (soit 40
demi-journées), a cumulé <strong>18 demi-journées d’absence</strong> au total.</p>
<ul>
<li>Demi-journées possibles : 25 × 40 = <strong>1 000</strong></li>
<li>% d’absence : (18 ÷ 1 000) × 100 = <strong>1,8 %</strong></li>
<li>% de présence : 100 − 1,8 = <strong>98,2 %</strong></li>
</ul>
<p><a href="/">Refaire ce calcul avec tes propres chiffres →</a></p>

<h2>Questions fréquentes</h2>
${faqHtml()}`;

  return layout({
    path: '/formule-cahier-appel/',
    title: 'Formule du cahier d’appel : calcul du pourcentage de présence expliqué',
    description: 'La méthode officielle pas à pas pour calculer le pourcentage de présence et d’absence du cahier d’appel, avec un exemple chiffré.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'La formule', href: '/formule-cahier-appel/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= Pages légales ================= */
function pageMentionsLegales() {
  const body = `<p class="eyebrow">INFORMATIONS LÉGALES</p>
<h1>Mentions légales</h1>
<p>Site édité à titre non professionnel, conformément à l’article 6-III-2 de la loi n° 2004-575 du 21 juin
2004 pour la confiance dans l’économie numérique (LCEN), qui permet à un éditeur non professionnel de
conserver l’anonymat vis-à-vis du public tant que le site n’est pas monétisé.</p>
<p>Hébergement : Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis.</p>
<h2>Contenu</h2>
<p>Cet outil de calcul est indépendant et n’est affilié à aucune académie ni au ministère de l’Éducation
nationale. Les résultats sont fournis à titre indicatif : vérifie-les toujours face aux consignes
officielles de ton académie avant un envoi administratif.</p>`;
  return layout({
    path: '/mentions-legales/',
    title: 'Mentions légales — Cahier d’Appel',
    description: 'Informations légales du site Cahier d’Appel.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Mentions légales', href: '/mentions-legales/' }]
  });
}

function pageConfidentialite() {
  const body = `<p class="eyebrow">DONNÉES PERSONNELLES</p>
<h1>Confidentialité</h1>
<p>Ce site ne demande aucune inscription. Les chiffres que tu saisis dans les calculateurs restent dans
ton navigateur : ils ne sont jamais envoyés à un serveur, ni enregistrés, ni partagés. Si tu recharges la
page, les valeurs sont perdues — comme sur une calculatrice de bureau.</p>
<h2>Cookies publicitaires</h2>
<p>Si tu acceptes le bandeau de cookies, Google peut déposer des cookies publicitaires. Si tu refuses,
aucun cookie publicitaire n’est déposé et le site fonctionne à l’identique. Tu peux changer d’avis à tout
moment depuis le pied de page.</p>`;
  return layout({
    path: '/confidentialite/',
    title: 'Confidentialité — Cahier d’Appel',
    description: 'Politique de confidentialité du site Cahier d’Appel.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Confidentialité', href: '/confidentialite/' }]
  });
}

/* ================= Génération ================= */
let pages = 0;
ecrire('', pageAccueil()); pages++;
ecrire('par-eleve', pageParEleve()); pages++;
ecrire('statistiques-annee', pageStatsAnnee()); pages++;
ecrire('formule-cahier-appel', pageFormule()); pages++;
ecrire('mentions-legales', pageMentionsLegales()); pages++;
ecrire('confidentialite', pageConfidentialite()); pages++;

const urls = [
  { loc: url('/'), priority: '1.0' },
  { loc: url('/par-eleve/'), priority: '0.9' },
  { loc: url('/statistiques-annee/'), priority: '0.9' },
  { loc: url('/formule-cahier-appel/'), priority: '0.8' }
];

/* ---------- Assets ---------- */
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), CSS, 'utf8');

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#007aff"/><text x="16" y="23" font-size="17" text-anchor="middle" fill="#fff" font-family="-apple-system,'Plus Jakarta Sans',sans-serif" font-weight="800">%</text></svg>`;
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), favicon, 'utf8');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f5f7"/><rect x="0" y="0" width="1200" height="630" fill="none" stroke="#007aff" stroke-width="16"/><text x="600" y="290" font-size="76" text-anchor="middle" fill="#1d1d1f" font-family="-apple-system,'Plus Jakarta Sans',sans-serif" font-weight="800">Cahier d’Appel</text><text x="600" y="365" font-size="30" text-anchor="middle" fill="#007aff" font-family="-apple-system,'Plus Jakarta Sans',sans-serif" font-weight="600">Calcul du pourcentage de présence, gratuit et instantané</text></svg>`;
fs.writeFileSync(path.join(OUT, 'assets', 'og-cahierdappel.svg'), og, 'utf8');

/* ---------- robots.txt + sitemap.xml ---------- */
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${url('/sitemap.xml')}\n`, 'utf8');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemapXml, 'utf8');

console.log(`${pages} pages générées.`);
