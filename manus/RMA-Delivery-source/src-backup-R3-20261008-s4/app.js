import { ROLE_META, ROLE_ORDER, SCREENS, SCREEN_BY_ID, STATE_OPTIONS } from "./data/screens.js";
import { ADDRESS, COUPONS, FLOW_SHORTCUTS, MENU, VEHICLES } from "./data/content.js";
import { bottomNav, escapeHTML, keyboardDemo } from "./ui/components.js";
import { renderScreen } from "./ui/renderers.js";
import { modalMarkup } from "./ui/modals.js";
import { demoMarkup } from "./ui/demo.js";
import { handleCoreAction } from "./ui/actions.js";
import { createLive } from "./ui/live.js";

const safeGet=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
const storedTheme=safeGet('rma-theme','light');
const systemTheme=()=>globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches?'dark':'light';
const initialTheme=storedTheme==='system'?systemTheme():storedTheme==='dark'?'dark':'light';
const state={
  currentId:location.hash.match(/#\/(.*)/)?.[1]||"A-01", previousId:"", theme:initialTheme, themePreference:storedTheme, reviewRole:"C",
  screenStates:{}, cart:[{menuIndex:0,qty:1,note:"เผ็ดน้อย · ไม่ใส่ผักชี"},{menuIndex:1,qty:1,note:"ไม่ใส่ผักชี"}], menuIndex:0, menuQty:1, coupon:"", discount:0, menuDeleted:new Set(),
  merchantStatus:"กำลังทำ", merchantOpen:true, riderOnline:false, orderCancelled:false, selectedVehicle:"economy",
  activeFlow:null, flowIndex:0, toast:"", modal:"", storeHidden:false, messageCount:0, chatMessages:{}, rating:5, soldOut:new Set([3]), chatTarget:"ไรเดอร์", taskType:"food", cashCollected:false, ridePayment:"พร้อมเพย์ QR", rideCouponApplied:false,
  hasBundle:false, orderMenuOpen:false, paymentMethod:"พร้อมเพย์ QR", paymentTarget:"order", cancelReason:"เปลี่ยนใจ", tipAmount:0, tipCustom:false, editCartIndex:null,
  ridePaid:false, ridePickup:"", rideDestination:"",
  historyFilter:"ทั้งหมด", historyService:"ทั้งหมด", messageTab:"แชท", merchantSignupStep:0, riderSignupStep:0, riderTypes:{food:true,passenger:false}, riderDocs:[],
  rideStep:0, rideStage:"coming", proofTaken:false, offerKind:"food", menuExtras:[], menuChoice:-1, savedCoupons:new Set(), reasonKind:"", dialogKind:"", issueType:"ได้รับอาหารไม่ครบ", payOutcome:"success", appLang:"th", soundOn:true, dealFilter:"ทั้งหมด", shopPause:"",
  prepMinutes:20, reportRange:"7 วัน", chartValue:0, optionRequired:true, optionDeleted:new Set(), optionOverrides:{}, optionOrder:{}, customOptionGroups:[], optionEditorId:"", promoPaused:[], promoCreateMode:false, claimStep:0, historyDetailText:"", favoriteStores:new Set(), permissionStep:0, keyboardOpen:false, otpStatus:"idle", searchKind:"all"
};
const app=document.querySelector('#app');
const getRole=(id)=>['A','C','M','R','S'].includes(id?.slice(0,1))?id.slice(0,1):'C';
const currentState=(id)=>state.screenStates[id] || STATE_OPTIONS[id]?.[0] || 'มีข้อมูล';
const unitPrice=(item)=>(MENU[item.menuIndex]?.price||0)+(item.extra||0);
const subtotal=()=>state.cart.reduce((sum,item)=>sum+unitPrice(item)*item.qty,0);
const extrasTotal=()=>(state.menuExtras||[]).reduce((sum,i)=>sum+(extraPrice(MENU[state.menuIndex]?.extra?.[i])),0);
const extraPrice=(label='')=>Number((String(label).match(/\+(\d+)/)||[])[1]||0);
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
    orderItems:state.cart.map((item)=>({...MENU[item.menuIndex],price:unitPrice(item),index:item.menuIndex,qty:item.qty,note:item.note})),
    orderCash:state.paymentMethod==='เงินสด', extrasTotal:extrasTotal(),
    orderLabel, orderStep, orderSteps, chatTarget:state.chatTarget, taskType:state.taskType, cashCollected:state.cashCollected,
    nav, roleMeta:ROLE_META, soldOut:state.soldOut, hasBundle:state.hasBundle, favoriteStores:state.favoriteStores,
    permissionStep:state.permissionStep, keyboardOpen:state.keyboardOpen, otpStatus:state.otpStatus, searchKind:state.searchKind
  };
}
function panelMarkup() {
  const role=ROLE_ORDER.includes(state.reviewRole)?state.reviewRole:'C';
  const items=SCREENS.filter(x=>x.role===role);
  const stateOptions=STATE_OPTIONS[state.currentId];
  const selected=currentState(state.currentId);
  const flow=state.activeFlow===null?null:FLOW_SHORTCUTS[state.activeFlow];
  const step=flow?`${Math.min(state.flowIndex+1,flow.route.length)} / ${flow.route.length}`:"";
  return `<div class="review-head"><h2>แผง review</h2><button class="icon-btn" style="width:40px;height:40px" data-action="theme-toggle" aria-label="สลับธีม">${state.theme==='dark'?'☼':'◐'}</button></div>
  <div class="review-code">หน้า <strong id="current-code">${state.currentId}</strong>${SCREEN_BY_ID[state.currentId]?.phase?'<span class="pill warning">phase ถัดไป</span>':''}</div>
  <div class="review-role-tabs">${ROLE_ORDER.map(r=>`<button class="${role===r?'active':''}" data-review-role="${r}">${ROLE_META[r].label}</button>`).join('')}</div>
  <select class="review-select" data-screen-select aria-label="เลือกหน้า">${items.map(s=>`<option value="${s.id}" ${s.id===state.currentId?'selected':''}>${s.id} · ${escapeHTML(s.title)}${s.phase?' · phase ถัดไป':''}</option>`).join('')}</select>
  <div class="review-list">${items.map(s=>`<button class="review-link ${s.id===state.currentId?'active':''}" data-route="${s.id}"><code>${s.id}</code><span>${escapeHTML(s.title)}</span>${s.phase?'<span class="pill warning">ถัดไป</span>':''}</button>`).join('')}</div>
  <div class="review-section"><h3>ทางลัด flow · ${flow?`ขั้น ${step}`:'เลือกเพื่อเริ่ม'}</h3><div class="flow-list">${FLOW_SHORTCUTS.map((f,i)=>`<button class="flow-btn" data-flow="${i}"><strong>${escapeHTML(f.title)}</strong><span>${f.route.length} หน้าจอ · ${f.route[0]} → ${f.route.at(-1)}</span></button>`).join('')}</div>
  ${flow?`<button class="btn secondary" style="margin-top:8px" data-action="flow-next">หน้าถัดไปใน flow →</button><div class="muted micro" style="margin-top:5px">ขั้นปัจจุบัน: ${flow.route[state.flowIndex]||flow.route.at(-1)}</div>`:''}</div>
  <div class="review-section"><h3>สถานะหน้าปัจจุบัน</h3>${stateOptions?`<select class="review-select" data-state-select>${stateOptions.map(opt=>`<option value="${escapeHTML(opt)}" ${opt===selected?'selected':''}>${escapeHTML(opt)}</option>`).join('')}</select>`:`<div class="muted small">หน้านี้แสดงสถานะข้อมูลตัวอย่าง</div>`}</div>
  ${state.currentId==='C-20'?`<div class="review-section"><div class="row-between"><strong class="small">Keyboard demo</strong><button class="btn inline secondary" data-action="p3-keyboard-toggle">${state.keyboardOpen?'ซ่อน':'แสดง'}</button></div>${state.keyboardOpen?keyboardDemo():'<div class="muted micro">ย้ายแป้นพิมพ์มาไว้ใน review panel แล้ว</div>'}</div>`:''}
  ${demoMarkup(state.currentId)}
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
  if(state.currentId==='C-05') applyP3Search();
}
function applyP3Search(){
  if(state.currentId!=='C-05') return;
  const screen=app.querySelector('.screen-content');
  const input=screen?.querySelector('[data-search]');
  const query=(input?.value||'').trim().toLocaleLowerCase('th-TH');
  const suggestions=screen?.querySelector('[data-p3-suggestions]');
  const tabs=screen?.querySelector('[data-p3-search-tabs]');
  if(suggestions) suggestions.hidden=Boolean(query);
  if(tabs) tabs.hidden=!query;
  screen?.querySelectorAll('.restaurant-row,.menu-row').forEach((row)=>{
    const kind=row.classList.contains('menu-row')?'menu':'store';
    const matchesKind=state.searchKind==='all'||state.searchKind===kind;
    row.hidden=!query||!matchesKind;
  });
}
function render() {
  document.documentElement.dataset.theme=state.theme;
  const id=state.currentId;
  const current=SCREEN_BY_ID[id];
  const screen=renderScreen(id,ctx());
  const brandRole=getRole(id);
  app.innerHTML=`<div class="workspace">
    <aside class="brand-rail"><div><span class="rail-kicker">RMA DELIVERY · R1 REVIEW</span><h1>ทุกการเดินทาง<br>เริ่มจากบริการที่เข้าใจง่าย</h1></div><p>Interactive mobile prototype · ลูกค้า · ร้านค้า · ไรเดอร์/คนขับ</p><div class="row"><span class="pill brand">80 screens</span><span class="pill success">clickable</span></div><div class="rail-note"><span class="status-dot"></span><span>ตัวอย่างข้อมูลจำลอง · ไม่มีการเชื่อมระบบจริง</span></div><div class="rail-note">กำลังดู: <strong>${id}</strong> · ${current?escapeHTML(current.title):''}</div></aside>
    <div class="phone-column"><main class="phone" aria-label="ตัวอย่างหน้าจอมือถือ"><div class="phone-status"><span>9:41</span><span>●●●　◔　▰</span></div><section class="screen-host" id="screen-host"><div class="screen-content">${screen}</div></section><div class="toast-region" id="toast-region"></div></main></div>
    <aside class="review-panel">${panelMarkup()}</aside>
    <button class="drawer-toggle" data-action="open-drawer">☷ Review · ${id}</button>
    <div class="drawer-backdrop ${state.drawerOpen?'open':''}" data-action="close-drawer"><div class="mobile-drawer" data-modal-inner>${panelMarkup()}</div></div>
    <div id="modal-root">${state.modal?modalMarkup(state.modal,state):''}</div>
  </div>`;
  if(id==='A-04') startOtpCountdown();
  if(id==='C-05') applyP3Search();
  live.start();
  if(state.toast) showToast(state.toast,false);
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
  if(state.currentId==='R-08'&&id==='R-09'){state.proofTaken=false;state.cashCollected=false;}
  if(id==='C-13')state.chatFrom=state.currentId.slice(0,1);
  if(id==='R-16'&&!['R-16','R-17'].includes(state.currentId))state.rideStep=0;
  if(id==='C-37'&&state.currentId==='C-36')state.rideStage='coming';
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

const api={state,render:()=>render(),navigate:(id)=>navigate(id),showToast:(m,r)=>showToast(m,r),setTheme:(v)=>setTheme(v),consumeDrag:()=>live.consumeDrag(),extraPrice:(l)=>extraPrice(l)};
const live=createLive(app,state,api);
app.addEventListener('click',(event)=>{
  const priorityAction=event.target.closest('[data-action="p3-remove-favorite"]');
  if(priorityAction){const index=Number(priorityAction.dataset.favoriteIndex);if(Number.isInteger(index))state.favoriteStores.add(index);showToast('นำร้านออกจากรายการโปรดแล้ว',false);render();return;}
  const route=event.target.closest('[data-route]');
  if(route){event.preventDefault();navigate(route.dataset.route);return;}
  const role=event.target.closest('[data-review-role]');
  if(role){state.reviewRole=role.dataset.reviewRole;render();return;}
  const flow=event.target.closest('[data-flow]');
  if(flow){flowStart(Number(flow.dataset.flow));return;}
  const actionEl=event.target.closest('[data-action]');
  if(!actionEl)return;
  const action=actionEl.dataset.action;
  if(action==='logout'){state.modal='logout-confirm';render();return;}
  if(action==='open-issue-form'){state.modal='issue-form';render();return;}
  if(action==='cannot-reach'){state.modal='cannot-reach';render();return;}
  if(action==='collect-coupon'){if(actionEl.dataset.code)state.savedCoupons.add(actionEl.dataset.code);showToast('เก็บคูปองแล้ว ใช้ได้ตอนชำระเงิน',false);render();return;}
  if(handleCoreAction(action,actionEl,api))return;
  if(action==='close-modal' && event.target.closest('[data-modal-inner]') && event.target!==actionEl)return;
  if(action==='back'){navigate(state.previousId||actionEl.dataset.fallback||'C-01');return;}
  if(action==='role-account'){const role=getRole(state.currentId);navigate(({C:'C-19',M:'M-17',R:'R-15'})[role]||'A-06');return;}
  if(action==='theme-toggle'){setTheme(state.theme==='dark'?'light':'dark');return;}
  if(action==='open-drawer'){state.drawerOpen=true;render();return;}
  if(action==='close-drawer'){if(event.target===actionEl)closeDrawer();return;}
  if(action==='close-modal'){state.modal='';render();return;}
  if(action==='flow-next'){const routes=FLOW_SHORTCUTS[state.activeFlow]?.route||[];const next=routes[Math.min(state.flowIndex+1,routes.length-1)];if(next)navigate(next);return;}
  if(action==='cart-plus'||action==='cart-minus'){const i=Number(actionEl.dataset.index);if(state.cart[i]){if(action==='cart-minus'&&state.cart[i].qty===1){state.pendingRemove=i;state.modal='remove-cart-item';render();return;}state.cart[i].qty+=action==='cart-plus'?1:-1;}render();return;}
  if(action==='p2-confirm-remove'){const i=Number(state.pendingRemove);if(state.cart[i])state.cart.splice(i,1);state.pendingRemove=null;state.modal='';render();return;}
  if(action==='apply-coupon'){const code=actionEl.closest('.coupon-card')?.querySelector('code')?.textContent.trim();const coupon=COUPONS.find(x=>x.code===code)||COUPONS[Number(actionEl.dataset.coupon)];if(coupon&&!coupon.disabled&&!(coupon.code==='RMA40'&&subtotal()<150)){state.coupon=coupon.code;state.discount=coupon.value;showToast(`ใช้โค้ด ${coupon.code} แล้ว`,false);navigate('C-09');}else if(coupon)showToast('ยอดสั่งซื้อยังไม่ถึงขั้นต่ำ',false);return;}
  if(action==='apply-manual-coupon'){const code=app.querySelector('[data-coupon-code]')?.value.trim().toUpperCase();const coupon=COUPONS.find(x=>x.code.toUpperCase()===code);if(coupon&&!coupon.disabled&&!(coupon.code==='RMA40'&&subtotal()<150)){state.coupon=coupon.code;state.discount=coupon.value;showToast(`ใช้โค้ด ${coupon.code} แล้ว`,false);navigate('C-09');}else showToast(coupon?'ยอดสั่งซื้อยังไม่ถึงขั้นต่ำ':'ไม่พบโค้ดนี้',false);return;}
  if(action==='p2-confirm-order'){if(state.paymentMethod==='เงินสด'){navigate('C-12');return;}navigate('C-11');return;}
  if(action==='p2-payment-method'){state.paymentTarget='order';state.modal='payment-method';render();return;}
  if(action==='p2-select-payment'){const method=actionEl.dataset.method||'พร้อมเพย์ QR';if(state.paymentTarget==='ride'){state.ridePayment=method;state.ridePaid=false;}else state.paymentMethod=method;state.modal='';showToast(`เลือกวิธีชำระ ${method} แล้ว`,false);render();return;}
  if(action==='p2-select-address'){navigate(state.previousId&&state.previousId!=='C-02'?state.previousId:'C-01');return;}
  if(action==='p2-order-menu'){state.orderMenuOpen=!state.orderMenuOpen;render();return;}
  if(action==='p2-message-tab'){state.messageTab=actionEl.dataset.tab||'แชท';render();return;}
  if(action==='p2-history-filter'){state.historyFilter=actionEl.dataset.filter||'ทั้งหมด';render();return;}
  if(action==='p2-history-service'){state.historyService=actionEl.dataset.service||'ทั้งหมด';render();return;}
  if(action==='p2-tip'){state.tipAmount=Number(actionEl.dataset.tip||0);state.tipCustom=false;render();return;}
  if(action==='p2-tip-custom'){state.tipCustom=!state.tipCustom;state.tipAmount=0;render();return;}
  if(action==='p2-wizard-next'){const key=state.currentId==='M-01'?'merchantSignupStep':'riderSignupStep';state[key]=Math.min(2,Number(state[key]||0)+1);render();return;}
  if(action==='p2-wizard-back'){const key=state.currentId==='M-01'?'merchantSignupStep':'riderSignupStep';state[key]=Math.max(0,Number(state[key]||0)-1);render();return;}
  if(action==='p2-prep-time'){state.prepMinutes=Number(actionEl.dataset.minutes||20);render();return;}
  if(action==='p2-report-range'){state.reportRange=actionEl.dataset.range||'7 วัน';render();return;}
  if(action==='p2-chart-value'){state.chartValue=Number(actionEl.dataset.value||0);render();return;}
  if(action==='p2-task-type'){const type=actionEl.dataset.type;state.riderTypes[type]=!state.riderTypes[type];if(!state.riderTypes.food&&!state.riderTypes.passenger)state.riderTypes[type]=true;showToast('อัปเดตประเภทงานแล้ว',false);render();return;}
  if(action==='p2-rider-doc'){const index=Number(actionEl.dataset.doc);if(Number.isInteger(index)&&index>=0&&index<4){if(state.riderDocs.includes(index))state.riderDocs=state.riderDocs.filter(x=>x!==index);else state.riderDocs=[...state.riderDocs,index];showToast(state.riderDocs.includes(index)?'แนบเอกสารตัวอย่างแล้ว':'นำเอกสารออกแล้ว',false);render();}return;}
  if(action==='p2-select-vehicle'){state.selectedVehicle=actionEl.dataset.vehicle||'economy';render();return;}
  if(action==='p2-ride-payment'){state.paymentTarget='ride';state.modal='payment-method';render();return;}
  if(action==='p2-set-pickup'){state.ridePickup=actionEl.dataset.value||state.ridePickup;showToast('อัปเดตจุดรับแล้ว',false);render();return;}
  if(action==='p2-set-destination'){state.rideDestination=actionEl.dataset.value||state.rideDestination;showToast('อัปเดตปลายทางแล้ว',false);render();return;}
  if(action==='p2-swap-route'){[state.ridePickup,state.rideDestination]=[state.rideDestination||'อโศก ทาวเวอร์',state.ridePickup||'ห้วยขวาง'];showToast('สลับจุดรับและปลายทางแล้ว',false);render();return;}
  if(action==='p2-ride-paid'){state.ridePaid=true;showToast('บันทึกการชำระเงินตัวอย่างแล้ว',false);render();return;}
  if(action==='p2-toggle-required'){state.optionRequired=state.optionRequired===false;render();return;}
  if(action==='p2-store-search'){app.querySelector('[data-menu-search]')?.focus();return;}
  if(action==='p2-favorite'){showToast('เพิ่มร้านในรายการโปรดแล้ว',false);return;}
  if(action==='p2-store-info'){state.modal='sheet';render();return;}
  if(action==='p3-remove-favorite'){const index=Number(actionEl.dataset.favoriteIndex);if(Number.isInteger(index))state.favoriteStores.add(index);showToast('นำร้านออกจากรายการโปรดแล้ว',false);render();return;}
  if(action==='p3-search-tab'){state.searchKind=actionEl.dataset.kind||'all';applyP3Search();return;}
  if(action==='p3-clear-search'){const input=app.querySelector('[data-search]');if(input){input.value='';state.searchKind='all';applyListFilter();input.focus();}return;}
  if(action==='p3-phase-service'){showToast('บริการนี้จะเปิดเร็ว ๆ นี้',false);return;}
  if(action==='p3-keyboard-toggle'){state.keyboardOpen=!state.keyboardOpen;render();return;}
  if(action==='p3-change-phone'){state.otpStatus='idle';navigate('A-03');return;}
  if(action==='p3-otp-error'){state.otpStatus='error';render();return;}
  if(action==='p3-otp-resend'){state.otpStatus='resent';startOtpCountdown();render();return;}
  if(action==='p3-permission-next'){state.permissionStep=Math.min(2,state.permissionStep+1);if(state.permissionStep>=2)navigate('C-01');else render();return;}
  if(action==='p2-menu-stock'){const index=Number(actionEl.dataset.menu);if(Number.isInteger(index)){if(state.soldOut.has(index))state.soldOut.delete(index);else state.soldOut.add(index);showToast(state.soldOut.has(index)?'ทำเครื่องหมายเมนูหมดแล้ว':'แจ้งว่าเมนูพร้อมขายแล้ว',false);render();}return;}
  if(action==='p2-menu-category'){actionEl.parentElement?.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));actionEl.classList.add('active');const category=actionEl.textContent.trim();app.querySelectorAll('.menu-row[data-category]').forEach(row=>row.hidden=category!=='ยอดนิยม'&&row.dataset.category!==category);return;}
  if(action==='p2-history-detail'){state.historyDetailText=actionEl.closest('.p2-row-card')?.textContent.trim()||'งานจัดส่งอาหาร';state.modal='history-detail';render();return;}
  if(action==='p2-edit-menu'){state.menuIndex=Number(actionEl.dataset.menu||0);state.menuCreateMode=false;navigate('M-07');return;}
  if(action==='p2-promo-toggle'){const i=Number(actionEl.dataset.promo||0);state.promoPaused[i]=!state.promoPaused[i];showToast(state.promoPaused[i]?'พักโปรโมชันชั่วคราวแล้ว':'เปิดโปรโมชันอีกครั้งแล้ว',false);render();return;}
  if(action==='p2-edit-promo'){state.promoCreateMode=true;state.promoEditIndex=Number(actionEl.dataset.promo||0);render();return;}
  if(action==='p2-create-promo'){state.promoCreateMode=true;state.promoEditIndex=null;render();return;}
  if(action==='p2-save-promo'){state.promoCreateMode=false;showToast('บันทึกโปรโมชันตัวอย่างแล้ว',false);render();return;}
  if(action==='p2-cancel-promo'){state.promoCreateMode=false;render();return;}
  if(action==='p2-start-claim'){state.claimStep=1;render();return;}
  if(action==='p2-submit-claim'){state.claimStep=2;render();return;}
  if(action==='p2-reset-claim'){state.claimStep=0;render();return;}
  if(action==='p2-store-issue'){showToast('เปิดรายงานปัญหาที่ร้านแล้ว',false);return;}
  if(action==='p2-cash-remittance'){state.modal='cash-remittance';render();return;}
  if(action==='p2-cash-confirm'){state.cashRemitted=true;state.modal='';showToast('บันทึกการนำส่งเงินสดตัวอย่างแล้ว',false);render();return;}
  if(action==='p2-option-menu'){state.optionEditorId=`${actionEl.dataset.group||'spice'}-${actionEl.dataset.option||0}`;state.modal='option-editor';render();return;}
  if(action==='p2-option-save'){const id=state.optionEditorId;state.optionOverrides[id]={name:app.querySelector('[data-option-name]')?.value?.trim()||'ตัวเลือก',price:Number(app.querySelector('[data-option-price]')?.value||0)};state.modal='';showToast('บันทึกตัวเลือกแล้ว',false);render();return;}
  if(action==='p2-option-delete'){state.optionDeleted.add(state.optionEditorId);state.modal='';showToast('ลบตัวเลือกแล้ว',false);render();return;}
  if(action==='p2-option-move'){const [group,indexText]=state.optionEditorId.split('-');const index=Number(indexText);const length=group==='topping'?3:4;const order=[...(state.optionOrder[group]||Array.from({length},(_,i)=>i))];const position=order.indexOf(index);if(position>0){[order[position-1],order[position]]=[order[position],order[position-1]];state.optionOrder[group]=order;}state.modal='';render();return;}
  if(action==='p2-add-option-group'){state.modal='option-group';render();return;}
  if(action==='p2-option-group-save'){const name=app.querySelector('[data-option-group-name]')?.value?.trim();if(name)state.customOptionGroups.push(name);state.modal='';showToast(name?'เพิ่มกลุ่มตัวเลือกแล้ว':'กรุณากรอกชื่อกลุ่ม',false);render();return;}
  if(action==='p2-delete-menu'){state.modal='delete-menu';render();return;}
  if(action==='p2-confirm-delete-menu'){state.menuDeleted.add(Number(state.menuIndex||0));state.modal='';showToast('ลบเมนูตัวอย่างแล้ว',false);navigate('M-06');return;}
  if(action==='cancel-order'){state.modal='cancel-order';render();return;}
  if(action==='confirm-cancel'){state.modal='';state.orderCancelled=true;state.screenStates['C-12']='ยกเลิกแล้ว';showToast('ยกเลิก order แล้ว · แสดงเงื่อนไขคืนเงินจำลอง',false);navigate('C-12');return;}
  if(action==='ride-pay-toggle'){state.ridePayment=state.ridePayment==='พร้อมเพย์'?'เงินสด':'พร้อมเพย์';showToast(`วิธีชำระ: ${state.ridePayment}`,false);render();return;}
  if(action==='ride-coupon'){state.rideCouponApplied=!state.rideCouponApplied;showToast(state.rideCouponApplied?'ใช้โค้ด RIDE10 แล้ว':'นำโค้ด RIDE10 ออกแล้ว',false);render();return;}
  if(action==='ride-receipt'){state.modal='ride-receipt';render();return;}
  if(action==='no-driver'){state.screenStates['C-36']='หาไรเดอร์ไม่ได้';render();return;}
  if(action==='retry-ride'){state.screenStates['C-36']='กำลังค้นหา';showToast('เริ่มค้นหาคนขับอีกครั้ง',false);render();return;}
  if(action==='merchant-cooking'){state.merchantStatus='กำลังทำ';showToast('สถานะออเดอร์: กำลังทำอาหาร',false);render();return;}
  if(action==='merchant-ready'){state.merchantStatus='พร้อมส่ง';showToast('แจ้งไรเดอร์ว่าพร้อมรับอาหารแล้ว',false);render();return;}
  if(action==='merchant-status-next'){state.merchantStatus='พร้อมส่ง';showToast('แจ้งไรเดอร์ว่าพร้อมรับอาหารแล้ว',false);render();return;}
  if(action==='merchant-handover'){state.merchantStatus='ส่งมอบไรเดอร์แล้ว';showToast('ส่งมอบ order ให้ไรเดอร์แล้ว',false);navigate('M-03');return;}
  if(action==='rider-online'){state.riderOnline=!state.riderOnline;state.screenStates['R-03']=state.riderOnline?'ออนไลน์':'ออฟไลน์';showToast(state.riderOnline?'ออนไลน์ · เริ่มรับงานได้':'ออฟไลน์ · พักรับงานแล้ว',false);render();return;}
  if(action==='toggle'){actionEl.classList.toggle('on');return;}
  if(action==='toggle-menu'){const i=Number(actionEl.dataset.menu);if(state.soldOut.has(i))state.soldOut.delete(i);else state.soldOut.add(i);showToast('อัปเดตสถานะเมนูแล้ว',false);render();return;}
  if(action==='retry'){showToast('โหลดข้อมูลตัวอย่างอีกครั้งแล้ว',false);state.screenStates[state.currentId]=STATE_OPTIONS[state.currentId]?.[0]||'มีข้อมูล';render();return;}
  if(action==='toast-demo'){showToast('บันทึกการเปลี่ยนแปลงแล้ว',false);return;}
  if(action==='chat-target'){state.chatTarget=actionEl.dataset.target||'ไรเดอร์';render();return;}
  if(action==='show-closed'){state.screenStates['C-04']='ร้านปิด';navigate('C-04');return;}
  if(action==='passenger-cash'){state.cashCollected=!state.cashCollected;showToast(state.cashCollected?'เปลี่ยนเป็นเก็บเงินสด ฿86':'เลือกพร้อมเพย์เป็นวิธีชำระ',false);render();return;}
  if(action==='stop-detail'){state.modal='sheet';render();return;}
  if(action==='sheet-demo'){state.modal='sheet';render();return;}
  if(action==='toast-call'){showToast('จำลองการโทร · เบอร์โทรถูกปกปิด',false);return;}
  if(action==='toast-upload'){showToast('จำลองการแนบรูป · ไฟล์อัปโหลด 100%',false);return;}
  if(action==='toast-location'||action==='allow-location'){if(state.currentId==='A-07'){state.permissionStep=1;showToast('อนุญาตตำแหน่งในตัวอย่างแล้ว',false);render();}else showToast('อนุญาตตำแหน่งในตัวอย่างแล้ว',false);return;}
  if(action==='allow-notifications'){if(state.currentId==='A-07'){state.permissionStep=2;showToast('เปิดการแจ้งเตือนตัวอย่างแล้ว',false);navigate('C-01');}else showToast('เปิดการแจ้งเตือนตัวอย่างแล้ว',false);return;}
  if(action==='line-login'){showToast('LINE login เป็นตัวอย่าง ยังไม่เชื่อม provider',false);return;}
  if(action==='resend-otp'){if(actionEl.disabled)return;showToast('ส่งรหัสตัวอย่าง 123456 อีกครั้ง',false);startOtpCountdown();return;}
  if(action==='save-profile'||action==='save-merchant'||action==='save-menu'||action==='save-options'){showToast('บันทึกข้อมูลตัวอย่างแล้ว',false);return;}
  if(action==='toast-next-step'){showToast('บันทึกข้อมูลร้านแล้ว · ขั้นถัดไปตรวจเอกสาร',false);navigate('M-02');return;}
  if(action==='toast-application'){showToast('ใบสมัครตัวอย่าง · ตรวจสอบภายใน 1–2 วันทำการ',false);return;}
  if(action==='toast-otp'){showToast('ส่ง OTP ยืนยันเบอร์โทรแล้ว (ตัวอย่าง)',false);return;}
  if(action==='sync-menu'){showToast('ซิงก์เมนูตัวอย่างสำเร็จ · 18 รายการ',false);return;}
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
  if(action==='start-passenger-trip'){showToast('เริ่มเดินทาง · ไม่มีงานอื่นเข้าในช่วงนี้',false);return;}
  if(action==='share-trip'){showToast('คัดลอกลิงก์แชร์การเดินทางตัวอย่างแล้ว',false);return;}
  if(action==='tip'){showToast('เพิ่มทิปตัวอย่าง ฿20 แล้ว',false);return;}
  if(action==='submit-rating'){showToast(`ส่งคะแนน ${state.rating} ดาวแล้ว ขอบคุณที่รีวิว`,false);navigate('C-01');return;}
  if(action==='rate'){state.rating=Number(actionEl.dataset.value);showToast(`เลือก ${state.rating} ดาว`,false);return;}
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
  if(action==='toast-booking'){showToast('ส่งคำขอจองตัวอย่างแล้ว · ผู้ให้บริการจะยืนยันกลับ',false);return;}
  if(action==='retry'){showToast('ลองโหลดข้อมูลอีกครั้งแล้ว',false);return;}
});

app.addEventListener('change',(event)=>{
  if(event.target.matches('[data-state-select]')){setState(event.target.value);return;}
  if(event.target.matches('[data-screen-select]')){navigate(event.target.value);return;}
  if(event.target.matches('[data-task-type]')){state.taskType=event.target.value==='passenger'?'passenger':'food';showToast(state.taskType==='passenger'?'เลือกงานรับส่งคนแล้ว':'เลือกงานส่งอาหารแล้ว',false);render();return;}
  if(event.target.matches('[name="cancel-reason"]')){state.cancelReason=event.target.value;render();return;}
  if(event.target.matches('[data-rider-type]')){state.riderTypes[event.target.dataset.riderType]=event.target.checked;if(!state.riderTypes.food&&!state.riderTypes.passenger){state.riderTypes[event.target.dataset.riderType]=true;showToast('เลือกประเภทรถอย่างน้อยหนึ่งประเภท',false);}render();return;}
  if(event.target.matches('[data-tip-custom]')){state.tipAmount=Math.max(0,Number(event.target.value||0));return;}
  if(event.target.matches('[data-theme-choice]')){setTheme(event.target.value);return;}
  if(event.target.matches('[data-action="vehicle-select"]')){state.selectedVehicle=event.target.value;render();return;}
  if(event.target.matches('input[name="vehicle"]')){state.selectedVehicle=event.target.value;render();}
});
app.addEventListener('input',(event)=>{if(event.target.matches('[data-search]'))applyListFilter();if(event.target.matches('[data-menu-search]')){const query=event.target.value.trim().toLocaleLowerCase('th-TH');app.querySelectorAll('.menu-row[data-category]').forEach(row=>row.hidden=!row.textContent.toLocaleLowerCase('th-TH').includes(query));}});
app.addEventListener('keydown',(event)=>{
  if(event.target.matches('input[aria-label^="เลข OTP"]')&&event.key.length===1){const next=event.target.nextElementSibling;if(next?.matches('input'))next.focus();}
  if(event.target.matches('[data-search]')&&event.key==='Enter'){showToast(`แสดงผลค้นหา: ${event.target.value||'ร้านใกล้คุณ'}`,false);}
  if(event.key==='Escape'&&state.modal){state.modal='';render();}
});
window.addEventListener('hashchange',syncRoute);
window.addEventListener('popstate',syncRoute);

syncRoute();
