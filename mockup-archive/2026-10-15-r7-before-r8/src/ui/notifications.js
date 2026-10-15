import { NOTIFS, NOTIF_CATS, NOTIF_CRITICAL_NOTE } from "../data/notifications.js";
import { escapeHTML, listGroup, listRow, section, statePanel } from "./components.js";
import { homeIcon } from "./home-icons.js";

export const INBOX_ROUTE = { C: "C-18", M: "M-18", R: "R-19" };
const ROLE_NAME = { C: "ลูกค้า", M: "ร้านค้า", R: "ไรเดอร์" };

export const unreadCount = (notifs, role) => (notifs || []).filter((n) => NOTIFS[n.key]?.role === role && !n.read).length;

// Inbox rows (flat list, D-025): icon bubble · title + body · time · unread dot. Whole row opens the deep link and marks it read.
export function notificationList(role, ctx) {
  const items = (ctx.notifs || []).filter((n) => NOTIFS[n.key]?.role === role);
  if (!items.length) return statePanel({ icon: "notifications", title: "ยังไม่มีการแจ้งเตือน", message: "อัปเดตออเดอร์และแชทจะแสดงที่นี่" });
  return `<div class="list-group notif-list">${items.map((n) => {
    const def = NOTIFS[n.key];
    return `<button class="list-row notif-row ${n.read ? "" : "unread"}" data-action="notif-open" data-id="${n.id}" data-key="${n.key}"><span class="notif-icon tone-${def.tone}">${homeIcon(def.icon, 20)}</span><span class="list-copy"><span class="list-label">${def.title}</span><small>${def.body}</small></span><span class="notif-meta"><small>${n.time}</small>${n.read ? "" : `<span class="p2-unread-dot" aria-label="ยังไม่ได้อ่าน"></span>`}</span></button>`;
  }).join("")}</div>`;
}

export const markAllReadButton = (role, ctx) => unreadCount(ctx.notifs, role) ? `<button class="text-btn notif-readall" data-action="notif-readall" data-role="${role}">อ่านทั้งหมด</button>` : "";

// Bell + unread badge for each role's main screens → that role's inbox (C-18 notifications tab · M-18 · R-19)
export function bellButton(role, ctx, extra = "") {
  const n = unreadCount(ctx.notifs, role);
  return `<span class="bell-wrap ${extra}"><button class="icon-btn bell-btn" aria-label="การแจ้งเตือน${n ? ` · ยังไม่ได้อ่าน ${n}` : ""}" title="การแจ้งเตือน" data-action="notif-inbox" data-role="${role}">${homeIcon("notifications", 22)}</button>${n ? `<span class="bell-badge" aria-hidden="true">${n > 9 ? "9+" : n}</span>` : ""}</span>`;
}

// OS heads-up notification (Android heads-up / iOS banner): app icon · app name · time · title · one-line body.
// Solid surface, no blur (D-003).
export function pushBanner(key, id = "", leaving = false) {
  const def = NOTIFS[key];
  if (!def) return "";
  return `<button class="push-banner ${leaving ? "leaving" : ""}" data-action="notif-open" data-id="${id}" data-key="${key}" aria-label="การแจ้งเตือนใหม่ · ${escapeHTML(def.title)}">${osAppIcon()}<span class="push-copy"><span class="push-head"><span class="push-appname">RMA Delivery</span><span class="push-dot" aria-hidden="true">·</span><span class="push-now">ตอนนี้</span></span><strong>${def.title}</strong><span class="push-body">${def.body}</span></span></button>`;
}
const osAppIcon = (size = "") => `<span class="os-app-icon ${size}" aria-hidden="true">R</span>`;

