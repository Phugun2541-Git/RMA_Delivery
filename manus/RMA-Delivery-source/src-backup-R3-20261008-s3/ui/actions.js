import { MENU } from "../data/content.js";
import { DIALOGS, REASONS } from "./modals-extra.js";

const openModal = (api, modal, patch = {}) => { Object.assign(api.state, patch, { modal }); api.render(); };
const stripPrice = (label = "") => String(label).replace(/\s*\+\d+$/, "");

function saveCart(api, actionEl) {
  const { state } = api;
  const m = MENU[state.menuIndex] || MENU[0];
  const extras = [...state.menuExtras];
  const extra = extras.reduce((sum, i) => sum + api.extraPrice(m.extra?.[i]), 0);
  const note = [m.choices?.[state.menuChoice], ...extras.map((i) => stripPrice(m.extra?.[i]))].filter(Boolean).join(" · ") || "ไม่มีตัวเลือกเพิ่มเติม";
  const editing = state.editCartIndex !== null && state.cart[state.editCartIndex];
  if (editing) {
    if (state.menuQty <= 0) state.cart.splice(state.editCartIndex, 1);
    else Object.assign(state.cart[state.editCartIndex], { qty: state.menuQty, note, extra, choice: state.menuChoice, extras });
    state.editCartIndex = null;
    api.showToast(state.menuQty <= 0 ? "นำรายการออกจากตะกร้าแล้ว" : "อัปเดตตะกร้าแล้ว", false);
    api.navigate("C-08");
    return;
  }
  const same = state.cart.find((x) => x.menuIndex === state.menuIndex && x.note === note);
  if (same) same.qty += state.menuQty;
  else state.cart.push({ menuIndex: state.menuIndex, qty: state.menuQty, note, extra, choice: state.menuChoice, extras });
  api.showToast("ใส่ตะกร้าแล้ว", false);
  api.navigate("C-06");
}

function payResult(api, ok) {
  const { state } = api;
  if (ok) { state.screenStates["C-11"] = "ชำระสำเร็จ"; state.orderCancelled = false; api.showToast("ชำระเงินสำเร็จ · สร้าง order แล้ว", false); api.navigate("C-12"); return; }
  state.screenStates["C-11"] = "ชำระไม่สำเร็จ"; api.render();
}

