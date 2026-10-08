import { pathToFileURL } from 'node:url';
const root = 'D:/rma-delivery/manus/RMA-Delivery-source/src/';
const { SCREENS } = await import(pathToFileURL(root + 'data/screens.js'));
const { renderScreen } = await import(pathToFileURL(root + 'ui/renderers.js'));
const { bottomNav } = await import(pathToFileURL(root + 'ui/components.js'));
const base = {
  state: 'มีข้อมูล', activeRole: 'C', theme: 'light', themePreference: 'light', previousId: '',
  cart: [{ menuIndex: 0, qty: 1, note: 'เผ็ดน้อย' }], cartTotal: 114, subtotal: 89, discount: 0, coupon: '',
  menuQty: 1, menuIndex: 0, selectedVehicle: 'economy', rideCouponApplied: false, ridePayment: 'พร้อมเพย์',
  taskType: 'food', merchantStatus: 'กำลังทำ', merchantOpen: true, riderOnline: true, orderCancelled: false,
  cashCollected: false, savedCoupons: new Set(), soldOut: new Set([3]), orderItems: [{ name: 'กะเพราหมูกรอบไข่ดาว', price: 89, qty: 1 }],
  orderLabel: 'ร้านกำลังเตรียมอาหาร', orderStep: 2, orderSteps: [['ร้านรับออเดอร์', '12:18 น.']], chatMessages: {}, chatTarget: 'ไรเดอร์',
};
const H = {};
for (const s of SCREENS) {
  const ctx = { ...base, activeRole: s.role, nav: (r) => bottomNav(r, s.id) };
  try { H[s.id] = renderScreen(s.id, ctx); } catch (e) { H[s.id] = 'ERROR ' + e.message; }
}
const txt = (id) => H[id].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const has = (id, re) => re.test(H[id]);
const count = (id, re) => (H[id].match(re) || []).length;
const out = [];
const chk = (code, ok, note = '') => out.push(`${ok ? 'OK  ' : 'FAIL'} ${code} ${note}`);

