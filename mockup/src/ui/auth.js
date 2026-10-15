import { PEOPLE } from "../data/content.js";
import { appBar, badge, button, field, segmented } from "./components.js";
import { homeIcon } from "./home-icons.js";

const wordmark = `<div class="row" style="justify-content:center;margin:28px 0 12px"><span class="brand-dot">R</span><strong style="font-size:20px">RMA Delivery</strong></div>`;
// R6: no eyebrow above the heading; one title + one short line
const authHead = (title, copy = "") => `${wordmark}<div class="page-heading" style="text-align:center"><h2>${title}</h2>${copy ? `<p>${copy}</p>` : ""}</div>`;

// A-06 role switch: flat list (icon · role · one line · status chip only when relevant · trailing check/chevron)
function roleSwitch(ctx) {
  const from = ["C", "M", "R"].includes(ctx.previousId?.[0]) ? ctx.previousId[0] : "C";
  const roles = [
    { id: "C", icon: "user", name: "ลูกค้า", sub: "สั่งอาหาร · เรียกรถ", go: "C-01" },
    { id: "M", icon: "store", name: "ร้านค้า", sub: "รับออเดอร์ · จัดการร้าน", go: "M-03", status: ["ยังไม่ได้สมัคร", "warning"], apply: "M-01" },
    { id: "R", icon: "bike", name: "ไรเดอร์ / คนขับ", sub: "ส่งอาหาร · รับส่งคน", go: "R-03", status: ["รออนุมัติ", "info"], apply: "R-02" }
  ];
  const rows = roles.map((r) => {
    const current = r.id === from;
    const pending = !current && r.status;
    const route = current ? r.go : pending ? r.apply : r.go;
    const end = current ? `<span class="role-current">${homeIcon("checkCircle", 22)}</span>` : `<span class="list-chevron">${homeIcon("chevron", 18)}</span>`;
    return `<button class="list-row role-row ${current ? "is-current" : ""}" data-route="${route}" ${current ? 'aria-current="true"' : ""}><span class="role-icon role-${r.id}">${homeIcon(r.icon, 22)}</span><span class="list-copy"><span class="list-label">${r.name}${current ? ` <small class="role-now">ใช้งานอยู่</small>` : ""}</span><small>${r.sub}</small></span>${pending ? badge(r.status[0], r.status[1]) : ""}${end}</button>`;
  }).join("");
  const back = Boolean(ctx.previousId) && ctx.previousId !== "A-05";
  return `${appBar("สลับโหมด", { back, route: ctx.previousId || "C-19" })}<div class="page-heading"><h2>ใช้งานในโหมดไหน?</h2><p>บัญชีเดียว ใช้ได้ทุกโหมด</p></div><div class="list-group">${rows}</div>`;
}

export function renderAuth(id,ctx) {
  switch(id) {
    case "A-01": return `<div data-route="A-02" role="button" tabindex="0" aria-label="แตะเพื่อไปต่อ" style="cursor:pointer;min-height:670px;display:flex;flex-direction:column;justify-content:center;text-align:center;padding:18px">${wordmark}<div class="splash-mark">${homeIcon("arrow",58)}</div><h2 style="font-size:29px;margin:6px 0">บริการใกล้ตัว<br>ในแอปเดียว</h2><div class="muted small" style="margin-top:28px">แตะเพื่อไปต่อ</div></div>`;
    case "A-02": return `${authHead("เลือกภาษา","เปลี่ยนได้ภายหลังที่ตั้งค่า")}${segmented([["th","ไทย"],["en","English"]], ctx.appLang||"th", "set-lang")}<div class="intro-slide"><span class="permission-icon">${homeIcon("home",36)}</span><strong>ร้านโปรด ส่งถึงหน้าบ้าน</strong><p class="muted small">สั่งอาหารและเรียกรถในแอปเดียว</p></div><div class="sticky-action">${button("ถัดไป",{route:"A-03"})}</div>`;
    case "A-03": return `${authHead("เข้าสู่ระบบ","รับรหัสยืนยันทางเบอร์โทร")}${field("เบอร์โทรศัพท์", "08X XXX XXXX", "tel", "0812343278")}<div class="muted micro center-note">เมื่อดำเนินต่อ ถือว่ายอมรับเงื่อนไขและนโยบายความเป็นส่วนตัว</div><div class="sticky-action">${button("รับรหัส OTP",{route:"A-04"})}<button class="text-btn sheet-text-btn" data-action="line-login">เข้าสู่ระบบด้วย LINE</button></div>`;
    case "A-04": return `${authHead("ยืนยันเบอร์โทร","กรอกรหัส 6 หลักที่ส่งไป 08x-xxx-3278")}<div class="row" style="justify-content:center;gap:7px;margin:22px 0">${[1,2,3,4,5,6].map((x,i)=>`<input class="field" aria-label="เลข OTP ${x}" maxlength="1" inputmode="numeric" value="${i===0?'1':i===1?'2':i===2?'3':i===3?'4':i===4?'5':'6'}" style="width:43px;height:54px;padding:0;text-align:center;font-size:22px;font-weight:700">`).join("")}</div><div class="muted small" style="text-align:center">ส่งรหัสใหม่ได้ใน <strong data-countdown>00:28</strong></div><button class="text-btn" data-action="resend-otp" data-resend disabled style="display:block;margin:8px auto">ส่งรหัสอีกครั้ง · 28 วินาที</button><div class="sticky-action">${button("ยืนยันรหัส",{route:"A-05"})}<button class="text-btn sheet-text-btn" data-route="A-03">เปลี่ยนเบอร์โทร</button></div>`;
    case "A-05": {
      const consent = ctx.consent || {};
      const row = (key, label, doc) => `<div class="consent-row"><button class="opt-row" role="checkbox" aria-checked="${Boolean(consent[key])}" data-action="consent-toggle" data-key="${key}"><span class="opt-control checkbox" aria-hidden="true">${consent[key] ? homeIcon("check", 16) : ""}</span><span class="opt-label">${label}</span></button><button class="text-btn" data-action="${doc}">อ่าน</button></div>`;
      return `${authHead("ยินดีที่ได้รู้จัก","ตั้งชื่อและยอมรับเงื่อนไข")}${field("ชื่อ-นามสกุล", "ชื่อจริง นามสกุล", "text", PEOPLE.customer.name)}<div class="list-group">${row("terms", "ยอมรับข้อกำหนดการใช้บริการ", "show-terms")}${row("pdpa", "รับทราบประกาศความเป็นส่วนตัว (PDPA)", "show-privacy")}</div><div class="sticky-action">${button("ดำเนินการต่อ",{action:"complete-consent",disabled:!(consent.terms&&consent.pdpa)})}</div>`;
    }
    case "A-06": return roleSwitch(ctx);
    case "A-07": return `${authHead("เปิดใช้บริการใกล้ตัว")}${button("ไปหน้าหลัก",{route:"C-01"})}`;
    default: return `${authHead("เลือกโหมด")}${button("ไปหน้าหลัก",{route:"C-01"})}`;
  }
}
