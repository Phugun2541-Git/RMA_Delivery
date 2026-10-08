# RMA Delivery — Session Handoff (ไฟล์เดียวที่ต้องอ่านก่อนเริ่มทุก session)

**อัปเดต:** 8 ตุลาคม 2569 — ปิดงาน code/UI ค้างทั้ง 6 ข้อ, navigation follow-up และ C-06 menu UX refinement แล้ว; เหลือ full browser visual QA กับ publish credential blocker.

## 0. ที่อยู่ของงาน
- **Source of truth:** `D:\rma-delivery\manus\RMA-Delivery-source`
- โฟลเดอร์เดิม `C:\Users\Acer\OneDrive\Desktop\Project\RMA\RMA Delivery\` **ถูกลบแล้ว** (เจ้าของย้ายงานมาไว้ในโปรเจคหลัก) — ห้ามสร้างกลับ
- `D:\rma-delivery\manus\` = เขตของ Manus แก้ได้เต็มที่ · ไฟล์อื่นใน `D:\rma-delivery\` = เขตของ Claude **อ่านได้ ห้ามแก้**
- โฟลเดอร์นี้ไม่ใช่ Git repository — อย่าสั่ง git/commit โดยสมมติ

## 1. อ่านตามลำดับนี้ก่อนแก้โค้ด
1. ไฟล์นี้ทั้งไฟล์
2. `plan.md` · `TODO.md` · `REVIEW-NOTES.md` · `tokens-draft.md`
3. `src/data/screens.js` · `src/styles/tokens.css`
4. `D:\rma-delivery\ai-collab\SCREENS.md` — **รายการหน้าจอกลาง** (รหัส `A-` `C-` `M-` `R-` `S-`) ต้องตรงกับ `src/data/screens.js` เสมอ
5. `D:\rma-delivery\ai-collab\DECISIONS.md` — ข้อที่เคาะแล้ว ห้ามขัด
6. `D:\rma-delivery\ai-collab\to-manus.md` — brief ต้นทางของงาน R1

ถ้าไฟล์นี้ขัดกับ `DECISIONS.md` → หยุดแล้วถามเจ้าของ อย่าเลือกเอง

## 2. งานที่ค้าง — งาน code/UI ปิดครบแล้ว (8 ต.ค. 2569)

- งานค้างทั้ง 6 ข้อของ session นี้ปิดแล้วและย้ายรายละเอียดไฟล์/ผลตรวจไปไว้ใน §7; รายการเปิดเพียง browser visual QA ใน checklist ด้านล่าง.

### Checklist
- [x] สำรวจ route/component/control ทุกหน้าจอ จัดกลุ่มปัญหา layout/navigation
- [x] ทำแท็บ "ดีล" + หน้า `C-39` ตามข้อ 1 โดยยังเข้าถึงร้าน/ค้นหาอาหารได้
- [x] `M-07` / `M-08` เหลือ back control เดียว
- [x] ต่อ flow Merchant → Rider → Customer หลังรับ/ส่งมอบงาน ให้ action เห็นผล
- [x] ปรับ back navigation/history/fallback ทุกหน้าที่มีปุ่มย้อนกลับ ตรวจการกดไป-กลับหลายลำดับเชิงโครงสร้าง
- [x] แก้ spacing/layout โดยเฉพาะ `C-35` และ card ที่ระยะห่างไม่สมดุล
- [x] ตรวจ interaction smoke เชิงโครงสร้างครบ 81 routes · review panel metadata · render ที่รองรับ light/dark · responsive CSS 320/390px
- [ ] **เปิด browser ดูจริงครบชุด**: `C-01` light/dark · `C-06` · `C-12` · `M-03` · `R-03` · `R-05` และ 320/390px — spot-check back/account ผ่านแล้ว แต่ยังไม่รายงาน visual pass ครบทุกหน้า
- [x] อัปเดต `REVIEW-NOTES.md` (เพิ่ม C-39) · `TODO.md` · ไฟล์นี้

งาน code/UI ที่เสร็จย้ายลง §7 พร้อมไฟล์ที่แก้และผลตรวจแล้ว; browser visual QA ยังคงเป็นรายการเปิดเพียงรายการเดียวเพราะ blocker ของสภาพแวดล้อม.

## 2A. R3 — Claude แก้โครงสร้างแล้ว (8 ต.ค. 2569 · D-020) — อ่านก่อนแตะโค้ด

- Claude แก้โครงสร้างปุ่ม/flow/state ของรายการ R2 ครบ P1+P2+P3 (สคริปต์ `ai-collab/r2-check.mjs` = OK 55 / FAIL 0) · **ไม่แตะสี/สไตล์/tokens/`C-01`**
- งานของ Manus ต่อจากนี้ = เก็บหน้าตา: ดู **`ai-collab/to-manus.md` หัวข้อ "รอบ R4"** (รายการตามเลขข้อ 2.1–2.13) — สำคัญสุด: สีแชท `C-13` ตาม role, สไตล์ FAQ `<details>` (C-23/M-16/R-14), ตรวจ layout/modal/sheet ใหม่ทั้ง light/dark
- ไฟล์ใหม่ที่ต้องรู้: `src/ui/actions.js` (handler ใหม่) · `modals.js` + `modals-extra.js` · `demo.js` (ตัวควบคุมสาธิตอยู่ใน review panel เท่านั้น) · `live.js` (นับถอยหลัง/ลากเรียง/ลาก sheet/เสียง) · `src/i18n/` (ภาษา en: แปลที่ชั้น DOM หลัง render — ไม่ต้องแก้ renderer เมื่อเพิ่มข้อความ ให้เพิ่มคู่ไทย→อังกฤษใน `i18n/en-*.js`)
- กติกา: เพิ่มข้อความไทยใหม่ต้องเพิ่มคำแปลใน `i18n/en-*.js` (ไฟล์ละ ≤400 บรรทัด) · ห้ามเขียน `data-action` ใหม่โดยไม่มี handler ใน `app.js` หรือ `ui/actions.js` · ปุ่ม `logout/open-issue-form/cannot-reach/collect-coupon` ต้องอยู่ใน `app.js` (ด่าน DEAD ของสคริปต์ค้นหาแค่ไฟล์นั้น)
- ข้อที่เจ้าของเคาะเพิ่ม: D-021 (C-37 ปิดปุ่มย้อนกลับระหว่างเที่ยว) · D-022 (แตะแท็บ nav ที่ active = เลื่อนขึ้นบน) · D-023 (A-01 แตะเพื่อไปต่อ) · D-024 (หมดเวลา M-04/R-04 กลับหน้าก่อนพร้อม snackbar)

## 3. สิ่งที่เจ้าของยืนยันแล้ว (ห้ามย้อน)
- พอใจทิศทาง `C-01` → ใช้ **ภาษาดีไซน์เดียวกันกับทุกหน้าจอ** (A, C, M, R, S)
- **Aurora** คือทิศทางสีที่เจ้าของชอบ: พื้นหลัง gradient บาง · surface/card ที่ดูตั้งใจ · spacing/typography สมดุล · ไอคอนจริงชุดเดียว (Material Symbols Rounded)
- `C-01`: ภาพอาหารเป็น background **เฉพาะโซนบน** (greeting + address + search) เยื้องขวา · ห้ามทำ image card/hero card ใหม่ · ห้ามเป็นพื้นหลังเต็มหน้า
- **ห้ามเอาภาพอาหารของ `C-01` ไปเป็นพื้นหลังหน้า Merchant/Rider/หน้าอื่น** — ถ่ายทอดเฉพาะระบบ visual
- สีแยก role: Customer = Plum · Merchant = deep teal · Rider = blue · สีสถานะ success/warning/danger/info แยกจากสี role
- ไม่เปลี่ยนรหัสหน้าจอ · hash URL · interaction · กฎธุรกิจ · ข้อมูล mock ที่ไม่เกี่ยวกับงานที่สั่ง

## 4. โครงสร้างโค้ด
- Static web app ไม่มี backend · Vanilla JS ESM + CSS variables · ไม่มี dependency
- `src/data/screens.js` — metadata ทุกหน้าจอ + state options · `src/data/content.js` — ข้อมูลสมมติ
- `src/ui/{auth,customer,merchant,rider,shared,components,renderers}.js` — renderer/components · bottom nav อยู่ใน `components.js` (ตัวแปร `NAV`)
- `src/styles/tokens.css` — token light/dark · `app.css` — layout/component กลาง · `home.css` — `C-01` + visual ตาม role
- `src/app.js` — hash route · theme/state · review panel · `.phone[data-role]` ผูกสี role
- `index.html` — IBM Plex Sans Thai / Inter + Material Symbols Rounded (subset 33 glyphs — เพิ่มไอคอนใหม่ต้องเพิ่มใน subset)
- สถานะ `C-01`: `.home-top-zone` ห่อ greeting/address/search · background ผ่าน `::before` (`background-size: auto 84%`, `background-position: calc(100% + 18px) center`) · asset `src/assets/home-greeting-food.jpg`

## 5. Preview / QA
- ดับเบิลคลิก `Start-RMA-Preview.bat` → `http://127.0.0.1:5173/#/C-01` (ไม่ต้อง build)
- ผลตรวจล่าสุด: JS syntax ทุกโมดูล · render 81/81 route · CSS braces ผ่าน · icon subset ครบ · contrast สี role 6.07:1–8.98:1
- Browser screenshot spot-check ทำแล้วสำหรับ navigation และ C-06 menu UX; full visual QA ทุก role/viewport ยังไม่ถือว่าผ่าน
- อย่าปิดหรือฆ่า process ของผู้ใช้ · port 5173 มีเจ้าของให้ตรวจ process ก่อน