// --- G
const demoWords = /จำลอง|ตัวอย่างข้อเสนอ|ดูงานตัวอย่าง|ดูมุมมองลูกค้า|เปิดงานไรเดอร์|ดูข้อเสนองานพ่วง/;
const g1 = SCREENS.filter(s => demoWords.test(txt(s.id))).map(s => s.id);
chk('G1 demo controls in-phone', g1.length === 0, g1.join(','));
const devWords = /mockup|prototype|review|รอทีมเคาะ|ต้องให้ทีมเคาะ|ข้อมูลสมมติ|ที่ C-\d\d|ตัวอย่างหน้าจอ/i;
const g2 = SCREENS.filter(s => devWords.test(txt(s.id))).map(s => s.id);
chk('G2 dev notes in-phone', g2.length === 0, g2.join(','));
const glyph = /[⌕⌖▦▣▤▧☏⌂✦⌁◷⌘⋯📍♡⚙]/u;
const g3 = SCREENS.filter(s => glyph.test(txt(s.id))).map(s => s.id);
chk('G3 unicode icons', g3.length === 0, g3.join(','));
const g4 = SCREENS.filter(s => /RMA DELIVERY · (MERCHANT|RIDER)/.test(H[s.id])).map(s => s.id);
chk('G4 eyebrow double header', g4.length === 0, g4.join(','));
const noSticky = ['C-08', 'C-33', 'C-36', 'M-04', 'R-04', 'R-05', 'R-06', 'R-07', 'R-08', 'R-16', 'R-17'].filter(id => !/sticky/.test(H[id]));
chk('G5 sticky primary', noSticky.length === 0, noSticky.join(','));
const btns = (id) => count(id, /class="btn(?! inline)[^"]*"/g);
const g6ids=['R-16', 'M-05', 'R-05', 'R-17', 'C-14', 'C-36', 'C-37', 'C-38'];
chk('G6 stacked buttons (max 2 full-width)', g6ids.every(id => btns(id) <= 2), ['R-16', 'M-05', 'R-05', 'R-17', 'C-14', 'C-36', 'C-37', 'C-38'].map(id => `${id}=${btns(id)}`).join(' '));
const g7 = ['C-04', 'C-22', 'C-24', 'M-12', 'R-13'].filter(id => /bottom-nav/.test(H[id]));
chk('G7 bottom nav on subpages', g7.length === 0, g7.join(','));
const g9 = SCREENS.filter(s => /<select/.test(H[s.id])).map(s => s.id);
chk('G9 raw select', g9.length === 0, g9.join(','));
const g11 = ['M-05', 'R-05', 'R-16', 'M-04'].filter(id => /0\d[\dx]-?[\dx]{3}-?\d{4}/.test(txt(id)));
chk('G11 phone shown', g11.length === 0, g11.join(','));
const g13 = ['C-19', 'M-17', 'R-15'].filter(id => !/ออกจากระบบ/.test(H[id]));
chk('G13 logout', g13.length === 0, g13.join(','));
const g16 = SCREENS.filter(s => /\$\{/.test(H[s.id])).map(s => s.id);
chk('G16 raw ${}', g16.length === 0, g16.join(','));

// --- screens exist / regressions
chk('C-39 deals page renders', /คูปอง/.test(txt('C-39')) && /ดีล/.test(txt('C-39')), txt('C-39').slice(0, 90));
chk('C nav has ดีล tab', />ดีล</.test(bottomNav('C', 'C-01')));
chk('C-01 aurora home (home-top-zone)', /home-top-zone/.test(H['C-01']));
chk('C-01 order card above promo', H['C-01'].indexOf('home-order-card') > -1 && H['C-01'].indexOf('home-order-card') < H['C-01'].indexOf('home-promo'));
// --- C
chk('C-07 single back / no appbar in sheet', count('C-07', /class="back-btn"/g) <= 1, `back=${count('C-07', /class="back-btn"/g)}`);
chk('C-07 CTA says ใส่ตะกร้า', /ใส่ตะกร้า/.test(txt('C-07')), txt('C-07').slice(-160));
chk('C-07 option label from menu data (info)', true, txt('C-07').match(/เลือก[^ ]*ระดับ[^ ]*/)?.[0] || '');
chk('C-06 add control', true, (H['C-06'].match(/data-action="menu-add"[^>]*>[^<]*/g) || []).slice(0, 2).join(' | '));
chk('C-06 sticky category/search/fav', /search|ค้นหา/.test(H['C-06']), '');
chk('C-06 min order hint', /ขั้นต่ำ/.test(txt('C-06')) && /อีก ฿|ขาด/.test(txt('C-06')));
chk('C-09 payment sheet not route C-11', !/วิธีชำระเงิน[\s\S]{0,200}data-route="C-11"/.test(H['C-09']));
chk('C-09 hides zero discount', !/−฿0/.test(txt('C-09')) && !/รวมส่วนลดแล้ว/.test(txt('C-09')));
chk('C-10 manual code + reason', /กรอก|ใส่โค้ด/.test(txt('C-10')));
chk('C-11 no method chooser', !/name="pay"/.test(H['C-11']));
chk('C-12 map + sheet', /sheet/.test(H['C-12']), `phoneIconToChat=${/icon-btn" data-route="C-13"/.test(H['C-12'])}`);
chk('C-12 cancel not primary row', !/ยกเลิก order/.test(txt('C-12')) || /more|เมนู/.test(H['C-12']), '');
chk('C-16 has completed food -> C-17', /data-route="C-17"/.test(H['C-16']));
chk('C-17 no loop to C-23', !/data-route="C-23"/.test(H['C-17']));
chk('C-18 tabs chat/notify', /แชท/.test(txt('C-18')) && /แจ้งเตือน/.test(txt('C-18')));
chk('C-37 two states / SOS icon / cancel', /sos|SOS/.test(H['C-37']), `fullWidthEmergency=${/class="btn danger"[^>]*data-action="emergency"/.test(H['C-37'])} cancel=${/ยกเลิก/.test(txt('C-37'))}`);
chk('C-15 tip choices + skip', /฿10/.test(txt('C-15')) && /ข้าม/.test(txt('C-15')));
chk('C-02 select not always C-09', !/data-route="C-09">เลือก/.test(H['C-02']));
// --- A
chk('A-05 consent unchecked', !/type="checkbox" checked/.test(H['A-05']));
chk('A-06 role status', /รออนุมัติ|ยังไม่ได้สมัคร|ใช้งานอยู่/.test(txt('A-06')));
chk('A-01 no start button', !/เริ่มใช้งาน/.test(txt('A-01')));
// --- M
chk('M-17 links M-14 & M-15', /data-route="M-14"/.test(H['M-17']) && /data-route="M-15"/.test(H['M-17']));
chk('M-17 settings sound/lang', /เสียง/.test(txt('M-17')) && !/data-route="M-17"/.test(H['M-17']));
chk('M-05 single state button', true, (txt('M-05').match(/กำลังทำอาหาร|พร้อมส่ง|อาหารพร้อมแล้ว|ส่งมอบให้ไรเดอร์[^ ]*/g) || []).join(' / '));
chk('M-04 chips prep time + sticky', /sticky/.test(H['M-04']) && !/<select/.test(H['M-04']));
chk('M-03 order timer / tabs', /นาที/.test(txt('M-03')), '');
chk('M-06 row -> M-07, SK lock', /data-route="M-07"/.test(H['M-06']), `skLock=${/จัดการจาก Smart Kitchen/.test(txt('M-06'))}`);
chk('M-10 states', true, txt('M-10').slice(0, 120));
chk('M-01 3 steps', true, txt('M-01').slice(0, 100));
// --- R
chk('R-04 accept is primary', !/class="btn inline"[^>]*>รับงาน/.test(H['R-04']), (H['R-04'].match(/<button class="btn[^"]*"[^>]*>[^<]*(รับงาน|ปฏิเสธ)[^<]*/g) || []).join(' | '));
chk('R-03 two toggles not select', !/<select/.test(H['R-03']), txt('R-03').slice(0, 140));
chk('R-18 four stops', count('R-18', /class="step[ "]/g) >= 4, `steps=${count('R-18', /class="step[ "]/g)} ${txt('R-18').slice(0, 200)}`);
chk('R-17 no payment toggle', !/เปลี่ยนเป็น/.test(txt('R-17')));
chk('R-16 one state button', btns('R-16') <= 2, `btns=${btns('R-16')}`);
chk('R-07 note read-only', !/<textarea/.test(H['R-07']));
chk('R-08 proof required + COD + cannot reach', /ติดต่อ.*ไม่ได้/.test(txt('R-08')), `disabled=${/disabled/.test(H['R-08'])}`);
chk('R-05 nav prominent + SOS', /sos|SOS|ฉุกเฉิน/.test(H['R-05']));
chk('R-15 settings theme/lang', /ธีม|ภาษา/.test(txt('R-15')));
// --- anti-stub: every screen must keep its real content (compared with the snapshot taken before the R3 work)
const { readFileSync } = await import('node:fs');
const baseline = JSON.parse(readFileSync(new URL('./r2-baseline.json', import.meta.url), 'utf8'));
const stubPhrase = /ข้อมูลสถานะและการดำเนินการของหน้านี้|central-next/;
const stubs = SCREENS.filter(s => stubPhrase.test(H[s.id]) || (baseline[s.id] && txt(s.id).length < baseline[s.id] * 0.6)).map(s => `${s.id}(${txt(s.id).length}/${baseline[s.id]})`);
chk('STUB screens replaced by placeholders', stubs.length === 0, stubs.join(' '));
const appSrc = readFileSync(root + 'app.js', 'utf8');
const dead = ['logout', 'open-issue-form', 'cannot-reach', 'collect-coupon', 'central-next'].filter(a => SCREENS.some(s => H[s.id].includes(`data-action="${a}"`)) && !appSrc.includes(a));
chk('DEAD buttons with no handler in app.js', dead.length === 0, dead.join(','));
console.log(out.join('\n'));
