// Shared mockup state + render context. Used by the live app (app.js) and by the static Figma board (board.js).
import { ROLE_META, STATE_OPTIONS } from "./data/screens.js";
import { MENU } from "./data/content.js";
import { bottomNav } from "./ui/components.js";
import { NOTIF_DEFAULT_PREFS, NOTIF_SEED } from "./data/notifications.js";
import { PHASE_FROM_MERCHANT, trackingView } from "./data/order-status.js";

export const safeGet=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
export const HOME_PALETTES = Object.freeze([
  { id: 'aurora', name: 'Aurora', subtitle: 'ม่วง · ฟ้า · มิ้นต์', swatches: ['#5945C7','#3274D6','#9B5A07','#146E54'] },
  { id: 'lagoon', name: 'Lagoon', subtitle: 'ทีล · คราม · ฮันนี่', swatches: ['#0B7478','#265F8B','#965707','#17664A'] },
  { id: 'rosewood', name: 'Rosewood', subtitle: 'เบอร์รี · สเลต · เซจ', swatches: ['#B34C67','#365B9D','#995903','#27684C'] },
  // Appetite palettes (warm food hues) — research notes in ai-collab/DECISIONS.md D-027
  { id: 'saffron', name: 'Saffron', subtitle: 'ส้มหญ้าฝรั่น · พริก · ใบมะกรูด', swatches: ['#C2410C','#B42318','#A16207','#3F7D3A'] },
  { id: 'chili', name: 'Chili', subtitle: 'แดงพริกแกง · ส้ม · มะนาว', swatches: ['#C0391B','#C2410C','#A16207','#3F7D3A'] }
]);
export const homePalette=()=>{const v=safeGet('rma-home-palette','aurora');return HOME_PALETTES.some(p=>p.id===v)?v:'aurora';};
const storedTheme=safeGet('rma-theme','light');
const systemTheme=()=>globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches?'dark':'light';
const initialTheme=storedTheme==='system'?systemTheme():storedTheme==='dark'?'dark':'light';
export const getRole=(id)=>['A','C','M','R','S'].includes(id?.slice(0,1))?id.slice(0,1):'C';
export const createState=()=>({
  currentId:location.hash.match(/#\/(.*)/)?.[1]||"A-01", previousId:"", theme:initialTheme, themePreference:storedTheme, reviewRole:"C",
  screenStates:{}, cart:[{menuIndex:0,qty:1,note:"เผ็ดน้อย · ไม่ใส่ผักชี"},{menuIndex:1,qty:1,note:"ไม่ใส่ผักชี"}], menuIndex:0, menuQty:1, coupon:"", discount:0, menuDeleted:new Set(),
  merchantStatus:"กำลังทำ", merchantOpen:true, riderOnline:false, orderCancelled:false, selectedVehicle:"economy",
  activeFlow:null, flowIndex:0, toast:"", modal:"", storeHidden:false, messageCount:0, chatMessages:{}, rating:5, soldOut:new Set([3]), chatTarget:"ไรเดอร์", taskType:"food", cashCollected:false, ridePayment:"พร้อมเพย์ QR", rideCouponApplied:false,
  hasBundle:false, orderMenuOpen:false, paymentMethod:"พร้อมเพย์ QR", paymentTarget:"order", cancelReason:"เปลี่ยนใจ", tipAmount:0, tipCustom:false, editCartIndex:null,
  ridePaid:false, ridePickup:"", rideDestination:"",
  historyFilter:"ทั้งหมด", historyService:"ทั้งหมด", messageTab:"แชท", merchantSignupStep:0, riderSignupStep:0, riderTypes:{food:true,passenger:false}, riderDocs:[],
  rideStep:0, rideStage:"coming", proofTaken:false, offerKind:"food", menuExtras:[], menuChoice:-1, savedCoupons:new Set(), reasonKind:"", dialogKind:"", issueType:"ได้รับอาหารไม่ครบ", payOutcome:"success", appLang:safeGet('rma-lang','th')==='en'?'en':'th', soundOn:true, dealFilter:"ทั้งหมด", shopPause:"",
  prepMinutes:20, reportRange:"7 วัน", chartValue:0, optionRequired:true, optionDeleted:new Set(), optionOverrides:{}, optionOrder:{}, customOptionGroups:[], optionEditorId:"", promoPaused:[], promoCreateMode:false, claimStep:0, historyDetailText:"", favoriteStores:new Set(), permissionStep:0, keyboardOpen:false, otpStatus:"idle", searchKind:"all",
  notifs:NOTIF_SEED(), notifPrefs:NOTIF_DEFAULT_PREFS(), banner:null, trackPhase:null, shopDelay:false, notifSeq:0, clockMinute:40
});

export function helpers(state){
  const currentState=(id)=>state.screenStates[id] || STATE_OPTIONS[id]?.[0] || 'มีข้อมูล';
  const unitPrice=(item)=>(MENU[item.menuIndex]?.price||0)+(item.extra||0);
  const subtotal=()=>state.cart.reduce((sum,item)=>sum+unitPrice(item)*item.qty,0);
  const extrasTotal=()=>(state.menuExtras||[]).reduce((sum,i)=>sum+(extraPrice(MENU[state.menuIndex]?.extra?.[i])),0);
  const extraPrice=(label='')=>Number((String(label).match(/\+(\d+)/)||[])[1]||0);
  const nav=(role)=>bottomNav(role,state.currentId);
  return { currentState, unitPrice, subtotal, extrasTotal, extraPrice, nav };
}

export function buildCtx(state){
  const { currentState, unitPrice, subtotal, extrasTotal, nav } = helpers(state);
  const phase=state.trackPhase||PHASE_FROM_MERCHANT[state.merchantStatus]||"accepted";
  const track=trackingView(phase,state.orderCancelled);
  const orderLabel=track.label,orderStep=track.done,orderSteps=track.steps;
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