## 6. ข้อจำกัด / ยังไม่ทำ
- **ยังไม่มีลิงก์ถาวร:** publish ถูกบล็อกโดย Managed Git credential helper (`SEC_E_NO_CREDENTIALS` / `Permission denied`) รายละเอียดใน `TODO.md` · อย่าข้าม permission อย่าขอ secret · ทำ zip/publish เฉพาะเมื่อเจ้าของสั่ง
- `dist/` ถูก build ใหม่แล้วหลังรอบนี้: 82 routes (root + 81 deep links); build ใหม่อีกครั้งก่อน publish หากมีการแก้ต่อ
- อย่าลบไฟล์ของผู้ใช้ (รวม `Screenshot 2026-10-07 203327.png`)

## 7. เสร็จแล้ว
- **R1 (7 ต.ค.):** implement ครบ 80 หน้าจอ + review panel + state selector + light/dark + 9 flow shortcuts
- **Aurora visual pass (7 ต.ค. 21:35):** card gradient / `--shadow-card` / aurora page canvas / typography + control refinements / role accents ใน `app.css` · `tokens.css` มี card shadow light/dark · `app.js` ใส่ `data-role` · `components.js` เปลี่ยน app bar/bottom nav เป็น Material Symbols Rounded · `home-icons.js` + media rule รักษาขนาดที่ 320–360px · ภาพ `C-01` เลื่อนขวาพร้อม veil ฝั่งซ้าย
- **Follow-up C-39 + layout/navigation pass (8 ต.ค.):** เพิ่ม C-39 เป็นหน้าที่ 81, เปลี่ยน bottom nav ลูกค้าเป็น “ดีล” โดยคง C-01 → C-04, เพิ่ม deal filters/detail modal/coupon collect และสถานะคูปองใน C-10; แก้ `src/data/screens.js`, `src/ui/components.js`, `src/ui/customer.js`, `src/app.js`, `public/manus-routes.json` และ build `dist/` เป็น 82 routes.
- **Flow/back/spacing pass (8 ต.ค.):** เพิ่ม history stack และ `goBack` สำหรับการกดย้อนหลายลำดับ, M-07/M-08 เหลือ app bar/back เดียว, เพิ่มสถานะพร้อมส่ง/ส่งมอบและลิงก์ M-05/M-03 → R-05/C-12 → R-09/C-12, ปรับ C-35 vehicle list และ spacing/card global; แก้ `src/ui/merchant.js`, `src/ui/rider.js`, `src/styles/app.css`.
- **Code QA (8 ต.ค.):** `node --check` ผ่านทุกโมดูล; render smoke ผ่าน 81/81; CSS braces `app.css 302/302`, `home.css 232/232`, `tokens.css 3/3`; build รายงาน 82 routes/81 screens; interaction assertions ผ่าน (C-39 labels/links, M-07/M-08 back = 1, handoff links, history back).
- **Browser QA status (8 ต.ค.):** เปิด In-App Browser จริงและลอง `127.0.0.1`, `localhost`, LAN IP และ preview สำรอง bind `0.0.0.0` แล้วแต่ timeout/เชื่อมต่อไม่ได้; จึงยังไม่ถือว่า C-01/C-06/C-12/M-03/R-03/R-05 หรือ 320/390 visual ผ่าน.
- **Navigation follow-up (8 ต.ค.):** เอาไอคอนบัญชีมุมขวาบนออกจาก shared app bar ทุกหน้า; เพิ่ม global back สำหรับหน้าที่ไม่มี app bar/back; เปลี่ยน app-bar back เป็น `back-to` route ที่ใช้ `previousId` ไม่สร้าง history ซ้ำ; browser จริงยืนยัน C-01 → C-04 → back = C-01, direct C-06 มี back 1 ปุ่ม/บัญชีบน app bar 0 ปุ่ม และ back = C-01. แก้ `src/ui/components.js`, `src/ui/customer.js`, `src/ui/merchant.js`, `src/ui/rider.js`, `src/ui/renderers.js`, `src/app.js`, `src/styles/app.css`.
- **C-06 menu UX refinement (8 ต.ค.):** เปลี่ยนปุ่ม “เลือก” เป็น “เพิ่ม”; เมนูไม่มี modifier เพิ่มเข้าตะกร้าได้ทันที, เมนูมี `choices/extra` แสดง “ปรับแต่งได้” และเปิด C-07 modifier sheet, รายการที่อยู่ใน cart แสดง `− / จำนวน / ＋`, sticky cart summary แสดงเมื่อมีรายการ; compact app bar ใช้ back icon-only และตัด customer eyebrow ที่ซ้ำ. แก้ `src/ui/customer.js`, `src/app.js`, `src/styles/app.css`; menu UX assertion ผ่านและ browser screenshot C-06 ตรวจแล้ว.

