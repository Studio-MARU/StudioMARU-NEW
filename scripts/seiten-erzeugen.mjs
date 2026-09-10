/**
 * Erzeugt nach dem Build für jede Route eine echte Datei.
 *
 * Hintergrund: GitHub Pages kennt keine Server-Regeln. Ohne diese Dateien
 * antwortet /portfolio mit dem Status 404 — im Browser lädt dank 404.html
 * trotzdem die App, aber Google sieht "nicht gefunden" und nimmt die Seite
 * nicht in den Index. Mit einer index.html je Route kommt ein sauberes 200.
 *
 * Die Routenliste wird aus src/App.tsx gelesen, damit sie nicht auseinander
 * läuft. Nebenbei entstehen sitemap.xml und robots.txt.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DOMAIN = 'https://studiomaru.at';

/** Nicht in den Index: hinter der Anmeldung, für Suchende ohne Wert. */
const NICHT_INDEXIEREN = ['/login', '/dashboard'];

const wurzel = process.cwd();
const dist = join(wurzel, 'dist');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html fehlt — zuerst "vite build" laufen lassen.');
  process.exit(1);
}

const seite = readFileSync(join(dist, 'index.html'), 'utf8');

const app = readFileSync(join(wurzel, 'src/App.tsx'), 'utf8');
const routen = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

if (routen.length === 0) {
  console.error('In src/App.tsx keine <Route path="…"> gefunden — Muster geändert?');
  process.exit(1);
}

// Der SPA-Rückfall für alles, was hier nicht abgedeckt ist.
writeFileSync(join(dist, '404.html'), seite);

const erzeugt = [];
for (const route of routen) {
  if (route === '/' || route.includes(':') || route === '*') continue;
  const ordner = join(dist, route);
  mkdirSync(ordner, { recursive: true });
  writeFileSync(join(ordner, 'index.html'), seite);
  erzeugt.push(route);
}

// Mit Schrägstrich am Ende: GitHub Pages leitet /portfolio auf /portfolio/
// um (301), weil es ein Ordner ist. Ohne den Schrägstrich läuft jeder
// Besucher — und Google — erst durch diese Weiterleitung.
const oeffentlich = [
  '/',
  ...erzeugt.filter((r) => !NICHT_INDEXIEREN.includes(r)).map((r) => `${r}/`),
];
const heute = new Date().toISOString().slice(0, 10);

writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${oeffentlich
  .map((r) => `  <url>\n    <loc>${DOMAIN}${r}</loc>\n    <lastmod>${heute}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`,
);

writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *
Allow: /
${NICHT_INDEXIEREN.map((r) => `Disallow: ${r}`).join('\n')}

Sitemap: ${DOMAIN}/sitemap.xml
`,
);

console.log(`Seiten erzeugt: ${erzeugt.join(', ')}`);
console.log(`In der sitemap.xml: ${oeffentlich.join(', ')}`);
