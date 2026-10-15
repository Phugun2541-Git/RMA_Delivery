import { SCREEN_BY_ID } from "../data/screens.js";
import { appBar, skeletonBlock, statePanel, button, card } from "./components.js";
import { renderAuth } from "./auth.js";
import { renderCustomer } from "./customer.js";
import { renderMerchant } from "./merchant.js";
import { renderRider } from "./rider.js";
import { renderShared } from "./shared.js";
import { renderP2 } from "./p2.js";
import { homeIcon, replaceLegacyIcons } from "./home-icons.js";
import { unreadCount } from "./notifications.js";

const genericStates = new Set(["loading", "ว่าง", "ผิดพลาด"]);
// Empty copy per context (S-01): one title, one short line, one action — no box, no second button
const EMPTY = {
  "C-01": { icon: "food", title: "ยังไม่มีร้านในพื้นที่นี้", message: "ลองเปลี่ยนที่อยู่จัดส่ง", action: { label: "เปลี่ยนที่อยู่", route: "C-02" } },
  "C-04": { icon: "food", title: "ยังไม่มีร้านเปิดใกล้คุณ", message: "ลองใหม่อีกครั้งในภายหลัง", action: { label: "ค้นหาเมนู", route: "C-05" } },
  "C-06": { icon: "menu", title: "ร้านยังไม่มีเมนู", message: "ลองเลือกร้านอื่นใกล้คุณ", action: { label: "ดูร้านอื่น", route: "C-04" } },
  "C-33": { icon: "pin", title: "ยังไม่มีสถานที่ล่าสุด", message: "พิมพ์ปลายทางเพื่อเริ่มเรียกรถ", action: null },
  "M-03": { icon: "receipt", title: "ยังไม่มีออเดอร์", message: "ออเดอร์ใหม่จะเด้งขึ้นพร้อมเสียง", action: null }
};
function genericState(id,ctx,value) {
  const backRoute=ctx.previousId||'C-01';
  const title=SCREEN_BY_ID[id]?.title || 'RMA Delivery';
  if (value === "loading") return `${appBar(title,{back:true,route:backRoute})}<div class="screen-content">${skeletonBlock(id==='C-06'?4:3)}</div>`;
  if (value === "ว่าง") { const e=EMPTY[id]||{ icon:"inbox", title:"ยังไม่มีรายการ", message:"รายการใหม่จะแสดงที่นี่", action:null }; return `${appBar(title,{back:true,route:backRoute})}<div class="screen-content">${statePanel(e)}</div>`; }
  return `${appBar(title,{back:true,route:backRoute})}<div class="screen-content">${statePanel({icon:"wifiOff",title:"เชื่อมต่อไม่สำเร็จ",message:"ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง",action:{label:"ลองอีกครั้ง",action:"retry",variant:""}})}</div>`;
}

