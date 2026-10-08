# งาน R1 — outcomes

> **สถานะ:** implement ครบ 81 screens รวม C-39; syntax และ render smoke ผ่าน 81/81 หน้า; static build ได้ 82 routes; route-link assertions ผ่าน 184 links; C-06 menu UX assertion ผ่าน: “เพิ่ม”, +/- quantity, modifier note และ sticky cart summary; browser screenshot ยืนยัน compact app bar. Full browser visual QA และ **publish ยังบล็อก**โดย environment/Managed Git credential (`SEC_E_NO_CREDENTIALS`) — ยังไม่มี checkpoint หรือ permanent URL.
> **ค้างก่อนปิดงานทั้งหมด:** แก้สิทธิ/credential ของ WebDev Managed Git, ตรวจ fetch canonical main, สร้าง checkpoint, publish และ post-deploy browser check. อย่าใช้ local preview URL แทนลิงก์ถาวร.

## 1. ชุด component กลาง, review panel และระบบ theme
- ทำชุด component กลางก่อนหน้าจอ: button, input, card, app bar, bottom navigation, bottom sheet, snackbar, dialog และ status badge; รองรับปุ่ม/input ทุกสถานะ (ปกติ, กด, loading, disabled, focus, error).
- สร้าง CSS variables สำหรับทุกสีและ design token พร้อม light/dark theme และปุ่มสลับที่ใช้ได้ทุกหน้า; พิจารณา dark mode อย่างละเอียดใน C-01, C-06, C-12, M-03, R-03, R-05.
- แสดง phone frame กว้าง 390px กลางจอ desktop; บนมือถือจริงใช้เต็มจอ; ใช้ภาษาไทย; contrast ตาม WCAG AA; touch target อย่างน้อย 48px; bottom navigation ไม่เกิน 5 แท็บต่อ role; ไม่ใช้ liquid glass/glassmorphism; ไม่มีโลโก้ ใช้ข้อความ RMA Delivery.
- ทำ review panel นอกมือถือ มีสารบัญเลือก role และรายการหน้าทุกหน้าพร้อมรหัส, ทางลัด flow ทุกเส้นที่กำหนด, รหัสหน้าปัจจุบันตลอดเวลา, light/dark switch, state selector สำหรับหน้าที่มี fixtures หลายสถานะ; บนมือถือให้เป็นปุ่มลอยเปิด panel.
- ใช้ CSS responsive สำหรับ 320px ขึ้นไปและเนื้อหาไทยยาว; เคารพ safe area; ปุ่มหลักอยู่ล่าง; หน้าย่อยมี back; keyboard mockup ไม่บัง input/CTA ใน A-03, C-03, M-07; reduced motion.

## 2. หมวด A — เข้าระบบ (A-01 ถึง A-07)
- ทำ Splash/session, เลือกภาษา/แนะนำแอป, เบอร์โทร/LINE option, OTP 6 หลักพร้อมนับถอยหลัง/ส่งใหม่, ลงทะเบียนชื่อและยินยอม, เลือก/สลับ role และสมัคร role, อธิบาย permission ก่อนจำลอง location/notification.
- ทุกหน้ามี action และ route ที่เชื่อมต่อได้; ฟอร์มพิมพ์ได้; แสดง keyboard-open state อย่างน้อย A-03; ทำ flow A-01 → A-02 → A-03 → A-04 → A-05 → A-07 → C-01.

