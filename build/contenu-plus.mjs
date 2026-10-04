/**
 * Contenus complémentaires (octobre 2026) : sections ajoutées avant la FAQ des
 * pages les plus courtes, et bloc « À lire aussi » commun à toutes les pages,
 * pour aider Google à explorer chaque page depuis les autres.
 */

export const PLUS = {
  accueil: `<h2>Comment utiliser le calculateur du cahier d’appel</h2>
<p>Trois chiffres suffisent, tous présents dans ton cahier ou ton registre d’appel :</p>
<ol>
<li><strong>Le nombre d’élèves inscrits</strong> dans la classe sur la période (élèves arrivés ou partis en
cours de mois : voir plus bas).</li>
<li><strong>Le nombre de demi-journées de classe</strong> sur la période : une journée de classe compte pour
deux demi-journées, une matinée seule (le mercredi par exemple) pour une seule.</li>
<li><strong>Le total des demi-journées d’absence</strong> de tous les élèves, justifiées ou non.</li>
</ol>
<p>Le calculateur donne alors les demi-journées possibles, les présences réelles, le pourcentage
d’absence et le pourcentage de présence. Ce sont les chiffres demandés en bas de page du cahier d’appel
ou dans le relevé mensuel envoyé à la direction.</p>

<h2>Exemple : un mois de classe en élémentaire</h2>
<p>Une classe de CM1 de <strong>24 élèves</strong> a eu classe <strong>16 jours</strong> en novembre, dont
quatre mercredis matin. Cela fait 12 journées complètes (24 demi-journées) et 4 matinées
(4 demi-journées), soit <strong>28 demi-journées</strong> de classe. Les absences cumulées du mois
s’élèvent à <strong>21 demi-journées</strong>.</p>
<ul>
<li>Demi-journées possibles : 24 × 28 = <strong>672</strong></li>
<li>Présences réelles : 672 − 21 = <strong>651</strong></li>
<li>Pourcentage d’absence : 21 ÷ 672 × 100 = <strong>3,1 %</strong></li>
<li>Pourcentage de présence : <strong>96,9 %</strong></li>
</ul>

<h2>Les cas particuliers à ne pas oublier</h2>
<ul>
<li><strong>Élève arrivé en cours de mois</strong> : il ne compte que pour les demi-journées où il était
inscrit. Le plus simple est de calculer ses demi-journées possibles à part, puis de les ajouter au total
(le <a href="/statistiques-annee/">cumul sur plusieurs périodes</a> le fait automatiquement).</li>
<li><strong>Sortie scolaire ou classe transplantée</strong> : l’élève qui y participe est présent ; celui
qui reste à la maison sans motif est absent.</li>
<li><strong>Retard</strong> : un retard n’est pas une absence. Il se note à part et ne change pas le
pourcentage.</li>
<li><strong>Jour de grève sans accueil</strong> : la demi-journée n’est pas une demi-journée de classe pour
les élèves concernés ; elle ne doit pas être comptée comme possible.</li>
</ul>
<p>Pour la méthode détaillée, lis <a href="/formule-cahier-appel/">la formule du cahier d’appel</a> ;
pour suivre chaque enfant, utilise le <a href="/par-eleve/">calcul par élève</a>.</p>`,

  parEleve: `<h2>Lire le pourcentage d’absence d’un élève</h2>
<p>Le pourcentage individuel se calcule exactement comme celui de la classe, mais pour un seul enfant :</p>
<div class="callout"><p><strong>% d’absence de l’élève = demi-journées d’absence ÷ demi-journées de classe de la période × 100</strong></p></div>
<p>Sur un mois de <strong>40 demi-journées</strong>, un élève absent <strong>6 demi-journées</strong> a un taux
d’absence de 15 % et un taux de présence de 85 %. Le même nombre d’absences sur un trimestre de 120
demi-journées ne représente plus que 5 %. C’est pourquoi il faut toujours préciser la période.</p>

<h2>Quand un taux individuel doit-il alerter ?</h2>
<p>Le pourcentage ne suffit pas : ce qui déclenche la procédure, ce sont les <strong>absences non justifiées</strong>.
À partir de <strong>quatre demi-journées d’absence sans motif légitime dans le mois</strong>, la situation de l’élève
doit être signalée à la direction de l’école ou de l’établissement, qui saisit les services académiques
(voir <a href="/absenteisme-scolaire/">absentéisme scolaire : seuils et procédure</a>).</p>
<ul>
<li><strong>Absences ponctuelles et justifiées</strong> (maladie, rendez-vous médical) : simple suivi.</li>
<li><strong>Absences répétées le même jour de la semaine</strong> : à repérer tôt, même avec un faible
pourcentage, et à évoquer avec la famille.</li>
<li><strong>Taux de présence sous 90 % sur un trimestre</strong> : un dialogue avec la famille est conseillé,
quelles que soient les justifications.</li>
</ul>

<h2>Bonnes pratiques de suivi</h2>
<p>Fais le point en fin de mois, en reprenant les demi-journées du registre. Note les absences non
justifiées séparément : ce sont elles qui comptent pour le signalement. Garde enfin une trace des
échanges avec les familles. Pour un bilan sur l’année entière, passe par les
<a href="/statistiques-annee/">statistiques annuelles</a>, et pour lire les chiffres sans erreur, consulte
<a href="/interpreter-taux-presence/">comment interpréter un taux de présence</a>.</p>`,

  statsAnnee: `<h2>Pourquoi cumuler les demi-journées plutôt que faire la moyenne des pourcentages ?</h2>
<p>C’est l’erreur la plus fréquente dans les bilans annuels. Les mois n’ont pas le même nombre de
demi-journées de classe : septembre, décembre ou avril en comptent moins à cause des vacances. Faire la
moyenne des pourcentages mensuels donne autant de poids à un mois de 20 demi-journées qu’à un mois
de 40, ce qui fausse le résultat.</p>
<p>La bonne méthode consiste à additionner les <strong>demi-journées possibles</strong> de chaque période d’un
côté, les <strong>demi-journées d’absence</strong> de l’autre, puis à calculer un seul pourcentage sur les
totaux. C’est exactement ce que fait le calculateur ci-dessus.</p>

<h2>Exemple sur un trimestre</h2>
<ul>
<li>Septembre : 600 demi-journées possibles, 9 absences (1,5 %)</li>
<li>Octobre : 750 demi-journées possibles, 30 absences (4 %)</li>
<li>Novembre : 700 demi-journées possibles, 14 absences (2 %)</li>
</ul>
<p>La moyenne des trois pourcentages donnerait 2,5 %. Le vrai taux d’absence du trimestre est de
53 ÷ 2 050 × 100 = <strong>2,6 %</strong>, soit <strong>97,4 % de présence</strong>. L’écart paraît faible ici, mais il
devient important quand un mois très court a un taux élevé.</p>

<h2>Que faire de ces statistiques ?</h2>
<p>Le bilan annuel sert au conseil d’école ou au conseil de classe, au rapport d’activité de l’école et
au suivi de l’absentéisme. Compare surtout l’évolution d’une période à l’autre : une hausse régulière
au même moment de l’année (fin de trimestre, veille de vacances) se repère mieux sur les cumuls que sur
un seul mois. Pour remplir le relevé de chaque mois, commence par le
<a href="/">calculateur de la classe</a>, puis reporte les totaux ici.</p>`,

  formule: `<h2>Comment calculer les présences possibles dans le mois</h2>
<p>Les présences possibles (ou demi-journées possibles) du mois se calculent en deux temps :</p>
<ol>
<li><strong>Compter les demi-journées de classe du mois</strong> : 2 par journée complète, 1 par matinée
seule, 0 pour les jours fériés, les vacances et les ponts sans classe.</li>
<li><strong>Multiplier par le nombre d’élèves inscrits</strong>. Si l’effectif a changé en cours de mois,
calcule chaque élève à part pour la durée de son inscription, puis additionne.</li>
</ol>
<p>Exemple : 25 élèves, 18 jours de classe dont 4 mercredis matin, soit 14 journées complètes
(28 demi-journées) et 4 matinées (4 demi-journées), soit 32 demi-journées. Présences possibles :
25 × 32 = <strong>800</strong>. Avec 24 demi-journées d’absence, les présences réelles sont de
<strong>776</strong>, soit <strong>97 % de présence</strong>.</p>

<h2>Les erreurs les plus fréquentes</h2>
<ul>
<li><strong>Compter les journées au lieu des demi-journées</strong> : le résultat est alors divisé par deux
et le pourcentage d’absence est faux.</li>
<li><strong>Oublier un jour férié ou un pont</strong> : les demi-journées possibles sont surestimées et le
taux d’absence paraît plus faible qu’il ne l’est.</li>
<li><strong>Compter les retards comme des absences</strong> : un retard se note mais n’entre pas dans le
calcul.</li>
<li><strong>Faire la moyenne des pourcentages de plusieurs mois</strong> : il faut additionner les
demi-journées (voir les <a href="/statistiques-annee/">statistiques de l’année</a>).</li>
</ul>
<p>Pour le registre tenu chaque jour et ce que l’administration attend, lis aussi
<a href="/calcul-registre-appel/">le calcul du registre d’appel journalier</a>.</p>`,

  imprimer: `<h2>Comment remplir la grille imprimée</h2>
<p>Chaque ligne correspond à un élève et chaque colonne à une demi-journée du mois (M pour le matin,
A pour l’après-midi). La convention la plus répandue :</p>
<ul>
<li><strong>Case vide</strong> : élève présent.</li>
<li><strong>Barre oblique (/)</strong> : absence, à compléter en croix (X) une fois l’absence non justifiée
confirmée, ou en lettre (M pour maladie, par exemple) si ton école utilise un code.</li>
<li><strong>R</strong> : retard, qui ne compte pas comme une absence.</li>
</ul>
<p>Garde la même convention toute l’année : c’est elle qui permet de compter vite les absences en fin de
mois et de repérer les absences non justifiées à signaler.</p>

<h2>Le bilan en bas de page</h2>
<p>À la fin du mois, on reporte en bas de la grille : le nombre de demi-journées de classe, le total des
demi-journées d’absence par élève et pour la classe, puis les pourcentages. Le
<a href="/">calculateur</a> donne ces chiffres en quelques secondes à partir des totaux, et le
<a href="/par-eleve/">calcul par élève</a> fait le détail pour chaque enfant.</p>

<h2>Conseils d’impression</h2>
<p>Imprime en <strong>A4 paysage</strong>, sans marges personnalisées, pour que les 31 jours tiennent sur une
seule page. Une grille par mois et par classe suffit ; garde les feuilles dans l’ordre avec le cahier
d’appel officiel de l’école, qui reste le document de référence. Pour savoir comment tenir le cahier au
quotidien, consulte le guide <a href="/remplir-cahier-appel/">comment remplir le cahier d’appel</a>.</p>`,
};

const LIENS = [
  ['/', 'Calculer le pourcentage de présence d’une classe'],
  ['/par-eleve/', 'Calculer les absences par élève'],
  ['/statistiques-annee/', 'Faire les statistiques de l’année'],
  ['/formule-cahier-appel/', 'La formule du cahier d’appel'],
  ['/remplir-cahier-appel/', 'Comment remplir le cahier d’appel'],
  ['/calcul-registre-appel/', 'Le calcul du registre d’appel journalier'],
  ['/absenteisme-scolaire/', 'Absentéisme scolaire : seuils et procédure'],
  ['/interpreter-taux-presence/', 'Interpréter un taux de présence'],
  ['/registre-appel-imprimer/', 'Registre d’appel à imprimer'],
];

/** Bloc « À lire aussi » : toutes les pages du site sauf la page courante. */
export function aLireAussi(path) {
  if (!LIENS.some(([href]) => href === path)) return '';
  const items = LIENS.filter(([href]) => href !== path)
    .map(([href, txt]) => `<li><a href="${href}">${txt}</a></li>`).join('\n');
  return `<section class="a-lire" aria-labelledby="a-lire-titre">
<h2 id="a-lire-titre">À lire aussi</h2>
<ul>
${items}
</ul>
</section>`;
}
