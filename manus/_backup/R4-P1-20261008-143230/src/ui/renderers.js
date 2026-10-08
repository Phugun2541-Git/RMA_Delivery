import { SCREEN_BY_ID } from "../data/screens.js";
import { appBar, skeletonBlock, statePanel, button, card } from "./components.js";
import { renderAuth } from "./auth.js";
import { renderCustomer } from "./customer.js";
import { renderMerchant } from "./merchant.js";
import { renderRider } from "./rider.js";
import { renderShared } from "./shared.js";
import { renderP2 } from "./p2.js";
import { replaceLegacyIcons } from "./home-icons.js";

const genericStates = new Set(["loading", "ว่าง", "ผิดพลาด"]);
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
  if (id === "C-01") return replaceLegacyIcons(renderCustomer(id,ctx));
  const p2Screen=renderP2(id,ctx);
  if(p2Screen!==null){const nav=ctx.nav(entry.role);const adjustedNav=id==='C-18'?nav.replace('ข้อความ</span>','ข้อความ<span class="p2-nav-badge">1</span></span>'):nav;return adjustedNav?`${p2Screen.replace(nav,"")}${adjustedNav}`:p2Screen;}
  if(id.startsWith('A-')) return renderAuth(id,ctx);
  if(id.startsWith('S-')) return renderShared(id,ctx);
  if(id.startsWith('C-')) {
    if(id==='C-36' && value==='หาไรเดอร์ไม่ได้') return `${appBar('หาไรเดอร์ไม่ได้',{subtitle:'ลองค้นหาอีกครั้งหรือเปลี่ยนประเภทรถ',route:ctx.previousId||'C-35'})}<div class="screen-content">${statePanel({icon:'⌖',title:'ยังไม่มีคนขับใกล้คุณ',message:'ลองอีกครั้งในอีกสักครู่ หรือเลือกประเภทรถอื่น'})}${button('ค้นหาใหม่',{action:'retry-ride'})}${button('เปลี่ยนประเภทรถ',{route:'C-35',variant:'secondary'})}</div>`;
    if(id==='C-11' && value==='ชำระสำเร็จ') return `${appBar('ชำระเงินสำเร็จ',{subtitle:'สร้างคำสั่งซื้อแล้ว',route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'✓',title:'ชำระเงินเรียบร้อย',message:`ยอด ฿${ctx.cartTotal} · สร้าง order แล้ว`})}${button('ติดตามออเดอร์',{route:'C-12'})}${button('ดูใบเสร็จ',{route:'C-17',variant:'ghost'})}</div>`;
    if(id==='C-11' && value==='กำลังชำระ') return `${appBar('กำลังตรวจสอบการชำระ',{subtitle:'พร้อมเพย์ QR',route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'◷',title:'รอยืนยันรายการ',message:'QR พร้อมเพย์หมดอายุใน 04:58 · ยังไม่สร้าง order จนกว่าจะยืนยัน'})}${button('ตรวจผลการชำระ',{action:'payment-check'})}</div>`;
    if(id==='C-11' && value==='ชำระไม่สำเร็จ') return `${appBar('ชำระเงินไม่สำเร็จ',{subtitle:'ยังไม่มีการยืนยันคำสั่งซื้อ',route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'฿',title:'รายการชำระเงินถูกปฏิเสธ',message:'ตรวจวงเงินหรือเลือกวิธีชำระเงินอื่น ยังไม่มีการตัดเงินจากรายการนี้'})}${button('ลองชำระอีกครั้ง',{route:'C-11'})}${button('เปลี่ยนวิธีชำระ',{route:'C-09',variant:'secondary'})}</div>`;
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
    html += feedback;
  }
  if (id === "M-02") html = html.replace('data-route="M-03"', 'data-route="A-06"').replace("กลับหน้า order", "สลับ role กลับลูกค้า");
  if (id === "A-07") {
    const step = Number(ctx.permissionStep || 0);
    const permission = step === 0
      ? { icon: "location_on", title: "ตำแหน่งที่ตั้ง", copy: "ใช้หาร้านใกล้คุณ คำนวณเส้นทาง และส่งถึงจุดหมาย", primary: "อนุญาตตำแหน่งขณะใช้แอป", action: "allow-location" }
      : { icon: "notifications", title: "การแจ้งเตือน", copy: "แจ้งสถานะ order และข้อความสำคัญ", primary: "เปิดการแจ้งเตือน", action: "allow-notifications" };
    html = `${appBar("เปิดใช้บริการใกล้ตัว", { back: false })}<div class="page-heading"><span class="eyebrow">ขั้น ${step + 1} จาก 2</span><h2>${permission.title}</h2><p>${permission.copy}</p></div>${card(`<div class="state-illustration"><span class="material-symbols-rounded home-symbol">${permission.icon}</span></div>${button(permission.primary, { action: permission.action })}${button("ข้ามขั้นนี้", { action: "p3-permission-next", variant: "ghost" })}`)}${button(step === 0 ? "ไปต่อ: การแจ้งเตือน" : "ไปหน้าหลัก", { action: step === 0 ? "p3-permission-next" : "p3-permission-next" })}`;
  }
  if (id === "C-20") {
    html = stripBlock(html, '<div class="input-demo-keyboard"');
    html = html.replace('data-action="toast-otp"', 'data-action="p3-change-phone"').replace("ยืนยันเปลี่ยนเบอร์ด้วย OTP", "เปลี่ยนเบอร์โทรเพื่อรับ OTP");
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
  if (id === "C-01") {
    const phase = `<section class="section p3-phase-services"><div class="section-head"><h3>บริการเพิ่มเติม</h3><span class="pill warning">เร็ว ๆ นี้</span></div><div class="p3-phase-grid"><button class="card phase-mini" data-action="p3-phase-service"><strong>ส่งของ</strong><small>รับ–ส่งพัสดุในเมือง</small><span class="pill warning">เร็ว ๆ นี้</span></button><button class="card phase-mini" data-action="p3-phase-service"><strong>บริการในบ้าน</strong><small>ช่างและผู้ช่วยที่ไว้ใจได้</small><span class="pill warning">เร็ว ๆ นี้</span></button></div></section>`;
    html = html.includes('<nav class="bottom-nav"') ? html.replace('<nav class="bottom-nav"', `${phase}<nav class="bottom-nav"`) : `${html}${phase}`;
  }
  if (id === "R-02" && ctx.state === "อนุมัติแล้ว") {
    html = html.replace("กำลังตรวจสอบเอกสารคนขับ", "เอกสารผ่าน พร้อมรับงาน").replaceAll("กำลังตรวจ", "อนุมัติแล้ว").replaceAll("รอตรวจ", "ผ่าน");
    html += button("เริ่มรับงาน", { route: "R-03" });
  }
  return html;
}

export function renderScreen(id,ctx) {
  return replaceLegacyIcons(applyP3Refinements(renderScreenRaw(id,ctx), id, ctx));
}
