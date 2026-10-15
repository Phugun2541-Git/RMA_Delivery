// Static hand-off board: every screen (and state) as a fixed 390x844 frame, grouped by role. Reuses the real renderers.
// ?only=<key> renders one frame edge-to-edge (used by scripts/shots.mjs for review screenshots). Keys: "C-09", "C-36:พบคนขับ", "C-09:payment-sheet", "push:c-pickedup" …
import { ROLE_META, SCREENS, STATE_OPTIONS } from "./data/screens.js";
import { NOTIFS } from "./data/notifications.js";
import { buildCtx, createState, getRole, HOME_PALETTES } from "./app-state.js";
import { renderScreen } from "./ui/renderers.js";
import { hostMarkup } from "./ui/shell.js";
import { applyNotifEffect, pushBanner } from "./ui/notifications.js";
import { modalMarkup } from "./ui/modals.js";
import { escapeHTML } from "./ui/components.js";
import { translateRoots } from "./i18n/index.js";

const q = new URLSearchParams(location.search);
const theme = q.get("theme") === "dark" ? "dark" : "light";
const lang = q.get("lang") === "en" ? "en" : "th";
const palette = HOME_PALETTES.some((p) => p.id === q.get("palette")) ? q.get("palette") : "aurora";
const only = q.get("only");
document.documentElement.dataset.theme = theme;
document.documentElement.dataset.homePalette = palette;
document.documentElement.lang = lang;
if (only) document.body.classList.add("board-shot");

function stateFor(id, value, tweak) {
  const st = createState();
  st.currentId = id;
  st.theme = theme;
  if (value) st.screenStates[id] = value;
  if (id === "C-12" && value === "ยกเลิกแล้ว") st.orderCancelled = true;
  if (id === "M-03" && value === "ร้านปิด") st.merchantOpen = false;
  if (id === "R-03" && value === "ออนไลน์") st.riderOnline = true;
  if (tweak) tweak(st);
  return st;
}

function frame({ key, id, title, value = "", role, markup, banner = "", modal = "" }) {
  const label = `${id} · ${title}${value ? ` · ${value}` : ""}`;
  return `<figure class="board-cell" data-key="${escapeHTML(key)}"><figcaption>${escapeHTML(label)}</figcaption><div class="board-frame"><div class="phone" data-role="${role}" data-chat-from="C"><div class="phone-status"><span>9:41</span><span>●●●　◔　▰</span></div><section class="screen-host">${hostMarkup(markup)}</section>${banner ? `<div class="push-region">${banner}</div>` : ""}${modal ? `<div id="modal-root" class="no-anim">${modal}</div>` : ""}</div></div></figure>`;
}

function renderOne(id, value, tweak) {
  const st = stateFor(id, value, tweak);
  try { return renderScreen(id, buildCtx(st)); } catch (error) { return `<div class="screen-content"><p>render error: ${escapeHTML(error.message)}</p></div>`; }
}

// Extra frames for overlays and context-dependent states (R6)
const EXTRA = {
  "A-06": [["from-merchant", "สลับโหมด (มาจากร้านค้า)", (st) => { st.previousId = "M-17"; }]],
  "C-01": [["no-unread", "ไม่มีแจ้งเตือนใหม่", (st) => { st.notifs.forEach((n) => { n.read = true; }); st.chatUnread = 0; }]],
  "C-09": [["payment-sheet", "เปลี่ยนวิธีชำระเงิน (sheet)", (st) => { st.modal = "payment-method"; st.paymentTarget = "order"; st.paymentDraft = "บัตรเครดิต / เดบิต"; }]],
  "C-11": [["card", "ชำระด้วยบัตร", (st) => { st.paymentMethod = "บัตรเครดิต / เดบิต"; }], ["wallet", "ชำระด้วยวอลเล็ต", (st) => { st.paymentMethod = "วอลเล็ต"; }]],
  "C-16": [["filter-sheet", "เลือกบริการ (sheet)", (st) => { st.modal = "history-filter"; }], ["empty", "ไม่พบรายการ", (st) => { st.historyService = "เรียกรถ"; st.historyFilter = "ยกเลิก"; }]],
  "C-18": [["notif-tab", "แท็บแจ้งเตือน", (st) => { st.messageTab = "แจ้งเตือน"; }]],
  "C-12": [["expanded", "ขยายรายละเอียด", (st) => { st.trackOpen = true; }]],
  "C-35": [["payment-sheet", "เปลี่ยนวิธีชำระ (sheet)", (st) => { st.modal = "payment-method"; st.paymentTarget = "ride"; }]],
  "R-10": [["cancelled", "แท็บยกเลิก", (st) => { st.riderHistoryFilter = "ยกเลิก"; }]],
  "S-06": [["empty", "ถาดว่าง", (st) => { st.notifs.forEach((n) => { n.shade = false; }); }]]
};

