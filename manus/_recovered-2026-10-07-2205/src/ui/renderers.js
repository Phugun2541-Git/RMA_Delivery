import { SCREEN_BY_ID } from "../data/screens.js";
import { appBar, skeletonBlock, statePanel, button } from "./components.js";
import { renderAuth } from "./auth.js";
import { renderCustomer } from "./customer.js";
import { renderMerchant } from "./merchant.js";
import { renderRider } from "./rider.js";
import { renderShared } from "./shared.js";

const genericStates = new Set(["loading", "ว่าง", "ผิดพลาด"]);
function genericState(id,ctx,value) {
  if (value === "loading") return `${appBar(SCREEN_BY_ID[id]?.title || 'กำลังโหลด',{back:true})}<div class="screen-content">${skeletonBlock(id==='C-06'?4:3)}</div>`;
  if (value === "ว่าง") return `${appBar(SCREEN_BY_ID[id]?.title || 'ยังไม่มีข้อมูล',{back:true})}<div class="screen-content">${statePanel({title:"ยังไม่มีรายการ",message:"เมื่อมีข้อมูล ระบบจะแสดงในหน้านี้"})}${button('กลับหน้าหลัก',{route:'C-01',variant:'secondary'})}</div>`;
  return `${appBar(SCREEN_BY_ID[id]?.title || 'เชื่อมต่อไม่ได้',{back:true})}<div class="screen-content">${statePanel({icon:"⌁",title:"เชื่อมต่อไม่สำเร็จ",message:"ตรวจอินเทอร์เน็ตและลองโหลดข้อมูลอีกครั้ง"})}${button('ลองใหม่',{action:'retry'})}</div>`;
}

export function renderScreen(id,ctx) {
  const entry=SCREEN_BY_ID[id];
  if(!entry) return `<div class="screen-content">${statePanel({title:"ไม่พบหน้าจอ",message:`ไม่พบรหัส ${id}`})}${button('กลับหน้าหลัก',{route:'C-01'})}</div>`;
  const value=ctx.state;
  if(genericStates.has(value)) return genericState(id,ctx,value);
  if(id.startsWith('A-')) return renderAuth(id,ctx);
  if(id.startsWith('S-')) return renderShared(id,ctx);
  if(id.startsWith('C-')) {
    if(id==='C-36' && value==='หาไรเดอร์ไม่ได้') return `${appBar('หาไรเดอร์ไม่ได้',{subtitle:'ลองค้นหาอีกครั้งหรือเปลี่ยนประเภทรถ'})}<div class="screen-content">${statePanel({icon:'⌖',title:'ยังไม่มีคนขับใกล้คุณ',message:'ลองอีกครั้งในอีกสักครู่ หรือเลือกประเภทรถอื่น'})}${button('ค้นหาใหม่',{action:'retry-ride'})}${button('เปลี่ยนประเภทรถ',{route:'C-35',variant:'secondary'})}</div>`;
    if(id==='C-11' && value==='ชำระสำเร็จ') return `${appBar('ชำระเงินสำเร็จ',{subtitle:'สร้างคำสั่งซื้อแล้ว'})}<div class="screen-content">${statePanel({icon:'✓',title:'ชำระเงินเรียบร้อย',message:`ยอด ฿${ctx.cartTotal} · สร้าง order แล้ว`})}${button('ติดตามออเดอร์',{route:'C-12'})}${button('ดูใบเสร็จ',{route:'C-17',variant:'ghost'})}</div>`;
    if(id==='C-11' && value==='กำลังชำระ') return `${appBar('กำลังตรวจสอบการชำระ',{subtitle:'พร้อมเพย์ QR'})}<div class="screen-content">${statePanel({icon:'◷',title:'รอยืนยันรายการ',message:'QR พร้อมเพย์หมดอายุใน 04:58 · ยังไม่สร้าง order จนกว่าจะยืนยัน'})}${button('ตรวจผลการชำระ',{action:'payment-success'})}${button('ลองชำระไม่สำเร็จ',{action:'payment-fail',variant:'ghost'})}</div>`;
    if(id==='C-11' && value==='ชำระไม่สำเร็จ') return `${appBar('ชำระเงินไม่สำเร็จ',{subtitle:'ยังไม่มีการยืนยันคำสั่งซื้อ'})}<div class="screen-content">${statePanel({icon:'฿',title:'รายการชำระเงินถูกปฏิเสธ',message:'ตรวจวงเงินหรือเลือกวิธีชำระเงินอื่น ยอดเงินจริงยังไม่ถูกตัดใน mockup'})}${button('ลองชำระอีกครั้ง',{route:'C-11'})}${button('เปลี่ยนวิธีชำระ',{route:'C-09',variant:'secondary'})}</div>`;
    return renderCustomer(id,ctx);
  }
  if(id.startsWith('M-')) return renderMerchant(id,ctx);
  if(id.startsWith('R-')) return renderRider(id,ctx);
  return `<div class="screen-content">${statePanel()}</div>`;
}
