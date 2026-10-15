// R9 · Rider availability (online switch + job-type switches) — owner request 2026-10-15, decision D-033.
// The app is a client only: every change is a PATCH to the backend, and the server's reply is the truth.
// The mockup simulates that round trip (no network): pending → ok | network error | server refusal.
//   PATCH /rider/availability { online, job_types, pause_after_current_job, client_seq }  (contract: mockup/CHANGES.md · R9)
// Pattern: no optimistic flip. The control keeps its confirmed value, shows a spinner in the thumb and is disabled until the
// server answers; one request in flight at a time (Hard Rule 3), so replies can never arrive out of order.
import { ORDER_NO } from "../data/content.js";
import { escapeHTML, listGroup, section } from "./components.js";
import { homeIcon } from "./home-icons.js";

export const AVAIL_DEFAULT = () => ({
  online: false, types: { food: true, ride: false }, pending: null, error: null, refused: null,
  forced: false, pauseAfterJob: false, activeJob: false, outcome: "ok", seq: 0
});

const TYPES = [
  ["food", "bike", "ส่งอาหาร", "มอเตอร์ไซค์ · รับงานพ่วงได้"],
  ["ride", "car", "รับส่งคน", "รถยนต์ · ไม่รับงานอื่นระหว่างเที่ยว"]
];
// Server refusal reasons (reason_code → icon · copy · recovery action). Copy will come from the server's localized message.
const NOTICE = {
  docs: { icon: "docs", tone: "warning", title: "ใบขับขี่หมดอายุ", sub: "อัปเดตเอกสารก่อนเปิดรับงาน", label: "อัปเดตเอกสาร", attrs: 'data-route="R-13"' },
  suspended: { icon: "block", tone: "danger", title: "บัญชีถูกระงับชั่วคราว", sub: "ติดต่อศูนย์ช่วยเหลือเพื่อตรวจสอบ", label: "ติดต่อศูนย์ช่วยเหลือ", attrs: 'data-route="R-14"' },
  area: { icon: "locationOff", tone: "warning", title: "อยู่นอกพื้นที่ให้บริการ", sub: "เข้าเขตให้บริการแล้วเปิดอีกครั้ง", label: "ดูพื้นที่ให้บริการ", attrs: 'data-action="avail-area"' },
  forced: { icon: "pause", tone: "warning", title: "ระบบพักรับงานให้แล้ว", sub: "ไม่ได้ใช้งานนาน 30 นาที", label: "รับทราบ", attrs: 'data-action="avail-dismiss"' }
};

// Review-panel state presets for R-03 (also used by the board and the sweeps)
export const AVAIL_PRESETS = {
  "ออฟไลน์": {},
  "ออนไลน์": { online: true },
  "กำลังเปิดรับงาน": { pending: "online" },
  "กำลังบันทึกประเภทงาน": { online: true, pending: "ride" },
  "เชื่อมต่อไม่สำเร็จ": { error: { target: "online", patch: { online: true } } },
  "ปฏิเสธ · เอกสารหมดอายุ": { refused: "docs" },
  "ปฏิเสธ · บัญชีถูกระงับ": { refused: "suspended" },
  "ปฏิเสธ · นอกพื้นที่": { refused: "area" },
  "มีงานที่กำลังทำ": { online: true, activeJob: true },
  "พักหลังส่งงานนี้": { online: true, activeJob: true, pauseAfterJob: true },
  "ระบบพักรับงานให้": { forced: true }
};
export function applyAvailPreset(state, label) {
  const preset = AVAIL_PRESETS[label];
  if (!preset) return false;
  state.avail = { ...AVAIL_DEFAULT(), ...preset, outcome: state.avail?.outcome || "ok" };
  return true;
}

// r2-check renders with a bare ctx (only riderOnline) — fall back to it
export const availOf = (ctx) => ctx.avail || { ...AVAIL_DEFAULT(), online: Boolean(ctx.riderOnline) };
// The switch means "accepting new jobs": online and not winding down after the current job
export const isAccepting = (a) => a.online && !a.pauseAfterJob;
const typeNames = (a) => TYPES.filter(([k]) => a.types[k]).map(([, , label]) => label).join(" · ");

