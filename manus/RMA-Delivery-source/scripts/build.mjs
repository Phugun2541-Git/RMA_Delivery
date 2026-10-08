import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCREENS } from '../src/data/screens.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const routes = [
  { path: '/', title: 'RMA Delivery Mobile Mockup' },
  ...SCREENS.map(({ id, title }) => ({ path: `/#/${id}`, title: `${id} · ${title}` }))
];
await mkdir(path.join(root, 'public'), { recursive: true });
await writeFile(path.join(root, 'public', 'manus-routes.json'), JSON.stringify({ routes }, null, 2) + '\n', 'utf8');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'index.html'), path.join(output, 'index.html'));
await cp(path.join(root, 'src'), path.join(output, 'src'), { recursive: true });
await cp(path.join(root, 'public', 'manus-routes.json'), path.join(output, 'manus-routes.json'));
console.log(`Static build ready: ${output} (${routes.length} routes, ${SCREENS.length} screens)`);