## 3. หมวด C — ลูกค้า (C-01 ถึง C-24 และ C-30 ถึง C-38)
- ทำครบ: C-01 หน้าหลัก; C-02 เลือกที่อยู่; C-03 ปักหมุด/รายละเอียดที่อยู่; C-04 รวมอาหารและตัวกรอง; C-05 ค้นหา; C-06 หน้าร้าน/เมนู/เมนูหมด/ตะกร้า; C-07 รายละเอียดเมนู/ตัวเลือก/ท็อปปิ้ง/หมายเหตุ/จำนวน; C-08 ตะกร้าแก้จำนวนและราคา; C-09 checkout/ที่อยู่/ชำระ/ส่วนลด/หมายเหตุ/สรุปยอด; C-10 เลือกโค้ด; C-11 PromptPay QR/บัตร/เงินสด/ผลสำเร็จและล้มเหลว; C-12 ติดตาม order/แผนที่/ไรเดอร์/งานพ่วง/ETA/โทร-แชท/รายการ; C-13 แชทกับร้านหรือไรเดอร์/ข้อความสำเร็จรูป/ส่งรูปจำลอง; C-14 ยกเลิก/เหตุผล/การคืนเงินจำลอง; C-15 ส่งสำเร็จ/คะแนน/ทิป; C-16 ประวัติแยกบริการและสถานะ; C-17 รายละเอียด/ใบเสร็จ/สั่งอีกครั้ง/แจ้งปัญหา; C-18 กล่องข้อความ; C-19 บัญชี/role switch; C-20 แก้ไขข้อมูล/ยืนยันเบอร์/ลบบัญชีจำลอง; C-21 จัดการที่อยู่; C-22 theme/language/notification; C-23 FAQ/ติดต่อ; C-24 ร้านโปรด.
- ทำกลุ่ม phase ถัดไป C-30 สร้างงานส่งของ; C-31 รายการ/รายละเอียดบริการ; C-32 จองวันและเวลา; C-34 ติดตามส่งของ/บริการ พร้อมป้าย phase ถัดไป.
- ทำ MVP ride flows: C-33 จุดรับ/ปลายทาง/ที่อยู่/แผนที่; C-35 ประเภทรถหลายชนิด ราคา จำนวนที่นั่ง เวลารอ วิธีชำระ/ส่วนลด; C-36 กำลังหาคนขับ/ยกเลิก/ไม่พบ/ลองใหม่; C-37 ข้อมูลคนขับ/ทะเบียน/คะแนน/ETA/โทร/แชท/แชร์/ฉุกเฉิน; C-38 ถึงปลายทาง/สรุปค่าโดยสาร/ชำระ/คะแนน/ทิป/ใบเสร็จ.
- Flow อาหารต่อเนื่อง C-01 → C-04 → C-06 → C-07 → C-08 → C-09 → C-11 → C-12 → C-15; flow เรียกรถ C-01 → C-33 → C-35 → C-36 → C-37 → C-38.
- ตะกร้าเพิ่ม/ลดรายการได้และยอดในหน้าตะกร้าเปลี่ยน; mock payment/order buttons เปลี่ยนหน้าหรือสถานะได้; มีกรณีเมนูหมด, ร้านปิด, ยกเลิก, ชำระไม่สำเร็จ, หาไรเดอร์ไม่ได้.

## 4. หมวด M — ร้านค้า (M-01 ถึง M-17)
- ทำครบ: M-01 สมัครหลายขั้นข้อมูลร้าน/เอกสาร/บัญชี; M-02 รออนุมัติและเอกสารถูกตีกลับ/สิ่งที่ต้องแก้; M-03 order dashboard พร้อมเปิดปิดร้านและแท็บสถานะ; M-04 order ใหม่เต็มจอ/นับถอยหลัง/รับหรือปฏิเสธ/เวลาเตรียม; M-05 รายละเอียดรายการ/หมายเหตุ/พร้อมส่ง/ส่งมอบ/โทรแชท/แจ้งของหมด; M-06 เมนู/หมวด/ขายหมด/เรียง; M-07 เพิ่มแก้เมนู/ชื่อ/ราคา/รูป/หมวด/ตัวเลือก; M-08 กลุ่มตัวเลือก/บังคับเลือก/ราคาเพิ่ม; M-09 ข้อมูลร้าน/ที่อยู่/หมุด/เวลา/วันหยุด; M-10 เชื่อม Smart Kitchen/ดึงเมนู/sync/ยกเลิกเชื่อม; M-11 บัญชีรับเงิน/รอบโอน; M-12 กระเป๋า/ยอดรอโอน/ประวัติ/ค่าธรรมเนียม; M-13 รายงานยอดขาย/เมนูขายดี/order ยกเลิก; M-14 รีวิวและตอบกลับ; M-15 โปรโมชัน; M-16 ช่วยเหลือ/เคลม/ติดตาม; M-17 บัญชี/ตั้งค่า/role switch.
- แสดง keyboard-open state ที่ M-07; ฟอร์มแก้ไขได้; ปุ่มร้านอาหารใช้งานได้ใน mock.
- ทำ flow ร้าน M-04 → M-05 (กำลังทำ → พร้อมส่ง → ส่งมอบไรเดอร์) → M-03 และแสดงผลสถานะ order ที่เปลี่ยน.