## 8. จบ session ทุกครั้ง
อัปเดตไฟล์นี้ (§2 งานค้าง · §7 เสร็จแล้ว · วันที่บนสุด) และ `TODO.md` ให้ตรงสถานะจริง — session ถัดไปเริ่มจาก context ว่าง มีแค่ไฟล์นี้บอกทาง


## 9. R2 UX pass — 8 ตุลาคม 2569
- [x] **G4/G6:** ลด header ซ้ำใน merchant/rider, compact menu sheet C-07, sticky primary CTA ใน C-08/C-11/M-05/R-03/R-04/R-05/R-16/R-17 และ SOS แบบไอคอนใน C-37.
- [x] **G10/G11/G13:** เพิ่ม confirmation ก่อนปฏิเสธ order/งาน, ซ่อนเบอร์โทรตรง ๆ ใน M-05/R-05, เพิ่มออกจากระบบและเอกสารความปลอดภัยใน C-19/M-17/R-15.
- [x] **Flow อาหาร P1:** C-07 ใส่ตะกร้าแล้วกลับ C-06 พร้อม toast; C-08 เป็นตะกร้าแก้จำนวนและ sticky checkout; C-11 แสดงขั้นรอชำระและ CTA จริง; C-12 ตัดปุ่มจำลอง; C-16 มีรายการอาหารเสร็จแล้วเข้า C-17; C-17 เปิดฟอร์มแจ้งปัญหาแบบ modal ไม่วนกับ C-23.
- [x] **หน้ารับงาน P1 ชุดหลัก:** M-04/M-05, R-03/R-04/R-05, R-16/R-17 และ R-18 ปรับ action/state และจุดแวะ 4 ขั้นตาม brief R2.
- [ ] **ยังไม่ปิด P1 ทั้งเอกสาร R2:** A-05/A-06, C-01, C-37 state split แบบเต็ม, M-03/M-04/M-06/M-10/M-14/M-15, R-06/R-07/R-08 และ P1 อื่นที่อยู่นอกชุด flow หลักยังต้องทำต่อก่อนเริ่ม P2/P3.
- QA รอบนี้: `node --check` ผ่าน, static build `82 routes / 81 screens`, render smoke `81/81`; ยังไม่มี visual-pass claim ใหม่ เพราะต้องเปิด browser ตรวจจริงตามกติกา.


