/**
 * Contrôle des pages générées — Cahier d'Appel.
 *
 *   node build/validate-site.mjs
 *
 * À lancer après chaque `node build/generate.mjs`. Le script sort en code 1 si
 * quelque chose est cassé, ce qui permet de l'enchaîner sans lire la sortie :
 *   node build/generate.mjs && node build/validate-site.mjs && node build/dist.mjs
 *
 * Ce que le script attrape et qu'une relecture à l'œil laisse passer : un lien
 * interne vers une page renommée, un script inline devenu invalide à cause d'une
 * interpolation, un identifiant HTML dupliqué qui casse un getElementById, un
 * titre trop long pour l'affichage de Google, une question balisée en FAQPage
 * mais absente du texte visible (ce dernier cas est une infraction aux règles
 * de Google sur les données structurées, pas une simple étourderie).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ignored = new Set(['.git', 'dist', 'node_modules', 'tmp']);
const htmlFiles = [];
const failures = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}

function targetFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]).replace(/^\/+/, '');
  if (!clean) return path.join(root, 'index.html');
  if (path.extname(clean)) return path.join(root, clean);
  return path.join(root, clean, 'index.html');
}

walk(root);

let checkedReferences = 0;
let checkedInlineScripts = 0;
let checkedQuestions = 0;
const missing = new Set();
const titres = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).replaceAll('\\', '/');

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) failures.push(`${relative}: ${h1Count} balise(s) h1`);
  if (!/<meta\s+name="viewport"/i.test(html)) failures.push(`${relative}: viewport absent`);
  if (!/rel="canonical"/i.test(html)) failures.push(`${relative}: canonical absent`);

  const titre = (html.match(/<title>([^<]*)<\/title>/i) || [, ''])[1];
  const description = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [, ''])[1];
  if (titre.length < 8) failures.push(`${relative}: titre HTML absent`);
  // Google tronque l'affichage vers 60 caractères : au-delà, la fin n'est lue par personne.
  if (titre.length > 60) failures.push(`${relative}: titre de ${titre.length} caractères (max 60)`);
  if (!description) failures.push(`${relative}: description absente`);
  else if (description.length > 160) failures.push(`${relative}: description de ${description.length} caractères (max 160)`);
  if (titre) titres.set(titre, [...(titres.get(titre) || []), relative]);
  if (description) descriptions.set(description, [...(descriptions.get(description) || []), relative]);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${relative}: identifiant HTML dupliqué`);

  const imagesSansDimension = [...html.matchAll(/<img\b([^>]*)>/gi)]
    .filter((m) => !/\bwidth\s*=/i.test(m[1]) || !/\bheight\s*=/i.test(m[1])).length;
  if (imagesSansDimension) failures.push(`${relative}: ${imagesSansDimension} image(s) sans width/height`);

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1];
    if (/\bsrc\s*=/i.test(attributes)) continue;
    if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) {
      // Chaque question balisée doit exister dans le texte visible de la page.
      let donnees;
      try {
        donnees = JSON.parse(match[2]);
      } catch (error) {
        failures.push(`${relative}: données structurées illisibles (${error.message})`);
        continue;
      }
      if (donnees['@type'] === 'FAQPage') {
        for (const question of donnees.mainEntity || []) {
          checkedQuestions += 1;
          if (!html.includes(question.name)) {
            failures.push(`${relative}: question balisée absente du texte visible — « ${question.name.slice(0, 50)}… »`);
          }
        }
      }
      continue;
    }
    checkedInlineScripts += 1;
    try {
      // Compilation seule : détecte un script généré invalide sans l'exécuter.
      new Function(match[2]);
    } catch (error) {
      failures.push(`${relative}: script inline invalide (${error.message})`);
    }
  }

  for (const match of html.matchAll(/\s(?:href|src)="(\/[^"#]*)"/g)) {
    const reference = match[1];
    if (reference.includes("'") || reference.includes('+')) continue;
    checkedReferences += 1;
    if (!fs.existsSync(targetFor(reference))) missing.add(`${relative} -> ${reference}`);
  }
}

for (const item of missing) failures.push(`Référence interne absente: ${item}`);

/* Titres et descriptions dupliqués : sur un site de neuf pages, deux pages qui
   se présentent pareil se font concurrence dans les résultats. */
for (const [valeur, pages] of titres) {
  if (pages.length > 1) failures.push(`Titre dupliqué sur ${pages.length} pages: « ${valeur.slice(0, 50)}… » (${pages.join(', ')})`);
}
for (const [valeur, pages] of descriptions) {
  if (pages.length > 1) failures.push(`Description dupliquée sur ${pages.length} pages: ${pages.join(', ')}`);
}

const cssPath = path.join(root, 'assets', 'site.css');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  const ouvrantes = (css.match(/{/g) || []).length;
  const fermantes = (css.match(/}/g) || []).length;
  if (ouvrantes !== fermantes) failures.push(`assets/site.css: ${ouvrantes} accolades ouvrantes pour ${fermantes} fermantes`);
  for (const match of css.matchAll(/url\(['"]?(\/[^)'"?#]+)['"]?\)/g)) {
    checkedReferences += 1;
    if (!fs.existsSync(targetFor(match[1]))) failures.push(`Asset CSS absent: ${match[1]}`);
  }
}

console.log(JSON.stringify({
  htmlPages: htmlFiles.length,
  checkedReferences,
  checkedInlineScripts,
  checkedQuestions,
  missingReferences: missing.size,
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