## 5. หมวด R — ไรเดอร์/คนขับ (R-01 ถึง R-18)
- ทำครบ: R-01 เลือกประเภทงาน/ข้อมูล/รถ/เอกสารสมมติ/บัญชี; R-02 รออนุมัติ/ถูกตีกลับ; R-03 ออนไลน์/ออฟไลน์/ประเภทงาน/แผนที่/รายได้/จำนวนงาน; R-04 offer งานอาหาร/รับส่งคน/งานพ่วง/ระยะเพิ่ม/ค่าตอบแทน/นับถอยหลัง; R-05 ไปรับ/แผนที่/นำทาง/ร้าน/โทร/แชท; R-06 ตรวจ order/รายการ/ยืนยันรับ/ถ่ายรูปจำลอง; R-07 ไปส่ง/หมายเหตุ/โทร/แชท; R-08 ยืนยันสำเร็จ/หลักฐาน/เก็บเงิน; R-09 สรุปงาน/รายได้/ทิป/งานถัดไป; R-10 ประวัติ; R-11 รายได้/ถอน/เงินสด; R-12 รายงาน/อัตรารับงาน/คะแนน/incentive; R-13 ข้อมูลและรถ/เอกสารหมดอายุ; R-14 ช่วยเหลือ/ฉุกเฉิน; R-15 บัญชี/ตั้งค่า/role switch; R-16 รับผู้โดยสาร/ข้อมูล/โทรแชท/ผู้โดยสารไม่มา; R-17 เดินทาง/ถึงปลายทาง/จบงาน/เงินสด/ฉุกเฉิน; R-18 ลำดับจุดแวะของงานพ่วงทุก order.
- คนขับตัวอย่างคนเดียวทำงานได้ทั้งสองประเภทแต่ไม่พร้อมกัน; ระหว่างงานรับส่งคนไม่มีงานอื่นเข้า; ระหว่างส่งอาหารมีงานพ่วงอาหารเพิ่มได้; รถส่งอาหารเป็นมอเตอร์ไซค์และรถรับคนหลายประเภทหลายราคา.
- ทำ flow อาหาร R-03 → R-04 → R-05 → R-06 → R-07 → R-08 → R-09; งานพ่วง R-05 → R-04 → R-18 → R-06 → R-07 → R-08 → R-09; งานรับส่งคน R-03 → R-04 → R-16 → R-17 → R-09; สมัครร้าน/ไรเดอร์และสลับ role ตาม flow ที่กำหนด.

## 6. หมวด S — state showcase (S-01 ถึง S-05)
- S-01 Empty state ตามบริบท; S-02 Error/เน็ตหลุดพร้อม retry; S-03 skeleton loading สำหรับรายการร้าน/หน้าร้าน/รายละเอียด; S-04 Snackbar/Dialog/Bottom sheet มาตรฐาน; S-05 ปุ่มทุก state และ input ทุก state.
- หน้าหลักของแต่ละ flow มีข้อมูล/loading/empty/error ผ่าน state selector ตามความเหมาะสม; หน้าที่เหลืออย่างน้อยมี populated state.

## 7. ไฟล์และการเผยแพร่
- URL ของทุกหน้าระบุรหัสใน hash เช่น `/#/C-06`; แชร์ URL แล้วเปิดหน้าเดิมได้.
- สร้าง `tokens-draft.md` เป็นตาราง token | ค่า light | ค่า dark | ใช้เมื่อไหร่ และค่าต้องตรงกับ CSS variables.
- สร้าง `REVIEW-NOTES.md` มีทิศทางดีไซน์และเหตุผล 3–5 บรรทัด; ตารางรหัสหน้า/สมมติฐาน/สิ่งที่ทีมต้องเคาะ; หน้าที่เพิ่ม/รวม/เสนอให้ตัดเทียบ SCREENS.md; bottom navigation ทุก role และตำแหน่ง/เหตุผลสลับ role; คำถามถึง Claude (เทคนิค) และเจ้าของ (ธุรกิจ).
- ส่ง source code ทั้งโปรเจกต์เป็น zip; publish เว็บไซต์และส่งลิงก์ถาวรที่สำเร็จ ห้ามใช้ sandbox URL ชั่วคราวแทนลิงก์ที่ publish แล้ว.


