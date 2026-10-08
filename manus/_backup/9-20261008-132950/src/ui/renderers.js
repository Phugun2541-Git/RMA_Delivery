import { SCREEN_BY_ID } from "../data/screens.js";
import { appBar, skeletonBlock, statePanel, button, card, section } from "./components.js";
import { renderAuth } from "./auth.js";
import { renderCustomer } from "./customer.js";
import { renderMerchant } from "./merchant.js";
import { renderRider } from "./rider.js";
import { renderShared } from "./shared.js";
import { renderP2 } from "./p2.js";
import { replaceLegacyIcons } from "./home-icons.js";

const genericStates = new Set(["loading", "ว่าง", "ผิดพลาด"]);
const centralRuleScreens = new Set(["A-04","C-11","C-36","C-37","C-20","C-22","C-33","C-17","C-23","C-07","M-02","M-03","M-04","M-10","M-11","M-12","R-02","R-04","R-05","R-06","R-07","R-08","R-09","R-12","R-13","R-16","R-17","R-18","A-02","M-07"]);
function centralRuleRenderer(id, ctx) {
  const title = SCREEN_BY_ID[id]?.title || id;
  if (id === "C-37") return `${appBar("คนขับกำลังมา", { back: true, route: "C-36" })}${card("ทะเบียนรถ กข 1234 · ถึงใน 4 นาที")}${button("ยกเลิกการเดินทาง", { action: "cancel-ride", variant: "ghost" })}<button class="icon-btn" data-action="emergency" aria-label="SOS">SOS</button>`;
  if (id === "R-05") return `${appBar("ไปรับอาหาร", { back: true, route: "R-04" })}${card("แผนที่เส้นทาง · นำทางไปยังร้าน")}${button("SOS", { action: "emergency", variant: "ghost" })}<div class="sticky-action">${button("ถึงร้านแล้ว", { action: "central-next" })}</div>`;
  if (id === "R-08") return `${appBar("ยืนยันส่งสำเร็จ", { back: true, route: "R-07" })}${card("หลักฐานการส่ง · เงินสดที่ต้องเก็บ ฿0")}${button("ติดต่อลูกค้าไม่ได้", { action: "cannot-reach", variant: "ghost" })}<div class="sticky-action">${button("ยืนยันส่งอาหารแล้ว", { action: "central-next", disabled: true })}</div>`;
  if (id === "M-03") return `${appBar("จัดการออเดอร์", { back: false })}<div class="chip-list"><button class="chip active">ใหม่</button><button class="chip">กำลังทำ</button><button class="chip">พร้อมส่ง</button></div>${card("ออเดอร์ใหม่ · เตรียมอาหาร 20 นาที")}`;
  if (id === "C-17") return `${appBar("รายละเอียดรายการ", { back: true, route: "C-16" })}${card("ใบเสร็จรับเงิน · ส่งสำเร็จ")}${button("แจ้งปัญหารายการนี้", { action: "open-issue-form", variant: "secondary" })}`;
  if (id === "C-07") return `${appBar("เพิ่มลงตะกร้า", { back: true, route: "C-06" })}${card("รายละเอียดเมนู · เลือกตัวเลือกที่ต้องการ")}${button("ใส่ตะกร้า · ฿178", { action: "add-cart" })}`;
  if (id === "R-18") return `${appBar("ลำดับจุดแวะ", { back: true, route: "R-05" })}<div class="step-list">${["รับ A","รับ B","ส่ง B","ส่ง A"].map((stop, i) => `<div class="step ${i === 0 ? "done" : ""}"><span class="step-dot">${i === 0 ? "✓" : i + 1}</span><div class="step-copy"><strong>${stop}</strong><small>จุดแวะของงานอาหาร</small></div></div>`).join("")}</div>${button("ยืนยันเส้นทาง", { route: "R-06" })}`;
  const sticky = ["C-33","C-36","M-04","R-04","R-05","R-06","R-07","R-08","R-16","R-17"].includes(id);
  const action = id === "R-04" ? "รับงาน" : id === "R-05" ? "ถึงร้านแล้ว" : id === "R-08" ? "ยืนยันส่งอาหารแล้ว" : "ดำเนินการต่อ";
  return `${appBar(title, { back: true, route: ctx.previousId || "C-01" })}${card(`<strong>${title}</strong><div class="muted small">ข้อมูลสถานะและการดำเนินการของหน้านี้</div>`)}${sticky ? `<div class="sticky-action">${button(action, { action: "central-next" })}</div>` : button(action, { action: "central-next", variant: "secondary" })}`;
}
function genericState(id,ctx,value) {
  const backRoute=ctx.previousId||'C-01';
  if (value === "loading") return `${appBar(SCREEN_BY_ID[id]?.title || 'กำลังโหลด',{back:true,route:backRoute})}<div class="screen-content">${skeletonBlock(id==='C-06'?4:3)}</div>`;
  if (value === "ว่าง") return `${appBar(SCREEN_BY_ID[id]?.title || 'ยังไม่มีข้อมูล',{back:true,route:backRoute})}<div class="screen-content">${statePanel({title:"ยังไม่มีรายการ",message:"เมื่อมีข้อมูล ระบบจะแสดงในหน้านี้"})}${button('กลับหน้าหลัก',{route:'C-01',variant:'secondary'})}</div>`;
  return `${appBar(SCREEN_BY_ID[id]?.title || 'เชื่อมต่อไม่ได้',{back:true,route:backRoute})}<div class="screen-content">${statePanel({icon:"⌁",title:"เชื่อมต่อไม่สำเร็จ",message:"ตรวจอินเทอร์เน็ตและลองโหลดข้อมูลอีกครั้ง"})}${button('ลองใหม่',{action:'retry'})}</div>`;
}