const cells = [];
const sections = [];
for (const role of ["A", "C", "M", "R", "S"]) {
  const row = [];
  for (const s of SCREENS.filter((x) => x.role === role)) {
    for (const value of STATE_OPTIONS[s.id] || [""]) {
      const key = STATE_OPTIONS[s.id] && value !== STATE_OPTIONS[s.id][0] ? `${s.id}:${value}` : s.id;
      row.push({ key, html: () => frame({ key, id: s.id, title: s.title, value: STATE_OPTIONS[s.id] ? value : "", role: getRole(s.id), markup: renderOne(s.id, value || null) }) });
    }
    for (const [variant, label, tweak] of EXTRA[s.id] || []) {
      const key = `${s.id}:${variant}`;
      row.push({ key, html: () => { const st = stateFor(s.id, null, tweak); let markup; try { markup = renderScreen(s.id, buildCtx(st)); } catch (e) { markup = `<p>${escapeHTML(e.message)}</p>`; } return frame({ key, id: s.id, title: s.title, value: label, role: getRole(s.id), markup, modal: st.modal ? modalMarkup(st.modal, st) : "" }); } });
    }
  }
  cells.push(...row);
  sections.push([role, `${role} · ${ROLE_META[role].label}`, row]);
}

// Push banners: each notification as an OS heads-up over the screen it deep-links to
const bannerRow = Object.keys(NOTIFS).map((k) => {
  const key = `push:${k}`;
  return { key, html: () => {
    const n = NOTIFS[k];
    const st = stateFor(n.route, null);
    applyNotifEffect(st, k);
    let markup;
    try { markup = renderScreen(n.route, buildCtx(st)); } catch (error) { markup = `<div class="screen-content">${escapeHTML(error.message)}</div>`; }
    return frame({ key, id: k, title: `push → ${n.route}`, role: getRole(n.route), markup, banner: pushBanner(k) });
  } };
});
cells.push(...bannerRow);
sections.push(["N", "N · แจ้งเตือน push (heads-up ของระบบ)", bannerRow]);

const link = (label, params) => `<a href="?${new URLSearchParams({ theme, lang, palette, ...params })}">${label}</a>`;
if (only) {
  const cell = cells.find((c) => c.key === only);
  document.querySelector("#board").innerHTML = cell ? cell.html() : `<p>no frame "${escapeHTML(only)}"</p>`;
} else {
  document.querySelector("#board").innerHTML = `<header class="board-head"><h1>RMA Delivery · Screen board</h1><nav>${link("Light", { theme: "light" })} · ${link("Dark", { theme: "dark" })} · ${link("ไทย", { lang: "th" })} · ${link("English", { lang: "en" })}</nav><p>${SCREENS.length} screens · ${cells.length} frames 390×844 · ${theme} · ${lang}</p></header>${sections.map(([r, title, row]) => `<section class="board-section" data-section="${r}"><h2>${escapeHTML(title)}</h2><div class="board-row">${row.map((c) => c.html()).join("")}</div></section>`).join("")}`;
}
if (lang === "en") translateRoots(document);
document.body.dataset.ready = "1";
