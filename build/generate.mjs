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
  },
  {
    q: 'Cahier d’appel ou registre d’appel : quelle différence ?',
    r: 'Aucune différence de fond : « registre d’appel » (ou registre d’appel journalier) est le terme administratif officiel, « cahier d’appel » est le nom courant employé par les enseignants. Le calcul du pourcentage de présence est exactement le même dans les deux cas, et les calculateurs de ce site s’appliquent indifféremment à l’un ou à l’autre.'
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
  const body = `<div class="intro-calc">
<div class="intro"><p class="eyebrow">CALCUL DE PRÉSENCE ET D’ABSENCE</p>
<h1>Calcul cahier d’appel : pourcentage de présence en 5 secondes</h1></div>
<p class="lede">Entre le nombre d’élèves, la période concernée et le nombre de demi-journées d’absence :
le pourcentage de présence et d’absence de ta classe s’affiche instantanément, avec le détail du calcul.
Fonctionne pour le cahier comme pour le registre d’appel journalier.</p>

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

<h2>Aller plus loin</h2>
<ul>
<li><a href="/formule-cahier-appel/">La formule officielle du cahier d’appel</a>, expliquée pas à pas avec un exemple chiffré.</li>
<li><a href="/remplir-cahier-appel/">Comment remplir le cahier d’appel</a> : ce qu’on note chaque demi-journée, les retards, les erreurs à éviter.</li>
<li><a href="/registre-appel-imprimer/">Un registre d’appel à imprimer</a> : grille mensuelle vierge, matin et après-midi, à remplir au stylo.</li>
<li><a href="/calcul-registre-appel/">Le registre d’appel journalier</a> : ce qu’il doit contenir, qui le tient, ce que l’administration contrôle.</li>
<li><a href="/absenteisme-scolaire/">Absentéisme scolaire</a> : le seuil des 4 demi-journées et la procédure de signalement.</li>
<li><a href="/interpreter-taux-presence/">Interpréter ton taux de présence</a> : ce que la moyenne cache et comment comparer deux mois.</li>
</ul>

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
    title: 'Calcul cahier d’appel et registre d’appel : calculateur en ligne gratuit',
    description: 'Calculateur gratuit de cahier d’appel et de registre d’appel : pourcentage de présence et d’absence de la classe, calcul par élève, statistiques de l’année. Pour les enseignants.',
    body,
    ogType: 'website',
    jsonLd: [faqJsonLd()]
  });
}

/* ================= PAR ÉLÈVE ================= */
function pageParEleve() {
  const body = `<div class="intro-calc">
<div class="intro"><p class="eyebrow">SUIVI INDIVIDUEL</p>
<h1>Calcul du pourcentage d’absence par élève</h1></div>
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
    title: 'Calculer les absences par élève : pourcentage cahier d’appel',
    description: 'Calcule le pourcentage de présence et d’absence de chaque élève individuellement dans le cahier d’appel, avec la moyenne de la classe. Gratuit, sans inscription.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Par élève', href: '/par-eleve/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= STATISTIQUES ANNÉE ================= */
function pageStatsAnnee() {
  const body = `<div class="intro-calc">
<div class="intro"><p class="eyebrow">CUMUL SUR L’ANNÉE</p>
<h1>Statistiques de présence cumulées sur l’année</h1></div>
<p class="lede">Ajoute une ligne par mois ou par période (avec ses demi-journées possibles et ses
absences) : le cumul et le pourcentage annuel se calculent automatiquement.</p>

<div class="calc">
  <table class="tableau-eleves tableau-annee" id="an-tableau">
    <thead>
      <tr><th>Période</th><th>Demi-j. possibles</th><th>Absences</th><th>% présence</th><th></th></tr>
    </thead>
    <tbody id="an-corps"></tbody>
  </table>
  <div class="calc-actions">
    <button type="button" class="calc-btn secondaire" id="an-ajouter">+ Ajouter une période</button>
  </div>

  <div class="calc-resultats" style="margin-top:24px">
    <div class="calc-resultat"><b>Demi-journées possibles (année)</b><span id="an-possibles">0</span></div>
    <div class="calc-resultat"><b>Absences (année)</b><span id="an-absences">0</span></div>
    <div class="calc-resultat accent"><b>% de présence annuel</b><span id="an-pct-presence">100 %</span></div>
    <div class="calc-resultat"><b>% d’absence annuel</b><span id="an-pct-absence">0 %</span></div>
  </div>
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
  var corps = document.getElementById('an-corps');
  var compteur = 0;

  function ligne(nom) {
    compteur++;
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><input type="text" class="an-nom" value="' + (nom || 'Période ' + compteur) + '"></td>' +
      '<td><input type="number" class="an-possibles" min="0" value="0" inputmode="numeric"></td>' +
      '<td><input type="number" class="an-absences" min="0" value="0" inputmode="numeric"></td>' +
      '<td class="pct an-pct">—</td>' +
      '<td><button type="button" class="suppr" aria-label="Supprimer">×</button></td>';
    corps.appendChild(tr);
    tr.querySelectorAll('input').forEach(function (i) { i.addEventListener('input', recalc); });
    tr.querySelector('.suppr').addEventListener('click', function () { tr.remove(); recalc(); });
  }

  function recalc() {
    var lignes = corps.querySelectorAll('tr');
    var totalPoss = 0, totalAbs = 0;
    lignes.forEach(function (tr) {
      var poss = Math.max(0, parseInt(tr.querySelector('.an-possibles').value, 10) || 0);
      var abs = Math.max(0, parseInt(tr.querySelector('.an-absences').value, 10) || 0);
      totalPoss += poss;
      totalAbs += abs;
      tr.querySelector('.an-pct').textContent = poss > 0
        ? Math.max(0, 100 - (abs / poss) * 100).toFixed(1).replace('.0', '') + ' %'
        : '—';
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
    title: 'Calcul cahier d’appel statistiques année : cumul de fin d’année',
    description: 'Cumule les demi-journées possibles et les absences de chaque mois pour obtenir les statistiques de l’année du cahier d’appel et le pourcentage de présence annuel.',
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

/* ================= REMPLIR LE CAHIER D'APPEL (guide) ================= */
function pageRemplir() {
  const body = `<p class="eyebrow">GUIDE PRATIQUE</p>
<h1>Comment remplir le cahier d’appel : le guide complet</h1>
<p class="lede">Ce que l’enseignant doit noter chaque demi-journée, comment compter les absences et les
retards, et ce qu’il faut calculer en fin de mois et en fin d’année.</p>

<h2>Ce qu’on note à chaque demi-journée</h2>
<p>Le registre d’appel doit être tenu <strong>deux fois par jour</strong> : une fois le matin, une fois
l’après-midi. À chaque appel, on relève pour chaque élève s’il est présent ou absent. C’est cette
double saisie quotidienne qui fait que tout se compte ensuite en <strong>demi-journées</strong> et non en
journées.</p>
<div class="callout"><p>Une journée d’école = 2 demi-journées. Un élève absent toute la journée compte
donc pour <strong>2 demi-journées d’absence</strong>, et non 1.</p></div>

<h2>Faut-il noter les retards comme des absences ?</h2>
<p>Non. Un élève qui arrive en retard mais qui assiste bien à la demi-journée est
<strong>présent</strong> : on ne le compte pas dans les demi-journées d’absence. Le retard peut être noté
séparément dans une colonne d’observations si ton école en tient une, mais il ne rentre pas dans le
calcul du pourcentage.</p>

<h2>Absences justifiées ou non justifiées</h2>
<p>Pour le calcul du pourcentage de présence, on compte <strong>toutes</strong> les demi-journées
d’absence, qu’elles soient justifiées ou pas : le taux de présence mesure le temps réellement passé en
classe. La distinction justifié / non justifié sert au suivi de l’absentéisme et au signalement, pas au
calcul du taux.</p>

<h2>Ce qu’on calcule en fin de mois</h2>
<p>La plupart des académies demandent, chaque fin de mois :</p>
<ul>
<li>le nombre de <strong>demi-journées possibles</strong> (élèves × demi-journées de classe du mois) ;</li>
<li>le <strong>total des demi-journées d’absence</strong> de la classe ;</li>
<li>le <strong>pourcentage de présence</strong> qui en découle.</li>
</ul>
<div class="calc-actions">
  <a class="calc-btn" href="/">Faire le calcul du mois →</a>
  <a class="calc-btn secondaire" href="/par-eleve/">Calculer par élève →</a>
</div>

<h2>Ce qu’on calcule en fin d’année</h2>
<p>En fin d’année scolaire, on cumule les demi-journées possibles et les absences de tous les mois pour
obtenir le taux de présence annuel de la classe. Garder le détail mois par mois permet de vérifier une
valeur qui paraît fausse, et de fournir le détail si l’administration le demande.</p>
<p><a href="/statistiques-annee/">Cumuler les statistiques de l’année →</a></p>

<h2>Les erreurs les plus fréquentes</h2>
<ul>
<li><strong>Compter en journées au lieu de demi-journées</strong> : c’est l’erreur qui fausse le plus
souvent le résultat, elle divise le total d’absences par deux.</li>
<li><strong>Oublier de multiplier par le nombre d’élèves</strong> : les demi-journées possibles ne sont pas
le nombre de demi-journées de classe, mais ce nombre × l’effectif.</li>
<li><strong>Compter les jours fériés et les vacances</strong> : seules les demi-journées où la classe avait
effectivement lieu entrent dans le calcul.</li>
<li><strong>Inclure les retards</strong> dans les absences (voir plus haut).</li>
</ul>

<h2>Questions fréquentes</h2>
${faqHtml()}

<p class="lede" style="margin-top:2em"><a href="/formule-cahier-appel/">Voir le détail de la formule et un exemple chiffré →</a></p>`;

  return layout({
    path: '/remplir-cahier-appel/',
    title: 'Comment remplir le cahier d’appel : guide pour l’enseignant',
    description: 'Comment remplir le cahier d’appel : ce qu’on note chaque demi-journée, comment compter absences et retards, et ce qu’il faut calculer en fin de mois et d’année.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Remplir le cahier d’appel', href: '/remplir-cahier-appel/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= REGISTRE D'APPEL À IMPRIMER ================= */
function pageImprimer() {
  const body = `<div class="intro-calc">
<div class="intro"><p class="eyebrow">MODÈLE VIERGE</p>
<h1>Registre d’appel à imprimer : grille mensuelle vierge</h1></div>
<p class="lede">Choisis le nombre d’élèves et de jours de classe, puis imprime la grille. Chaque jour a
deux cases (matin et après-midi) à cocher, plus une colonne de total par élève.</p>

<div class="calc">
  <div class="calc-champs">
    <div class="calc-champ">
      <label for="im-eleves">Nombre de lignes élèves</label>
      <input type="number" id="im-eleves" min="1" max="40" value="25" inputmode="numeric">
    </div>
    <div class="calc-champ">
      <label for="im-jours">Nombre de jours de classe</label>
      <input type="number" id="im-jours" min="1" max="23" value="20" inputmode="numeric">
    </div>
  </div>
  <div class="calc-actions">
    <button type="button" class="calc-btn" id="im-imprimer">Imprimer la grille</button>
  </div>
</div>
</div>

<div class="grille-zone">
  <div class="grille-entete">
    <div><span>Classe</span><i></i></div>
    <div><span>Enseignant</span><i></i></div>
    <div><span>Mois / année</span><i></i></div>
  </div>
  <div class="scroll-x"><table class="grille" id="im-grille"></table></div>
  <p class="grille-note">M = matin · S = soir (après-midi). Cocher les cases d’<strong>absence</strong>.
  Total = nombre de demi-journées d’absence de l’élève sur le mois.</p>
</div>

<h2>Comment utiliser cette grille</h2>
<p>Imprime-la en début de mois et coche une case à chaque demi-journée d’absence. En fin de mois,
additionne les totaux de la colonne de droite : tu obtiens le total des demi-journées d’absence de la
classe, le seul chiffre dont tu as besoin pour le calcul du pourcentage.</p>
<div class="calc-actions">
  <a class="calc-btn" href="/">Calculer le pourcentage du mois →</a>
  <a class="calc-btn secondaire" href="/remplir-cahier-appel/">Comment remplir le registre →</a>
</div>

<h2>Questions fréquentes</h2>
${faqHtml()}

<script>
(function () {
  var nbE = document.getElementById('im-eleves'), nbJ = document.getElementById('im-jours');
  var table = document.getElementById('im-grille');

  function construire() {
    var e = Math.min(40, Math.max(1, parseInt(nbE.value, 10) || 1));
    var j = Math.min(23, Math.max(1, parseInt(nbJ.value, 10) || 1));
    var h1 = '<tr><th rowspan="2" class="col-nom">Élève</th>';
    var h2 = '<tr>';
    for (var d = 1; d <= j; d++) {
      h1 += '<th colspan="2">' + d + '</th>';
      h2 += '<th>M</th><th>S</th>';
    }
    h1 += '<th rowspan="2" class="col-total">Total</th></tr>';
    h2 += '</tr>';
    var corps = '';
    for (var n = 1; n <= e; n++) {
      corps += '<tr><td class="col-nom"></td>';
      for (var k = 0; k < j * 2; k++) corps += '<td></td>';
      corps += '<td class="col-total"></td></tr>';
    }
    table.innerHTML = '<thead>' + h1 + h2 + '</thead><tbody>' + corps + '</tbody>';
  }

  [nbE, nbJ].forEach(function (i) { i.addEventListener('input', construire); });
  document.getElementById('im-imprimer').addEventListener('click', function () { window.print(); });
  construire();
})();
</script>`;

  return layout({
    path: '/registre-appel-imprimer/',
    title: 'Registre d’appel à imprimer : grille mensuelle vierge gratuite',
    description: 'Grille de registre d’appel journalier à imprimer gratuitement : matin et après-midi, nombre d’élèves et de jours au choix, total des demi-journées d’absence par élève.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Registre à imprimer', href: '/registre-appel-imprimer/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= CALCUL REGISTRE D'APPEL ================= */
function pageRegistre() {
  const body = `<p class="eyebrow">REGISTRE D’APPEL JOURNALIER</p>
<h1>Calcul du registre d’appel : ce que l’administration attend</h1>
<p class="lede">Le registre d’appel journalier est le document officiel de suivi de la présence. Voici ce
qu’il doit contenir, qui doit le tenir, combien de temps le conserver, et comment en tirer les
pourcentages demandés.</p>

<h2>Registre d’appel ou cahier d’appel ?</h2>
<p>C’est le même document. <strong>Registre d’appel journalier</strong> est le terme administratif que
tu retrouveras dans les circulaires et les demandes de l’inspection ; <strong>cahier d’appel</strong> est
le nom courant employé dans les salles des maîtres. Le mode de calcul est identique dans les deux cas :
tout se compte en demi-journées.</p>
<div class="calc-actions">
  <a class="calc-btn" href="/">Calculer les pourcentages du registre →</a>
  <a class="calc-btn secondaire" href="/registre-appel-imprimer/">Registre vierge à imprimer →</a>
</div>

<h2>Ce que le registre doit faire apparaître</h2>
<ul>
<li>La <strong>liste nominative</strong> des élèves inscrits dans la classe.</li>
<li>Un relevé de présence <strong>par demi-journée</strong>, matin et après-midi — c’est le caractère
« journalier » du registre.</li>
<li>Les <strong>absences</strong>, avec l’information de leur justification ou non.</li>
<li>Les <strong>totaux</strong> permettant d’établir les statistiques mensuelles et annuelles.</li>
</ul>

<h2>Qui le tient, qui le contrôle</h2>
<p>Le registre est tenu par l’enseignant de la classe, sous la responsabilité du directeur d’école. Il
peut être demandé lors d’une inspection, et il sert de pièce de référence en cas de signalement
d’absentéisme ou de litige avec une famille. C’est pour cette raison que les chiffres doivent être
cohérents avec les statistiques transmises : un total qui ne correspond pas au détail du registre est
la première chose que l’administration repère.</p>

<h2>Combien de temps le conserver</h2>
<p>Les registres d’appel font partie des archives de l’école et se conservent plusieurs années — la
durée exacte dépend des instructions de ta commune et de ton académie, l’école n’en étant pas
propriétaire à titre personnel. En pratique, ne jette jamais un registre en fin d’année : remets-le à
la direction.</p>

<h2>Des pourcentages cohérents avec le registre</h2>
<p>Les trois chiffres que l’administration croise le plus souvent :</p>
<ul>
<li>les <strong>demi-journées possibles</strong> (effectif × demi-journées de classe de la période) ;</li>
<li>le <strong>total des demi-journées d’absence</strong> relevé dans le registre ;</li>
<li>le <strong>taux de présence</strong> qui en découle.</li>
</ul>
<p>Si l’un des trois ne colle pas avec les deux autres, c’est presque toujours une erreur de comptage en
journées au lieu de demi-journées. <a href="/formule-cahier-appel/">Le détail de la formule est ici</a>,
et <a href="/remplir-cahier-appel/">les erreurs fréquentes sont listées là</a>.</p>

<h2>Questions fréquentes</h2>
${faqHtml()}`;

  return layout({
    path: '/calcul-registre-appel/',
    title: 'Calcul du registre d’appel journalier : pourcentages et obligations',
    description: 'Le registre d’appel journalier : ce qu’il doit contenir, qui le tient, combien de temps le conserver, et comment calculer les pourcentages de présence attendus par l’administration.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Registre d’appel', href: '/calcul-registre-appel/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= ABSENTÉISME : SEUILS ET PROCÉDURE ================= */
function pageAbsenteisme() {
  const body = `<p class="eyebrow">SUIVI ET SIGNALEMENT</p>
<h1>Absentéisme scolaire : seuils, procédure et rôle de l’enseignant</h1>
<p class="lede">À partir de quand une absence devient un absentéisme à signaler, quelle procédure suivre,
et ce que le registre d’appel doit permettre de prouver.</p>

<div class="callout"><p>Cette page décrit le cadre général. Les modalités précises de signalement
varient selon les académies et les écoles : <strong>vérifie toujours la procédure de ton
établissement</strong> avant un envoi administratif.</p></div>

<h2>Le principe : l’instruction est obligatoire</h2>
<p>En France, l’instruction est obligatoire pour tous les enfants de <strong>3 à 16 ans</strong>. La
personne responsable de l’enfant doit faire connaître le <strong>motif</strong> de chaque absence, sans
délai. C’est ce qui distingue une absence justifiée d’une absence non justifiée — distinction qui n’a
pas d’effet sur le calcul du taux de présence, mais qui est décisive pour le signalement.</p>

<h2>Le seuil de référence : 4 demi-journées</h2>
<p>Le seuil communément retenu est de <strong>4 demi-journées d’absence sans motif légitime ni excuses
valables sur un même mois</strong>. À partir de ce niveau, l’absentéisme n’est plus traité comme un
incident isolé : le directeur d’école engage un dialogue avec la famille et, si la situation persiste,
transmet le dossier à l’autorité académique.</p>
<div class="callout"><p><strong>Attention au comptage :</strong> 4 demi-journées, ce n’est que
<strong>2 journées complètes</strong>. Le seuil est atteint beaucoup plus vite qu’on ne le croit
lorsqu’on raisonne en journées.</p></div>

<h2>La progression de la procédure</h2>
<ol>
<li><strong>Relevé.</strong> Les absences sont consignées dans le registre d’appel, demi-journée par
demi-journée, avec l’indication du motif reçu ou de son absence.</li>
<li><strong>Contact de la famille.</strong> L’enseignant signale la situation au directeur, qui prend
contact avec les responsables de l’élève pour comprendre et rappeler l’obligation d’assiduité.</li>
<li><strong>Dialogue formalisé.</strong> Si les absences continuent, un échange écrit et un plan
d’action avec la famille sont mis en place.</li>
<li><strong>Transmission à l’académie.</strong> En cas d’échec, le dossier part vers les services
académiques, qui disposent de leurs propres leviers d’accompagnement et de mise en demeure.</li>
</ol>

<h2>Ce que ça change pour ta tenue du registre</h2>
<p>Un registre correctement tenu est ta seule preuve en cas de contestation. Trois réflexes :</p>
<ul>
<li><strong>Noter au jour le jour</strong>, pas en reconstituant en fin de mois — une reconstitution est
facilement contestable.</li>
<li><strong>Distinguer justifié / non justifié</strong> dès la saisie : c’est cette colonne qui
déclenche ou non le seuil des 4 demi-journées, pas le total brut.</li>
<li><strong>Garder les justificatifs</strong> reçus, ou au moins la trace de leur réception.</li>
</ul>
<div class="calc-actions">
  <a class="calc-btn" href="/par-eleve/">Repérer les élèves concernés →</a>
  <a class="calc-btn secondaire" href="/remplir-cahier-appel/">Comment remplir le registre →</a>
</div>

<h2>Retards, absences prévues, sorties anticipées</h2>
<p>Un <strong>retard</strong> n’est pas une demi-journée d’absence si l’élève assiste bien à la
demi-journée. Une <strong>sortie anticipée</strong> autorisée non plus. En revanche une absence annoncée
à l’avance reste une absence : être prévenu ne la rend pas justifiée au sens de l’assiduité, c’est le
motif qui compte.</p>

<h2>Questions fréquentes</h2>
${faqHtml()}`;

  return layout({
    path: '/absenteisme-scolaire/',
    title: 'Absentéisme scolaire : seuil des 4 demi-journées et procédure',
    description: 'Absentéisme scolaire : le seuil de 4 demi-journées non justifiées par mois, la procédure de signalement étape par étape, et ce que le registre d’appel doit prouver.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Absentéisme scolaire', href: '/absenteisme-scolaire/' }],
    jsonLd: [faqJsonLd()]
  });
}

/* ================= INTERPRÉTER LE TAUX ================= */
function pageInterpreter() {
  const body = `<p class="eyebrow">LIRE SES CHIFFRES</p>
<h1>Taux de présence : comment l’interpréter</h1>
<p class="lede">Un pourcentage seul ne dit pas grand-chose. Voici comment lire un taux de présence,
ce qui relève de la variation normale, et ce qui mérite un regard plus attentif.</p>

<h2>Ce qu’un taux de classe cache</h2>
<p>Le taux global est une moyenne, et une moyenne masque les cas individuels. Une classe à
<strong>96 % de présence</strong> peut correspondre à deux réalités très différentes :</p>
<ul>
<li>l’absentéisme est <strong>réparti</strong> : chaque élève a manqué une ou deux demi-journées dans le
mois — situation banale, rien à signaler ;</li>
<li>l’absentéisme est <strong>concentré</strong> : la quasi-totalité des absences vient d’un ou deux
élèves — situation qui relève potentiellement du suivi individuel.</li>
</ul>
<p>Le taux global est identique dans les deux cas. C’est pour ça que le calcul par élève n’est pas un
luxe : c’est lui qui distingue les deux.</p>
<div class="calc-actions">
  <a class="calc-btn" href="/par-eleve/">Voir la répartition par élève →</a>
</div>

<h2>Les ordres de grandeur</h2>
<p>Sans valeur réglementaire — ce sont des repères de lecture, pas des seuils officiels :</p>
<ul>
<li><strong>Au-dessus de 95 %</strong> : profil habituel d’une classe d’école élémentaire sur un mois
sans épidémie.</li>
<li><strong>Entre 90 et 95 %</strong> : fréquent en hiver, ou sur un mois avec une vague de maladie.
S’explique généralement tout seul.</li>
<li><strong>En dessous de 90 %</strong> : vaut le coup de regarder la répartition par élève avant de
transmettre — soit un événement collectif explique tout, soit quelques situations individuelles pèsent
lourd.</li>
</ul>

<h2>L’effet trompeur des périodes courtes</h2>
<p>Plus la période est courte, plus le taux est instable. Sur une semaine de 8 demi-journées avec
20 élèves, il n’y a que 160 demi-journées possibles : <strong>une seule journée d’absence d’un élève
fait bouger le taux de plus d’un point</strong>. Sur un mois complet, le même événement devient
imperceptible.</p>
<p>Conséquence pratique : ne compare pas un taux hebdomadaire à un taux mensuel, et méfie-toi d’une
« chute » observée sur une période très courte.</p>

<h2>Comparer d’un mois sur l’autre, correctement</h2>
<p>Deux mois n’ont ni le même nombre de jours de classe, ni forcément le même effectif. Comparer les
<strong>pourcentages</strong> est valable ; comparer les <strong>totaux d’absences bruts</strong> ne
l’est pas. Un mois de 40 demi-journées et un mois de 32 demi-journées ne sont pas comparables en
valeur absolue.</p>
<p>Si ton effectif a changé en cours d’année (arrivée ou départ d’élèves), le nombre de demi-journées
possibles change aussi : recalcule-le pour la période concernée plutôt que de reprendre celui du mois
précédent.</p>
<div class="calc-actions">
  <a class="calc-btn" href="/statistiques-annee/">Cumuler proprement sur l’année →</a>
  <a class="calc-btn secondaire" href="/absenteisme-scolaire/">Quand faut-il signaler ? →</a>
</div>

<h2>Questions fréquentes</h2>
${faqHtml()}`;

  return layout({
    path: '/interpreter-taux-presence/',
    title: 'Taux de présence : comment l’interpréter et le comparer',
    description: 'Comment lire un taux de présence de classe : ce que la moyenne cache, les ordres de grandeur, l’effet des périodes courtes et comment comparer deux mois correctement.',
    body,
    crumbs: [{ nom: 'Accueil', href: '/' }, { nom: 'Interpréter le taux', href: '/interpreter-taux-presence/' }],
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
ecrire('remplir-cahier-appel', pageRemplir()); pages++;
ecrire('registre-appel-imprimer', pageImprimer()); pages++;
ecrire('calcul-registre-appel', pageRegistre()); pages++;
ecrire('absenteisme-scolaire', pageAbsenteisme()); pages++;
ecrire('interpreter-taux-presence', pageInterpreter()); pages++;
ecrire('mentions-legales', pageMentionsLegales()); pages++;
ecrire('confidentialite', pageConfidentialite()); pages++;

const urls = [
  { loc: url('/'), priority: '1.0' },
  { loc: url('/par-eleve/'), priority: '0.9' },
  { loc: url('/statistiques-annee/'), priority: '0.9' },
  { loc: url('/formule-cahier-appel/'), priority: '0.8' },
  { loc: url('/remplir-cahier-appel/'), priority: '0.8' },
  { loc: url('/registre-appel-imprimer/'), priority: '0.8' },
  { loc: url('/calcul-registre-appel/'), priority: '0.9' },
  { loc: url('/absenteisme-scolaire/'), priority: '0.7' },
  { loc: url('/interpreter-taux-presence/'), priority: '0.7' }
];

/* ---------- Assets ---------- */
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), CSS, 'utf8');

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#5856d6"/><rect x="16" y="12" width="32" height="40" rx="4" fill="none" stroke="#fff" stroke-width="4"/><line x1="22" y1="24" x2="34" y2="24" stroke="#fff" stroke-width="4" stroke-linecap="round"/><line x1="22" y1="32" x2="34" y2="32" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M22 40l4 4 8-8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
fs.writeFileSync(path.join(OUT, 'assets', 'favicon.svg'), favicon, 'utf8');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f5f7"/><rect x="0" y="0" width="1200" height="630" fill="none" stroke="#5856d6" stroke-width="16"/><text x="600" y="290" font-size="76" text-anchor="middle" fill="#1d1d1f" font-family="-apple-system,'Plus Jakarta Sans',sans-serif" font-weight="800">Cahier d’Appel</text><text x="600" y="365" font-size="30" text-anchor="middle" fill="#5856d6" font-family="-apple-system,'Plus Jakarta Sans',sans-serif" font-weight="600">Calcul du pourcentage de présence, gratuit et instantané</text></svg>`;
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