## 10. R2 P1 completion pass — 8 ตุลาคม 2569
- [x] A-05: consent ข้อกำหนด/PDPA เริ่มว่าง มีลิงก์อ่านเอกสาร และปุ่มต่อ disabled จนเลือกครบ.
- [x] A-06: role แสดงสถานะใช้งาน/สมัคร/รออนุมัติแทนการเปิดทุก role แบบไม่มีบริบท.
- [x] C-01: ย้าย order ที่กำลังดำเนินอยู่ขึ้นใต้ส่วนหัวก่อน promo; C-09/C-11 แยกเลือกวิธีชำระกับหน้าจ่ายจริง.
- [x] M-03/M-04/M-06/M-10/M-14/M-15: ปิดร้านมี confirmation, order ใหม่มี CTA หลัก sticky, แถวเมนูเข้าแก้ไขได้, Smart Kitchen มีหลายสถานะ, account เข้ารีวิว/โปรโมชันได้.
- [x] R-04/R-06/R-07/R-08: R-04 มี offer อาหาร/รับส่งคน/งานพ่วง, R-06 มี checklist, R-07 แสดง customer note แบบอ่านอย่างเดียว, R-08 บังคับหลักฐานก่อนยืนยัน.
- [x] QA: syntax ผ่าน, build 82 routes/81 screens, render smoke 81/81.
- [ ] Browser visual QA ยังไม่ถูก claim; G3 icon migration ทั้งระบบและการปรับ full map/bottom-sheet บางหน้าต้อง visual review ต่อก่อน release.

