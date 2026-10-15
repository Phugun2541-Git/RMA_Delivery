import { NOTIFS, NOTIF_CATS, NOTIF_CRITICAL_NOTE } from "../data/notifications.js";
import { escapeHTML, listGroup, listRow, section, statePanel } from "./components.js";
import { homeIcon } from "./home-icons.js";

const BELL_ROUTE = { M: "M-18", R: "R-19" };

export const unreadCount = (notifs, role) => (notifs || []).filter((n) => NOTIFS[n.key]?.role === role && !n.read).length;

// Inbox rows (flat list, D-025): icon bubble · title + body · time · unread dot. Whole row opens the deep link.
export function notificationList(role, ctx) {
  const items = (ctx.notifs || []).filter((n) => NOTIFS[n.key]?.role === role);
  if (!items.length) return statePanel({ icon: homeIcon("notifications", 30), title: "ยังไม่มีการแจ้งเตือน", message: "เมื่อมีอัปเดตจากออเดอร์หรือแชท จะแสดงที่นี่" });
  return `<div class="list-group notif-list">${items.map((n) => {
    const def = NOTIFS[n.key];
    return `<button class="list-row notif-row ${n.read ? "" : "unread"}" data-action="notif-open" data-id="${n.id}" data-key="${n.key}"><span class="notif-icon tone-${def.tone}">${homeIcon(def.icon, 20)}</span><span class="list-copy"><span class="list-label">${def.title}</span><small>${def.body}</small></span><span class="notif-meta"><small>${n.time}</small>${n.read ? "" : `<span class="p2-unread-dot" aria-label="ยังไม่ได้อ่าน"></span>`}</span></button>`;
  }).join("")}</div>`;
}

export const markAllReadButton = (role, ctx) => unreadCount(ctx.notifs, role) ? `<button class="text-btn notif-readall" data-action="notif-readall" data-role="${role}">อ่านทั้งหมดแล้ว</button>` : "";

// Bell entry point for the app bar (merchant M-03 / rider R-03) → inbox screen
export function bellButton(role, ctx) {
  const n = unreadCount(ctx.notifs, role);
  return `<span class="bell-wrap"><button class="icon-btn" aria-label="การแจ้งเตือน" title="การแจ้งเตือน" data-route="${BELL_ROUTE[role]}">${homeIcon("notifications", 20)}</button>${n ? `<span class="bell-badge" aria-label="ยังไม่ได้อ่าน ${n} รายการ">${n}</span>` : ""}</span>`;
}

// OS-style push banner overlay (solid surface, no blur: D-003)
export function pushBanner(key, id = "") {
  const def = NOTIFS[key];
  if (!def) return "";
  return `<button class="push-banner" data-action="notif-open" data-id="${id}" data-key="${key}" aria-label="การแจ้งเตือนใหม่"><span class="push-head"><span class="push-app" aria-hidden="true">R</span><span class="push-appname">RMA Delivery</span><span class="push-now">ตอนนี้</span></span><span class="push-body"><span class="notif-icon tone-${def.tone}">${homeIcon(def.icon, 20)}</span><span class="push-copy"><strong>${def.title}</strong><span>${def.body}</span></span></span></button>`;
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

// Review-panel list: simulate a push for the selected role
export function notifDemoMarkup(role) {
  const keys = Object.keys(NOTIFS).filter((k) => NOTIFS[k].role === role);
  if (!keys.length) return "";
  return `<div class="review-section"><h3>จำลองแจ้งเตือน (push) · ${escapeHTML(role === "C" ? "ลูกค้า" : role === "M" ? "ร้านค้า" : "ไรเดอร์")}</h3><div class="flow-list">${keys.map((k) => `<button class="flow-btn" data-action="notif-simulate" data-key="${k}"><strong>${NOTIFS[k].title}</strong><span>${NOTIFS[k].critical ? "สำคัญ · " : ""}${NOTIFS[k].body}</span></button>`).join("")}</div><p class="muted micro">แบนเนอร์ขึ้นบนจอมือถือ 6 วินาที · แตะเพื่อไปหน้าที่เกี่ยวข้อง · หมวดที่ปิดในตั้งค่าจะไม่ขึ้นแบนเนอร์</p></div>`;
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