function renderScreenRaw(id,ctx) {
  const entry=SCREEN_BY_ID[id];
  if(!entry) return `<div class="screen-content">${statePanel({title:"ไม่พบหน้าจอ",message:`ไม่พบรหัส ${id}`})}${button('กลับหน้าหลัก',{route:'C-01'})}</div>`;
  const value=ctx.state;
  if(genericStates.has(value)) return genericState(id,ctx,value);
  if (id === "A-01") return `<div class="splash-screen"><div class="state-illustration">RMA Delivery</div><div class="muted small">กำลังตรวจ session</div></div>`;
  if (centralRuleScreens.has(id)) return centralRuleRenderer(id, ctx);
  if (id === "C-19") return `${renderCustomer(id,ctx)}${button("ออกจากระบบ", { action: "logout", variant: "danger" })}`;
  if (id === "M-17") return `${appBar("บัญชีร้านค้า", { back: false })}${card(`<strong>${ctx.roleMeta?.M?.label || "ร้านค้า"}</strong><div class="muted small">ตั้งค่าการใช้งานและข้อมูลร้าน</div>`)}${button("รีวิวร้าน", { route: "M-14", variant: "secondary" })}${button("โปรโมชัน", { route: "M-15", variant: "secondary" })}${section("ตั้งค่า", "เสียงแจ้งเตือน · ภาษา · ธีม")}${button("ออกจากระบบ", { action: "logout", variant: "danger" })}`;
  if (id === "R-15") return `${appBar("บัญชีไรเดอร์", { back: false })}${card(`<strong>บัญชีคนขับ</strong><div class="muted small">จัดการข้อมูล เอกสาร และการตั้งค่า</div>`)}${section("ตั้งค่า", "ธีม · ภาษา · เสียงแจ้งเตือน")}${button("ออกจากระบบ", { action: "logout", variant: "danger" })}`;
  if (id === "C-01") return replaceLegacyIcons(renderCustomer(id,ctx));
  const p2Screen=renderP2(id,ctx);
  if(p2Screen!==null){const nav=ctx.nav(entry.role);const adjustedNav=id==='C-18'?nav.replace('ข้อความ</span>','ข้อความ<span class="p2-nav-badge">1</span></span>'):nav;return adjustedNav?`${p2Screen.replace(nav,"")}${adjustedNav}`:p2Screen;}
  if(id.startsWith('A-')) return renderAuth(id,ctx);
  if(id.startsWith('S-')) return renderShared(id,ctx);
  if(id.startsWith('C-')) {
    if(id==='C-36' && value==='หาไรเดอร์ไม่ได้') return `${appBar('หาไรเดอร์ไม่ได้',{subtitle:'ลองค้นหาอีกครั้งหรือเปลี่ยนประเภทรถ',route:ctx.previousId||'C-35'})}<div class="screen-content">${statePanel({icon:'⌖',title:'ยังไม่มีคนขับใกล้คุณ',message:'ลองอีกครั้งในอีกสักครู่ หรือเลือกประเภทรถอื่น'})}${button('ค้นหาใหม่',{action:'retry-ride'})}${button('เปลี่ยนประเภทรถ',{route:'C-35',variant:'secondary'})}</div>`;
    if(id==='C-11' && value==='ชำระสำเร็จ') return `${appBar('ชำระเงินสำเร็จ',{subtitle:'สร้างคำสั่งซื้อแล้ว',route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'✓',title:'ชำระเงินเรียบร้อย',message:`ยอด ฿${ctx.cartTotal} · สร้าง order แล้ว`})}${button('ติดตามออเดอร์',{route:'C-12'})}${button('ดูใบเสร็จ',{route:'C-17',variant:'ghost'})}</div>`;
    if(id==='C-11' && value==='กำลังชำระ') return `${appBar('กำลังตรวจสอบการชำระ',{subtitle:'พร้อมเพย์ QR',route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'◷',title:'รอยืนยันรายการ',message:'QR พร้อมเพย์หมดอายุใน 04:58 · ยังไม่สร้าง order จนกว่าจะยืนยัน'})}${button('ตรวจผลการชำระ',{action:'payment-success'})}${button('ลองชำระไม่สำเร็จ',{action:'payment-fail',variant:'ghost'})}</div>`;
    if(id==='C-11' && value==='ชำระไม่สำเร็จ') return `${appBar('ชำระเงินไม่สำเร็จ',{subtitle:'ยังไม่มีการยืนยันคำสั่งซื้อ',route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'฿',title:'รายการชำระเงินถูกปฏิเสธ',message:'ตรวจวงเงินหรือเลือกวิธีชำระเงินอื่น ยอดเงินจริงยังไม่ถูกตัดใน mockup'})}${button('ลองชำระอีกครั้ง',{route:'C-11'})}${button('เปลี่ยนวิธีชำระ',{route:'C-09',variant:'secondary'})}</div>`;
    return renderCustomer(id,ctx);
  }
  if(id.startsWith('M-')) return renderMerchant(id,ctx);
  if(id.startsWith('R-')) return renderRider(id,ctx);
  return `<div class="screen-content">${statePanel()}</div>`;
}

