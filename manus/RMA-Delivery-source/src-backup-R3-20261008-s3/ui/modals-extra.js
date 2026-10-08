import { escapeHTML } from "./components.js";

export const DIALOGS = {
  default: { title: "ยืนยันการทำรายการ?", body: "การดำเนินการนี้ไม่สามารถย้อนกลับได้", label: "ยืนยัน", toast: "ทำรายการแล้ว", go: "" },
  "no-show": { title: "ผู้โดยสารไม่มาตามนัด?", body: "ยกเลิกงานนี้ได้หลังรอครบ 5 นาที ระบบจะแจ้งผู้โดยสารและคิดค่าเสียเวลาตามเงื่อนไข", label: "ยกเลิกงาน", toast: "ยกเลิกงานแล้ว", go: "R-03" },
  "disconnect-sk": { title: "ยกเลิกการเชื่อม Smart Kitchen?", body: "เมนูและสต็อกจะไม่ซิงก์อัตโนมัติ และออเดอร์จะไม่ถูกส่งเข้าครัว คุณต้องจัดการเมนูในแอปนี้เอง", label: "ยกเลิกการเชื่อม", toast: "ยกเลิกการเชื่อมแล้ว", go: "" },
  "delete-account": { title: "ขอลบบัญชี?", body: "ข้อมูลทั้งหมดจะถูกลบและกู้คืนไม่ได้ ทีมงานจะตรวจสอบคำขอภายใน 7 วัน", label: "ขอลบบัญชี", toast: "ส่งคำขอลบบัญชีแล้ว", go: "" }
};

export const REASONS = {
  "merchant-decline": { title: "ปฏิเสธออเดอร์นี้?", note: "เลือกเหตุผล ลูกค้าจะได้รับแจ้งและคืนเงินเต็มจำนวน", list: ["วัตถุดิบหมด", "ร้านยุ่งมาก รับไม่ไหว", "ใกล้ปิดร้าน", "เหตุผลอื่น"], label: "ปฏิเสธออเดอร์", toast: "ปฏิเสธออเดอร์แล้ว", go: "M-03" },
  "rider-decline": { title: "ปฏิเสธงานนี้?", note: "การปฏิเสธบ่อยอาจมีผลต่ออัตรารับงาน", list: ["อยู่ไกลเกินไป", "ค่าตอบแทนไม่คุ้ม", "ขอพักก่อน", "เหตุผลอื่น"], label: "ปฏิเสธงาน", toast: "ปฏิเสธงานแล้ว", go: "R-03" },
  "ride-cancel": { title: "ยกเลิกการค้นหารถ?", note: "ยังไม่มีค่าใช้จ่าย เลือกเหตุผลที่ยกเลิก", list: ["รอนานเกินไป", "เปลี่ยนแผนการเดินทาง", "ใส่จุดรับผิด", "เหตุผลอื่น"], label: "ยกเลิกการค้นหา", toast: "ยกเลิกการค้นหารถแล้ว", go: "C-33" },
  "ride-cancel-trip": { title: "ยกเลิกการเดินทาง?", note: "ยกเลิกได้ก่อนขึ้นรถ อาจมีค่าธรรมเนียมหากคนขับใกล้ถึง", list: ["คนขับมาช้า", "เปลี่ยนแผนการเดินทาง", "จองผิดประเภทรถ", "เหตุผลอื่น"], label: "ยกเลิกการเดินทาง", toast: "ยกเลิกการเดินทางแล้ว", go: "C-33" }
};

const ISSUE_TYPES = ["ได้รับอาหารไม่ครบ", "อาหารเสียหาย", "ยอดเงินไม่ถูกต้อง", "ไรเดอร์มีปัญหา", "อื่น ๆ"];
const PAUSES = [["30", "พักรับออเดอร์ 30 นาที"], ["60", "พักรับออเดอร์ 1 ชั่วโมง"], ["day", "ปิดร้านวันนี้"]];

const closeBtn = `<button class="btn ghost" data-action="close-modal">กลับ</button>`;

