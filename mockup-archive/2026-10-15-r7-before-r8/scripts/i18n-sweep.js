// i18n sweep (browser module): switches the app to English, visits every route + review-panel state + key overlays,
// and lists Thai text that is still visible inside the phone (screen, sheet, banner).
// Usage in the preview page console:  const m = await import('/scripts/i18n-sweep.js'); const r = await m.sweep(); console.log(r.missing)
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const THAI = /[ก-฾เ-๛]/; // same range as src/i18n (฿ is not Thai text)
const ROOTS = '#screen-host, #modal-root, #push-region';

function collect(into, where) {
  document.querySelectorAll(ROOTS).forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest('textarea')) continue;
      const t = node.nodeValue.trim();
      if (t && THAI.test(t)) { if (!into.has(t)) into.set(t, where); }
    }
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach((el) => ['placeholder', 'aria-label', 'title'].forEach((a) => { const v = el.getAttribute(a); if (v && THAI.test(v) && !into.has(v)) into.set(v, `${where} @${a}`); }));
  });
}

export async function sweep() {
  const { SCREENS, STATE_OPTIONS } = await import('/src/data/screens.js');
  const missing = new Map();
  const click = async (sel) => { const el = document.querySelector(sel); if (el) { el.click(); await wait(80); } };
  if (!document.querySelector('#screen-host')) return { error: 'open the app first' };
  location.hash = '/C-22'; await wait(80);
  await click('[data-action="set-lang"][data-value="en"]');
  for (const s of SCREENS) {
    location.hash = `/${s.id}`; await wait(80);
    for (const st of STATE_OPTIONS[s.id] || [null]) {
      if (st) { const sel = document.querySelector('[data-state-select]'); if (!sel) continue; sel.value = st; sel.dispatchEvent(new Event('change', { bubbles: true })); await wait(60); }
      collect(missing, `${s.id}${st ? ` [${st}]` : ''}`);
    }
    if (STATE_OPTIONS[s.id]) { const sel = document.querySelector('[data-state-select]'); if (sel) { sel.value = STATE_OPTIONS[s.id][0]; sel.dispatchEvent(new Event('change', { bubbles: true })); await wait(40); } }
  }
  // overlays
  location.hash = '/C-09'; await wait(80); await click('#screen-host [data-action="p2-payment-method"]'); collect(missing, 'C-09 payment sheet'); await click('[data-action="close-modal"].icon-btn');
  location.hash = '/C-35'; await wait(80); await click('#screen-host [data-action="p2-ride-payment"]'); collect(missing, 'C-35 payment sheet'); await click('[data-action="close-modal"].icon-btn');
  location.hash = '/C-16'; await wait(80); await click('#screen-host [data-action="p2-history-sheet"]'); collect(missing, 'C-16 filter sheet'); await click('[data-action="close-modal"].icon-btn');
  location.hash = '/C-18'; await wait(80); await click('[data-action="p2-message-tab"][data-tab="แจ้งเตือน"]'); collect(missing, 'C-18 notifications');
  for (const key of ['c-pickedup', 'm-new', 'r-offer']) { await click(`[data-action="notif-simulate"][data-key="${key}"]`); collect(missing, `push ${key}`); }
  location.hash = '/C-22'; await wait(80); await click('[data-action="set-lang"][data-value="th"]');
  return { count: missing.size, missing: [...missing].map(([t, w]) => `${w}: ${t}`) };
}