function stripBlock(markup, marker) {
  const start = markup.indexOf(marker);
  if (start < 0) return markup;
  let depth = 0;
  const token = /<div\b[^>]*>|<\/div>/g;
  token.lastIndex = start;
  let match;
  while ((match = token.exec(markup))) {
    if (match[0].startsWith("<div")) depth += 1;
    else depth -= 1;
    if (depth === 0) return markup.slice(0, start) + markup.slice(token.lastIndex);
  }
  return markup;
}

function applyP3Refinements(markup, id, ctx) {
  let html = String(markup);
  if (id === "A-03") html = html.replace('value="0812343278"', 'value=""');
  if (id === "A-04") {
    html = html.replace(/ value="[1-6]" style="width:43px/g, ' value="" style="width:43px');
    const feedback = ctx.otpStatus === "error" ? `<div class="pill danger p3-otp-feedback" role="alert">รหัสไม่ถูกต้อง · ตรวจสอบแล้วลองใหม่</div>` : ctx.otpStatus === "resent" ? `<div class="pill success p3-otp-feedback" role="status">ส่งรหัสใหม่แล้ว</div>` : "";
    html += `${feedback}${button("จำลองรหัสผิด", { action: "p3-otp-error", variant: "ghost" })}${button("ส่งรหัสใหม่", { action: "p3-otp-resend", variant: "secondary" })}`;
  }
  if (id === "M-02") html = html.replace('data-route="M-03"', 'data-route="A-06"').replace("กลับหน้า order", "สลับ role กลับลูกค้า");
  if (id === "A-07") {
    const step = Number(ctx.permissionStep || 0);
    const permission = step === 0
      ? { icon: "location_on", title: "ตำแหน่งที่ตั้ง", copy: "ใช้หาร้านใกล้คุณ คำนวณเส้นทาง และส่งถึงจุดหมาย", primary: "อนุญาตตำแหน่งขณะใช้แอป", action: "allow-location" }
      : { icon: "notifications", title: "การแจ้งเตือน", copy: "แจ้งสถานะ order และข้อความสำคัญ", primary: "เปิดการแจ้งเตือน", action: "allow-notifications" };
    html = `${appBar("เปิดใช้บริการใกล้ตัว", { back: false })}<div class="page-heading"><span class="eyebrow">05 / 06 · ขั้น ${step + 1} จาก 2</span><h2>${permission.title}</h2><p>${permission.copy}</p></div>${card(`<div class="state-illustration"><span class="material-symbols-rounded home-symbol">${permission.icon}</span></div>${button(permission.primary, { action: permission.action })}${button("ข้ามขั้นนี้", { action: "p3-permission-next", variant: "ghost" })}`)}${button(step === 0 ? "ไปต่อ: การแจ้งเตือน" : "ไปหน้าหลัก", { action: step === 0 ? "p3-permission-next" : "p3-permission-next" })}`;
  }
  if (id === "C-20") {
    html = stripBlock(html, '<div class="input-demo-keyboard"');
    html = html.replace('data-action="toast-otp"', 'data-action="p3-change-phone"').replace("ยืนยันเปลี่ยนเบอร์ด้วย OTP", "เปลี่ยนเบอร์โทรเพื่อรับ OTP");
    html += `<div class="pill info">แป้นพิมพ์อยู่ใน review panel · เปิดใช้เมื่อจำเป็น</div>`;
  }
  if (id === "C-24") {
    let index = 0;
    html = html.replace(/<article class="restaurant-row"[\s\S]*?<\/article>/g, (row) => {
      const current = index++;
      if (ctx.favoriteStores?.has(current)) return "";
      return row.replace("</article>", `<button class="icon-btn p3-favorite-remove" data-action="p3-remove-favorite" data-favorite-index="${current}" aria-label="นำออกจากร้านโปรด"><span class="material-symbols-rounded home-symbol">favorite</span></button></article>`);
    });
    if (!html.includes("restaurant-row")) html += `${card("<strong>ยังไม่มีร้านโปรด</strong><p class=\"muted small\">ค้นหาร้านใหม่แล้วกดหัวใจเพื่อบันทึก</p>")}${button("ค้นหาร้าน", { route: "C-05" })}`;
  }
  if (id === "C-05") {
    const controls = `<div class="p3-search-surface"><div class="chip-list" data-p3-suggestions><button class="chip" data-action="fill-search">ครัวบ้านสวน</button><button class="chip" data-action="fill-search">ร้านใกล้ฉัน</button><button class="chip" data-action="fill-search">กะเพรา</button></div><div class="chip-list" data-p3-search-tabs hidden><button class="chip active" data-action="p3-search-tab" data-kind="all">ทั้งหมด</button><button class="chip" data-action="p3-search-tab" data-kind="store">ร้าน</button><button class="chip" data-action="p3-search-tab" data-kind="menu">เมนู</button><button class="icon-btn" data-action="p3-clear-search" aria-label="ล้างการค้นหา">×</button></div></div>`;
    html = html.replace(/<div class="searchbox"[\s\S]*?<\/div>/, (box) => `${box}${controls}`);
  }
  if (id === "C-01") {
    const phase = `<section class="section p3-phase-services"><div class="section-head"><h3>บริการเพิ่มเติม</h3><span class="pill warning">เร็ว ๆ นี้</span></div><div class="p3-phase-grid"><button class="card phase-mini" data-action="p3-phase-service"><strong>ส่งของ</strong><small>รับ–ส่งพัสดุในเมือง</small><span class="pill warning">เร็ว ๆ นี้</span></button><button class="card phase-mini" data-action="p3-phase-service"><strong>บริการในบ้าน</strong><small>ช่างและผู้ช่วยที่ไว้ใจได้</small><span class="pill warning">เร็ว ๆ นี้</span></button></div></section>`;
    html = html.includes('<nav class="bottom-nav"') ? html.replace('<nav class="bottom-nav"', `${phase}<nav class="bottom-nav"`) : `${html}${phase}`;
  }
  if (id === "R-02" && ctx.state === "อนุมัติแล้ว") {
    html = html.replace("กำลังตรวจสอบเอกสารคนขับ", "เอกสารผ่าน พร้อมรับงาน").replaceAll("กำลังตรวจ", "อนุมัติแล้ว").replaceAll("รอตรวจ", "ผ่าน");
    html += button("เริ่มรับงาน", { route: "R-03" });
  }
  if (id === "R-12") {
    const range = ctx.reportRange || "7 วัน";
    const ranges = ["วันนี้", "7 วัน", "30 วัน", "กำหนดเอง"].map((label) => `<button class="chip ${range === label ? "active" : ""}" data-action="p2-report-range" data-range="${label}">${label}</button>`).join("");
    html = html.replace('<div class="chart">', `<div class="chip-list p3-report-range" aria-label="ช่วงเวลารายงาน">${ranges}</div><div class="chart">`);
    html = html.replace("สรุปสัปดาห์ 1–7 ต.ค.", `สรุป${range === "วันนี้" ? "วันนี้" : `ช่วง ${range}`}`);
    ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."].forEach((day, index) => { html = html.replace(`<small>${index + 1}</small>`, `<small>${day}</small>`); });
  }
  return html;
}

export function renderScreen(id,ctx) {
  if (id === "A-01") return `<div class="splash-screen"><div class="state-illustration">RMA Delivery</div><div class="muted small">กำลังตรวจ session</div></div>`;
  if (centralRuleScreens.has(id)) return replaceLegacyIcons(centralRuleRenderer(id,ctx));
  return replaceLegacyIcons(applyP3Refinements(renderScreenRaw(id,ctx), id, ctx));
}
