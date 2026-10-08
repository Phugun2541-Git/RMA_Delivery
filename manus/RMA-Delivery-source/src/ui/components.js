import { homeIcon } from "./home-icons.js";

export const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

export function button(label, { route = "", action = "", variant = "", disabled = false, small = false } = {}) {
  const klass = ["btn", variant, small ? "inline" : ""].filter(Boolean).join(" ");
  const attrs = [route ? `data-route="${escapeHTML(route)}"` : "", action ? `data-action="${escapeHTML(action)}"` : "", disabled ? "disabled" : ""].filter(Boolean).join(" ");
  return `<button class="${klass}" ${attrs}>${label}</button>`;
}

export function badge(label, kind = "") { return `<span class="pill ${kind}">${label}</span>`; }
export function card(content, extra = "") { return `<section class="card ${extra}">${content}</section>`; }
export function section(title, content, trailing = "") { return `<section class="section"><div class="section-head"><h3>${title}</h3>${trailing}</div>${content}</section>`; }
export function field(label, placeholder = "", type = "text", value = "") {
  return `<div class="form-field"><label>${label}</label><input class="field" type="${type}" placeholder="${placeholder}" value="${value}" /></div>`;
}
export function textArea(label, placeholder = "", value = "") {
  return `<div class="form-field"><label>${label}</label><textarea class="textarea" placeholder="${placeholder}">${value}</textarea></div>`;
}
export function infoRows(rows) {
  return `<div class="info-list">${rows.map(([label, value, extra = ""]) => `<div class="info-row"><span>${label}</span><strong class="${extra}">${value}</strong></div>`).join("")}</div>`;
}
export function priceRows(rows, totalLabel = "ยอดรวม") {
  return `<div>${rows.map(([label, value]) => `<div class="price-line"><span>${label}</span><strong>${value}</strong></div>`).join("")}<div class="price-line total"><span>${totalLabel}</span><strong data-total>฿0</strong></div></div>`;
}