function renderScreenRaw(id,ctx) {
  const entry=SCREEN_BY_ID[id];
  if(!entry) return `<div class="screen-content">${statePanel({title:"ไม่พบหน้าจอ",message:`ไม่พบรหัส ${id}`,action:{label:'กลับหน้าหลัก',route:'C-01'}})}</div>`;
  const value=ctx.state;
  if(genericStates.has(value)) return genericState(id,ctx,value);
  if (id === "C-01") return replaceLegacyIcons(renderCustomer(id,ctx));
  const p2Screen=renderP2(id,ctx);
  if(p2Screen!==null) return p2Screen;
  if(id.startsWith('A-')) return renderAuth(id,ctx);
  if(id.startsWith('S-')) return renderShared(id,ctx);
  if(id.startsWith('C-')) {
    if(id==='C-36' && value==='หาไรเดอร์ไม่ได้') return `${appBar('ไม่พบคนขับ',{route:ctx.previousId||'C-35'})}<div class="screen-content">${statePanel({icon:'car',title:'ยังไม่มีคนขับใกล้คุณ',message:'ลองอีกครั้ง หรือเปลี่ยนประเภทรถ'})}</div><div class="sticky-action">${button('ค้นหาใหม่',{action:'retry-ride'})}<button class="text-btn sheet-text-btn" data-route="C-35">เปลี่ยนประเภทรถ</button></div>`;
    if(id==='C-11' && value==='ชำระสำเร็จ') return `${appBar('ชำระเงินสำเร็จ',{route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'checkCircle',tone:'success',title:'ชำระเงินเรียบร้อย',message:`ยอด ฿${ctx.cartTotal} · สร้าง order แล้ว`})}</div><div class="sticky-action">${button('ติดตามออเดอร์',{route:'C-12'})}<button class="text-btn sheet-text-btn" data-route="C-17">ดูใบเสร็จ</button></div>`;
    if(id==='C-11' && value==='กำลังชำระ') return `${appBar('กำลังตรวจสอบ',{route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'clock',title:'รอยืนยันการชำระ',message:'QR หมดอายุใน 04:58 · ยังไม่สร้างออเดอร์'})}</div><div class="sticky-action">${button('ตรวจผลการชำระ',{action:'payment-check'})}</div>`;
    if(id==='C-11' && value==='ชำระไม่สำเร็จ') return `${appBar('ชำระเงินไม่สำเร็จ',{route:ctx.previousId||'C-09'})}<div class="screen-content">${statePanel({icon:'error',tone:'danger',title:'รายการถูกปฏิเสธ',message:'ยังไม่มีการตัดเงิน · ลองอีกครั้งหรือเปลี่ยนวิธีชำระ'})}</div><div class="sticky-action">${button('ลองชำระอีกครั้ง',{route:'C-11'})}<button class="text-btn sheet-text-btn" data-action="p2-payment-method">เปลี่ยนวิธีชำระ</button></div>`;
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
  if (id === "M-02") html = html.replace('data-route="M-03"', 'data-route="A-06"').replace("กลับหน้า order", "กลับโหมดลูกค้า");
  if (id === "A-07") {
    const step = Number(ctx.permissionStep || 0);
    const permission = step === 0
      ? { icon: "pin", title: "เปิดตำแหน่งที่ตั้ง", copy: "ใช้หาร้านใกล้คุณและส่งถึงจุดหมาย", primary: "อนุญาตตำแหน่งขณะใช้แอป", action: "allow-location" }
      : { icon: "notifications", title: "เปิดการแจ้งเตือน", copy: "รู้สถานะออเดอร์แม้ไม่ได้เปิดแอป", primary: "เปิดการแจ้งเตือน", action: "allow-notifications" };
    html = `${appBar(`ขั้น ${step + 1} จาก 2`, { back: false })}<div class="permission-hero"><span class="permission-icon">${homeIcon(permission.icon, 40)}</span><h2>${permission.title}</h2><p>${permission.copy}</p></div><div class="sticky-action">${button(permission.primary, { action: permission.action })}<button class="text-btn sheet-text-btn" data-action="p3-permission-next">ไว้ทีหลัง</button></div>`;
  }
  if (id === "C-20") {
    html = html.replace('data-action="toast-otp"', 'data-action="p3-change-phone"').replace("ยืนยันเปลี่ยนเบอร์ด้วย OTP", "เปลี่ยนเบอร์โทรเพื่อรับ OTP");
  }
  if (id === "C-24") {
    let index = 0;
    html = html.replace(/<article class="restaurant-row"[\s\S]*?<\/article>/g, (row) => {
      const current = index++;
      if (ctx.favoriteStores?.has(current)) return "";
      return row.replace("</article>", `<button class="icon-btn p3-favorite-remove" data-action="p3-remove-favorite" data-favorite-index="${current}" aria-label="นำออกจากร้านโปรด"><span class="material-symbols-rounded home-symbol">favorite</span></button></article>`);
    });
    if (!html.includes("restaurant-row")) html = html.replace(/(<nav class="bottom-nav"|$)/, `${statePanel({ icon: "favorite", title: "ยังไม่มีร้านโปรด", message: "กดหัวใจที่ร้านเพื่อบันทึก", action: { label: "ค้นหาร้าน", route: "C-05" } })}$1`);
  }
  if (id === "R-02" && ctx.state === "อนุมัติแล้ว") {
    html = html.replace("กำลังตรวจสอบเอกสารคนขับ", "เอกสารผ่าน พร้อมรับงาน").replaceAll("กำลังตรวจ", "อนุมัติแล้ว").replaceAll("รอตรวจ", "ผ่าน");
    html += button("เริ่มรับงาน", { route: "R-03" });
  }
  return html;
}

// Customer bottom nav: unread badge on the Messages tab = unread notifications + unread chat (updates as items are opened)
function navBadges(html, ctx) {
  if (!html.includes('class="bottom-nav"') || ctx.activeRole !== "C") return html;
  const n = unreadCount(ctx.notifs, "C") + Number(ctx.chatUnread || 0);
  return n ? html.replace("<span>ข้อความ</span></button>", `<span>ข้อความ</span><span class="nav-badge" aria-label="ยังไม่ได้อ่าน ${n}">${n > 9 ? "9+" : n}</span></button>`) : html;
}

export function renderScreen(id,ctx) {
  return navBadges(replaceLegacyIcons(applyP3Refinements(renderScreenRaw(id,ctx), id, ctx)), ctx);
}