function status(a) {
  if (a.pending === "online" || a.pending === "resume") return { tone: "off", title: a.pauseAfterJob ? "พักหลังส่งงานนี้" : "ออฟไลน์", sub: "กำลังเปิดรับงาน…" };
  if (a.pending === "offline" || a.pending === "pause") return { tone: "on", title: "ออนไลน์", sub: "กำลังพักรับงาน…" };
  if (a.online && a.pauseAfterJob) return { tone: "paused", title: "พักหลังส่งงานนี้", sub: "ไม่รับงานใหม่" };
  if (a.online) return { tone: "on", title: "ออนไลน์", sub: `กำลังหางาน · ${typeNames(a)}` };
  if (a.refused) return { tone: "off", title: "ออฟไลน์", sub: "เปิดรับงานไม่ได้" };
  if (a.forced) return { tone: "off", title: "ออฟไลน์", sub: "ระบบพักรับงานให้" };
  return { tone: "off", title: "ออฟไลน์", sub: "เปิดเพื่อเริ่มรับงาน" };
}

// Visual switch (the whole row/bar is the control, so the track itself is aria-hidden)
const switchVis = (on, { busy = false, locked = false } = {}) => `<span class="switch${on ? " on" : ""}${busy ? " busy" : ""}${locked ? " locked" : ""}" aria-hidden="true"></span>`;

// R-03 pinned header: status (glanceable, colour + word) + one large switch + bell. The whole status area is the hit target.
export function availBar(ctx, bell = "") {
  const a = availOf(ctx);
  const s = status(a);
  const busy = a.pending === "online" || a.pending === "offline" || a.pending === "pause" || a.pending === "resume";
  const disabled = Boolean(a.pending);
  return `<header class="appbar avail-bar is-${s.tone}"><button class="avail-toggle" role="switch" aria-checked="${isAccepting(a)}" aria-busy="${busy}" data-action="avail-toggle" ${disabled ? "disabled" : ""}><span class="avail-copy"><strong><span class="avail-dot" aria-hidden="true"></span>${s.title}</strong><small>${s.sub}</small></span>${switchVis(isAccepting(a), { busy })}</button>${bell}</header>`;
}

// Small read-only status chip for the other rider tabs → opens R-03 (single source of truth)
export function availPill(ctx) {
  const a = availOf(ctx);
  const s = a.pending ? { tone: "busy", label: "กำลังเชื่อมต่อ" } : a.online && a.pauseAfterJob ? { tone: "paused", label: "พักหลังงานนี้" } : a.online ? { tone: "on", label: "ออนไลน์" } : { tone: "off", label: "ออฟไลน์" };
  return `<button class="avail-pill is-${s.tone}" data-route="R-03" aria-label="สถานะรับงาน · ${s.label}"><span class="avail-dot" aria-hidden="true"></span>${s.label}</button>`;
}
export const riderTrailing = (ctx, bell) => `<span class="appbar-actions">${availPill(ctx)}${bell}</span>`;

// Overlay card on top of the map: server refusal / forced offline (with the recovery action) or the job in progress
function mapCard(a) {
  const key = a.refused || (a.forced && !a.online ? "forced" : "");
  if (key) {
    const n = NOTICE[key];
    return `<div class="map-banner" role="status"><span class="list-icon tone-${n.tone}">${homeIcon(n.icon, 24)}</span><span class="map-banner-copy"><strong>${n.title}</strong><small>${n.sub}</small></span><button class="text-btn map-banner-action" ${n.attrs}>${n.label}</button></div>`;
  }
  if (a.activeJob) return `<button class="map-banner is-job" data-route="R-05"><span class="list-icon tone-brand">${homeIcon("delivery", 24)}</span><span class="map-banner-copy"><strong>งานที่กำลังทำ</strong><small>${ORDER_NO} · ไปรับอาหาร</small></span><span class="list-chevron">${homeIcon("chevron", 18)}</span></button>`;
  return "";
}

export function availMap(ctx) {
  const a = availOf(ctx);
  return `<div class="map-card map-full avail-map${isAccepting(a) ? " searching" : ""}">${mapCard(a)}<span class="map-me" aria-hidden="true"></span><span class="pill map-area">พื้นที่ห้วยขวาง</span></div>`;
}

