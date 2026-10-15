import { ORDER_NO, PEOPLE } from "./content.js";
import { ORDER_STATUS } from "./order-status.js";

// Push + inbox catalogue. `cat` = preference category (toggle in C-22 / M-17 / R-15) · `critical` = cannot be switched off.
// `route` = deep link opened from the banner or the inbox row · `phase`/`state` apply mockup state so the target screen matches the message.
const courier = PEOPLE.courier.name;
export const NOTIFS = Object.freeze({
  "c-accepted": { role: "C", cat: "order", icon: "food", tone: "brand", title: ORDER_STATUS.accepted.title, body: "ครัวบ้านสวน รัชดา กำลังทำอาหารให้คุณ", route: "C-12", phase: "accepted" },
  "c-toshop": { role: "C", cat: "order", icon: "bike", tone: "brand", title: ORDER_STATUS.toShop.title, body: `${courier} กำลังเดินทางไปที่ร้าน`, route: "C-12", phase: "toShop" },
  "c-pickedup": { role: "C", cat: "order", icon: "delivery", tone: "brand", title: ORDER_STATUS.pickedUp.title, body: "ถึงโดยประมาณ 12:45 น.", route: "C-12", phase: "pickedUp" },
  "c-arrived": { role: "C", cat: "order", icon: "pin", tone: "success", title: ORDER_STATUS.arrived.title, body: "รับอาหารได้เลย ไรเดอร์รออยู่ที่จุดส่ง", route: "C-12", phase: "arrived" },
  "c-delivered": { role: "C", cat: "order", icon: "checkCircle", tone: "success", title: ORDER_STATUS.delivered.title, body: "ขอบคุณที่สั่ง · แตะเพื่อให้คะแนนร้านและไรเดอร์", route: "C-15", phase: "delivered" },
  "c-cancelled": { role: "C", cat: "order", critical: true, icon: "error", tone: "danger", title: "ออเดอร์ถูกยกเลิก", body: "ร้านไม่สามารถรับออเดอร์นี้ได้ · คืนเงินเข้าช่องทางเดิมใน 3–5 วันทำการ", route: "C-12", cancelled: true },
  "c-norider": { role: "C", cat: "order", critical: true, icon: "error", tone: "warning", title: "ยังหาไรเดอร์ไม่ได้", body: "เรายังค้นหาต่อให้ หรือยกเลิกพร้อมคืนเงินเต็มจำนวนได้", route: "C-12" },
  "c-ride-accepted": { role: "C", cat: "ride", icon: "car", tone: "brand", title: "คนขับรับงานแล้ว", body: "คนขับกำลังมารับคุณ · ดูทะเบียนรถก่อนขึ้น", route: "C-37" },
  "c-ride-arrived": { role: "C", cat: "ride", icon: "pin", tone: "success", title: "คนขับถึงจุดรับแล้ว", body: "คนขับรออยู่ที่จุดรับ", route: "C-37" },
  "c-ride-done": { role: "C", cat: "ride", icon: "checkCircle", tone: "success", title: "ถึงปลายทางแล้ว", body: "ขอบคุณที่ใช้บริการ · ดูสรุปค่าโดยสาร", route: "C-38" },
  "c-chat": { role: "C", cat: "chat", icon: "message", tone: "info", title: "ข้อความใหม่จากไรเดอร์", body: "“ผมอยู่หน้าตึกนะครับ”", route: "C-13" },
  "c-promo": { role: "C", cat: "promo", icon: "sparkles", tone: "warning", title: "โปรโมชันประจำสัปดาห์", body: "ลด 20% สูงสุด ฿40 ที่ร้านใกล้บ้าน", route: "C-04" },

  "m-new": { role: "M", cat: "orders", icon: "receipt", tone: "brand", title: "ออเดอร์ใหม่เข้า", body: `${ORDER_NO} · ${PEOPLE.customer.short} · รับภายใน 45 วินาที`, route: "M-04" },
  "m-rider-arrived": { role: "M", cat: "rider", icon: "bike", tone: "success", title: "ไรเดอร์ถึงร้านแล้ว", body: `${courier} มารับออเดอร์ ${ORDER_NO}`, route: "M-05" },
  "m-cancel": { role: "M", cat: "orders", critical: true, icon: "error", tone: "danger", title: "ลูกค้ายกเลิกออเดอร์", body: `${ORDER_NO} · ไม่ต้องทำอาหารต่อ`, route: "M-03" },
  "m-chat": { role: "M", cat: "chat", icon: "message", tone: "info", title: "ข้อความใหม่", body: "“ขอเพิ่มน้ำจิ้มอีกถุงได้ไหมครับ”", route: "C-13" },

  "r-offer": { role: "R", cat: "jobs", icon: "delivery", tone: "brand", title: "งานใหม่ รับหรือปฏิเสธภายใน 30 วินาที", body: "ครัวบ้านสวน รัชดา → ห้วยขวาง · 2.4 กม.", route: "R-04" },
  "r-ready": { role: "R", cat: "order", icon: "food", tone: "success", title: "อาหารพร้อมแล้ว ไปรับได้", body: `ครัวบ้านสวน รัชดา · ${ORDER_NO}`, route: "R-05" },
  "r-delay": { role: "R", cat: "order", icon: "clock", tone: "warning", title: "ร้านแจ้งทำอาหารล่าช้า", body: "ร้านขอเวลาเพิ่มอีกประมาณ 8 นาที", route: "R-05" },
  "r-cancel": { role: "R", cat: "order", critical: true, icon: "error", tone: "danger", title: "ลูกค้ายกเลิกออเดอร์", body: "งานนี้ถูกยกเลิก · ดูค่าตอบแทนตามเงื่อนไข", route: "R-05", screenState: ["R-05", "งานถูกยกเลิก"] },
  "r-chat": { role: "R", cat: "chat", icon: "message", tone: "info", title: "ข้อความใหม่", body: "ลูกค้า: “ฝากไว้ที่ป้อมยามได้เลยค่ะ”", route: "C-13" }
});