## Credential follow-up (7 ตุลาคม 2569)
- `webdev.config GET` ระบุ Manus provider, static build `dist/`, `auto_publish=false`; ไม่มี live deployment.
- Managed Git fetch ปกติแจ้ง `SEC_E_NO_CREDENTIALS`; diagnostic ครั้งเดียวชี้ว่า Host `__addon_git_credential` helper ถูกปฏิเสธ `Permission denied` และไม่มี `/dev/tty` สำหรับ interactive fallback. ไม่ยืนยันว่า password/token ของผู้ใช้ผิด; ไม่อ่าน/ไม่ขอ secret.
- ค้าง: ให้ Manus Desktop/WebDev Host helper ทำงานได้ก่อน แล้วจึง fetch, checkpoint, publish และ post-deploy verify. ห้ามแก้ ACL/ส่ง credential/ข้าม Host transport.


## 8. Aurora visual refinement pass (7 ต.ค. 2569)
- [x] ใช้ Aurora เป็นพื้นฐานดีไซน์ร่วมกับ surface/card gradient, typography, spacing, control states, shadows และ Material Symbols Rounded สำหรับ shared navigation/state iconography.
- [x] รักษาภาพอาหารไว้เฉพาะ background zone เดิมของ C-01 และเยื้องไปทางขวา; ไม่เพิ่ม card และไม่เปลี่ยนภาพให้เป็น full-screen.
- [x] แยก brand accent ภายใน phone: Customer Plum, Merchant deep teal, Rider blue; คง semantic status colors.
- [x] ตรวจ JS syntax ทุกโมดูล, render routes 81/81, CSS bracket balance, icon subset coverage และ role accent contrast pairs.
- [x] เพิ่ม C-39 ใน metadata, review panel, route manifest และ bottom navigation; คง C-01 → C-04 สำหรับทางเข้าร้าน/ค้นอาหาร.
- [x] แก้ spacing/layout กลางและ C-35, ตัด back ซ้ำ M-07/M-08, ต่อ Merchant → Rider → Customer และเพิ่ม history back stack.
- [ ] Browser visual QA เต็มชุดสำหรับ C-01 light/dark, C-06, C-12, M-03, R-03, R-05 และ viewport 390/320px; spot-check navigation/back ผ่านแล้ว แต่ยังไม่รายงาน visual pass ครบทุกหน้าจอ.


## 9. R2 UX/UI pass — 8 ต.ค. 2569
- [x] G4/G6: compact header/sheet, sticky primary CTA, ลด action ซ้ำ และ SOS icon ใน flow ที่แตะแล้ว.
- [x] G10/G11/G13: confirmation dialog, ซ่อนเบอร์โทรในงาน, ออกจากระบบ/เอกสารใน account screens.
- [x] Food P1 ชุดหลัก: C-06 → C-07 → C-08 → C-09 → C-11 → C-12; C-16 → C-17 และ report modal ไม่วน C-23.
- [x] Rider/merchant P1 ชุดหลัก: M-04/M-05, R-03/R-04/R-05, R-16/R-17, R-18.
- [ ] P1 นอกชุดหลักยังค้าง: A-05/A-06, C-01/C-37 full state, M-03/M-04/M-06/M-10/M-14/M-15, R-06/R-07/R-08 และข้อ P1 ที่เหลือใน `ai-collab/to-manus.md`; ทำให้ครบก่อนเริ่ม P2/P3.
- [x] QA code รอบ R2: syntax ผ่านทุก JS, build `82 routes / 81 screens`, render smoke `81/81`.
- [ ] Browser visual QA ของรอบ R2 ยังไม่ผ่าน/ยังไม่ claim จนกว่าจะเปิด browser ตรวจจริง.


## 10. R2 P1 completion pass — 8 ต.ค. 2569
- [x] A-05/A-06 consent และ role status.
- [x] C-01 order placement, C-09/C-11 payment separation, C-17 report flow.
- [x] M-03/M-04/M-06/M-10/M-14/M-15 merchant P1 access/state/actions.
- [x] R-04/R-06/R-07/R-08 rider offer/checklist/proof flow.
- [x] Final code QA: `node --check`, build `82 routes / 81 screens`, render smoke `81/81`.
- [ ] ยังต้องตรวจ browser visual จริงก่อนปิด QA; G3 การแทน Unicode/emoji เป็น Material Symbols ให้ครบทุกจุด และ full map/bottom-sheet refinement เป็นงาน visual follow-up ที่ยังไม่ claim ผ่าน.

- [x] P1 map pass: C-12 full map + tracking sheet และ R-05 full map + navigation action; code QA ผ่าน.
- [ ] ยังไม่เริ่ม P2 เพราะ G3 icon migration และ browser visual QA ของ P1 ยังไม่ปิดครบ.


