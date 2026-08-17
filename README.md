# Cahier d'Appel — site statique

Calculateurs de pourcentage de présence et d'absence pour les enseignants, plus
les guides du cluster « cahier d'appel / registre d'appel ». Déployé sur
https://cahierdappel.fr via GitHub → Cloudflare Pages : un `git push` sur `main`
suffit à mettre en ligne.

## Reconstruire le site

```bash
node build/generate.mjs        # écrit les 12 pages à la racine
node build/validate-site.mjs   # contrôle : sort en code 1 si quelque chose casse
node build/dist.mjs            # recopie dans dist/ avec _headers
```

## Structure

```
/                              calculateur de classe entière
/par-eleve/                    taux d'absence élève par élève
/statistiques-annee/           cumul de plusieurs périodes
/registre-appel-imprimer/      grille mensuelle vierge, mise en page paysage
/remplir-cahier-appel/         guide de tenue du cahier
/formule-cahier-appel/         la formule détaillée
/calcul-registre-appel/        ce que l'administration attend
/absenteisme-scolaire/         seuils et procédure de signalement
/interpreter-taux-presence/    lire un taux sans se tromper
/mentions-legales/  /confidentialite/
404.html  robots.txt  sitemap.xml  /assets/

build/                         générateur (non publié)
  site.mjs                     configuration et gabarit HTML
  site-css.mjs                 feuille de style
  generate.mjs                 génération des pages et des FAQ
  validate-site.mjs            contrôle des pages produites
  dist.mjs                     assemblage de dist/
```

## Points à ne pas défaire

- **Chaque page a ses propres questions**, dans `FAQ_PAR_PAGE` de
  `build/generate.mjs`. Le même bloc répété partout, comme c'était le cas
  auparavant, faisait de la majeure partie de chaque page un texte identique aux
  autres, et soumettait à Google neuf `FAQPage` semblables dont il n'aurait
  retenu qu'un. Le validateur vérifie qu'aucune question balisée n'est absente du
  texte visible : baliser une réponse invisible enfreint les règles de Google sur
  les données structurées.
- **Rien n'est envoyé sur un serveur.** Les calculs sont entièrement dans le
  navigateur ; la page de confidentialité l'affirme, il faut que ça reste vrai.
- **Les champs de saisie sont en 16 px minimum.** En dessous, iOS zoome à chaque
  fois qu'on touche une cellule et ne dézoome jamais. Ne pas « corriger » ça avec
  un `maximum-scale` sur le viewport, qui casserait l'accessibilité.
- **Les bordures d'impression sont en `1px solid #000`.** Une bordure sous le
  pixel est arrondie à zéro par les navigateurs : le tableau sort alors sans
  aucun trait sur le papier.
- **`404.html` doit exister.** Sans lui, Cloudflare Pages sert l'accueil en 200
  sur une URL inconnue, ce que Google indexe comme un doublon.

## Mentions légales

Le site est publié sous le régime de l'article 6-III-2 de la LCEN, qui dispense
un éditeur non professionnel de publier son identité **tant que le site n'est pas
monétisé**. Si de la publicité est activée un jour, cette dispense tombe et les
mentions légales doivent être complétées avec l'identité de l'éditeur.
