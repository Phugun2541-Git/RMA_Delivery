// Review screenshots (PNG 390×844) of single board frames via headless Edge/Chrome. No npm dependencies.
// Needs the preview server: node scripts/serve.mjs  (port 5174)  ·  Usage: node scripts/shots.mjs [--r8] [key ...]
// --r8 = the R8 design-system review set (review-shots/r8-*.png)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.env.SHOTS_DIR || path.join(root, 'review-shots');
mkdirSync(out, { recursive: true });
const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'
].find(existsSync);
if (!browser) { console.error('Edge/Chrome not found'); process.exit(1); }
const port = process.env.PORT || 5174;

// [file name, board key, extra query]
const SHOTS = [
  ['01-A-06-role-switch', 'A-06'],
  ['02-A-06-role-switch-from-merchant', 'A-06:from-merchant'],
  ['03-C-09-payment-sheet', 'C-09:payment-sheet'],
  ['04-C-35-payment-sheet-ride', 'C-35:payment-sheet'],
  ['05-C-16-history', 'C-16'],
  ['06-C-16-filter-sheet', 'C-16:filter-sheet'],
  ['07-C-01-home-bell', 'C-01'],
  ['08-C-04-empty', 'C-04:ว่าง'],
  ['09-S-06-os-shade', 'S-06'],
  ['10-push-banner-c-pickedup', 'push:c-pickedup'],
  ['11-push-banner-m-new', 'push:m-new'],
  ['12-C-18-notifications-tab', 'C-18:notif-tab'],
  ['13-M-03-orders', 'M-03'],
  ['14-R-10-job-history', 'R-10'],
  ['15-C-04-store-list', 'C-04'],
  ['16-C-06-store', 'C-06'],
  ['17-M-12-wallet', 'M-12'],
  ['18-R-11-earnings', 'R-11'],
  ['19-C-35-vehicles', 'C-35'],
  ['20-C-11-qr', 'C-11'],
  ['21-A-07-permission', 'A-07'],
  ['22-C-09-checkout', 'C-09'],
  ['23-S-06-os-shade-dark', 'S-06', 'theme=dark'],
  ['24-C-16-history-dark', 'C-16', 'theme=dark'],
  ['25-C-09-payment-sheet-en', 'C-09:payment-sheet', 'lang=en'],
  ['26-R-03-rider-home', 'R-03']
];

// R8 (D-032): new surfaces + Material 3 controls on every role
const R8 = [
  ['r8-C-01-home', 'C-01'],
  ['r8-C-01-home-dark', 'C-01', 'theme=dark'],
  ['r8-C-01-home-saffron', 'C-01', 'palette=saffron'],
  ['r8-C-16-history', 'C-16'],
  ['r8-C-16-history-dark', 'C-16', 'theme=dark'],
  ['r8-C-16-filter-sheet', 'C-16:filter-sheet'],
  ['r8-C-09-payment-sheet', 'C-09:payment-sheet'],
  ['r8-C-09-checkout', 'C-09'],
  ['r8-C-22-settings', 'C-22'],
  ['r8-C-22-settings-dark', 'C-22', 'theme=dark'],
  ['r8-A-06-role-switch', 'A-06'],
  ['r8-M-03-orders', 'M-03'],
  ['r8-R-03-rider-home', 'R-03'],
  ['r8-R-10-job-history', 'R-10'],
  ['r8-S-06-os-shade', 'S-06'],
  ['r8-push-banner', 'push:c-pickedup'],
  ['r8-C-04-store-list', 'C-04'],
  ['r8-C-06-store', 'C-06'],
  ['r8-C-19-account', 'C-19'],
  ['r8-C-37-ride', 'C-37'],
  ['r8-M-04-new-order', 'M-04'],
  ['r8-R-05-pickup', 'R-05'],
  ['r8-C-22-settings-en', 'C-22', 'lang=en'],
  ['r8-C-13-chat', 'C-13']
];

const pick = process.argv.slice(2).filter((a) => a !== '--r8');
if (process.argv.includes('--r8')) SHOTS.splice(0, SHOTS.length, ...R8);
// keys that are not in the list are shot as-is (file name = key)
for (const k of pick) if (!SHOTS.some(([n, key]) => n === k || key === k)) SHOTS.push([k.replace(/[^\w-]+/g, '_'), k]);
for (const [name, key, extra = ''] of SHOTS) {
  if (pick.length && !pick.includes(name) && !pick.includes(key)) continue;
  const file = path.join(out, `${name}.png`);
  const url = `http://127.0.0.1:${port}/board.html?only=${encodeURIComponent(key)}${extra ? `&${extra}` : ''}`;
  execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=390,844', '--virtual-time-budget=6000', `--screenshot=${file}`, url], { stdio: 'ignore', timeout: 60000 });
  console.log(`${existsSync(file) ? 'OK  ' : 'FAIL'} ${name}.png  ← ${key}${extra ? ` (${extra})` : ''}`);
}
