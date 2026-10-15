import { escapeHTML } from "./components.js";

// Review-panel-only controls. They simulate server events and never render inside the phone frame.
const btn = (label, { set = "", screenState = "", go = "", action = "" } = {}) => {
  if (action) return `<button class="flow-btn" data-action="${action}"><strong>${label}</strong></button>`;
  const attrs = [set && `data-set="${escapeHTML(set)}"`, screenState && `data-screen-state="${escapeHTML(screenState)}"`, go && `data-go="${go}"`].filter(Boolean).join(" ");
  return `<button class="flow-btn" data-action="demo" ${attrs}><strong>${label}</strong></button>`;
};

const payOnline = btn("ลูกค้าชำระออนไลน์", { set: "paymentMethod=พร้อมเพย์ QR" });
const payCash = btn("ลูกค้าจ่ายเงินสด", { set: "paymentMethod=เงินสด" });

const SCREEN_CONTROLS = {
  "A-04": [btn("แสดงสถานะรหัสผิด", { set: "otpStatus=error" }), btn("แสดงสถานะส่งรหัสใหม่แล้ว", { set: "otpStatus=resent" })],
  "C-11": [btn("ชำระสำเร็จ", { action: "payment-success" }), btn("ชำระไม่สำเร็จ", { action: "payment-fail" }), btn("ผลตอนกดตรวจสอบ = สำเร็จ", { set: "payOutcome=success" }), btn("ผลตอนกดตรวจสอบ = ไม่สำเร็จ", { set: "payOutcome=fail" })],
  "C-12": [btn("ไรเดอร์รับงานพ่วง", { set: "hasBundle=true" }), btn("ไรเดอร์รับอาหารจากร้านแล้ว", { set: "merchantStatus=ส่งมอบไรเดอร์แล้ว" }), btn("ส่งอาหารสำเร็จ → C-15", { go: "C-15" })],
  "C-36": [btn("พบคนขับ", { screenState: "C-36=พบคนขับ" }), btn("หาคนขับไม่ได้", { action: "no-driver" }), btn("คนขับกำลังมา → C-37", { set: "rideStage=coming", go: "C-37" })],
  "C-37": [btn("คนขับถึงจุดรับ / ขึ้นรถแล้ว", { set: "rideStage=riding" }), btn("ถึงปลายทาง → C-38", { go: "C-38" }), btn("ชำระเงินสด", { set: "ridePayment=เงินสด" })],
  "M-03": [btn("ออเดอร์ใหม่เข้า → M-04", { go: "M-04" })],
  "R-03": [btn("งานอาหารเข้า", { set: "offerKind=food", go: "R-04" }), btn("งานรับส่งคนเข้า", { set: "offerKind=passenger", go: "R-04" }), btn("งานพ่วงเข้า", { set: "offerKind=bundle", go: "R-04" })],
  "R-04": [btn("ข้อเสนอ: งานอาหาร", { set: "offerKind=food" }), btn("ข้อเสนอ: รับส่งคน", { set: "offerKind=passenger" }), btn("ข้อเสนอ: งานพ่วง", { set: "offerKind=bundle" })],
  "R-05": [btn("งานพ่วงเข้าระหว่างทาง", { set: "offerKind=bundle", go: "R-04" })],
  "R-07": [payOnline, payCash],
  "R-08": [payOnline, payCash],
  "R-16": [btn("ผู้โดยสารจ่ายเงินสด", { set: "ridePayment=เงินสด" }), btn("ผู้โดยสารจ่ายพร้อมเพย์", { set: "ridePayment=พร้อมเพย์ QR" }), btn("รีเซ็ตขั้นตอน", { set: "rideStep=0" })],
  "R-17": [btn("ผู้โดยสารจ่ายเงินสด", { set: "ridePayment=เงินสด" }), btn("ผู้โดยสารจ่ายพร้อมเพย์", { set: "ridePayment=พร้อมเพย์ QR" })]
};

export function demoMarkup(currentId) {
  const items = SCREEN_CONTROLS[currentId];
  if (!items) return "";
  return `<div class="review-section"><h3>ตัวช่วยสาธิต · จำลองเหตุการณ์จากระบบ</h3><div class="flow-list">${items.join("")}</div></div>`;
}
