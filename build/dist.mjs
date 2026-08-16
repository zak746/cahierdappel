/**
 * Assemble dans dist/ ce qui doit être publié — et seulement cela.
 *
 *   node build/dist.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');

const EXCLUS = new Set([
  'dist', 'build', 'node_modules', '.git', '.github', '.claude',
  'package.json', 'package-lock.json', 'README.md', '.gitignore'
]);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

let fichiers = 0;
let octets = 0;

function copier(rel = '') {
  const src = path.join(ROOT, rel);
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const relEnfant = rel ? path.join(rel, e.name) : e.name;
    if (!rel && EXCLUS.has(e.name)) continue;
    if (e.name.startsWith('.')) continue;
    const dest = path.join(DIST, relEnfant);
    if (e.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      copier(relEnfant);
    } else {
      fs.copyFileSync(path.join(ROOT, relEnfant), dest);
      fichiers++;
      octets += fs.statSync(dest).size;
    }
  }
}
copier();

fs.writeFileSync(path.join(DIST, '_headers'), `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`);

const mo = (octets / 1048576).toFixed(1);
console.log(`dist/ : ${fichiers} fichiers, ${mo} Mo`);