const NAV = {
  C: [["หน้าหลัก", "home", "C-01"], ["ดีล", "sparkles", "C-39"], ["รายการ", "receipt", "C-16"], ["ข้อความ", "message", "C-18"], ["บัญชี", "user", "C-19"]],
  M: [["ออเดอร์", "receipt", "M-03"], ["เมนู", "menu", "M-06"], ["รายงาน", "analytics", "M-13"], ["ช่วยเหลือ", "help", "M-16"], ["บัญชี", "user", "M-17"]],
  R: [["แผนที่", "map", "R-03"], ["งาน", "delivery", "R-10"], ["รายได้", "wallet", "R-11"], ["รายงาน", "analytics", "R-12"], ["บัญชี", "user", "R-15"]]
};
export function bottomNav(role, activeId) {
  if (!NAV[role]) return "";
  if (!NAV[role].some(([, , route]) => route === activeId)) return "";
  return `<nav class="bottom-nav" aria-label="เมนูหลัก">${NAV[role].map(([label, icon, route]) => { const active = activeId === route; const target = active ? 'data-action="nav-top" aria-current="page"' : `data-route="${route}"`; return `<button class="nav-item ${active ? "active" : ""}" ${target}><span class="nav-icon">${homeIcon(icon,20)}</span><span>${label}</span></button>`; }).join("")}</nav>`;
}
export function appBar(title, { subtitle = "", back = true, route = "A-06", trailing = "" } = {}) {
  return `<header class="appbar">${back ? `<button class="back-btn" aria-label="ย้อนกลับ" title="ย้อนกลับ" data-action="back-to" data-route="${escapeHTML(route)}">${homeIcon("arrowBack",20)}</button>` : ""}<div class="appbar-title"><strong>${title}</strong>${subtitle ? `<small>${subtitle}</small>` : ""}</div>${trailing}</header>`;
}
export const sosButton = () => `<button class="icon-btn sos-btn" data-action="sos" aria-label="ขอความช่วยเหลือฉุกเฉิน SOS" title="SOS">${homeIcon("sos",22)}</button>`;
export const iconButton = (icon, label, attrs = "") => `<button class="icon-btn" aria-label="${label}" title="${label}" ${attrs}>${homeIcon(icon,20)}</button>`;
export function segmented(options, selected, action, attr = "data-value") {
  return `<div class="chip-list" role="group">${options.map(([value, label]) => `<button class="chip ${value === selected ? "active" : ""}" aria-pressed="${value === selected}" data-action="${action}" ${attr}="${escapeHTML(value)}">${label}</button>`).join("")}</div>`;
}
export function faq(items) {
  return `<div class="list-group">${items.map(([q, a]) => `<details class="faq-item"><summary class="p2-help-row">${q}<span class="faq-chevron" aria-hidden="true">›</span></summary><div class="faq-answer muted small">${a}</div></details>`).join("")}</div>`;
}
export function accountFooter() {
  const row = (label, action) => `<button class="p2-help-row" data-action="${action}">${label}<span>›</span></button>`;
  return `<div class="list-group">${row("ข้อกำหนดการใช้บริการ", "show-terms")}${row("นโยบายความเป็นส่วนตัว", "show-privacy")}</div><div class="muted micro list-footnote">RMA Delivery เวอร์ชัน 1.0.0</div>${button("ออกจากระบบ", { action: "logout", variant: "ghost" })}`;
}
export function skeletonBlock(count = 3) {
  return `<div aria-label="กำลังโหลด">${Array.from({ length: count }, (_, i) => `<div class="card"><div class="skeleton skeleton-line" style="width:${56 + (i * 11) % 35}%"></div><div class="skeleton skeleton-line" style="width:${90 - i * 9}%"></div><div class="skeleton skeleton-card"></div></div>`).join("")}</div>`;
}
export function statePanel({ icon = homeIcon("inbox",30), title = "ยังไม่มีข้อมูล", message = "รายการจะแสดงที่นี่เมื่อพร้อม" } = {}) {
  return `<div class="state-box"><div><div class="state-illustration">${icon}</div><strong>${title}</strong><p class="muted small">${message}</p><button class="btn secondary" data-action="retry">ลองอีกครั้ง</button></div></div>`;
}
export function keyboardDemo() {
  return `<div class="input-demo-keyboard" aria-label="ตัวอย่างแป้นพิมพ์เปิด"><div class="key-row">${"1234567890".split("").map((x) => `<span class="key">${x}</span>`).join("")}</div><div class="key-row">${"qwertyuiop".split("").map((x) => `<span class="key">${x}</span>`).join("")}</div><div class="key-row">${"asdfghjkl".split("").map((x) => `<span class="key">${x}</span>`).join("")}</div><div class="key-row"><span class="key">?123</span><span class="key" style="flex:5">ไทย / English</span><span class="key">⌕</span></div></div>`;
}
export function modalShell(content, title = "รายละเอียด") {
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="${title}" data-modal-inner>${content}</div></div>`;
}
// Flat list (D-025): rows share the page background and are split by dividers · attrs = data-route/data-action string
export const listGroup = (rows) => `<div class="list-group">${rows}</div>`;
export function listRow({ icon = "", label, sub = "", attrs = "", trailing = "" }) {
  const tag = attrs ? "button" : "div";
  const end = trailing || (attrs ? `<span class="list-chevron">${homeIcon("chevron", 18)}</span>` : "");
  return `<${tag} class="list-row" ${attrs}>${icon ? `<span class="list-icon">${homeIcon(icon, 20)}</span>` : ""}<span class="list-copy"><span class="list-label">${label}</span>${sub ? `<small>${sub}</small>` : ""}</span>${end}</${tag}>`;
}
// Shared account blocks for C-19 / M-17 / R-15 (actions unchanged: toggle-sound, set-lang, set-theme, A-06)
export const profileRow = (initials, name, sub, extra = "") => `<div class="list-profile"><span class="avatar large">${initials}</span><div><strong>${name}</strong><div class="muted small">${sub}</div>${extra}</div></div>`;
export function settingsGroup(ctx, soundLabel = "") {
  const sound = soundLabel ? listRow({ icon: "notifications", label: soundLabel, trailing: `<button class="switch ${ctx.soundOn === false ? "" : "on"}" data-action="toggle-sound" aria-label="${soundLabel}" aria-pressed="${ctx.soundOn !== false}"></button>` }) : "";
  return listGroup(`${sound}${listRow({ icon: "message", label: "ภาษา", trailing: segmented([["th", "ไทย"], ["en", "English"]], ctx.appLang || "th", "set-lang") })}${listRow({ icon: "dark", label: "ธีม", trailing: segmented([["light", "สว่าง"], ["dark", "มืด"], ["system", "ตามระบบ"]], ctx.themePreference || "light", "set-theme") })}`);
}
export const roleSwitchRow = (sub) => listGroup(listRow({ icon: "sync", label: "เปลี่ยนโหมดการใช้งาน", sub, attrs: 'data-route="A-06"', trailing: `<span class="pill brand">สลับ role</span>` }));
