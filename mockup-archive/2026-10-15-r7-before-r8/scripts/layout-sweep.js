// Layout sweep (browser module): visits every route (and every review-panel state) and measures fit inside the phone.
// Usage in the preview page console:  const m = await import('/scripts/layout-sweep.js'); const r = await m.sweep(); console.table(r.problems)
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rect = (el) => el.getBoundingClientRect();

function clippedByAncestor(el, stop) {
  for (let p = el.parentElement; p && p !== stop; p = p.parentElement) {
    const cs = getComputedStyle(p);
    if (/(auto|scroll|hidden|clip)/.test(cs.overflowX)) return true;
  }
  return false;
}

function measure(id, label) {
  const phone = document.querySelector('.phone');
  const host = document.querySelector('#screen-host');
  const scroller = host.querySelector('.screen-scroll') || host;
  const hostR = rect(host);
  const problems = [];
  const tag = label ? `${id} [${label}]` : id;
  const nav = host.querySelector('.bottom-nav') || phone.querySelector('.bottom-nav');
  if (nav) {
    const gap = Math.round(hostR.bottom - rect(nav).bottom);
    if (Math.abs(gap) > 1) problems.push(`${tag}: nav not at bottom (gap ${gap}px)`);
  }
  host.querySelectorAll('.sticky-action,.chat-compose,.p2-cart-fab,.p2-quick-replies').forEach((bar) => {
    if (bar.closest('.menu-detail-sheet')) return; // bottom sheet keeps its own sticky action
    const below = nav ? rect(nav).top : hostR.bottom;
    const gap = Math.round(below - rect(bar).bottom);
    if (bar.matches('.p2-quick-replies')) return;
    if (gap > 1 || gap < -1) problems.push(`${tag}: ${bar.className.split(' ')[0]} not pinned (gap ${gap}px)`);
  });
  // horizontal overflow
  if (scroller.scrollWidth > scroller.clientWidth + 1) problems.push(`${tag}: scroller scrollWidth ${scroller.scrollWidth} > ${scroller.clientWidth}`);
  const limitL = hostR.left - 0.5;
  const limitR = hostR.right + 0.5;
  const wide = [];
  host.querySelectorAll('*').forEach((el) => {
    const r = rect(el);
    if (!r.width || !r.height) return;
    if (r.left < limitL || r.right > limitR) {
      if (clippedByAncestor(el, host)) return;
      const cs = getComputedStyle(el);
      if (cs.position === 'absolute' && cs.visibility === 'hidden') return;
      wide.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}(${Math.round(r.left - hostR.left)}..${Math.round(r.right - hostR.left)})`);
    }
  });
  if (wide.length) problems.push(`${tag}: wider than screen: ${wide.slice(0, 4).join(', ')}`);
  // nested vertical scrollers
  const nested = [];
  host.querySelectorAll('*').forEach((el) => {
    if (el === scroller || el === host || el.matches('.menu-detail-sheet')) return; // a bottom sheet scrolls internally by design
    const cs = getComputedStyle(el);
    if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) nested.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
  });
  if (nested.length) problems.push(`${tag}: nested vertical scroller: ${nested.slice(0, 3).join(', ')}`);
  // content hidden behind the dock / bottom bars (new shell only has a dock)
  const dock = host.querySelector('.screen-dock');
  scroller.scrollTop = scroller.scrollHeight;
  const content = scroller.querySelector('.screen-content');
  if (content && dock) {
    const dr = rect(dock);
    const sr = rect(scroller);
    if (Math.abs(sr.bottom - dr.top) > 1) problems.push(`${tag}: scroller/dock gap ${Math.round(dr.top - sr.bottom)}px`);
    let last = null;
    content.querySelectorAll('*').forEach((el) => { const r = rect(el); if (r.height && getComputedStyle(el).position !== 'fixed' && (!last || r.bottom > rect(last).bottom)) last = el; });
    if (last && rect(last).bottom > dr.top + 1 && !clippedAbs(last)) problems.push(`${tag}: last element hidden behind dock (${Math.round(rect(last).bottom - dr.top)}px)`);
  }
  if (!dock && content) {
    // old shell: sticky/nav inside content; report empty space under the nav
    const n = content.querySelector('.bottom-nav');
    if (n) { const gap = Math.round(hostR.bottom - rect(n).bottom); if (gap > 1) problems.push(`${tag}: (old shell) nav floats ${gap}px above bottom`); }
  }
  // content area must fill the scroller (no empty strip below)
  if (content) {
    const sr = rect(scroller);
    const cr = rect(content);
    const gap = Math.round(sr.bottom - cr.bottom);
    if (gap > 1) problems.push(`${tag}: empty strip below content ${gap}px`);
  }
  scroller.scrollTop = 0;
  return problems;
}

function clippedAbs(el) {
  for (let p = el; p; p = p.parentElement) if (getComputedStyle(p).position === 'absolute' && p.closest('.screen-content') !== p) return false;
  return false;
}

export async function sweep({ only = null } = {}) {
  const { SCREENS, STATE_OPTIONS } = await import('/src/data/screens.js');
  const style = document.createElement('style');
  style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
  document.head.append(style);
  const out = { visited: 0, problems: [], errors: [], viewport: [innerWidth, innerHeight] };
  const onErr = (e) => out.errors.push(String(e.message || e.reason));
  window.addEventListener('error', onErr);
  window.addEventListener('unhandledrejection', onErr);
  for (const s of SCREENS) {
    if (only && !only.includes(s.id)) continue;
    location.hash = `/${s.id}`;
    await wait(80);
    const states = STATE_OPTIONS[s.id] || [null];
    for (const st of states) {
      if (st) {
        const sel = document.querySelector('[data-state-select]');
        if (!sel) continue;
        sel.value = st;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        await wait(60);
      }
      out.visited += 1;
      const text = document.querySelector('#screen-host').innerText;
      if (/undefined|NaN|\[object/.test(text)) out.problems.push(`${s.id}${st ? ` [${st}]` : ''}: text contains undefined/NaN/[object]`);
      out.problems.push(...measure(s.id, st));
    }
    if (states[0]) { // reset to first state so later screens are not affected
      const sel = document.querySelector('[data-state-select]');
      if (sel) { sel.value = states[0]; sel.dispatchEvent(new Event('change', { bubbles: true })); await wait(40); }
    }
  }
  window.removeEventListener('error', onErr);
  window.removeEventListener('unhandledrejection', onErr);
  style.remove();
  return out;
}