// S-06 · phone notification shade / lock screen: everything pushed while the app was closed stays here until tapped or cleared.
export function osShade(ctx) {
  const items = (ctx.notifs || []).filter((n) => n.shade && NOTIFS[n.key]);
  const rows = items.map((n) => {
    const def = NOTIFS[n.key];
    return `<button class="shade-item ${n.read ? "" : "unread"}" data-action="notif-open" data-id="${n.id}" data-key="${n.key}">${osAppIcon("small")}<span class="shade-copy"><span class="shade-head"><span>RMA Delivery · ${ROLE_NAME[def.role]}</span><span>${n.time}</span></span><strong>${def.title}</strong><span class="shade-body">${def.body}</span></span></button>`;
  }).join("");
  const body = items.length
    ? `<div class="shade-group-head"><span>การแจ้งเตือน</span><button class="shade-clear" data-action="notif-shade-clear">ล้างทั้งหมด</button></div><div class="shade-stack">${rows}</div>`
    : `<div class="shade-empty">${homeIcon("notifications", 28)}<span>ไม่มีการแจ้งเตือนใหม่</span></div>`;
  return `<div class="os-shade" aria-label="ศูนย์แจ้งเตือนของโทรศัพท์"><div class="shade-clock"><strong>9:41</strong><span>พฤหัสบดี 15 ตุลาคม</span></div>${body}<button class="shade-open-app" data-action="notif-open-app">เปิดแอป RMA Delivery</button></div>`;
}

// Per-category switches (C-22 / M-17 / R-15) + the always-on critical row
export function notifPrefsSection(role, ctx) {
  const prefs = ctx.notifPrefs?.[role] || {};
  const rows = NOTIF_CATS[role].map(([cat, label, sub]) => {
    const on = prefs[cat] !== false;
    return listRow({ icon: "notifications", label, sub, trailing: `<button class="switch ${on ? "on" : ""}" data-action="notif-pref" data-role="${role}" data-cat="${cat}" aria-label="${label}" aria-pressed="${on}"></button>` });
  }).join("");
  const critical = listRow({ icon: "error", label: "แจ้งเตือนสำคัญ", sub: NOTIF_CRITICAL_NOTE[role], trailing: `<span class="pill">เปิดเสมอ</span>` });
  return section("การแจ้งเตือน", listGroup(rows + critical));
}

// Review-panel list: simulate a push for the selected role + open the phone's notification shade (S-06)
export function notifDemoMarkup(role) {
  const keys = Object.keys(NOTIFS).filter((k) => NOTIFS[k].role === role);
  if (!keys.length) return "";
  return `<div class="review-section"><h3>จำลองแจ้งเตือน (push) · ${escapeHTML(ROLE_NAME[role])}</h3><button class="btn secondary" style="margin-bottom:8px" data-route="S-06">เปิดศูนย์แจ้งเตือนมือถือ (S-06)</button><div class="flow-list">${keys.map((k) => `<button class="flow-btn" data-action="notif-simulate" data-key="${k}"><strong>${NOTIFS[k].title}</strong><span>${NOTIFS[k].critical ? "สำคัญ · " : ""}${NOTIFS[k].body}</span></button>`).join("")}</div><p class="muted micro">แบนเนอร์ขึ้น 6 วินาทีแล้วหายไป แต่ยังอยู่ใน S-06 (ถาดแจ้งเตือนของมือถือ) และกล่องแจ้งเตือนในแอป · แตะ = เปิดหน้าที่เกี่ยวข้อง + อ่านแล้ว · หมวดที่ปิดในตั้งค่าจะไม่ขึ้นแบนเนอร์</p></div>`;
}

// Keep the mockup state coherent with a notification (tracking phase, cancelled order, shop ready/delay, screen state)
export function applyNotifEffect(state, key) {
  const n = NOTIFS[key];
  if (n.phase) {
    state.trackPhase = n.phase; state.orderCancelled = false; state.screenStates["C-12"] = "กำลังส่ง";
    state.merchantStatus = n.phase === "accepted" ? "กำลังทำ" : n.phase === "toShop" ? "พร้อมส่ง" : "ส่งมอบไรเดอร์แล้ว";
  }
  if (n.cancelled) { state.orderCancelled = true; state.screenStates["C-12"] = "ยกเลิกแล้ว"; }
  if (key === "r-ready") state.merchantStatus = "พร้อมส่ง";
  if (key === "r-delay") state.shopDelay = true;
  if (n.screenState) state.screenStates[n.screenState[0]] = n.screenState[1];
}