export function extraModal(type, state) {
  if (type === "logout-confirm") return `<h3>ออกจากระบบ?</h3><p class="muted small">คุณต้องเข้าสู่ระบบอีกครั้งเพื่อใช้งานต่อ</p><div class="btn-row">${closeBtn}<button class="btn danger" data-action="logout-confirm">ออกจากระบบ</button></div>`;
  if (type === "sos-confirm") return `<h3>ขอความช่วยเหลือฉุกเฉิน?</h3><p class="muted small">ระบบจะแจ้งทีมช่วยเหลือพร้อมตำแหน่งปัจจุบัน และแชร์การเดินทางให้ผู้ติดต่อฉุกเฉินของคุณ</p><div class="btn-row">${closeBtn}<button class="btn danger" data-action="sos-send">แจ้งเหตุฉุกเฉิน</button></div>`;
  if (type === "terms") return `<h3>ข้อกำหนดการใช้บริการ</h3><p class="muted small">เอกสารฉบับเต็มจะแสดงที่นี่ เมื่อทีมกฎหมายส่งข้อความสุดท้ายมา</p><button class="btn" data-action="close-modal">ปิด</button>`;
  if (type === "privacy") return `<h3>นโยบายความเป็นส่วนตัว</h3><p class="muted small">อธิบายข้อมูลที่เก็บ วัตถุประสงค์ และสิทธิ์ของเจ้าของข้อมูลตาม PDPA เอกสารฉบับเต็มจะแสดงที่นี่</p><button class="btn" data-action="close-modal">ปิด</button>`;
  if (type === "dialog") {
    const d = DIALOGS[state.dialogKind] || DIALOGS.default;
    return `<h3>${d.title}</h3><p class="muted small">${d.body}</p><div class="btn-row">${closeBtn}<button class="btn danger" data-action="confirm-dialog">${d.label}</button></div>`;
  }
  if (type === "reason") {
    const r = REASONS[state.reasonKind] || REASONS["rider-decline"];
    return `<h3>${r.title}</h3><p class="muted small">${r.note}</p>${r.list.map((x) => `<button class="toggle-row" data-action="pick-reason" data-reason="${escapeHTML(x)}"><span>${x}</span><span>›</span></button>`).join("")}${closeBtn}`;
  }
  if (type === "issue-form") {
    return `<h3>แจ้งปัญหารายการนี้</h3><p class="muted small">เลือกประเภทปัญหา แล้วเล่ารายละเอียดให้ทีมช่วยเหลือ</p><div class="chip-list" style="flex-wrap:wrap">${ISSUE_TYPES.map((x) => `<button class="chip ${state.issueType === x ? "active" : ""}" data-action="issue-type" data-value="${x}">${x}</button>`).join("")}</div><div class="form-field"><label>รายละเอียด</label><textarea class="textarea" placeholder="เล่าสิ่งที่เกิดขึ้น"></textarea></div><button class="btn secondary" data-action="toast-upload">แนบรูปประกอบ</button><div class="btn-row" style="margin-top:8px">${closeBtn}<button class="btn" data-action="issue-submit">ส่งเรื่อง</button></div>`;
  }
  if (type === "shop-pause") {
    return `<h3>ปิดรับออเดอร์ชั่วคราว?</h3><p class="muted small">ลูกค้าจะสั่งร้านนี้ไม่ได้ในช่วงที่ปิด ออเดอร์ที่รับไว้แล้วยังต้องทำต่อ</p>${PAUSES.map(([v, l]) => `<button class="toggle-row" data-action="shop-pause-pick" data-value="${v}"><span>${l}</span><span>›</span></button>`).join("")}${closeBtn}`;
  }
  if (type === "cannot-reach") {
    return `<h3>ติดต่อลูกค้าไม่ได้</h3><p class="muted small">ลองโทรอีกครั้ง รอที่จุดส่ง 3 นาที แล้วแจ้งศูนย์ช่วยเหลือเพื่อขอยกเลิกงาน</p><div class="step-list"><div class="step done"><span class="step-dot">✓</span><div class="step-copy"><strong>โทรหาลูกค้า</strong><small>ลองแล้ว 1 ครั้ง</small></div></div><div class="step"><span class="step-dot">2</span><div class="step-copy"><strong>รอที่จุดส่ง 3 นาที</strong><small>ระบบนับเวลาให้</small></div></div><div class="step"><span class="step-dot">3</span><div class="step-copy"><strong>แจ้งศูนย์ช่วยเหลือ</strong><small>เมื่อครบเวลาแล้วยังติดต่อไม่ได้</small></div></div></div><button class="btn secondary" data-action="toast-call">โทรอีกครั้ง</button><div class="btn-row" style="margin-top:8px">${closeBtn}<button class="btn" data-action="cannot-reach-report">แจ้งศูนย์ช่วยเหลือ</button></div>`;
  }
  return null;
}