export const NOTIF_CATS = Object.freeze({
  C: [["order", "สถานะ order", "ร้านรับออเดอร์ · ไรเดอร์รับอาหาร · ถึงแล้ว · ส่งสำเร็จ"], ["ride", "สถานะการเรียกรถ", "คนขับรับงาน · ถึงจุดรับ · ถึงปลายทาง"], ["chat", "ข้อความแชท", ""], ["promo", "โปรโมชันและข่าวสาร", ""]],
  M: [["orders", "ออเดอร์ใหม่", "แจ้งเมื่อมี order เข้าร้าน"], ["rider", "ไรเดอร์ถึงร้าน", "แจ้งเมื่อไรเดอร์มารับอาหาร"], ["chat", "ข้อความแชท", ""], ["promo", "ข่าวสารจากแพลตฟอร์ม", ""]],
  R: [["jobs", "งานใหม่", "แจ้งเมื่อมีงานเสนอถึงคุณ"], ["order", "อัปเดตงานที่รับอยู่", "อาหารพร้อมรับ · ร้านทำอาหารล่าช้า"], ["chat", "ข้อความแชท", ""], ["promo", "ข่าวสารจากแพลตฟอร์ม", ""]]
});
export const NOTIF_CRITICAL_NOTE = Object.freeze({
  C: "ออเดอร์ถูกยกเลิก · คืนเงิน · หาไรเดอร์ไม่ได้",
  M: "ลูกค้ายกเลิกออเดอร์",
  R: "ลูกค้ายกเลิกออเดอร์"
});
export const NOTIF_DEFAULT_PREFS = () => ({
  C: { order: true, ride: true, chat: true, promo: false },
  M: { orders: true, rider: true, chat: true, promo: false },
  R: { jobs: true, order: true, chat: true, promo: false }
});
// Seed inbox (newest first). ids are negative so simulated items always sort above them.
// `shade` = still waiting in the phone notification shade (S-06) · cleared when tapped or "ล้างทั้งหมด".
export const NOTIF_SEED = () => [
  ["c-pickedup", "12:38 น.", false], ["c-toshop", "12:25 น.", true], ["c-accepted", "12:19 น.", true], ["c-promo", "เมื่อวาน", true],
  ["m-rider-arrived", "12:36 น.", false], ["m-new", "12:17 น.", true],
  ["r-ready", "12:33 น.", false], ["r-delay", "12:28 น.", true], ["r-offer", "12:10 น.", true]
].map(([key, time, read], i) => ({ id: -(i + 1), key, time, read, shade: !read }));
