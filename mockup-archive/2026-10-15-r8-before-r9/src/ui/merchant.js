import { ADDRESS, MENU, ORDER_NO, PEOPLE, PHOTOS } from "../data/content.js";
import { accountFooter, block, listGroup, listRow, profileRow, roleSwitchRow, settingsGroup, appBar, badge, button, card, field, infoRows, section, segmented, textArea, historyRow, infoTile, listLabel, metaLine, statePanel, tabs } from "./components.js";
import { homeIcon } from "./home-icons.js";
import { bellButton, markAllReadButton, notifPrefsSection, notificationList } from "./notifications.js";

const head = (id, title, sub="", trailing="") => appBar(title,{subtitle:sub,back:!['M-03','M-06','M-13','M-16','M-17'].includes(id),route:'M-03',trailing});
const ORDER_TABS = ["ใหม่", "กำลังทำ", "พร้อมส่ง", "เสร็จแล้ว"];
const orderList = (ctx) => [
  { no: ORDER_NO, who: PEOPLE.customer.short, total: ctx.subtotal, items: 2, status: "ใหม่", timer: "รับภายใน 0:45 · เตรียม 20 นาที", route: "M-04" },
  { no: "RM-261007-1851", who: "คุณธีรภัทร", total: 186, items: 2, status: "ใหม่", timer: "รับภายใน 0:32 · เตรียม 15 นาที", route: "M-04" },
  { no: "RM-261007-1829", who: "คุณมินตรา", total: 243, items: 2, status: "กำลังทำ", timer: "ทำมาแล้ว 6 นาที · เหลือ 12 นาที", route: "M-05" },
  { no: "RM-261007-1815", who: "คุณปวีณ์", total: 129, items: 2, status: "กำลังทำ", timer: "ทำมาแล้ว 14 นาที · เหลือ 4 นาที", route: "M-05" },
  { no: "RM-261007-1802", who: "คุณอริษา", total: 215, items: 2, status: "พร้อมส่ง", timer: "รอไรเดอร์ถึงใน 5 นาที", route: "M-05" },
  { no: "RM-261007-1790", who: "คุณวีระ", total: 158, items: 2, status: "เสร็จแล้ว", timer: "ส่งมอบ 12:02 น.", route: "M-05" },
  { no: "RM-261007-1776", who: "คุณนภา", total: 97, items: 2, status: "เสร็จแล้ว", timer: "ส่งมอบ 11:41 น.", route: "M-05" }
];

