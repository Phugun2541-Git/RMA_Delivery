// Static hand-off board: every screen (and state) as a fixed 390x844 frame, grouped by role. Reuses the real renderers.
import { ROLE_META, SCREENS, STATE_OPTIONS } from "./data/screens.js";
import { NOTIFS } from "./data/notifications.js";
import { buildCtx, createState, getRole, HOME_PALETTES } from "./app-state.js";
import { renderScreen } from "./ui/renderers.js";
import { hostMarkup } from "./ui/shell.js";
import { applyNotifEffect, pushBanner } from "./ui/notifications.js";
import { escapeHTML } from "./ui/components.js";
import { translateRoots } from "./i18n/index.js";

const q = new URLSearchParams(location.search);
const theme = q.get("theme") === "dark" ? "dark" : "light";
const lang = q.get("lang") === "en" ? "en" : "th";
const palette = HOME_PALETTES.some((p) => p.id === q.get("palette")) ? q.get("palette") : "aurora";
document.documentElement.dataset.theme = theme;
document.documentElement.dataset.homePalette = palette;
document.documentElement.lang = lang;

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

function frame({ id, title, value = "", role, markup, banner = "" }) {
  const label = `${id} · ${title}${value ? ` · ${value}` : ""}`;
  return `<figure class="board-cell"><figcaption>${escapeHTML(label)}</figcaption><div class="board-frame"><div class="phone" data-role="${role}" data-chat-from="C"><div class="phone-status"><span>9:41</span><span>●●●　◔　▰</span></div><section class="screen-host">${hostMarkup(markup)}</section>${banner ? `<div class="push-region">${banner}</div>` : ""}</div></div></figure>`;
}

function renderOne(id, value, tweak) {
  const st = stateFor(id, value, tweak);
  try { return renderScreen(id, buildCtx(st)); } catch (error) { return `<div class="screen-content"><p>render error: ${escapeHTML(error.message)}</p></div>`; }
}

const sections = [];
for (const role of ["A", "C", "M", "R", "S"]) {
  const cells = [];
  for (const s of SCREENS.filter((x) => x.role === role)) {
    for (const value of STATE_OPTIONS[s.id] || [""]) {
      cells.push(frame({ id: s.id, title: s.title, value: STATE_OPTIONS[s.id] ? value : "", role: getRole(s.id), markup: renderOne(s.id, value || null) }));
    }
    if (s.id === "C-18") cells.push(frame({ id: s.id, title: s.title, value: "แท็บแจ้งเตือน", role: "C", markup: renderOne(s.id, null, (st) => { st.messageTab = "แจ้งเตือน"; }) }));
    if (s.id === "C-12") cells.push(frame({ id: s.id, title: s.title, value: "ขยายรายละเอียด", role: "C", markup: renderOne(s.id, null, (st) => { st.trackOpen = true; }) }));
  }
  sections.push(`<section class="board-section" data-section="${role}"><h2>${role} · ${escapeHTML(ROLE_META[role].label)}</h2><div class="board-row">${cells.join("")}</div></section>`);
}

// Push banners: each notification over the screen it deep-links to
const bannerCells = Object.keys(NOTIFS).map((key) => {
  const n = NOTIFS[key];
  const st = stateFor(n.route, null);
  applyNotifEffect(st, key);
  let markup;
  try { markup = renderScreen(n.route, buildCtx(st)); } catch (error) { markup = `<div class="screen-content">${escapeHTML(error.message)}</div>`; }
  return frame({ id: key, title: `push → ${n.route}`, role: getRole(n.route), markup, banner: pushBanner(key) });
});
sections.push(`<section class="board-section" data-section="N"><h2>N · แจ้งเตือน push banner (OS-style overlay)</h2><div class="board-row">${bannerCells.join("")}</div></section>`);

const link = (label, params) => `<a href="?${new URLSearchParams({ theme, lang, palette, ...params })}">${label}</a>`;
document.querySelector("#board").innerHTML = `<header class="board-head"><h1>RMA Delivery · Screen board</h1><nav>${link("Light", { theme: "light" })} · ${link("Dark", { theme: "dark" })} · ${link("ไทย", { lang: "th" })} · ${link("English", { lang: "en" })}</nav><p>${SCREENS.length} screens · frames 390×844 · ${theme} · ${lang}</p></header>${sections.join("")}`;
if (lang === "en") translateRoots(document);
document.body.dataset.ready = "1";