// Job types: one switch row per type. At least one must stay on (the last one is locked and explains why on tap).
export function jobTypeSection(ctx) {
  const a = availOf(ctx);
  const onCount = TYPES.filter(([k]) => a.types[k]).length;
  const rows = TYPES.map(([key, icon, label, sub]) => {
    const on = Boolean(a.types[key]);
    const locked = on && onCount === 1;
    const busy = a.pending === key;
    return `<button class="list-row switch-row" role="switch" aria-checked="${on}" aria-busy="${busy}" ${locked ? 'aria-disabled="true"' : ""} data-action="avail-type" data-type="${key}" ${a.pending ? "disabled" : ""}><span class="list-icon">${homeIcon(icon, 24)}</span><span class="list-copy"><span class="list-label">${label}</span><small>${sub}</small></span>${switchVis(on, { busy, locked })}</button>`;
  }).join("");
  return `${section("ประเภทงาน", listGroup(rows))}<p class="muted small list-footnote">เปิดไว้อย่างน้อย 1 ประเภท · รับได้ครั้งละ 1 งาน</p>`;
}

// Snackbar with retry (pinned above the dock, M3 inverse surface)
export function availSnack(ctx) {
  const a = availOf(ctx);
  if (!a.error) return "";
  return `<div class="snackbar" role="alert"><span>เชื่อมต่อไม่สำเร็จ</span><button class="snackbar-action" data-action="avail-retry">ลองอีกครั้ง</button></div>`;
}

// R-15 row: shows the current state and links back to R-03 (settings never hold a second copy of the switch)
export function availSettingsRow(ctx) {
  const a = availOf(ctx);
  const s = status(a);
  return listGroup(`<button class="list-row" data-route="R-03"><span class="list-icon">${homeIcon("work", 24)}</span><span class="list-copy"><span class="list-label">สถานะรับงาน</span><small>${s.title} · ${typeNames(a)}</small></span><span class="list-chevron">${homeIcon("chevron", 18)}</span></button>`);
}

// Pause-after-current-job confirm (going offline with a job in progress)
export const availPauseDialog = () => `<h3>พักรับงานหลังส่งงานนี้?</h3><p class="muted small">ส่งงานที่ทำอยู่ให้เสร็จก่อน · ระหว่างนี้ไม่มีงานใหม่เข้า และระบบจะพักรับงานให้เมื่อส่งเสร็จ</p><div class="btn-row"><button class="btn ghost" data-action="close-modal">กลับ</button><button class="btn" data-action="avail-pause-confirm">พักหลังส่งงานนี้</button></div>`;

// ---------- Live simulation (app.js only) ----------
const LATENCY = 1200;
const SNACK_MS = 8000;
const ONLINE_LABEL = (a) => a.online ? (a.activeJob ? (a.pauseAfterJob ? "พักหลังส่งงานนี้" : "มีงานที่กำลังทำ") : "ออนไลน์") : (a.forced ? "ระบบพักรับงานให้" : "ออฟไลน์");
const ensure = (state) => (state.avail ??= AVAIL_DEFAULT());

function send(api, target, patch) {
  const a = ensure(api.state);
  if (a.pending) return; // one request in flight — the control is already disabled
  a.pending = target; a.error = null;
  if (target === "online" || target === "resume") a.refused = null;
  const seq = ++a.seq;
  api.render();
  setTimeout(() => {
    const cur = api.state.avail;
    if (!cur || cur.seq !== seq || cur.pending !== target) return; // superseded (e.g. state preset from the review panel)
    const outcome = cur.outcome || "ok";
    const goingOnline = target === "online" || target === "resume";
    cur.pending = null;
    if (outcome === "network") {
      cur.error = { target, patch };
      cur.outcome = "ok";
      setTimeout(() => { if (api.state.avail?.error && api.state.avail.seq === seq) { api.state.avail.error = null; if (api.state.currentId === "R-03") api.render(); } }, SNACK_MS);
    } else if (goingOnline && NOTICE[outcome]) {
      cur.refused = outcome; cur.online = false; cur.pauseAfterJob = false; cur.outcome = "ok";
    } else {
      if ("online" in patch) cur.online = patch.online;
      if ("pauseAfterJob" in patch) cur.pauseAfterJob = patch.pauseAfterJob;
      if (patch.types) cur.types = { ...patch.types };
      if (cur.online) cur.forced = false;
    }
    api.state.screenStates["R-03"] = ONLINE_LABEL(cur);
    if (api.state.currentId.startsWith("R-")) api.render();
  }, LATENCY);
}

