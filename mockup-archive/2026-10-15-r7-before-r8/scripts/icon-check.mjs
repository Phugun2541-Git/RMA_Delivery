// Icon check: every Material Symbols name the mockup can render must be in the Google Fonts `icon_names=` subset,
// otherwise the browser shows the ligature as a plain word (e.g. "person"). Exit code 1 on any problem.
// Usage: node scripts/icon-check.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const problems = [];

// Renderers read location/localStorage at import time; give them a quiet node stand-in.
globalThis.location ??= { hash: '', search: '' };

// 1. The subset requested by each HTML entry point
const subsetOf = (file) => {
  const html = readFileSync(path.join(root, file), 'utf8');
  const m = html.match(/icon_names=([a-z0-9_,]+)/);
  if (!m) { problems.push(`${file}: no icon_names= subset found`); return new Set(); }
  const names = m[1].split(',');
  const sorted = [...names].sort();
  if (names.join() !== sorted.join()) problems.push(`${file}: icon_names must be sorted alphabetically (Google Fonts rejects unsorted lists)`);
  return new Set(names);
};
const subset = subsetOf('index.html');
const boardSubset = subsetOf('board.html');
for (const n of subset) if (!boardSubset.has(n)) problems.push(`board.html subset is missing "${n}" (index.html has it)`);
for (const n of boardSubset) if (!subset.has(n)) problems.push(`index.html subset is missing "${n}" (board.html has it)`);

// 2. Static maps: every homeIcon key and legacy glyph must resolve to a subset name
const { ICONS, LEGACY_ICON_NAMES } = await import(pathToFileURL(path.join(src, 'ui/home-icons.js')));
const used = new Map(); // name -> where
const use = (name, where) => { if (!used.has(name)) used.set(name, where); };
Object.entries(ICONS).forEach(([k, v]) => use(v, `home-icons.js ICONS.${k}`));
Object.entries(LEGACY_ICON_NAMES).forEach(([k, v]) => use(v, `home-icons.js legacy "${k}"`));

// 3. homeIcon keys used in source must exist in ICONS (unknown keys silently fall back to the sparkles icon)
const files = [];
const walk = (dir) => readdirSync(dir).forEach((f) => { const p = path.join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.js')) files.push(p); });
walk(src);
const keyPatterns = [/homeIcon\(\s*["'`](\w+)["'`]/g, /iconButton\(\s*["'`](\w+)["'`]/g, /\bicon:\s*["'](\w+)["']/g, /\["[^"]+",\s*"(\w+)",\s*"[A-Z]-\d\d"\]/g];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  for (const re of keyPatterns) for (const m of text.matchAll(re)) {
    if (!ICONS[m[1]]) problems.push(`${rel}: icon key "${m[1]}" is not in ICONS (renders the fallback icon)`);
  }
  // literal material spans written by hand
  for (const m of text.matchAll(/material-symbols-rounded[^"]*"[^>]*>([a-z0-9_]+)</g)) use(m[1], `${rel} literal span`);
}

// 4. Render every screen, state, modal and push banner and read back what actually reaches the page
const { SCREENS, STATE_OPTIONS } = await import(pathToFileURL(path.join(src, 'data/screens.js')));
const { renderScreen } = await import(pathToFileURL(path.join(src, 'ui/renderers.js')));
const { buildCtx, createState } = await import(pathToFileURL(path.join(src, 'app-state.js')));
const { modalMarkup } = await import(pathToFileURL(path.join(src, 'ui/modals.js')));
const { NOTIFS } = await import(pathToFileURL(path.join(src, 'data/notifications.js')));
const { pushBanner, bellButton } = await import(pathToFileURL(path.join(src, 'ui/notifications.js')));

const rendered = [];
const tweaks = [null, (s) => { s.messageTab = 'แจ้งเตือน'; }, (s) => { s.riderOnline = true; s.trackOpen = true; s.orderMenuOpen = true; }, (s) => { s.notifs = []; }];
for (const s of SCREENS) {
  for (const value of STATE_OPTIONS[s.id] || [null]) {
    for (const tweak of tweaks) {
      const st = createState(); st.currentId = s.id; if (value) st.screenStates[s.id] = value; if (tweak) tweak(st);
      try { rendered.push([`${s.id}${value ? ` [${value}]` : ''}`, renderScreen(s.id, buildCtx(s.id === 'A-06' ? { ...st, previousId: 'M-17' } : st))]); }
      catch (e) { problems.push(`${s.id}: render error ${e.message}`); }
    }
  }
}
const modalSrc = readFileSync(path.join(src, 'ui/modals.js'), 'utf8') + readFileSync(path.join(src, 'ui/modals-extra.js'), 'utf8');
const modalTypes = new Set([...modalSrc.matchAll(/type\s*===\s*['"]([\w-]+)['"]/g)].map((m) => m[1]));
for (const type of modalTypes) {
  for (const target of ['order', 'ride']) {
    const st = createState(); st.paymentTarget = target;
    try { rendered.push([`modal ${type}`, modalMarkup(type, st)]); } catch (e) { problems.push(`modal ${type}: render error ${e.message}`); }
  }
}
Object.keys(NOTIFS).forEach((k) => rendered.push([`push ${k}`, pushBanner(k, 1)]));
['C', 'M', 'R'].forEach((r) => rendered.push([`bell ${r}`, bellButton(r, buildCtx(createState()))]));

const spanRe = /<span class="material-symbols-rounded[^"]*"[^>]*>([^<]*)<\/span>/g;
for (const [where, html] of rendered) {
  for (const m of html.matchAll(spanRe)) use(m[1].trim(), where);
  // an icon name printed as plain text (the A-06 "person"/"business" bug): a lone snake_case word between tags
  const bare = html.replace(spanRe, '').match(/>\s*([a-z]+(?:_[a-z]+)*)\s*</g) || [];
  bare.map((x) => x.replace(/[<>\s]/g, '')).filter((w) => w.length > 2).forEach((w) => problems.push(`${where}: icon-like word "${w}" rendered as text (missing material-symbols span?)`));
}

for (const [name, where] of used) {
  if (!name) problems.push(`${where}: empty material-symbols span`);
  else if (!subset.has(name)) problems.push(`"${name}" (first seen: ${where}) is not in the icon_names subset`);
}

const unique = [...new Set(problems)];
console.log(`icon-check: ${used.size} icon names used · subset ${subset.size} · ${rendered.length} renders`);
if (unique.length) { console.log(unique.map((p) => `FAIL ${p}`).join('\n')); process.exit(1); }
console.log('OK   all icon names are in the subset');