export function renderMerchant(id, ctx) {
  switch(id) {
    case "M-02": { const rejected=ctx.state==='เอกสารถูกตีกลับ'; const approved=ctx.state==='อนุมัติแล้ว'; return `${head(id,'สถานะการสมัคร','หมายเลข M-10482')}${statePanel(rejected?{icon:'error',tone:'danger',title:'เอกสารบัญชีรับเงินไม่ชัด',message:'ส่งภาพหน้าแรกสมุดบัญชีใหม่ให้เห็นชื่อและเลขบัญชี'}:approved?{icon:'checkCircle',tone:'success',title:'อนุมัติร้านค้าแล้ว',message:'ตั้งค่าร้านและเริ่มรับออเดอร์ได้เลย'}:{icon:'clock',title:'กำลังตรวจสอบใบสมัคร',message:'ปกติใช้เวลา 1–2 วันทำการ'})}${section('เอกสาร', infoRows([["หนังสือรับรองร้าน","ผ่าน","success"],["บัตรประชาชนผู้สมัคร",rejected?"ภาพไม่ชัด":"กำลังตรวจ","warning"],["บัญชีรับเงิน",rejected?"ต้องส่งใหม่":"รอตรวจ","warning"]]))}<div class="sticky-action">${button(rejected?'อัปโหลดเอกสารใหม่':'ดูข้อมูลใบสมัคร',{action:rejected?'toast-upload':'toast-application',variant:rejected?'':'secondary'})}<button class="text-btn sheet-text-btn" data-route="M-03">กลับหน้า order</button></div>`; }
    case "M-03": {
      // Order list in the history-row style (R6) · actions kept: merchant-open, m-order-tab, rows → M-04 / M-05, summary → M-13
      const tab = ctx.orderTab || "ใหม่";
      const all = orderList(ctx);
      const shown = all.filter((o) => o.status === tab);
      const closed = ctx.merchantOpen === false;
      const tone = { "ใหม่": "warning", "กำลังทำ": "brand", "พร้อมส่ง": "success", "เสร็จแล้ว": "muted" };
      const rows = shown.map((o) => historyRow({ icon: o.status === "เสร็จแล้ว" ? "checkCircle" : "receipt", tone: tone[o.status], title: o.who, sub: `#${o.no} · ${o.items} รายการ`, meta: `${homeIcon("clock", 12)}${o.timer}`, amount: `฿${o.total}`, status: o.status, statusTone: o.status === "เสร็จแล้ว" ? "muted" : tone[o.status], attrs: `data-route="${o.route}"`, extra: "order-sample" })).join("");
      return `${head(id, "ออเดอร์", PEOPLE.merchant.name, bellButton("M", ctx))}<div class="shop-status">${infoTile("store", closed ? "ร้านปิดรับออเดอร์" : "ร้านเปิดรับออเดอร์", closed ? "ลูกค้าสั่งร้านนี้ไม่ได้ตอนนี้" : "เชื่อม Smart Kitchen", `<button class="switch ${closed ? "" : "on"}" data-action="merchant-open" aria-label="เปิดหรือปิดรับออเดอร์" aria-pressed="${!closed}"></button>`)}</div>${closed ? `<div class="flat-note">${homeIcon("error", 18)}<span>ออเดอร์ที่รับไว้แล้วยังต้องทำต่อ</span></div>${button("เปิดรับออเดอร์", { action: "merchant-open" })}` : ""}${tabs(ORDER_TABS.map((t) => [t, t, all.filter((o) => o.status === t).length]), tab, "m-order-tab")}${shown.length ? `<div class="history-list">${rows}</div>` : statePanel({ icon: "receipt", title: "ไม่มีออเดอร์ในสถานะนี้" })}${listGroup(listRow({ icon: "analytics", label: "สรุปวันนี้", sub: "ยอดขาย ฿8,420 · 27 ออเดอร์", attrs: 'data-route="M-13"' }))}${ctx.nav("M")}`;
    }
    case "M-10": {
      const st = ctx.state === "มีข้อมูล" || !ctx.state ? "เชื่อมต่อแล้ว" : ctx.state;
      const sk = infoTile("store", "Smart Kitchen", "ระบบ POS และครัวของร้าน");
      const top = head(id, "เชื่อม Smart Kitchen");
      if (st === "ยังไม่เชื่อม") return `${top}${sk}${section("เชื่อมแล้วได้อะไร", listGroup([["sync", "ดึงเมนูและราคาอัตโนมัติ"], ["receipt", "ออเดอร์เข้าครัวทันที ไม่ต้องคีย์ซ้ำ"], ["package", "ตัดสต็อกเอง เมนูหมดปิดขายให้"]].map(([icon, label]) => listRow({ icon, label })).join("")))}<div class="sticky-action">${button("เชื่อม Smart Kitchen", { action: "sk-connect" })}</div>`;
      if (st === "กำลังเชื่อม") return `${top}${sk}${statePanel({ icon: "clock", title: "กำลังเชื่อมต่อ…", message: "ตรวจบัญชีร้านและดึงเมนู" })}`;
      if (st === "เชื่อมไม่สำเร็จ") return `${top}${sk}${statePanel({ icon: "error", tone: "danger", title: "เชื่อมต่อไม่สำเร็จ", message: "ไม่พบบัญชี Smart Kitchen ที่ตรงกับร้านนี้" })}<div class="sticky-action">${button("ลองอีกครั้ง", { action: "sk-connect" })}<button class="text-btn sheet-text-btn" data-action="toast-support">ติดต่อทีมช่วยเหลือ</button></div>`;
      const syncFailed = st === "ซิงก์ไม่สำเร็จ";
      return `${top}${infoTile("store", "Smart Kitchen", syncFailed ? "ซิงก์ล่าสุดไม่สำเร็จ 12:10 น." : "เชื่อมบัญชีครัวบ้านสวน · 12:10 น.", badge(syncFailed ? "ซิงก์ไม่สำเร็จ" : "เชื่อมต่อแล้ว", syncFailed ? "danger" : "success"))}${section("ข้อมูลที่ซิงก์", infoRows([["รายการเมนู", "18 รายการ"], ["สต็อกเมนู", "อัตโนมัติ"], ["ออเดอร์จาก Delivery", "ส่งเข้าครัวทันที"], ["ซิงก์ล่าสุด", syncFailed ? "ล้มเหลว" : "สำเร็จ 12:10 น.", syncFailed ? "danger" : ""]]))}<p class="muted micro">ราคาและสต็อกของเมนูที่เชื่อม แก้ได้ที่ Smart Kitchen เท่านั้น</p><div class="row-between" style="margin-top:10px">${button(syncFailed ? "ลองซิงก์อีกครั้ง" : "ซิงก์เมนูตอนนี้", { action: "sync-menu", variant: "secondary", small: true })}${button("ยกเลิกเชื่อม", { action: "disconnect-sk", variant: "ghost", small: true })}</div>`;
    }
    case "M-11": return `${head(id,'บัญชีรับเงิน','รอบโอนทุกวันอังคารและศุกร์')}${block(`<strong>บัญชีธนาคาร</strong>${infoRows([["ธนาคาร","กสิกรไทย"],["ชื่อบัญชี",PEOPLE.merchant.owner],["เลขบัญชี","xxx-x-xx492-1"],["รอบโอน","อังคาร · ศุกร์"]])}<button class="text-btn" data-action="edit-bank">แก้ไขบัญชีรับเงิน</button>`)}${block(`<strong>ค่าธรรมเนียมแพลตฟอร์ม</strong><div class="muted small">แพลตฟอร์ม 15% ของยอดอาหาร</div><div class="price-line"><span>ยอดขายวันนี้</span><strong>฿8,420</strong></div><div class="price-line"><span>ค่าธรรมเนียมโดยประมาณ</span><strong>฿1,263</strong></div>`, 'tint')}${button('ดูประวัติการโอน',{route:'M-12',variant:'secondary'})}`;
    case "M-12": return `${head(id,'กระเป๋าร้านค้า')}<div class="amount-hero"><small>ยอดรอโอน</small><strong>฿12,480.50</strong>${metaLine([["clock","โอนรอบถัดไป ศุกร์ 9 ต.ค."]])}</div>${listLabel('ประวัติการโอน')}<div class="history-list">${[['6 ต.ค.',24,'฿7,840'],['3 ต.ค.',19,'฿6,240'],['30 ก.ย.',21,'฿6,980']].map(x=>historyRow({ icon:'wallet', tone:'success', title:'โอนเข้าบัญชี', sub:`ยอดขาย ${x[1]} ออเดอร์`, meta:`${x[0]} · ค่าธรรมเนียม ฿${Math.round(Number(x[2].replace(/[฿,]/g,''))*.15).toLocaleString('th-TH')}`, amount:x[2], status:'โอนแล้ว', statusTone:'success' })).join('')}</div>${ctx.nav('M')}`;
    case "M-18": return `${head(id, "การแจ้งเตือน", "", markAllReadButton("M", ctx))}${notificationList("M", ctx)}`;
    case "M-17": {
      const links = [["M-09", "store", "ข้อมูลร้าน"], ["M-10", "sync", "Smart Kitchen"], ["M-11", "wallet", "บัญชีรับเงิน"], ["M-14", "star", "รีวิวจากลูกค้า"], ["M-15", "sparkles", "โปรโมชันของร้าน"]];
      return `${head(id, "บัญชีร้านค้า", "", bellButton("M", ctx))}${profileRow("คบ", PEOPLE.merchant.name, `ผู้ดูแล ${PEOPLE.merchant.owner}`)}${section("จัดการร้าน", listGroup(links.map((x) => listRow({ icon: x[1], label: x[2], attrs: `data-route="${x[0]}"` })).join("")))}${section("ตั้งค่า", settingsGroup(ctx, "เสียงแจ้งเตือนออเดอร์ใหม่"))}${notifPrefsSection("M", ctx)}${section("โหมดการใช้งาน", roleSwitchRow("ลูกค้า · ร้านค้า · ไรเดอร์"))}${accountFooter()}${ctx.nav("M")}`;
    }
    default: return `${head(id,'ร้านค้าของฉัน',PEOPLE.merchant.name)}${card(infoRows([["ชื่อร้าน",PEOPLE.merchant.name],["คะแนน","4.8 ★"],["order วันนี้","27"],["สถานะ","เปิดรับ order"]]))}${button('กลับหน้า order',{route:'M-03'})}`;
  }
}