// Returns true when handled. hooks.fireNotif = app.js push simulator
export function handleAvailAction(action, el, api, hooks = {}) {
  const { state } = api;
  if (!action.startsWith("avail-")) return false;
  const a = ensure(state);
  const d = el.dataset;
  switch (action) {
    case "avail-toggle":
      if (a.pending) return true;
      if (isAccepting(a)) {
        if (a.activeJob) { state.modal = "avail-pause"; api.render(); }
        else send(api, "offline", { online: false });
      } else if (a.online && a.pauseAfterJob) send(api, "resume", { pauseAfterJob: false });
      else send(api, "online", { online: true });
      return true;
    case "avail-pause-confirm": state.modal = ""; send(api, "pause", { pauseAfterJob: true }); return true;
    case "avail-type": {
      if (a.pending) return true;
      const key = d.type;
      const next = { ...a.types, [key]: !a.types[key] };
      if (!next.food && !next.ride) { api.showToast("เปิดไว้อย่างน้อย 1 ประเภท", false); return true; }
      send(api, key, { types: next });
      return true;
    }
    case "avail-retry": if (a.error) { const { target, patch } = a.error; a.error = null; send(api, target, patch); } return true;
    case "avail-dismiss": a.forced = false; api.render(); return true;
    case "avail-area": api.showToast("แสดงขอบเขตพื้นที่ให้บริการบนแผนที่", false); return true;
    // review-panel simulations
    case "avail-outcome": a.outcome = d.value || "ok"; api.render(); return true;
    case "avail-job": a.activeJob = !a.activeJob; if (!a.activeJob && a.pauseAfterJob) { a.online = false; a.pauseAfterJob = false; api.showToast("ส่งงานเสร็จ · พักรับงานแล้ว", false); } state.screenStates["R-03"] = ONLINE_LABEL(a); api.render(); return true;
    case "avail-force": Object.assign(a, { online: false, pauseAfterJob: false, pending: null, error: null, refused: null, forced: true }); state.screenStates["R-03"] = ONLINE_LABEL(a); hooks.fireNotif?.("r-offline"); if (!hooks.fireNotif) api.render(); return true;
    default: return false;
  }
}

const OUTCOMES = [["ok", "สำเร็จ"], ["network", "เชื่อมต่อไม่ได้ (timeout)"], ["docs", "ปฏิเสธ · เอกสารหมดอายุ"], ["suspended", "ปฏิเสธ · บัญชีถูกระงับ"], ["area", "ปฏิเสธ · นอกพื้นที่"]];
export function availDemoMarkup(state) {
  const a = state.avail || AVAIL_DEFAULT();
  const opt = ([v, l]) => `<button class="flow-btn" data-action="avail-outcome" data-value="${v}" aria-pressed="${a.outcome === v}"><strong>${a.outcome === v ? "✓ " : ""}${escapeHTML(l)}</strong></button>`;
  return `<div class="review-section"><h3>จำลองเซิร์ฟเวอร์ · สถานะรับงาน</h3><p class="muted micro">ผลของการกดสวิตช์ครั้งถัดไป (หน่วง 1.2 วินาที)</p><div class="flow-list">${OUTCOMES.map(opt).join("")}</div><div class="flow-list" style="margin-top:8px"><button class="flow-btn" data-action="avail-job"><strong>${a.activeJob ? "ส่งงานที่ทำอยู่เสร็จ" : "มีงานที่กำลังทำ"}</strong><span>${a.activeJob ? "ถ้าตั้งพักไว้ จะออฟไลน์ทันที" : "ลองปิดสวิตช์ระหว่างมีงาน"}</span></button><button class="flow-btn" data-action="avail-force"><strong>ระบบบังคับออฟไลน์</strong><span>ไม่ได้ใช้งานนาน · push + สวิตช์ปิดเอง</span></button></div></div>`;
}
