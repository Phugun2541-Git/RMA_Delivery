// Exports CSS design tokens (tokens.css, role colours in app.css, customer palettes in palettes.css + home.css) to Tokens Studio JSON.
// Run: node scripts/export-tokens.mjs  → figma/tokens.json
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = async (f) => (await readFile(path.join(root, 'src/styles', f), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
const rules = (text) => [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim().replace(/\s+/g, ' '), decl: Object.fromEntries([...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((d) => [d[1], d[2].trim()])) }));

const SKIP = new Set(['--ease']);
function put(set, name, value) {
  if (SKIP.has(name)) return;
  const n = name.slice(2);
  let group; let key; let type = 'color';
  if (n.startsWith('radius-')) { group = ['radius']; key = n.slice(7); type = 'borderRadius'; }
  else if (n.startsWith('space-')) { group = ['spacing']; key = n.slice(6); type = 'spacing'; }
  else if (n.startsWith('font-')) { group = ['fontSize']; key = n.slice(5); type = 'fontSizes'; }
  else if (n === 'tap') { group = ['size']; key = 'tap'; type = 'sizing'; }
  else if (n.startsWith('shadow')) { group = ['shadow']; key = n === 'shadow' ? 'default' : n.slice(7); type = 'other'; }
  else { group = ['color']; key = n.replace(/^home-/, 'home.').replace(/-/g, '-'); }
  let target = set;
  for (const g of group) target = (target[g] ??= {});
  const parts = key.split('.');
  for (const p of parts.slice(0, -1)) target = (target[p] ??= {});
  target[parts.at(-1)] = { value, type };
}

const sets = { global: {}, light: {}, dark: {} };
const ensure = (name) => (sets[name] ??= {});

for (const r of rules(await css('tokens.css'))) {
  if (r.sel === ':root') for (const [k, v] of Object.entries(r.decl)) put(/^--(radius|space|font|tap)/.test(k) ? sets.global : sets.light, k, v);
  if (r.sel === ':root[data-theme="dark"]') for (const [k, v] of Object.entries(r.decl)) put(sets.dark, k, v);
}
const dark = (s) => s.includes('[data-theme="dark"]');
for (const r of rules(await css('app.css'))) {
  const m = r.sel.match(/\.phone\[data-role="([MR])"\]$/);
  if (m) for (const [k, v] of Object.entries(r.decl)) put(ensure(`role-${m[1] === 'M' ? 'merchant' : 'rider'}-${dark(r.sel) ? 'dark' : 'light'}`), k, v);
}
for (const f of ['palettes.css', 'home.css']) {
  for (const r of rules(await css(f))) {
    const p = r.sel.match(/data-home-palette="(\w+)"\]/)?.[1];
    if (!p) continue;
    const mode = dark(r.sel) ? 'dark' : 'light';
    if (r.sel.includes(':has(.customer-home)')) for (const [k, v] of Object.entries(r.decl)) put(ensure(`customer-${p}-home-${mode}`), k, v);
    else if (r.sel.includes('.phone:not(')) for (const [k, v] of Object.entries(r.decl)) put(ensure(`customer-${p}-${mode}`), k, v);
  }
}
const names = Object.keys(sets);
const themes = [
  { id: 'light', name: 'Light · Aurora (default)', selectedTokenSets: { global: 'source', light: 'enabled' } },
  { id: 'dark', name: 'Dark · Aurora (default)', selectedTokenSets: { global: 'source', light: 'source', dark: 'enabled' } },
  ...['merchant', 'rider'].flatMap((role) => ['light', 'dark'].map((mode) => ({ id: `${role}-${mode}`, name: `${role} · ${mode}`, selectedTokenSets: { global: 'source', light: 'source', ...(mode === 'dark' ? { dark: 'source' } : {}), [`role-${role}-light`]: 'enabled', ...(mode === 'dark' ? { [`role-${role}-dark`]: 'enabled' } : {}) } }))),
  ...['lagoon', 'rosewood', 'saffron', 'chili'].flatMap((p) => ['light', 'dark'].map((mode) => ({ id: `customer-${p}-${mode}`, name: `customer ${p} · ${mode}`, selectedTokenSets: { global: 'source', light: 'source', ...(mode === 'dark' ? { dark: 'source' } : {}), [`customer-${p}-light`]: 'enabled', ...(mode === 'dark' ? { [`customer-${p}-dark`]: 'enabled' } : {}) } })))
];
const out = { ...sets, $themes: themes, $metadata: { tokenSetOrder: names } };
await mkdir(path.join(root, 'figma'), { recursive: true });
await writeFile(path.join(root, 'figma/tokens.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('sets:', names.join(', '));