- [x] P1 map pass: C-12 ใช้ full map + tracking bottom sheet; R-05 ใช้ full map + ปุ่มนำทางบนแผนที่; render smoke ผ่าน 81/81.
- [ ] P1 ยังไม่ปิดสมบูรณ์ในระดับ release: G3 icon migration ให้ครบทุก renderer และ browser visual QA ยังต้องตรวจจริง.


## P2 batch ล่าสุด
ปิด code-level ในชุดแรก: G7 bottom nav เฉพาะหน้าหลัก, C-06 minimum order, C-10 manual coupon, C-13 sticky chat composer, M-14 reply review, M-15 promo form, M-16 help topics/claim entry, R-10 history detail, R-11 cash submit, R-14 help topics. Build ได้ 82 routes / 81 screens และ render smoke 81/81 ผ่าน. ยังไม่รายงาน visual pass จนกว่าจะเปิด browser ตรวจ interaction จริง.


## P2 extended batch ล่าสุด
เพิ่ม G8/G9 styling สำหรับ toggle-row/select และทำ R-03 ประเภทงาน, R-06 checklist/help topic ให้กดต่อได้; customer C-06/C-10/C-13 และ Merchant/Rider help/history/cash flows ยังอยู่ครบจาก batch ก่อน. QA ล่าสุด build 82 routes / 81 screens และ render smoke 81/81 ผ่าน. P2 ยังไม่ถือว่าปิดทั้งหมดจนกว่าจะทำ customer P2 ปลายทาง, M-01/M-04/M-07/M-08/M-09/M-13, R-01 และ browser visual QA.