## P2 batch ล่าสุด
- [x] G7 และ P2 flow batch แรก: C-06/C-10/C-13, M-14/M-15/M-16, R-10/R-11/R-14 ปรับให้มี route/modal/state ต่อจริง.
- [x] Code QA: syntax ผ่าน, build 82 routes / 81 screens, render smoke 81/81.
- [ ] P2 ที่ยังเหลือ: G8/G9, C-08/C-09/C-12/C-14/C-15/C-16/C-18/C-01/C-02/C-04, M-05/M-06/M-07/M-08/M-01/M-09/M-13, R-07/R-01 และ browser visual QA.

- [x] P2 extended: G8/G9 base styling, R-03 task controls, R-06 checklist/help action; QA 81/81 render ผ่าน.
- [ ] P2 ยังเหลือ: customer tail flow, M-01/M-04/M-07/M-08/M-09/M-13, R-01 และ browser visual QA; ยังไม่ประกาศ P2 complete.


## Recovery note
- [x] กู้ `app.js`, `customer.js`, `merchant.js`, `rider.js` จาก working copy UTF-8 หลัง syntax/encoding regression; syntax/build/render ผ่านอีกครั้ง.
- [ ] P2 ยังไม่ complete: ต้องตรวจ diff และ reapply เฉพาะ P2 ที่หายจาก recovery ด้วย patch ที่ปลอดภัย; ห้ามใช้ PowerShell `Set-Content` กับ source ภาษาไทย.


## 11. P2 continuation หลัง UTF-8 recovery — 8 ต.ค. 2569

- [x] ต่อ P2 customer/merchant/rider ใน batch ที่ Handoff ระบุ: ประวัติอาหารสำเร็จ C-16 → C-17 และตัวกรอง service/status; C-33/C-35/C-38 ride flow และชำระก่อน rating/receipt; M-05 stock item action, M-07 confirm delete, M-08 option editor/group, M-15 promo form, M-16 claim form; R-01 document status, R-07 customer note, R-10 detail, R-11 cash remittance.
- [x] Shared payment selector สำหรับ C-09/C-35; เงินสดของ order ข้าม C-11 ไป C-12; เพิ่ม unread badge C-18 และ CSS ของ ride/order controls.
- [x] QA: syntax ทุก `src/**/*.js` และ `.work/p2-smoke.mjs` ผ่าน; P2 smoke 42 assertions ผ่าน; render smoke 81/81; build 82 routes / 81 screens; UTF-8 scan ไม่พบ replacement/Hebrew; CSS braces 368/368.
- [ ] Browser visual QA ยังไม่ผ่าน: ลองครบ 3 ครั้งทั้ง `127.0.0.1:5173`, `localhost:5173` และ LAN bind `192.168.0.102:5174` แต่ In-App Browser timeout. ต้องตรวจจริงที่ 320/390px และ light/dark ก่อน release.
- [x] G3 icon migration: renderer output ใช้ Material Symbols Rounded ผ่าน `replaceLegacyIcons()` และเพิ่ม glyph subset ใน `index.html`; scan ตัวอย่าง 10 หน้าไม่พบ legacy icon glyph.
- [ ] Publish/credential blocker: ลองครบ 3 ครั้งแล้ว แต่ `manus-config` ไม่อยู่ใน PATH, ค้นหา executable ถูกปฏิเสธ และ WebDev config ตอบ `not_attached`; ยังไม่มี checkpoint/permanent URL.
- [x] P3 ครบทุกข้อ: C-01 phase cards/snackbar, C-05 recent/popular + แยกแท็บร้าน/เมนู + ปุ่มล้าง, C-20 ย้าย keyboard ไป review panel + flow เปลี่ยนเบอร์, C-24 เอาร้านออกจากรายการโปรด, A-03/A-04 ช่องว่าง + state OTP ผิด/ส่งใหม่, A-07 แยก permission ทีละขั้น, M-02 สลับ role กลับลูกค้า, R-02 อนุมัติแล้ว + เริ่มรับงาน, R-12 ชื่อวัน + ตัวเลือกช่วงเวลา.
- [x] P3 QA: full renderer assertions 7 ผ่าน; syntax ทุก `src/**/*.js`, P2 smoke 42 assertions และ build 82 routes / 81 screens ผ่าน.
