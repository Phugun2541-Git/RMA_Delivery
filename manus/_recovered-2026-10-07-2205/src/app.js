import { ROLE_META, ROLE_ORDER, SCREENS, SCREEN_BY_ID, STATE_OPTIONS } from "./data/screens.js";
import { ADDRESS, COUPONS, FLOW_SHORTCUTS, MENU, VEHICLES } from "./data/content.js";
import { bottomNav, escapeHTML } from "./ui/components.js";
import { renderScreen } from "./ui/renderers.js";
import { homeIcon } from "./ui/home-icons.js";

const safeGet=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
const storedTheme=safeGet('rma-theme','light');
const systemTheme=()=>globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches?'dark':'light';
const initialTheme=storedTheme==='system'?systemTheme():storedTheme==='dark'?'dark':'light';
const HOME_PALETTES = Object.freeze([
  { id: 'aurora', name: 'Aurora', subtitle: 'ม่วง · ฟ้า · มิ้นต์', swatches: ['#5945C7','#3274D6','#9B5A07','#146E54'] },
  { id: 'lagoon', name: 'Lagoon', subtitle: 'ทีล · คราม · ฮันนี่', swatches: ['#0B7478','#265F8B','#965707','#17664A'] },
  { id: 'rosewood', name: 'Rosewood', subtitle: 'เบอร์รี · สเลต · เซจ', swatches: ['#B34C67','#365B9D','#995903','#27684C'] }
]);
const storedHomePalette = safeGet('rma-home-palette','aurora');
const initialHomePalette = HOME_PALETTES.some(p=>p.id===storedHomePalette)?storedHomePalette:'aurora';
const state={
  currentId:location.hash.match(/#\/(.*)/)?.[1]||"A-01", previousId:"", theme:initialTheme, themePreference:storedTheme, reviewRole:"C",
  screenStates:{}, cart:[{menuIndex:0,qty:1,note:"เผ็ดน้อย · ไม่ใส่ผักชี"},{menuIndex:1,qty:1,note:"ไม่ใส่ผักชี"}], menuIndex:0, menuQty:1, coupon:"", discount:0,
  merchantStatus:"กำลังทำ", merchantOpen:true, riderOnline:false, orderCancelled:false, selectedVehicle:"economy",
  activeFlow:null, flowIndex:0, toast:"", modal:"", storeHidden:false, messageCount:0, chatMessages:{}, rating:5, soldOut:new Set([3]), chatTarget:"ไรเดอร์", taskType:"food", cashCollected:false, ridePayment:"พร้อมเพย์", rideCouponApplied:false
};
const app=document.querySelector('#app');
state.homePalette = initialHomePalette;
const getRole=(id)=>['A','C','M','R','S'].includes(id?.slice(0,1))?id.slice(0,1):'C';
const currentState=(id)=>state.screenStates[id] || STATE_OPTIONS[id]?.[0] || 'มีข้อมูล';
const STATE_ICON_GLYPHS=Object.freeze({'⌂':'home','⌖':'pin','▣':'notifications','▧':'camera','✓':'checkCircle','!':'error','◷':'clock','⌁':'wifiOff','○':'inbox','▦':'store','▥':'analytics','▤':'receipt','☷':'tune','◉':'food','↗':'arrow'});
function hydrateStateIcons(){app.querySelectorAll('.state-illustration').forEach(node=>{if(node.childElementCount)return;const name=STATE_ICON_GLYPHS[node.textContent.trim()];if(name)node.innerHTML=homeIcon(name,30);});}
const subtotal=()=>state.cart.reduce((sum,item)=>sum+(MENU[item.menuIndex]?.price||0)*item.qty,0);
const nav=(role)=>bottomNav(role,state.currentId);
function ctx(){
  const orderLabel=state.orderCancelled?'ยกเลิกแล้ว':state.merchantStatus==='ส่งมอบไรเดอร์แล้ว'?'ไรเดอร์กำลังนำส่ง':state.merchantStatus==='พร้อมส่ง'?'พร้อมให้ไรเดอร์รับ':'ร้านกำลังเตรียมอาหาร';
  const orderStep=state.orderCancelled?1:state.merchantStatus==='ส่งมอบไรเดอร์แล้ว'?4:state.merchantStatus==='พร้อมส่ง'?3:2;
  const orderSteps=state.orderCancelled
    ? [['order ถูกยกเลิก','12:41 น.'],['กำลังคืนเงินเข้าช่องทางเดิม','3–5 วันทำการ']]
    : [['ร้านรับออเดอร์','12:18 น.'],['กำลังปรุงอาหาร',state.merchantStatus==='กำลังทำ'?'กำลังทำ':'12:22 น.'],['พร้อมให้ไรเดอร์รับ',state.merchantStatus==='กำลังทำ'?'คาด 12:34 น.':'12:34 น.'],['กำลังนำส่งถึงคุณ',state.merchantStatus==='ส่งมอบไรเดอร์แล้ว'?'12:39 น.':'รอไรเดอร์มารับ']];
  return {
    ...state, state:currentState(state.currentId), cart:state.cart, subtotal:subtotal(), cartTotal:subtotal()+15-state.discount,
    menuQty:state.menuQty, discount:state.discount, coupon:state.coupon, activeRole:getRole(state.currentId),
    orderItems:state.cart.map((item)=>({...MENU[item.menuIndex],index:item.menuIndex,qty:item.qty,note:item.note})),
    orderLabel, orderStep, orderSteps, chatTarget:state.chatTarget, taskType:state.taskType, cashCollected:state.cashCollected,
    nav, roleMeta:ROLE_META, soldOut:state.soldOut
  };
}
function panelMarkup() {
  const role=ROLE_ORDER.includes(state.reviewRole)?state.reviewRole:'C';
  const items=SCREENS.filter(x=>x.role===role);
  const stateOptions=STATE_OPTIONS[state.currentId];
  const selected=currentState(state.currentId);
  const flow=state.activeFlow===null?null:FLOW_SHORTCUTS[state.activeFlow];
  const step=flow?`${Math.min(state.flowIndex+1,flow.route.length)} / ${flow.route.length}`:"";
  const paletteSection=state.currentId==='C-01'?`<div class="review-section"><h3>เลือกโทนสี · C-01</h3><div class="palette-options">${HOME_PALETTES.map(p=>`<button class="palette-option ${state.homePalette===p.id?'active':''}" data-home-palette="${p.id}" aria-pressed="${state.homePalette===p.id}"><span class="palette-swatches" aria-hidden="true">${p.swatches.map(c=>`<i style="--palette-swatch:${c}"></i>`).join('')}</span><span class="palette-copy"><strong>${p.name}</strong><small>${p.subtitle}</small></span><span class="palette-check" aria-hidden="true">${state.homePalette===p.id?'✓':''}</span></button>`).join('')}</div><p class="muted micro">เปลี่ยนสีเฉพาะหน้าหลัก C-01</p></div>`:'';
  return `<div class="review-head"><h2>แผง review</h2><button class="icon-btn" style="width:40px;height:40px" data-action="theme-toggle" aria-label="สลับธีม">${homeIcon(state.theme==='dark'?'light':'dark',18)}</button></div>
  <div class="review-code">หน้า <strong id="current-code">${state.currentId}</strong>${SCREEN_BY_ID[state.currentId]?.phase?'<span class="pill warning">phase ถัดไป</span>':''}</div>${paletteSection}
  <div class="review-role-tabs">${ROLE_ORDER.map(r=>`<button class="${role===r?'active':''}" data-review-role="${r}">${ROLE_META[r].label}</button>`).join('')}</div>
  <select class="review-select" data-screen-select aria-label="เลือกหน้า">${items.map(s=>`<option value="${s.id}" ${s.id===state.currentId?'selected':''}>${s.id} · ${escapeHTML(s.title)}${s.phase?' · phase ถัดไป':''}</option>`).join('')}</select>
  <div class="review-list">${items.map(s=>`<button class="review-link ${s.id===state.currentId?'active':''}" data-route="${s.id}"><code>${s.id}</code><span>${escapeHTML(s.title)}</span>${s.phase?'<span class="pill warning">ถัดไป</span>':''}</button>`).join('')}</div>
  <div class="review-section"><h3>ทางลัด flow · ${flow?`ขั้น ${step}`:'เลือกเพื่อเริ่ม'}</h3><div class="flow-list">${FLOW_SHORTCUTS.map((f,i)=>`<button class="flow-btn" data-flow="${i}"><strong>${escapeHTML(f.title)}</strong><span>${f.route.length} หน้าจอ · ${f.route[0]} → ${f.route.at(-1)}</span></button>`).join('')}</div>
  ${flow?`<button class="btn secondary" style="margin-top:8px" data-action="flow-next">หน้าถัดไปใน flow →</button><div class="muted micro" style="margin-top:5px">ขั้นปัจจุบัน: ${flow.route[state.flowIndex]||flow.route.at(-1)}</div>`:''}</div>
  <div class="review-section"><h3>สถานะหน้าปัจจุบัน</h3>${stateOptions?`<select class="review-select" data-state-select>${stateOptions.map(opt=>`<option value="${escapeHTML(opt)}" ${opt===selected?'selected':''}>${escapeHTML(opt)}</option>`).join('')}</select>`:`<div class="muted small">หน้านี้แสดงสถานะข้อมูลตัวอย่าง</div>`}</div>
  <div class="review-section"><div class="row-between"><div><strong class="small">${state.theme==='dark'?'Dark mode':'Light mode'}</strong><div class="muted micro">theme tokens CSS variables</div></div><button class="switch ${state.theme==='dark'?'on':''}" data-action="theme-toggle" aria-label="สลับธีม"></button></div></div>`;
}
let otpTimer;
function startOtpCountdown(){
  clearInterval(otpTimer);
  let seconds=28;
  const tick=()=>{
    const label=app.querySelector('[data-countdown]');
    const resend=app.querySelector('[data-resend]');
    if(!label||!resend){clearInterval(otpTimer);return;}
    label.textContent=`00:${String(seconds).padStart(2,'0')}`;
    resend.disabled=seconds>0;
    resend.textContent=seconds>0?`ส่งรหัสอีกครั้ง · ${seconds} วินาที`:'ส่งรหัสอีกครั้ง';
    if(seconds<=0){clearInterval(otpTimer);return;}
    seconds-=1;
  };
  tick();
  otpTimer=setInterval(tick,1000);
}
function applyListFilter(){
  const screen=app.querySelector('.screen-content');
  if(!screen)return;
  const query=(screen.querySelector('[data-search]')?.value||'').trim().toLocaleLowerCase('th-TH');
  const category=screen.querySelector('.chip.active[data-action="filter"]')?.textContent.trim()||'ทั้งหมด';
  const rows=[...screen.querySelectorAll('.restaurant-row,.menu-row')];
  let shown=0;
  rows.forEach(row=>{
    const matchesQuery=!query||row.textContent.toLocaleLowerCase('th-TH').includes(query);
    const matchesCategory=state.currentId!=='C-04'||!row.classList.contains('restaurant-row')||category==='ทั้งหมด'||row.textContent.includes(category);
    row.hidden=!(matchesQuery&&matchesCategory);
    if(!row.hidden)shown++;
  });
  let empty=screen.querySelector('[data-search-empty]');
  if(rows.length&&shown===0){
    if(!empty){empty=document.createElement('div');empty.className='card soft';empty.dataset.searchEmpty='';empty.setAttribute('role','status');screen.querySelector('.searchbox')?.insertAdjacentElement('afterend',empty);}
    empty.textContent=query?`ไม่พบ “${query}” ในรายการ`:`ไม่มีร้านในหมวด “${category}”`;
  }else empty?.remove();
}
function render() {
  document.documentElement.dataset.theme=state.theme;
  document.documentElement.dataset.homePalette=state.homePalette;
  const id=state.currentId;
  const current=SCREEN_BY_ID[id];
  const screen=renderScreen(id,ctx());
  const brandRole=getRole(id);
  app.innerHTML=`<div class="workspace">
    <aside class="brand-rail"><div><span class="rail-kicker">RMA DELIVERY · R1 REVIEW</span><h1>ทุกการเดินทาง<br>เริ่มจากบริการที่เข้าใจง่าย</h1></div><p>Interactive mobile prototype · ลูกค้า · ร้านค้า · ไรเดอร์/คนขับ</p><div class="row"><span class="pill brand">80 screens</span><span class="pill success">clickable</span></div><div class="rail-note"><span class="status-dot"></span><span>ตัวอย่างข้อมูลจำลอง · ไม่มีการเชื่อมระบบจริง</span></div><div class="rail-note">กำลังดู: <strong>${id}</strong> · ${current?escapeHTML(current.title):''}</div></aside>
    <div class="phone-column"><main class="phone" data-role="${brandRole}" aria-label="ตัวอย่างหน้าจอมือถือ"><div class="phone-status"><span>9:41</span><span>●●●　◔　▰</span></div><section class="screen-host" id="screen-host"><div class="screen-content">${screen}</div></section><div class="toast-region" id="toast-region"></div></main></div>
    <aside class="review-panel">${panelMarkup()}</aside>
    <button class="drawer-toggle" data-action="open-drawer">${homeIcon("tune",18)} Review · ${id}</button>
    <div class="drawer-backdrop ${state.drawerOpen?'open':''}" data-action="close-drawer"><div class="mobile-drawer" data-modal-inner>${panelMarkup()}</div></div>
    <div id="modal-root">${state.modal?modalMarkup(state.modal):''}</div>
  </div>`;
  hydrateStateIcons();
  if(id==='A-04') startOtpCountdown();
  if(state.toast) showToast(state.toast,false);
}
function modalMarkup(type) {
  const ride=VEHICLES.find(v=>v.id===state.selectedVehicle)||VEHICLES[1];
  const rideFare=ride.price-(state.rideCouponApplied?10:0);
  const content=type==='ride-receipt'?`<span class="eyebrow">ใบเสร็จการเดินทาง</span><h3>RM-RIDE-261007-63</h3><div class="info-row"><span>เส้นทาง</span><strong>ห้วยขวาง → อโศก</strong></div><div class="info-row"><span>รถ</span><strong>${ride.name} · ${ride.seats} ที่นั่ง</strong></div>${state.rideCouponApplied?`<div class="info-row"><span>ส่วนลด RIDE10</span><strong>−฿10</strong></div>`:""}<div class="info-row"><span>ชำระผ่าน</span><strong>${state.ridePayment}</strong></div><div class="price-line total"><span>ยอดชำระ</span><strong>฿${rideFare}</strong></div><button class="btn" data-action="close-modal">ปิดใบเสร็จ</button>`:
  type==='sheet'?`<span class="eyebrow">รายละเอียดระหว่างรอ</span><h3>สถานะ order ${state.currentId}</h3><p class="muted small">ร้านกำลังเตรียมอาหาร · ไรเดอร์ธนกรกำลังไปรับ · ETA 12:45 น.</p><div class="step-list"><div class="step done"><span class="step-dot">✓</span><div class="step-copy"><strong>ร้านรับ order แล้ว</strong><small>12:19 น.</small></div></div><div class="step"><span class="step-dot">2</span><div class="step-copy"><strong>กำลังจัดเตรียม</strong><small>ประมาณ 18 นาที</small></div></div></div><button class="btn" data-action="close-modal">เข้าใจแล้ว</button>`:
  type==='cancel-order'?`<h3>ยืนยันยกเลิกคำสั่งซื้อ?</h3><p class="muted small">ร้านเริ่มเตรียมอาหารแล้ว หากชำระเงินสำเร็จ ระบบจะแสดงการคืนเงินเข้าช่องทางเดิมภายใน 3–5 วันทำการ</p><div class="btn-row"><button class="btn ghost" data-action="close-modal">กลับ</button><button class="btn danger" data-action="confirm-cancel">ยืนยันยกเลิก</button></div>`:
  type==='dialog'?`<h3>ยืนยันการทำรายการ?</h3><p class="muted small">ตัวอย่าง dialog ยืนยันก่อนการกระทำสำคัญ เช่น ยกเลิก order</p><div class="btn-row"><button class="btn ghost" data-action="close-modal">กลับ</button><button class="btn danger" data-action="confirm-dialog">ยืนยัน</button></div>`:
  `<h3>รายละเอียด</h3><p class="muted small">ตัวอย่าง bottom sheet สำหรับข้อมูลที่เกี่ยวกับงานปัจจุบัน</p><button class="btn" data-action="close-modal">ปิด</button>`;
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" data-modal-inner>${content}</div></div>`;
}
function showToast(message,rerender=true) {
  state.toast=message;
  const region=document.querySelector('#toast-region');
  if(region) region.innerHTML=`<div class="toast" role="status">${escapeHTML(message)}</div>`;
  if(rerender) { /* keep current screen and scroll while feedback appears */ }
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>{state.toast=''; const r=document.querySelector('#toast-region'); if(r)r.innerHTML='';},2600);
}
function navigate(id) {
  if(!SCREEN_BY_ID[id]) return;
  state.drawerOpen=false;
  if(id==='C-13' && state.currentId.startsWith('R-')) state.chatTarget='ลูกค้า';
  if(id==='C-13' && state.currentId.startsWith('M-')) state.chatTarget='ไรเดอร์';
  state.previousId=state.currentId;
  if(id==='R-16') state.taskType='passenger';
  if(id==='R-05') state.taskType='food';
  if(state.activeFlow!==null) { const ix=FLOW_SHORTCUTS[state.activeFlow].route.indexOf(id); if(ix>=0) state.flowIndex=ix; }
  if(location.hash===`#/${id}`) {state.currentId=id;render();return;}
  location.hash=`/${id}`;
}
function syncRoute(){
  const id=decodeURIComponent(location.hash.replace(/^#\//,'').split('?')[0]||'A-01');
  state.currentId=SCREEN_BY_ID[id]?id:'A-01';
  if(!['A','S'].includes(getRole(id))) state.reviewRole=getRole(id);
  render();
}
function setTheme(next){const preference=['light','dark','system'].includes(next)?next:'light';state.themePreference=preference;state.theme=preference==='system'?systemTheme():preference;try{localStorage.setItem('rma-theme',preference);}catch{}render();}
const systemThemeMedia=globalThis.matchMedia?.('(prefers-color-scheme: dark)');
systemThemeMedia?.addEventListener?.('change',(event)=>{if(state.themePreference==='system'){state.theme=event.matches?'dark':'light';render();}});
function setState(value){state.screenStates[state.currentId]=value;if(state.currentId==='C-12')state.orderCancelled=value==='ยกเลิกแล้ว';if(state.currentId==='M-03')state.merchantOpen=value!=='ร้านปิด';if(state.currentId==='R-03')state.riderOnline=value==='ออนไลน์';render();}
function flowStart(index){state.activeFlow=index;state.flowIndex=0;const first=FLOW_SHORTCUTS[index]?.route[0];if(first)navigate(first);else render();}
function closeDrawer(){state.drawerOpen=false;render();}

app.addEventListener('click',(event)=>{
  const route=event.target.closest('[data-route]');
  if(route){event.preventDefault();navigate(route.dataset.route);return;}
  const palette=event.target.closest('[data-home-palette]');
  if(palette){const value=palette.dataset.homePalette;if(HOME_PALETTES.some(p=>p.id===value)){state.homePalette=value;try{localStorage.setItem('rma-home-palette',value);}catch{}render();}return;}
  const role=event.target.closest('[data-review-role]');
  if(role){state.reviewRole=role.dataset.reviewRole;render();return;}
  const flow=event.target.closest('[data-flow]');
  if(flow){flowStart(Number(flow.dataset.flow));return;}
  const actionEl=event.target.closest('[data-action]');
  if(!actionEl)return;
  const action=actionEl.dataset.action;
  if(action==='close-modal' && event.target.closest('[data-modal-inner]') && event.target!==actionEl)return;
  if(action==='back'){navigate(state.previousId||actionEl.dataset.fallback||'C-01');return;}
  if(action==='role-account'){const role=getRole(state.currentId);navigate(({C:'C-19',M:'M-17',R:'R-15'})[role]||'A-06');return;}
  if(action==='theme-toggle'){setTheme(state.theme==='dark'?'light':'dark');return;}
  if(action==='open-drawer'){state.drawerOpen=true;render();return;}
  if(action==='close-drawer'){if(event.target===actionEl)closeDrawer();return;}
  if(action==='close-modal'){state.modal='';render();return;}
  if(action==='flow-next'){const routes=FLOW_SHORTCUTS[state.activeFlow]?.route||[];const next=routes[Math.min(state.flowIndex+1,routes.length-1)];if(next)navigate(next);return;}
  if(action==='open-menu'){state.menuIndex=Number(actionEl.dataset.menu||0);state.menuQty=1;navigate('C-07');return;}
  if(action==='menu-qty-plus'){state.menuQty++;render();return;}
  if(action==='menu-qty-minus'){state.menuQty=Math.max(1,state.menuQty-1);render();return;}
  if(action==='add-cart'){const i=state.cart.findIndex(x=>x.menuIndex===state.menuIndex);if(i>=0)state.cart[i].qty+=state.menuQty;else state.cart.push({menuIndex:state.menuIndex,qty:state.menuQty,note:'เผ็ดน้อย · ไม่ใส่ผักชี'});showToast('เพิ่มเมนูลงตะกร้าแล้ว',false);navigate('C-08');return;}
  if(action==='cart-plus'||action==='cart-minus'){const i=Number(actionEl.dataset.index);if(state.cart[i]){state.cart[i].qty+=action==='cart-plus'?1:-1;if(state.cart[i].qty<=0)state.cart.splice(i,1);}render();return;}
  if(action==='apply-coupon'){const coupon=COUPONS[Number(actionEl.dataset.coupon)];if(coupon&&!coupon.disabled){state.coupon=coupon.code;state.discount=coupon.value;showToast(`ใช้โค้ด ${coupon.code} แล้ว`,false);navigate('C-09');}return;}
  if(action==='payment-success'){state.screenStates['C-11']='ชำระสำเร็จ';state.orderCancelled=false;showToast('ชำระเงินสำเร็จ · สร้าง order แล้ว',false);navigate('C-12');return;}
  if(action==='payment-fail'){state.screenStates['C-11']='ชำระไม่สำเร็จ';render();return;}
  if(action==='cancel-order'){state.modal='cancel-order';render();return;}
  if(action==='confirm-cancel'){state.modal='';state.orderCancelled=true;state.screenStates['C-12']='ยกเลิกแล้ว';showToast('ยกเลิก order แล้ว · แสดงเงื่อนไขคืนเงินจำลอง',false);navigate('C-12');return;}
  if(action==='ride-pay-toggle'){state.ridePayment=state.ridePayment==='พร้อมเพย์'?'เงินสด':'พร้อมเพย์';showToast(`วิธีชำระ: ${state.ridePayment}`,false);render();return;}
  if(action==='ride-coupon'){state.rideCouponApplied=!state.rideCouponApplied;showToast(state.rideCouponApplied?'ใช้โค้ด RIDE10 แล้ว':'นำโค้ด RIDE10 ออกแล้ว',false);render();return;}
  if(action==='ride-receipt'){state.modal='ride-receipt';render();return;}
  if(action==='no-driver'){state.screenStates['C-36']='หาไรเดอร์ไม่ได้';render();return;}
  if(action==='retry-ride'){state.screenStates['C-36']='กำลังค้นหา';showToast('เริ่มค้นหาคนขับอีกครั้ง',false);render();return;}
  if(action==='cancel-ride'){showToast('ยกเลิกการค้นหารถแล้ว',false);navigate('C-33');return;}
  if(action==='merchant-cooking'){state.merchantStatus='กำลังทำ';showToast('สถานะออเดอร์: กำลังทำอาหาร',false);render();return;}
  if(action==='merchant-ready'){state.merchantStatus='พร้อมส่ง';showToast('แจ้งไรเดอร์ว่าพร้อมรับอาหารแล้ว',false);render();return;}
  if(action==='merchant-handover'){state.merchantStatus='ส่งมอบไรเดอร์แล้ว';showToast('ส่งมอบ order ให้ไรเดอร์แล้ว',false);navigate('M-03');return;}
  if(action==='merchant-decline'){showToast('ปฏิเสธ order แล้ว · รายการถูกยกเลิกใน mockup',false);navigate('M-03');return;}
  if(action==='merchant-open'){state.merchantOpen=!state.merchantOpen;state.screenStates['M-03']=state.merchantOpen?'มี order':'ร้านปิด';showToast(state.merchantOpen?'เปิดรับ order แล้ว':'พักรับ order ชั่วคราว',false);render();return;}
  if(action==='rider-online'){state.riderOnline=!state.riderOnline;state.screenStates['R-03']=state.riderOnline?'ออนไลน์':'ออฟไลน์';showToast(state.riderOnline?'ออนไลน์ · เริ่มรับงานได้':'ออฟไลน์ · พักรับงานแล้ว',false);render();return;}
  if(action==='toggle'){actionEl.classList.toggle('on');return;}
  if(action==='toggle-menu'){const i=Number(actionEl.dataset.menu);if(state.soldOut.has(i))state.soldOut.delete(i);else state.soldOut.add(i);showToast('อัปเดตสถานะเมนูแล้ว',false);render();return;}
  if(action==='retry'){showToast('โหลดข้อมูลตัวอย่างอีกครั้งแล้ว',false);state.screenStates[state.currentId]=STATE_OPTIONS[state.currentId]?.[0]||'มีข้อมูล';render();return;}
  if(action==='toast-demo'){showToast('บันทึกการเปลี่ยนแปลงแล้ว',false);return;}
  if(action==='chat-target'){state.chatTarget=actionEl.dataset.target||'ไรเดอร์';render();return;}
  if(action==='show-closed'){state.screenStates['C-04']='ร้านปิด';navigate('C-04');return;}
  if(action==='passenger-cash'){state.cashCollected=!state.cashCollected;showToast(state.cashCollected?'เปลี่ยนเป็นเก็บเงินสด ฿86':'เลือกพร้อมเพย์เป็นวิธีชำระ',false);render();return;}
  if(action==='stop-detail'){state.modal='sheet';render();return;}
  if(action==='decline-offer'){showToast('ปฏิเสธข้อเสนอตัวอย่างแล้ว',false);navigate('R-03');return;}
  if(action==='dialog-demo'){state.modal='dialog';render();return;}
  if(action==='sheet-demo'){state.modal='sheet';render();return;}
  if(action==='confirm-dialog'){state.modal='';showToast('ยืนยันรายการตัวอย่างแล้ว',false);render();return;}
  if(action==='toast-call'){showToast('จำลองการโทร · เบอร์โทรถูกปกปิด',false);return;}
  if(action==='toast-upload'){showToast('จำลองการแนบรูป · ไฟล์อัปโหลด 100%',false);return;}
  if(action==='toast-location'||action==='allow-location'){showToast('อนุญาตตำแหน่งในตัวอย่างแล้ว',false);return;}
  if(action==='allow-notifications'){showToast('เปิดการแจ้งเตือนตัวอย่างแล้ว',false);return;}
  if(action==='line-login'){showToast('LINE login เป็นตัวอย่าง ยังไม่เชื่อม provider',false);return;}
  if(action==='resend-otp'){if(actionEl.disabled)return;showToast('ส่งรหัสตัวอย่าง 123456 อีกครั้ง',false);startOtpCountdown();return;}
  if(action==='save-profile'||action==='save-merchant'||action==='save-menu'||action==='save-options'){showToast('บันทึกข้อมูลตัวอย่างแล้ว',false);return;}
  if(action==='toast-next-step'){showToast('บันทึกข้อมูลร้านแล้ว · ขั้นถัดไปตรวจเอกสาร',false);navigate('M-02');return;}
  if(action==='toast-application'){showToast('ใบสมัครตัวอย่าง · ตรวจสอบภายใน 1–2 วันทำการ',false);return;}
  if(action==='toast-otp'){showToast('ส่ง OTP ยืนยันเบอร์โทรแล้ว (ตัวอย่าง)',false);return;}
  if(action==='sync-menu'){showToast('ซิงก์เมนูตัวอย่างสำเร็จ · 18 รายการ',false);return;}
  if(action==='disconnect-sk'){state.modal='dialog';render();return;}
  if(action==='merchant-decline'){showToast('แจ้งปฏิเสธ order ตัวอย่างแล้ว',false);navigate('M-03');return;}
  if(action==='toast-out-of-stock'){showToast('ทำเครื่องหมายเมนูหมดชั่วคราวแล้ว',false);return;}
  if(action==='toast-support'){showToast('เปิดเคสช่วยเหลือตัวอย่างแล้ว · CS-261007-128',false);return;}
  if(action==='create-promo'){showToast('เปิดฟอร์มสร้างโปรโมชันตัวอย่าง',false);return;}
  if(action==='reply-review'){showToast('เปิดช่องตอบกลับรีวิว',false);return;}
  if(action==='edit-bank'||action==='edit-address'||action==='edit-hours'||action==='edit-vehicle'){showToast('เข้าสู่โหมดแก้ไขข้อมูลตัวอย่าง',false);return;}
  if(action==='add-option'){showToast('เพิ่มแถวตัวเลือกใหม่แล้ว',false);return;}
  if(action==='withdraw'){showToast('ส่งคำขอถอนเงินตัวอย่างแล้ว',false);return;}
  if(action==='toast-navigate'){showToast('เปิดการนำทางตัวอย่าง',false);return;}
  if(action==='toast-camera'){showToast('กล้องเป็นตัวอย่าง · บันทึกภาพจำลองแล้ว',false);return;}
  if(action==='passenger-arrived'){showToast('แจ้งผู้โดยสารว่าถึงจุดรับแล้ว',false);return;}
  if(action==='passenger-no-show'){state.modal='dialog';render();return;}
  if(action==='start-passenger-trip'){showToast('เริ่มเดินทาง · ไม่มีงานอื่นเข้าในช่วงนี้',false);return;}
  if(action==='emergency'){state.modal='dialog';render();return;}
  if(action==='share-trip'){showToast('คัดลอกลิงก์แชร์การเดินทางตัวอย่างแล้ว',false);return;}
  if(action==='tip'){showToast('เพิ่มทิปตัวอย่าง ฿20 แล้ว',false);return;}
  if(action==='submit-rating'){showToast(`ส่งคะแนน ${state.rating} ดาวแล้ว ขอบคุณที่รีวิว`,false);navigate('C-01');return;}
  if(action==='rate'){state.rating=Number(actionEl.dataset.value);showToast(`เลือก ${state.rating} ดาว`,false);return;}
  if(action==='cancel-ride'){navigate('C-33');return;}
  if(action==='select-destination'){showToast('เลือกปลายทางตัวอย่างแล้ว',false);return;}
  if(action==='filter'){
    actionEl.parentElement?.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
    actionEl.classList.add('active');
    applyListFilter();
    showToast(`แสดงร้านตามหมวด: ${actionEl.textContent.trim()}`,false);
    return;
  }
  if(action==='sort'){
    const list=document.querySelector('[data-store-list]');
    if(!list){showToast('เปลี่ยนลำดับรายการตัวอย่างแล้ว',false);return;}
    state.sortOrder=state.sortOrder==='rating'?'eta':'rating';
    const rows=[...list.querySelectorAll('.restaurant-row')];
    rows.sort((a,b)=>state.sortOrder==='rating'?Number(b.dataset.rating)-Number(a.dataset.rating):Number(a.dataset.eta)-Number(b.dataset.eta));
    list.append(...rows);
    actionEl.textContent=`เรียงตาม: ${state.sortOrder==='rating'?'คะแนนสูงสุด':'เวลาเร็วสุด'}`;
    applyListFilter();
    showToast(`เรียงตาม${state.sortOrder==='rating'?'คะแนนสูงสุด':'เวลาจัดส่งเร็วสุด'}`,false);
    return;
  }
  if(action==='order-tab'){
    actionEl.parentElement?.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
    actionEl.classList.add('active');
    const status=actionEl.textContent.trim().replace(/\s+\d+\s*$/,'');
    const cards=[...document.querySelectorAll('[data-order-sample]')];
    let visible=0;
    cards.forEach(item=>{item.hidden=status!=='ทั้งหมด'&&item.dataset.orderSample!==status;if(!item.hidden)visible++;});
    let empty=document.querySelector('[data-order-empty]');
    if(!visible){
      if(!empty){empty=document.createElement('div');empty.className='card soft';empty.dataset.orderEmpty='';empty.textContent=`ไม่มีออเดอร์สถานะ “${status}” ในข้อมูลตัวอย่าง`;cards.at(-1)?.insertAdjacentElement('afterend',empty);}
      else empty.textContent=`ไม่มีออเดอร์สถานะ “${status}” ในข้อมูลตัวอย่าง`;
    }else empty?.remove();
    showToast(`แสดงออเดอร์: ${status}`,false);
    return;
  }
  if(action==='fill-search'){const input=document.querySelector('[data-search]');if(input){input.value=actionEl.textContent.replace('×','').trim();applyListFilter();input.focus();}return;}
  if(action==='send-chat'||action==='quick-reply'){const input=document.querySelector('[data-chat-input]');const text=action==='quick-reply'?actionEl.textContent.trim():(input?.value||'').trim();if(!text){showToast('พิมพ์ข้อความก่อนส่ง',false);return;}state.chatMessages[state.chatTarget]??=[];state.chatMessages[state.chatTarget].push(text);state.messageCount++;showToast('ส่งข้อความตัวอย่างแล้ว',false);render();return;}
  if(action==='confirm-delete'){state.modal='dialog';render();return;}
  if(action==='toast-booking'){showToast('ส่งคำขอจองตัวอย่างแล้ว · ผู้ให้บริการจะยืนยันกลับ',false);return;}
  if(action==='retry'){showToast('ลองโหลดข้อมูลอีกครั้งแล้ว',false);return;}
});

app.addEventListener('change',(event)=>{
  if(event.target.matches('[data-state-select]')){setState(event.target.value);return;}
  if(event.target.matches('[data-screen-select]')){navigate(event.target.value);return;}
  if(event.target.matches('[data-task-type]')){state.taskType=event.target.value==='passenger'?'passenger':'food';showToast(state.taskType==='passenger'?'เลือกงานรับส่งคนแล้ว':'เลือกงานส่งอาหารแล้ว',false);render();return;}
  if(event.target.matches('[data-theme-choice]')){setTheme(event.target.value);return;}
  if(event.target.matches('[data-action="vehicle-select"]')){state.selectedVehicle=event.target.value;render();return;}
  if(event.target.matches('input[name="vehicle"]')){state.selectedVehicle=event.target.value;render();}
});
app.addEventListener('input',(event)=>{if(event.target.matches('[data-search]'))applyListFilter();});
app.addEventListener('keydown',(event)=>{
  if(event.target.matches('input[aria-label^="เลข OTP"]')&&event.key.length===1){const next=event.target.nextElementSibling;if(next?.matches('input'))next.focus();}
  if(event.target.matches('[data-search]')&&event.key==='Enter'){showToast(`แสดงผลค้นหา: ${event.target.value||'ร้านใกล้คุณ'}`,false);}
  if(event.key==='Escape'&&state.modal){state.modal='';render();}
});
window.addEventListener('hashchange',syncRoute);
window.addEventListener('popstate',syncRoute);

syncRoute();