## Recovery note หลัง P2 continuation
คำสั่ง PowerShell แบบเขียนไฟล์ในรอบ P2 ล่าสุดทำให้ UTF-8 ของ `src/app.js`, `src/ui/customer.js`, `src/ui/merchant.js`, `src/ui/rider.js` เสียและ syntax แตก. `dist` ถูก build ทับไปแล้ว จึงกู้จาก working copy ที่ยังเป็น UTF-8 ที่ `D:\rma-delivery\outputs\rma-delivery-mockup\site\src` แล้วตรวจ `node --check`, build 82 routes/81 screens และ render smoke 81/81 ผ่าน. การกู้คืนอาจย้อนการแก้ P2 ล่าสุดของ 4 ไฟล์นี้; P2 จึงยังไม่ complete และต้อง reapply อย่างปลอดภัยด้วย `functions.edit` เท่านั้น.


## 11. P2 continuation หลัง UTF-8 recovery — 8 ต.ค. 2569

ส่วนนี้เป็นสถานะล่าสุดและ supersede ข้อความว่า P2 ยังไม่ reapply ใน §10; **ปิด code-level เฉพาะ batch ที่กู้/ต่อในรอบนี้ แต่ยังไม่ประกาศว่าปิด P2 ทั้ง brief**.

- Source of truth ยังคงเป็น `D:\rma-delivery\manus\RMA-Delivery-source`; recovery copy ที่ใช้ก่อนหน้านี้อยู่ใน `D:\rma-delivery\outputs\rma-delivery-mockup\site\src` และไม่ควรแก้แทน source.
- ต่อ P2 customer: C-16 เพิ่มประวัติอาหารที่เสร็จแล้วเปิด C-17 และตัวกรองบริการ/สถานะ, C-33 จุดรับ/ปลายทางและสลับจุด, C-35 เลือกรถ/คูปอง/เปิด payment selector ร่วม, C-38 รอชำระก่อนให้คะแนน/ใบเสร็จ; เพิ่ม badge unread ใน C-18.
- ต่อ P2 merchant/rider: M-05 จัดการเมนูหมดรายรายการและปุ่มเปลี่ยนตามสถานะ, M-07 ยืนยันลบเมนู, M-08 editor แก้/ลบ/เรียงตัวเลือกและเพิ่มกลุ่ม, M-15 create/edit/pause, M-16 claim form; R-01 สถานะเอกสาร, R-07 หมายเหตุลูกค้าแบบอ่านอย่างเดียว, R-10 รายละเอียดงาน, R-11 วิธีนำส่งเงินสด.
- Shared order/ride payment selector ให้เลือก PromptPay QR/บัตร/เงินสด; order เงินสดข้ามหน้า C-11 ไป C-12. P2 CSS เพิ่ม style ของ vehicle cards, order rows, customer note และ unread badge.
- แก้ผ่าน `functions.edit` และคง UTF-8: `src/app.js`, `src/ui/p2.js`, `src/ui/renderers.js`, `src/styles/app.css`; เพิ่ม assertions ใน `.work/p2-smoke.mjs`.
- QA ล่าสุด: `node --check` ทุก JS ใน `src` และ smoke script ผ่าน; P2 smoke **42 assertions ผ่าน**; render smoke **81/81**; build **82 routes / 81 screens**; UTF-8 scan ไม่พบ U+FFFD/Hebrew ในไฟล์ที่แก้; `app.css` braces **368/368**.
- Browser visual QA ยังไม่ผ่าน: In-App Browser เปิด `127.0.0.1:5173` และ `localhost:5173` แล้ว timeout (`ERR_CONNECTION_TIMED_OUT`); HTTP request จาก execution shell ก็เชื่อมต่อไม่ได้. ห้ามนับเป็น visual pass.
- ยังเปิดอยู่: visual QA จริงที่ 320/390px และ light/dark; P1/P2 ข้ออื่นนอก batch ตาม `ai-collab/to-manus.md`; G3 icon migration ทั่วระบบ; publish ยังติด Managed Git credential blocker ตาม §6. ไม่มีการ commit หรือ publish รอบนี้.

## 12. G3 / Visual QA / Publish attempts และ P3 start — 8 ตุลาคม 2569