// Returns true when the action was handled here.
export function handleCoreAction(action, el, api) {
  const { state } = api;
  const d = el.dataset;
  switch (action) {
    case "demo": {
      (d.set || "").split(",").filter(Boolean).forEach((pair) => { const i = pair.indexOf("="); const k = pair.slice(0, i); const v = pair.slice(i + 1); state[k] = v === "true" ? true : v === "false" ? false : v; });
      if (d.screenState) { const i = d.screenState.indexOf("="); state.screenStates[d.screenState.slice(0, i)] = d.screenState.slice(i + 1); }
      if (d.go) api.navigate(d.go); else api.render();
      return true;
    }
    case "nav-top": document.querySelector("#screen-host")?.scrollTo?.({ top: 0, behavior: "smooth" }); return true;
    case "m-order-tab": state.orderTab = d.value || "ใหม่"; api.render(); return true;
    case "sk-connect": {
      state.screenStates["M-10"] = "กำลังเชื่อม"; api.render();
      setTimeout(() => { if (state.screenStates["M-10"] === "กำลังเชื่อม") { state.screenStates["M-10"] = "เชื่อมต่อแล้ว"; api.showToast("เชื่อม Smart Kitchen สำเร็จ", false); if (state.currentId === "M-10") api.render(); } }, 1600);
      return true;
    }
    case "save-qr": api.showToast("บันทึกรูป QR ลงเครื่องแล้ว", false); return true;
    case "sos": case "emergency": openModal(api, "sos-confirm"); return true;
    case "sos-send": state.modal = ""; api.showToast("ส่งสัญญาณขอความช่วยเหลือแล้ว ทีมงานกำลังติดต่อกลับ", false); api.render(); return true;
    case "logout-confirm": state.modal = ""; api.showToast("ออกจากระบบแล้ว", false); api.navigate("A-03"); return true;
    case "show-terms": openModal(api, "terms"); return true;
    case "show-privacy": openModal(api, "privacy"); return true;
    case "merchant-decline": openModal(api, "reason", { reasonKind: "merchant-decline" }); return true;
    case "decline-offer": openModal(api, "reason", { reasonKind: "rider-decline" }); return true;
    case "cancel-ride": openModal(api, "reason", { reasonKind: "ride-cancel" }); return true;
    case "cancel-ride-trip": openModal(api, "reason", { reasonKind: "ride-cancel-trip" }); return true;
    case "pick-reason": { const r = REASONS[state.reasonKind]; state.modal = ""; if (r) { api.showToast(r.toast, false); api.navigate(r.go); } else api.render(); return true; }
    case "passenger-no-show": openModal(api, "dialog", { dialogKind: "no-show" }); return true;
    case "disconnect-sk": openModal(api, "dialog", { dialogKind: "disconnect-sk" }); return true;
    case "confirm-delete": openModal(api, "dialog", { dialogKind: "delete-account" }); return true;
    case "dialog-demo": openModal(api, "dialog", { dialogKind: "default" }); return true;
    case "confirm-dialog": { const dlg = DIALOGS[state.dialogKind] || DIALOGS.default; state.modal = ""; api.showToast(dlg.toast, false); if (dlg.go) api.navigate(dlg.go); else api.render(); return true; }
    case "issue-type": state.issueType = d.value || state.issueType; api.render(); return true;
    case "issue-submit": state.modal = ""; api.showToast("ส่งเรื่องแล้ว ทีมช่วยเหลือจะติดต่อกลับภายใน 30 นาที", false); api.render(); return true;
    case "cannot-reach-report": state.modal = ""; api.showToast("แจ้งศูนย์ช่วยเหลือแล้ว รอการยืนยันยกเลิกงาน", false); api.render(); return true;
    case "merchant-open": {
      if (state.merchantOpen) { openModal(api, "shop-pause"); return true; }
      state.merchantOpen = true; state.shopPause = ""; state.screenStates["M-03"] = "มี order"; api.showToast("เปิดรับออเดอร์แล้ว", false); api.render(); return true;
    }
    case "shop-pause-pick": state.merchantOpen = false; state.shopPause = d.value || "day"; state.screenStates["M-03"] = "ร้านปิด"; state.modal = ""; api.showToast("ปิดรับออเดอร์ชั่วคราวแล้ว", false); api.render(); return true;
    case "deal-filter": state.dealFilter = d.value || "ทั้งหมด"; api.render(); return true;
    case "ride-arrived": state.rideStep = 1; api.render(); return true;
    case "ride-start": state.rideStep = 2; api.navigate("R-17"); return true;
    case "take-proof": state.proofTaken = true; api.showToast("บันทึกรูปหลักฐานแล้ว", false); api.render(); return true;
    case "cash-collected": state.cashCollected = !state.cashCollected; api.render(); return true;
    case "payment-check": payResult(api, state.payOutcome !== "fail"); return true;
    case "payment-success": payResult(api, true); return true;
    case "payment-fail": payResult(api, false); return true;
    case "set-theme": api.setTheme(d.value); return true;
    case "set-lang": state.appLang = d.value || "th"; api.render(); return true;
    case "toggle-sound": state.soundOn = !state.soundOn; api.render(); return true;
    case "seg": { el.parentElement?.querySelectorAll(".chip").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); }); el.classList.add("active"); el.setAttribute("aria-pressed", "true"); return true; }
    case "menu-choice": state.menuChoice = Number(d.index); api.render(); return true;
    case "menu-extra": { const i = Number(d.index); state.menuExtras = state.menuExtras.includes(i) ? state.menuExtras.filter((x) => x !== i) : [...state.menuExtras, i]; api.render(); return true; }
    case "open-menu": {
      state.menuIndex = Number(d.menu || 0); state.menuQty = 1; state.editCartIndex = null;
      state.menuChoice = MENU[state.menuIndex]?.choices ? -1 : 0; state.menuExtras = [];
      api.navigate("C-07"); return true;
    }
    case "menu-qty-plus": state.menuQty++; api.render(); return true;
    case "menu-qty-minus": state.menuQty = Math.max(state.editCartIndex !== null ? 0 : 1, state.menuQty - 1); api.render(); return true;
    case "add-cart": saveCart(api, el); return true;
    case "p2-edit-cart": {
      const index = Number(d.index); const item = state.cart[index];
      if (!item) return true;
      state.editCartIndex = index; state.menuIndex = item.menuIndex; state.menuQty = item.qty;
      state.menuChoice = item.choice ?? 0; state.menuExtras = [...(item.extras || [])];
      api.navigate("C-07"); return true;
    }
    default: return false;
  }
}