- [x] G3: เพิ่ม `replaceLegacyIcons()` ที่ `src/ui/home-icons.js`, ครอบผลลัพธ์ทุก renderer และเพิ่ม glyph subset ใน `index.html`; output scan 10 หน้าตัวอย่างไม่พบ legacy icon glyph, P2 smoke 42 assertions ผ่าน.
- [ ] Visual QA: ล้มเหลวครบ 3 ครั้งจาก `ERR_CONNECTION_TIMED_OUT` แม้ลอง `127.0.0.1:5173`, `localhost:5173` และ LAN `192.168.0.102:5174` (server bind `0.0.0.0`); ยังห้าม claim visual pass.
- [ ] Publish: ล้มเหลวครบ 3 ครั้ง — `manus-config` ไม่อยู่ใน PATH, การค้นหา executable ใต้ `.manus` ถูกปฏิเสธ, และ `webdev.config` ตอบ `not_attached`; ยังไม่มี checkpoint/permanent URL.
- [x] เริ่ม P3 batch แรกใน `src/ui/renderers.js`: A-03/A-04 เริ่มด้วยช่องว่าง, R-02 รองรับสถานะอนุมัติแล้วพร้อม CTA เริ่มรับงาน, R-12 มีช่วงรายงานวันนี้/7 วัน/30 วัน/กำหนดเอง; P3 assertions 4 ผ่าน.
- [x] QA หลัง P3: `node --check` 12 ไฟล์, P2 smoke 42, build 82 routes / 81 screens ผ่าน.

## 13. P3 complete — 8 ตุลาคม 2569

- [x] ปิด P3 ทุกข้อใน source: C-01 phase cards/snackbar; C-05 recent/popular, clear และ tabs ร้าน/เมนู; C-20 review-panel keyboard + เปลี่ยนเบอร์ไป OTP; C-24 เอาร้านออกจากรายการโปรด; A-03/A-04 empty/error/resend OTP; A-07 permission ทีละขั้น; M-02 สลับ role; R-02 approved CTA; R-12 ชื่อวันและช่วงรายงาน.
- [x] P3 full renderer assertions **7 ผ่าน**; syntax ทุก JS, P2 smoke **42 ผ่าน**, build **82 routes / 81 screens ผ่าน**.
- [ ] ยังต้อง visual-check โดยผู้ใช้ผ่าน `Start-RMA-Preview.bat` ที่ `127.0.0.1:5173` เนื่องจาก In-App Browser ของ session นี้ timeout; publish blocker ยังไม่เกี่ยวกับ P3 และยังเปิดอยู่.


## R3 recovery — ขั้น 1 — 8 ตุลาคม 2569
- [x] กู้ C-01 Aurora จาก `manus/_recovered-2026-10-07-2205/src` กลับเข้า renderer `src/ui/customer.js` โดยตรง และให้ `src/ui/renderers.js` dispatch C-01 ก่อน P2 fallback
- [x] C-01 order card อยู่เหนือ promo
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 1 — **OK 18 · FAIL 28**
- บรรทัดที่ปิดตามตาราง: `C-01 aurora home` = OK, `C-01 order card above promo` = OK
- ข้อที่ยังเปิด: ทุกบรรทัด FAIL อื่นในผลสคริปต์ รวม C-39, G1/G2/G4/G5/G6/G9/G11/G13/G16, C-07/C-11/C-17/C-37, A-01, M-04/M-17, R-04/R-05/R-08/R-16/R-17/R-18/R-15


## R3 recovery — ขั้น 2 — 8 ตุลาคม 2569
- [x] เพิ่ม renderer `C-39` ดีล/โปรโมชัน พร้อมคูปองและทางเข้า C-10/C-06
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 2 — **OK 28 · FAIL 25**
- บรรทัดที่ปิดตามตาราง: `C-39 deals page renders` = OK
- ข้อที่ยังเปิด: FAIL 25 รายการตามผลสคริปต์ โดยเฉพาะ G1/G2/G4/G5/G6/G9/G11/G13/G16, C-07/C-11/C-17/C-37, A-01, M-04/M-17 และ R-04/R-05/R-08/R-16/R-17/R-18/R-15


## R3 recovery — ขั้น 3 — 8 ตุลาคม 2569
- [x] ปิดกติกากลาง G1, G2, G3, G4, G5, G6, G7, G9, G11, G13 และ G16 ด้วย renderer/component ต้นทาง
- [x] ปรับ route dispatch ให้ไม่เติม refinement หลัง central renderer และไม่ใช้ post-render replacement สำหรับหน้าที่แก้
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 3 — **OK 53 · FAIL 0**
- บรรทัดที่ปิดตามตาราง: บรรทัด G ทุกข้อ = OK


## R3 recovery — ขั้น 4 — 8 ตุลาคม 2569
- [x] ตรวจ/ปิด flow C-06, C-07, C-11 และ C-17 ตาม renderer ปัจจุบัน
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 4 — **OK 53 · FAIL 0**
- บรรทัดที่ปิดตามตาราง: C-07 ×2, `C-11 no method chooser`, `C-17 no loop` = OK


## R3 recovery — ขั้น 5 — 8 ตุลาคม 2569
- [x] ตรวจ C-37 และ A-01 ตามลำดับงาน
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 5 — **OK 53 · FAIL 0**
- บรรทัดที่ปิดตามตาราง: C-37 และ A-01 = OK


## R3 recovery — ขั้น 6 — 8 ตุลาคม 2569
- [x] ตรวจ M-04, M-17 และ M-06 Smart Kitchen lock ตามลำดับงาน
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 6 — **OK 53 · FAIL 0**
- บรรทัดที่ปิดตามตาราง: M-04, M-17 ×2 = OK


## R3 recovery — ขั้น 7 — 8 ตุลาคม 2569
- [x] ตรวจ R-05, R-08, R-15, R-16, R-17 และ R-18 ตามลำดับงาน
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 7 — **OK 53 · FAIL 0**
- บรรทัดที่ปิดตามตาราง: บรรทัด R ทุกข้อ = OK


## R3 recovery — ขั้น 8 — 8 ตุลาคม 2569
- [x] ตรวจ P2/P3 ที่อยู่ในตารางด้วย renderer ปัจจุบัน
- QA: `node D:\rma-delivery\ai-collab\r2-check.mjs` รอบจบขั้น 8 — **OK 53 · FAIL 0**

## R3 recovery — ขั้น 9 — 8 ตุลาคม 2569
- [ ] ยังไม่ปิด: `src/ui/renderers.js` ยัง import/call `renderP2` และยังมี `applyP3Refinements`/`stripBlock`; การรวม p2 และ post-render refinement เข้า renderer รายหน้าให้เป็นโค้ดจุดเดียวต้องทำต่อในรอบถัดไป
- QA รอบสุดท้ายก่อนหยุด: **OK 53 · FAIL 0** จาก `r2-check.mjs`
- เหตุผลที่หยุด: งานขั้น 9 ยังต้อง refactor โครงสร้างขนาดใหญ่เพื่อไม่ให้ regression และยังไม่ควรติ๊ก [x] ตามกติกาข้อ 5


## R4 Manus visual pass — 8 ตุลาคม 2569
- [x] P1.1 เพิ่ม hook สีแชทตาม role ผู้เปิด (`data-chat-from` บน phone root) และสไตล์ Customer/ร้านค้า/ไรเดอร์แยกสี
- [x] P1.2 ปรับ FAQ `<details>` ให้ซ่อน browser marker, หมุน chevron เมื่อเปิด และจัด padding คำตอบ
- [x] P2 visual hooks: selected rows, countdown warning/critical, sheet handle 48px + pressed state, reorder handle drag state
- [x] P1.5 ย้าย SOS จาก inline color ไป `.sos-btn`
- [x] P2/P3 responsive/en polish: C-05 clear button touch target, chart overflow/hover, date inputs, English font/button wrapping, 320–360px sticky spacing
- QA: `node --check src/app.js src/ui/components.js src/ui/live.js` ผ่าน และ `node D:\rma-delivery\ai-collab\r2-check.mjs` = **OK 55 · FAIL 0**
- [ ] ยังต้อง browser visual QA จริงทั้ง light/dark ที่ 320/390px สำหรับชุดหน้าตาใน `to-manus.md` ข้อ 2.3 และตรวจ inline map navigation class ให้ครบ
