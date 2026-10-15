# CHANGES — mockup/ เทียบกับ manus/RMA-Delivery-source (ของเดิมไม่ถูกแตะ)

เปิดดู: `Start-Preview.bat` (พอร์ต 5174; ของเดิม 5173 รันคู่กันได้) · หรือ `node scripts/serve.mjs` (ตั้งพอร์ตด้วย `PORT=`)
Board: `http://127.0.0.1:5174/board.html` (`?theme=dark` `?lang=en` `?palette=saffron`)

## QA
- `node scripts/r2-check.mjs` (สำเนา แก้แค่ path): baseline 55 OK / 0 FAIL → ปัจจุบัน 55 OK / 0 FAIL
- `scripts/layout-sweep.js` (รันในเบราว์เซอร์): ไล่ทุกหน้า + ทุกสถานะใน review panel (127 รายการ) วัด nav ชิดล่าง · overflow แนวนอน · content ถูกบัง · scroll ซ้อน · พื้นที่ว่างใต้เนื้อหา · ข้อความ undefined/NaN
  - baseline (ของ shell เดิม ที่ 390×844): 192 ปัญหา → ปัจจุบัน 0 ที่ 390×844, 360×740, 320×640, desktop 1600×1000
  - ข้อยกเว้นที่ตั้งใจ: C-07 เป็น bottom sheet ที่เลื่อนในตัวเอง

## Task A — เปลือกหน้าจอ
สาเหตุ: เนื้อหา + แถบ nav + sticky bar อยู่ใน `.screen-content` ที่เลื่อนรวมกัน nav จึงลอยกลางจอเมื่อเนื้อหาสั้น · `#modal-root` ว่างเป็น flex item ทำให้ gap 18px แย่งความกว้าง (จอ 390 เหลือ 372) · margin bleed hard-code `-18px` แต่ padding จริง 16/13px (ล้น 2px ทุกด้าน)
- `src/ui/shell.js` (ใหม่) แยกหน้าเป็น top (app bar) / body (เลื่อนที่เดียว) / dock (sticky-action · chat-compose · p2-cart-fab · quick-replies · bottom-nav)
- `src/styles/shell.css` (ใหม่) · ตัวแปร `--screen-pad` (18/16/13) ใช้กับ margin/padding bleed ใน app.css · flat.css
- หน้าที่มีแผนที่นำ (C-12 R-05 R-07 R-16 R-17) แผนที่ยืดเต็มพื้นที่ ส่วน sheet/การ์ดชิดล่าง · C-07 sheet ชิดล่างเต็มพื้นที่
- `app.js`: render ผ่าน `hostMarkup()` · `ctx`/state ย้ายไป `src/app-state.js` (ใช้ร่วมกับ board) · `nav-top` เลื่อน `.screen-scroll`
- C-01: ตัดส่วนเกิน 4px ที่ 360px (`overflow-x: clip`)
- แก้ไฟล์เดิม: index.html (path สัมพัทธ์) · app.css/flat.css (ตัวแปร pad) · actions.js (nav-top)

## Task B — แจ้งเตือน
- ข้อมูล: `src/data/notifications.js` (แคตตาล็อก · หมวด · seed) · `src/data/order-status.js` (ถ้อยคำสถานะ order ใช้ร่วม C-12 + push)
- UI: `src/ui/notifications.js` · `src/styles/notify.css` · แบนเนอร์ OS-style (พื้นทึบ ไม่มี blur ตาม D-003) ขึ้น 6.5 วินาที แตะ = deep link
- จำลอง: review panel หัวข้อ "จำลองแจ้งเตือน (push)" ตาม role ที่เลือก
- หน้าใหม่: **M-18** (ร้านค้า) · **R-19** (ไรเดอร์) · กระดิ่ง+badge ที่ M-03 / R-03 · C-18 แท็บ "แจ้งเตือน" ใช้ข้อมูลจริง
- toggle รายหมวด: C-22 · M-17 · R-15 (แจ้งเตือนสำคัญ = เปิดเสมอ) · หมวดที่ปิดไม่ขึ้นแบนเนอร์ แต่ยังอยู่ในกล่อง
- C-12 ไทม์ไลน์ 5 ขั้นตรงกับแจ้งเตือน · ยกเลิกได้เฉพาะก่อน "รับอาหารแล้ว" (เดิม <4 ขั้น → ใหม่ <3)
- R-05 แสดงป้าย "อาหารพร้อมแล้ว"/"ร้านทำอาหารล่าช้า" · state "งานถูกยกเลิก" ของ R-05 (เดิมไม่มีหน้าจริง) มีหน้าแล้ว
- i18n: `src/i18n/en-6.js`
- แคตตาล็อก: ลูกค้า 12 (5 ขั้น + ยกเลิก/คืนเงิน + หาไรเดอร์ไม่ได้ + เรียกรถ 3 + แชท + โปรโมชัน) · ร้าน 4 · ไรเดอร์ 5

## Task C — Figma
- `board.html` + `src/board.js` + `src/styles/board.css` · 150 เฟรม 390×844 (A 7 · C 60 · M 29 · R 28 · S 5 · N push 21) ใช้ renderer จริง ไม่มี iframe/animation · สลับ light/dark/ไทย/EN ด้วย query
- path สัมพัทธ์ทั้งหมด (ทดสอบโฮสต์ใต้ `/mockup/` ไม่มี 404) · `scripts/build.mjs` copy board + figma เข้า dist
- รูป 8 รูป: โหลดจาก files.manuscdn.com (ทั้งหมด HTTP 200, ตรวจ magic bytes JPEG/PNG ผ่าน) → `src/assets/food-0N*.{jpg,png}` — **เป็นรูปจากการค้นเว็บ ใช้ใน mockup ภายในเท่านั้น ต้องเช็คลิขสิทธิ์ก่อนใช้ในแอปจริง** (ชื่อรูป 5–8 ยังไม่ได้ระบุเมนู)
- `scripts/export-tokens.mjs` → `figma/tokens.json` (Tokens Studio: global · light · dark · role · palette · home) · `figma/README-FIGMA.md`

## ของค้าง / ข้อสังเกต (ยังไม่ได้แก้เพราะไม่ใช่ขอบเขตหรือต้องให้เจ้าของเคาะ)
- ปุ่ม "Review" ลอยมุมขวาล่างบนจอแคบ ทับ dock (เครื่องมือ review ไม่อยู่ในแอปจริง)
- R-03 ยังมีปุ่มย้อนกลับทั้งที่เป็นหน้าหลักของ role (พฤติกรรมเดิมของ p2.js)
- ค่าตอบแทนไรเดอร์เมื่อลูกค้ายกเลิก ยังไม่เคาะ (หน้าเขียน "ตามเงื่อนไขการยกเลิก")
- board dark = สลับด้วย `?theme=dark` (ไม่มี 2 ส่วนในหน้าเดียวเพราะ token ผูกกับ `:root`)
- theme ใน tokens.json ยังไม่เปิด set `customer-*-home-*` อัตโนมัติ (เปิดเองใน Tokens Studio ได้)
- ฟอนต์/ไอคอนโหลดจาก Google Fonts (ต้องมีเน็ต)
- ไม่ได้ทดสอบ import จริงด้วย html.to.design (ไม่มีส่วนขยายในเครื่องนี้)

## R6 — 2026-10-15 · feedback เจ้าของ (ไอคอน · แป้นพิมพ์ปลอม · แจ้งเตือน · sheet ชำระเงิน · สลับโหมด · ลดข้อความ · ภาพอ้างอิง)
สแนปช็อตก่อนรอบนี้: `mockup-archive/2026-10-15-r5-published/` (ไม่ถูกแตะ)

### QA (baseline → หลังทำ)
- `node scripts/r2-check.mjs`: 55 OK / 0 FAIL → 55 OK / 0 FAIL — **ปรับ check 1 ข้อ:** `STUB screens` เดิมเทียบความยาวข้อความกับ `r2-baseline.json` (ก่อน R3) ซึ่งขัดกับคำขอ "ลดข้อความ" → ย้ายไปเทียบ `scripts/r6-baseline.json` (สร้างด้วย `--write-r6-baseline` หลังไล่ดูทุกหน้าที่ข้อความลดเกิน 40% ด้วยตา) · ยังพิมพ์บรรทัด INFO รายชื่อหน้าที่สั้นลงเทียบของเดิม
- `node scripts/icon-check.mjs` (ใหม่): baseline FAIL 3 (A-06 พิมพ์ "person"/"business" เป็นตัวหนังสือ · A-07 ใช้ชื่อ ligature ตรง) → OK (55 ชื่อ, subset ตรงกันทั้ง index.html และ board.html, เรียงตัวอักษร)
- `scripts/layout-sweep.js` (เบราว์เซอร์): 390×844 = 0 · 360×740 = 0 (128 หน้า/สถานะ รวม S-06)
- `scripts/i18n-sweep.js` (ใหม่, เบราว์เซอร์): โหมด EN ไม่มีข้อความไทยเหลือในจอ/sheet/banner (เริ่มที่ 212 → 0) · board `?lang=en` 161 เฟรม ไม่มีไทย
- render smoke ทุกหน้า × สถานะ × 3 ชุด state + modal ทุกชนิด: 0 exception / undefined / NaN
- ทดสอบ flow จริงในเบราว์เซอร์: กระดิ่ง → กล่องแจ้งเตือนของ role · push → badge +1 → เปิดจาก S-06 → อ่านแล้ว + หายจากถาด + badge ลด · เลือกวอลเล็ตใน sheet → C-09/C-11 เปลี่ยนตาม

### 1. ไอคอน
- ต้นเหตุ: A-06 ใส่ชื่อไอคอนใน `<span>` ที่ไม่มี class ของฟอนต์ ("business" ไม่มีใน subset ด้วย) → เขียนใหม่ใช้ `homeIcon()`
- `home-icons.js` export `ICONS`/`LEGACY_ICON_NAMES` (ให้ script ตรวจ) · เพิ่ม key: card, swap, expand, work, ac, cleaning, plumbing · `homeIcon(name,size,extraClass)`
- subset เพิ่ม: ac_unit, cleaning_services, credit_card, expand_more, plumbing, swap_vert, work
- `scripts/icon-check.mjs`: อ่าน subset ทั้ง 2 HTML · key ที่เรียก `homeIcon/iconButton/icon:` ต้องมีใน ICONS · render ทุกหน้า/สถานะ/modal/push/กระดิ่ง แล้วเช็คชื่อที่ออกมาจริง · จับคำ snake_case ที่หลุดเป็นตัวหนังสือ
- ไอคอนบิดเบี้ยว: `.material-symbols-rounded` = กล่อง 1em×1em ไม่หด · ไทล์ไอคอนทุกแบบ `aspect-ratio:1; flex-shrink:0` (เดิม `.state-illustration` ใน `.row` หดกว้างแต่สูงคงที่) · `.phone img { object-fit: cover }`

### 2. ลบแป้นพิมพ์ปลอม
- ลบ `keyboardDemo()` + การเรียกใน A-03 · C-03 · C-20 · M-07 · S-05 · แผง review (C-20) · action `p3-keyboard-toggle` · state `keyboardOpen` · CSS `.input-demo-keyboard/.key-row/.key` · คำแปล

### 3. แจ้งเตือน
- กระดิ่ง + badge ไม่ได้อ่าน บนหน้าหลักทุก role: C-01 (คอลัมน์ขวาของแถวทักทาย) C-16 C-19 C-39 · M-03 M-06 M-13 M-17 · R-03 R-10 R-11 R-12 R-15 → `notif-inbox` เปิด C-18 (แท็บแจ้งเตือน) / M-18 / R-19
- badge บนแท็บ "ข้อความ" ของลูกค้า = แจ้งเตือนยังไม่อ่าน + แชทยังไม่อ่าน (อัปเดตเมื่อเปิดอ่าน · เปิด C-13 = แชทอ่านแล้ว)
- **S-06 ศูนย์แจ้งเตือนมือถือ (OS)** (หน้าใหม่, S-01 ถูกใช้แล้ว): นาฬิกา/วันที่ · กอง RMA notification · แตะ = deep link + อ่านแล้ว + หายจากถาด · "ล้างทั้งหมด" · "เปิดแอป" กลับหน้าล่าสุด · เปิดได้จากปุ่มในแผง review หัวข้อจำลองแจ้งเตือน
- push banner เป็น heads-up แบบ OS: ไอคอนแอป · ชื่อแอป · ตอนนี้ · หัวข้อ · เนื้อหา 1 บรรทัด · ออกแบบ slide-up 180ms (เดิมหายทันที) · reduced-motion
- state: `notifs[].shade` · `lastAppId` · `chatUnread` · ไฟล์ `ui/notifications.js` `data/notifications.js` `app.js`

### 4. เปลี่ยนวิธีชำระเงิน (C-09 · C-35 · C-11)
- bottom sheet จริง ชิดขอบล่างของจอมือถือ: handle · หัวข้อ + ปุ่มปิด · แถว radio (ไอคอน QR/บัตร/วอลเล็ต/เงินสด · ชื่อ · บรรทัดรอง · radio ขวา) คั่นเส้น · ปุ่มหลักปักล่าง "ใช้ …" · บัตรแสดง `Visa •••• 4242` · เลือกแล้วยังไม่บันทึกจนกดยืนยัน (`paymentDraft`)
- modal ทุกตัวย้ายเข้าไปอยู่ในกรอบมือถือ (`#modal-root` ใน `.phone`) · sheet ไม่เล่นแอนิเมชันซ้ำตอน re-render
- C-09/C-35 แถววิธีชำระเป็น list tile มีไอคอน · C-11 รองรับบัตร (CVV อย่างเดียว) และวอลเล็ต · ข้อมูล `PAYMENT_METHODS` ใน `data/content.js`

### 5. สลับโหมด (A-06)
- list แบน: ไอคอนวงกลมสี role · ชื่อ · บรรทัดเดียว · chip สถานะเฉพาะที่เกี่ยว (ยังไม่ได้สมัคร / รออนุมัติ) · โหมดปัจจุบัน = check + "ใช้งานอยู่" (ดูจากหน้าที่มา) · แถวที่ยังไม่สมัคร → M-01 / R-02
- แถว "สลับโหมด" ในหน้าบัญชีทั้ง 3 role ตัด pill ซ้ำออก

### 6. ลดข้อความ / การ์ด → list tile
- `statePanel` ใหม่ = empty state แบน (ไอคอน · หัวข้อ · บรรทัดเดียว · ปุ่มเดียว) ไม่มีกล่อง · ข้อความว่างตามบริบท (C-01 C-04 C-06 C-33 M-03) · ไม่มีปุ่ม "ลองอีกครั้ง" ติดมาทุกที่อีกแล้ว
- helper ใหม่ (`components.js`): `metaLine` (★ 4.8 · ⏱ 20–30 นาที · 🛵 ฿10 ด้วยไอคอน Material) · `tabs` (underline) · `historyRow` · `listLabel` · `largeBar` · `infoTile`
- เขียนใหม่/ตัดข้อความ: A-01…A-07 · C-02 C-03 C-04 C-05 C-06 C-08 C-09 C-10 C-11 C-14 C-15 C-16 C-17 C-18 C-19 C-20 C-21 C-22 C-23 C-24 C-30–C-39 · M-02 M-03 M-04 M-05 M-06 M-07 M-08 M-10 M-12 M-13 M-14 M-17 M-18 · R-01 R-02 R-03 R-04 R-05 R-06 R-07 (โน้ตลูกค้า) R-08 R-09 R-10 R-11 R-12 R-14 R-16 R-19 · S-01–S-05
- ลบโค้ดตายที่ถูก `p2.js` ทับ (customer.js 12 case + C-01 ซ้ำ 2 ที่ · merchant.js 11 case · rider.js 7 case) ให้เหลือที่เดียวต่อหน้า
- หน้าที่เป็นแท็บหลักไม่มีปุ่มย้อนกลับแล้ว (C-16 C-18 C-19 C-39 M-06 M-13 R-03 R-10 R-11)

### 7. ภาพอ้างอิง (`manus/reference/`)
- `rma-delivery-history-grab-style.png` = **C-16** → large title · ปุ่มเลือกบริการ (sheet) + ช่องค้นหา · แท็บสถานะ · "ล่าสุด" · แถว: วงกลมไอคอนบริการ / ชื่อบริการ / สถานที่ / เลขที่ · เวลา / ยอด + สถานะสี / chevron · ใช้แบบเดียวกันที่ R-10 · R-11 · M-03 · M-12
- `rma-delivery-services-theme-matched.png` = **C-01** ส่วนทักทาย/ที่อยู่/ค้นหา/บริการของเรา/ออเดอร์ที่กำลังส่ง — โครงเดิมตรงภาพแล้ว จึงคงไว้ เพิ่มเฉพาะกระดิ่ง (ตามที่เจ้าของขอ) · แถวบริการเพิ่มเติม/บริการในบ้าน (C-31) ใช้ list tile ไอคอนแบบเดียวกัน

### Board + ภาพหน้าจอ
- `board.html`: 161 เฟรม (เพิ่ม S-06 ×2, A-06 จากร้านค้า, C-09/C-35 sheet ชำระเงิน, C-16 sheet + ว่าง, C-11 บัตร/วอลเล็ต, C-01 ไม่มีแจ้งเตือน, R-10 แท็บยกเลิก) · modal วาดในเฟรม · `?only=<key>` แสดงเฟรมเดียวเต็มจอ · แก้ `?lang=en` ไม่แปล (ตัวแปลหา `#screen-host` แต่ board ใช้ class)
- `node scripts/shots.mjs` → `review-shots/*.png` 26 ภาพ (Edge headless, ต้องเปิด `node scripts/serve.mjs` ก่อน)

### ไฟล์
- ใหม่: `src/styles/r6.css` · `src/i18n/en-7.js` · `scripts/icon-check.mjs` · `scripts/i18n-sweep.js` · `scripts/shots.mjs` · `scripts/r6-baseline.json` · `review-shots/`
- แก้: index.html · board.html · tokens.css (เพิ่ม `--role-m/-r` และ `--os-*` สำหรับ chrome ของ OS) · board.css · app.css (ลบ CSS แป้นพิมพ์) · app.js · app-state.js · board.js · i18n/index.js · en-2.js · data/content.js · data/notifications.js · data/screens.js · ui/{actions,auth,components,customer,home-icons,merchant,modals,notifications,p2,renderers,rider,shared}.js · scripts/r2-check.mjs · scripts/shots.mjs

### ค้าง / ข้อสังเกต
- วอลเล็ต RMA ในตัวเลือกชำระเงิน = ใส่ตามที่เจ้าของระบุไอคอน wallet · ยังไม่มีการตัดสินใจทางธุรกิจว่ามีวอลเล็ตจริง (ยอดคงเหลือต้องมาจาก server)
- S-06 แสดงแจ้งเตือนของทุก role รวมกัน (บัญชีเดียวหลาย role) — ถ้าจะแยกตาม role ที่ล็อกอินอยู่ต้องเคาะ
- รูปเมนูบางรูปไม่ตรงชื่อเมนู (เช่น กะเพรา = รูปชาเย็น) — เป็นข้อมูลรูปเดิม ไม่ได้แก้รอบนี้
- C-13 (แชท) และ C-07 (sheet เมนู) ไม่ได้แตะ (เจ้าของให้คงไว้ / ออกแบบไว้แล้วรอบก่อน)
- การ์ดลอยบนแผนที่ (C-12 R-05 R-07 R-16 R-17) ยังเป็นการ์ด — เป็น sheet จริงตาม D-025

## R7 (proposal) — 2026-10-15 · ตัวอย่างก่อนปรับทั้งแอป (ยังไม่แตะ style ของแอป)
- เปิด: `samples/r7-sample.html` (ผ่าน `node scripts/serve.mjs` → `/samples/r7-sample.html` · query `?theme=dark` `?palette=saffron` `?hit=1`)
- หน้า C-16 เทียบ 3 แบบ 390×844: **A** = ภาพจริง R6 · **B** Tonal (Material 3: ชิป 32/ตัวควบคุม 40/ปุ่ม 48 · ไอคอน 24 ไม่มีกล่อง · nav 64 + pill 56×32 · พื้นไล่โทนจาก `--brand`) · **C** Grouped (iOS/Grab: ตัวควบคุมสูง 36 แคปซูลทั้งหมด · ปุ่มหลัก 50 · back = chevron · tab bar 52 tint อย่างเดียว · พื้นเทา #F2F1F6 + รายการขาว)
- ค่าของแต่ละแบบอยู่ในตัวแปร CSS ที่ scope `.p-b` / `.p-c` (`samples/r7-sample.css`) พร้อมย้ายเข้า tokens.css เมื่อเจ้าของเลือก · light/dark + โทนสี C-01 ทั้ง 5 ใช้ได้
- ไฟล์ใหม่: `samples/r7-sample.{html,css,js}` · `samples/assets/a-c16-{light,dark}.png` (สำเนา review-shots 05/24) · `review-shots/r7-sample-{light,dark}.png`

## R8 — 2026-10-15 · ระบบหน้าตาทั้งแอป (เจ้าของเลือกผสม R7: สีพื้นจาก C + ปุ่ม/ชิป/ไอคอน/เมนูล่างจาก B · D-032)
สแนปช็อตก่อนรอบนี้: `mockup-archive/2026-10-15-r7-before-r8/` (ไม่ถูกแตะ)

### QA (ก่อน → หลัง)
- `node scripts/r2-check.mjs`: 55 OK / 0 FAIL → 55 OK / 0 FAIL (ไม่ได้แก้สคริปต์)
- `node scripts/icon-check.mjs`: OK → OK (54 ชื่อ · subset 55 · 580 renders) · ไอคอน ✓ ของชิปที่เลือกใช้ ligature `check` ที่อยู่ใน subset แล้ว
- `scripts/layout-sweep.js`: 390×844 = 0 · 360×740 = 0 (128 หน้า/สถานะ)
- `scripts/i18n-sweep.js`: 1 → 0 (เจอ "กลับโหมดลูกค้า" ใน M-02 [รอตรวจ] ที่ไม่มีคำแปลมาตั้งแต่ก่อน R8 → เพิ่มใน `en-7.js`)
- วัดขนาดจริงทุกหน้า (script ในเบราว์เซอร์): ชิป 32 ทั้งหมด · ตัวควบคุม 40 · ปุ่มหลัก ≥ 48 · ไอคอนในปุ่ม 24 ในกล่องกด 48 · nav 64 · indicator 56×32 · ไม่มีปุ่มไอคอนที่มีพื้น/กรอบ ยกเว้น tonal/SOS/FAB ที่ตั้งใจ
- คอนทราสต์: outline #84828C = 3.78:1 บนขาว / 3.37:1 บนเทา · มืด #76747F = 3.73:1 / 4.22:1 · ตัวอักษรชิปที่เลือก (brand-strong บน `--sel`) 5.27–7.02:1 ทุกโทน/role · เส้นคั่น #E2E1E7 = 1.30:1 (จางตามที่อนุญาต) · ข้อความ muted บนพื้นเทา 5.59:1

### ความสูงแถบเมนูล่าง = 64
- ตรวจหน้า m3.material.io/components/navigation-bar/specs (2026-10-15): แบบ baseline 80 ถูกระบุว่า "no longer recommended" ให้ใช้ **flexible navigation bar** · ภาพ measurement: ขอบบน 6 · indicator 32 (กว้าง 56) · ช่องไฟ 4 · ป้าย 16 · ขอบล่าง 6 = **64**

### สิ่งที่แก้ (ระดับ token/ชิ้นส่วน · ทุก role A/C/M/R/S · sheet · modal · push · S-06 · board)
- `src/styles/tokens.css`: สีพื้นใหม่ (`--bg` `--surface` `--chrome` `--surface-2/3` `--line` + `--outline` ใหม่ ทั้ง light/dark) · ระบบขนาด `--chip-*` `--ctl-*` `--btn-*` `--icon` `--icon-sm` `--hit` `--press` `--lead` `--card-r` `--sheet-r` `--nav-*` `--band-gap` `--state-hover/press`
- `src/styles/system.css` (ใหม่ โหลดท้ายสุดใน index.html + board.html): แถบขาวเต็มกว้างของรายการ (การตีความ D-025) · การ์ด/sheet/dialog · app bar + ปุ่มไอคอน (state layer วงกลม 40) · กระดิ่ง + badge 16 · ปุ่ม 48/40 + text button 40 · ชิป 32 + ✓ · segmented · toggle row แบบแบน + checkbox ท้ายแถว · dropdown/ช่องค้นหา 40 (ตัว input เป็นพื้นที่กด 48) · ช่องกรอกขอบ outline · nav bar M3 · วงกลมนำหน้ารายการ 40 + เส้นคั่น inset
- `--sel` (เลือกแล้ว) = brand 12% ผสม brand-soft ประกาศที่ตัวชิ้นส่วน (ไม่ใช่ :root) เพื่อให้ตามโทนสี C-01 และสี role ร้าน/ไรเดอร์
- `src/styles/home.css`: รวม 4 รอบ "visual pilot" ที่ทับกันเหลือชุดเดียว (937 → 299 บรรทัด) · layout C-01 เดิม · การ์ดที่อยู่/บริการ/ออเดอร์/โปร/ร้านใกล้คุณ = ขาว ไม่มีกรอบ/เงา/ไล่สี · สีโทนอยู่ที่ไอคอนบริการเท่านั้น · ช่องค้นหา = ตัวควบคุม 40 · แถวร้านเลื่อนชนขอบจอ · ลบตัวแปร `--home-wash-*` ที่ไม่ได้ใช้แล้ว (home.css + palettes.css)
- ลบสไตล์เก่าที่ตายแล้ว/ถูกแทน: app.css (ปุ่มไอคอนกล่องมีเงา · ชิป pill 48 font 11 · nav เดิม + gradient · ปุ่ม gradient/เงา · การ์ด gradient · field เดิม · deal-*, p2-vehicle-*, p2-chat-history ฯลฯ ที่ไม่มีใน markup · blur ของแถบแชท) · r6.css (filter-chip · bell/nav badge · ปุ่มปิด sheet แบบวงกลมเทา · ขนาดไอคอนนำหน้าเดิม) · flat.css · notify.css · shell.css (พื้นไล่สีแบรนด์)
- JS (ชิ้นส่วนกลาง): `home-icons.js` ขนาดไอคอนส่งเป็น `--icon-size` ให้ CSS ของชิ้นส่วนกำหนดขนาดได้ · `components.js` nav = `.nav-ind` + `.nav-label` · `segmented()` = `.seg` แบ่งช่องเท่ากัน · `iconButton(..., "tonal")` · ไอคอน 24 · `renderers.js` badge แท็บข้อความ · `actions.js` seg รองรับ `.seg-btn` · `notifications.js` กระดิ่ง 24 · `app.js` แตะช่องค้นหาตรงไหนก็ focus
- ปุ่มโทร/แชท/นำทางในเนื้อหา (C-12 C-37 M-05 R-05 R-07 R-16 R-18) = tonal · ปุ่มนำทางบนแผนที่ (R-05 R-07 R-16 R-17) = `map-fab` 56
- ห่อแถวร้านด้วย `.store-list` (C-04 C-05 C-24 C-39) ให้เป็นแถบเดียว · C-05 ห่อผลค้นหาเมนูด้วย `.menu-list`
- ชาร์ต M-13/R-12: พื้นขาว + สีแท่งจาก `--brand` (เดิม hard-code ม่วง #9789ED ทำให้ร้าน/ไรเดอร์เป็นเขียว→ม่วง)
- `board.css` พื้นเฟรม = `--bg`
- Figma: `scripts/export-tokens.mjs` ส่งออกขนาดชิ้นส่วน (`component.chip/control/button/icon/list/card/sheet/nav`) · `state.hover/press` · `color.chrome/outline/sel` (sel คำนวณให้ทุก set) · theme โทนลูกค้าเปิด set ของ C-01 ให้อัตโนมัติ (ปิดของค้างจาก Task C) → `figma/tokens.json` · `figma/README-FIGMA.md` เขียนใหม่ (ลิงก์ · ขั้นตอน · ตารางสรุป · ข้อจำกัด)
- `scripts/shots.mjs --r8` → `review-shots/r8-*.png` 23 ภาพ

### บั๊กเดิมที่เจอระหว่างทางและแก้
- C-24 ปุ่มหัวใจ "นำออกจากร้านโปรด" ไม่เคยขึ้น: regex ใน `renderers.js` หา `class="restaurant-row"` แต่ markup เป็น `class="restaurant-row "` (มีช่องว่าง)

### ตัดสินใจเอง / ยังไม่ทำ
- ช่องค้นหาไม่มีเส้นขอบ (ตาม B/C) — ระบุตัวด้วยไอคอนค้นหา + placeholder · บนพื้นขาว (sheet/การ์ด) ใช้พื้น `--surface-2`
- ช่องกรอกข้อความ (field) คงสูง 48 แต่เปลี่ยนขอบเป็น `--outline` (เจ้าของไม่ได้ระบุขนาด field)
- แถว "ภาษา/ธีม" ใน C-22 M-17 R-15: segmented 3 ช่องไม่พอวางข้างป้ายที่ 360px → ย้ายลงบรรทัดใต้ป้าย (layout เปลี่ยนเพราะขนาดใหม่บังคับ)
- ตัวอักษรเล็ก 9–10px บางจุดบน C-01 (การ์ดออเดอร์ · ร้านใกล้คุณ) และ pill สถานะ 10px ยังไม่แก้ (ไม่อยู่ในขอบเขตรอบนี้)
- `samples/r7-sample.*` คงไว้เป็นหลักฐานข้อเสนอ ไม่ได้แก้

## R9 — 2026-10-15 · สวิตช์รับงานของไรเดอร์ (owner request · D-033 รอเจ้าของยืนยัน)
สแนปช็อตก่อนรอบนี้: `mockup-archive/2026-10-15-r8-before-r9/` (ไม่ถูกแตะ)

### QA (ก่อน → หลัง)
- `node scripts/r2-check.mjs`: 55 OK / 0 FAIL → 55 OK / 0 FAIL (ไม่ได้แก้สคริปต์)
- `node scripts/icon-check.mjs`: OK (54 ชื่อ) → OK (58 ชื่อ · subset 59 · 619 renders) · เพิ่ม `pause_circle` `description` `block` `location_off` ใน subset ทั้ง index.html + board.html (เรียงตัวอักษร)
- `scripts/layout-sweep.js`: 390×844 = 0 · 360×740 = 0 (137 หน้า/สถานะ · +9 สถานะใหม่ของ R-03)
- `scripts/i18n-sweep.js`: 0 · ตรวจ EN เพิ่มเองนอก sweep: dialog · snackbar · toast · push · pill R-10 · แถว R-15 · กล่องแจ้งเตือน R-19 = ไม่มีไทยเหลือ · board `?lang=en` 176 เฟรม ไทยเหลือ 1 จุดเดิม (ค่าใน textarea ของ M-07 ซึ่ง sweep ยกเว้นอยู่แล้ว)
- ทดสอบ flow จริงในเบราว์เซอร์ (สคริปต์กดจริง): เปิด → pending (กดซ้ำไม่มีผล) → ยืนยัน · ปิด + timeout → snackbar → ลองอีกครั้ง → สำเร็จ · เปิด + ถูกปฏิเสธ (เอกสาร/ระงับ/นอกพื้นที่) → การ์ดอธิบาย + ปุ่มแก้ · ปิดระหว่างมีงาน → dialog → "พักหลังส่งงานนี้" → ส่งงานเสร็จ → ออฟไลน์เอง · ปิดประเภทสุดท้าย → ไม่ยอม + toast · ระบบบังคับออฟไลน์ → push + สวิตช์ปิด + การ์ด
- บั๊กที่เจอระหว่างทดสอบและแก้แล้ว: บังคับออฟไลน์ขณะการ์ด "นอกพื้นที่" ยังค้าง → การ์ดเก่าไม่หาย (ตอนนี้ล้าง `refused` เมื่อ server บังคับออฟไลน์)
- ภาพ: `node scripts/shots.mjs --r9` → `review-shots/r9-*.png` 17 ภาพ (ดูแล้วทุกภาพ)

### รูปแบบที่เลือก + เหตุผล
- **สวิตช์ออนไลน์ = แถบสถานะบนสุดของ R-03 (แทน app bar)** ไม่อยู่ใน dock เหนือเมนูล่างแล้ว: แถบเต็มกว้าง (ภาษาเดียวกับ D-032) ที่ **สีของแถบคือสถานะ** — ออนไลน์ = เขียว (success 14%) · พักหลังงานนี้ = เหลือง · ออฟไลน์ = ขาว · คำสถานะ 20px ตัวหนา + จุดสี + บรรทัดรอง · ทั้งก้อนสถานะเป็นปุ่ม `role="switch"` สูง 56 กว้างเกือบเต็มจอ (ถุงมือกดโดนง่าย) + สวิตช์ M3 ทางขวา + กระดิ่งเดิม · ปักบนสุดไม่เลื่อนหาย · อ่านสถานะได้จากระยะแขนกลางแดด
- **แท็บอื่นของไรเดอร์ (R-10 R-11 R-12 R-15)** มี pill สถานะ 32 (พื้นที่กด 48) หน้ากระดิ่ง → แตะไป R-03 · ไม่มีสวิตช์ซ้ำ (แหล่งความจริงเดียว) · เมนูล่าง M3 64 (D-032) ไม่เปลี่ยน
- **ประเภทงาน = แถวสวิตช์** (ไม่ใช่ checkbox/ชิป): สวิตช์ = มีผลทันทีเมื่อแตะ (ตรงกับที่ทุกครั้งยิง API) ส่วน checkbox ตาม M3/HIG = เลือกไว้ก่อนแล้วค่อยกดยืนยัน · ชิปสูง 32 เล็กไปสำหรับถุงมือ และสื่อว่า "กรองรายการบนจอ" ไม่ใช่ค่าที่ส่งไป server · ทั้งแถวสูง 64 เป็นพื้นที่กด
- **ห้ามปิดทั้ง 2 ประเภท = ประเภทสุดท้ายล็อก** (สวิตช์จางลง + แตะแล้วขึ้น toast "เปิดไว้อย่างน้อย 1 ประเภท" + บรรทัดใต้รายการ) — ไม่ใช้ "ปิดหมด = ออฟไลน์" เพราะทำให้ 2 ตัวควบคุมมีความหมายทับกัน และไรเดอร์อาจหลุดออฟไลน์โดยไม่ตั้งใจ · ใช้ทั้งตอนออนไลน์และออฟไลน์ (server ต้องได้ `job_types` ไม่ว่าง)
- **pending = ไม่พลิกสวิตช์ล่วงหน้า (no optimistic flip):** สวิตช์ค้างค่าที่ยืนยันแล้ว หัวสวิตช์กลายเป็นวงหมุน + บรรทัดรอง "กำลังเปิดรับงาน…" + ตัวควบคุมสถานะทั้งหมด disabled จนกว่า server ตอบ (Hard Rule 3) · เหตุผล: ถ้าแสดง "ออนไลน์" ก่อน server ยืนยันแล้วพลาด ไรเดอร์จะนึกว่ารอรับงานอยู่แต่ไม่มีงานเข้า (หรือกลับกัน นึกว่าพักแล้วแต่ยังมีงานเสนอ → อัตรารับงานตก) · latency ปกติ < 1 วินาที รอได้ · ส่งได้ทีละ 1 request เลยไม่มีปัญหาคำตอบสลับลำดับ
- **error = ค่าเดิมคงอยู่ (ไม่ต้อง rollback เพราะไม่ได้พลิก) + snackbar M3 "เชื่อมต่อไม่สำเร็จ · ลองอีกครั้ง"** ลอยเหนือเมนูล่าง ไม่ดันเนื้อหา · หายเองใน 8 วินาที
- **server ปฏิเสธ = การ์ดลอยบนแผนที่ใต้แถบสถานะ** (ไอคอน · เหตุผล 1 บรรทัด · ปุ่มแก้ 1 ปุ่ม): เอกสารหมดอายุ → อัปเดตเอกสาร (R-13) · บัญชีถูกระงับ → ติดต่อศูนย์ช่วยเหลือ (R-14) · นอกพื้นที่ → ดูพื้นที่ให้บริการ · ข้อความจริงให้มาจาก server (reason code + message)
- **ปิดระหว่างมีงาน = dialog ยืนยัน "พักรับงานหลังส่งงานนี้?"** (ไม่บล็อกเฉย ๆ): ปิดทันทีทำไม่ได้เพราะงานยังต้องส่ง · บล็อกเฉย ๆ ทำให้งง · dialog ตั้ง "พักหลังส่งงานนี้" → แถบเหลือง "พักหลังส่งงานนี้ · ไม่รับงานใหม่" สวิตช์ปิด (สวิตช์ = "รับงานใหม่") · แตะเปิดอีกครั้ง = ยกเลิกการพัก · ส่งงานเสร็จ → server ตั้งออฟไลน์ให้
- **server บังคับออฟไลน์** (เช่น ไม่ได้ใช้งาน 30 นาที): push สำคัญ (ปิดไม่ได้) `r-offline` + สวิตช์ปิดเอง + การ์ดบนแผนที่ "ระบบพักรับงานให้แล้ว · รับทราบ" + pill แท็บอื่นเปลี่ยนตาม
- **R-15** ไม่มีสวิตช์ซ้ำ: เพิ่มแถว "สถานะรับงาน" (สถานะ · ประเภท) ลิงก์กลับ R-03
- motion (emil-design-eng): หัวสวิตช์เลื่อน 200ms ease-out · สีแถบ 200ms · วงหมุน 700ms linear (หมุนเร็ว = รู้สึกรอน้อย) · จุดตำแหน่งไรเดอร์มีคลื่น "กำลังหางาน" ตอนออนไลน์ · snackbar เข้า 200ms · `prefers-reduced-motion` ตัดการเลื่อน/คลื่น เหลือวงหมุนช้าลง

### API contract ที่ตั้งใจ (ให้ทีม backend ยืนยัน — mockup จำลองเท่านั้น ไม่มี network)
```
GET   /rider/availability                       -> state (ตอนเปิดแอป / กลับจาก background / หลัง timeout)
PATCH /rider/availability
  Header: Idempotency-Key: <uuid ต่อ 1 การแตะ>   (retry ใช้ key เดิม)
  Body (ส่งเฉพาะฟิลด์ที่เปลี่ยน): { "online": true|false, "job_types": ["food","ride"], "pause_after_current_job": true|false, "client_seq": 42 }
  200 -> state ที่ server ถือ (แอปแสดงตามนี้เสมอ):
        { "online": true, "accepting_new_jobs": true, "pause_after_current_job": false, "job_types": ["food"],
          "active_job_id": null, "forced_reason": null, "server_seq": 1081, "updated_at": "2026-10-15T12:40:00+07:00" }
  409/422 -> { "error": { "code": "documents_expired" | "account_suspended" | "outside_service_area" | "job_types_empty" | "vehicle_not_registered" | "active_job",
               "message": "<ข้อความตามภาษาผู้ใช้>", "action": "update_documents" | "contact_support" | "show_service_area" | null },
               "state": { ...state ปัจจุบัน } }
  5xx / timeout (แอปตั้ง 10 วิ) -> แอปไม่เปลี่ยนค่า · GET เพื่อเช็คก่อน · ยังไม่รู้ผล = snackbar ลองอีกครั้ง
Server -> app (push FCM/APNs + realtime ถ้ามี): "availability_changed" { "state": {...}, "reason": "idle_timeout" | "documents_expired" | "admin" | "job_completed_pause" }
```
- **ลำดับ/ความสอดคล้อง:** แอปส่งทีละ 1 request (ตัวควบคุม disabled ระหว่างรอ) · **state ที่ server ตอบชนะเสมอ** · แอปทิ้งคำตอบ/event ที่ `server_seq` น้อยกว่าค่าล่าสุดที่เห็น · `client_seq` ให้ server ทิ้ง request เก่าที่มาถึงช้า · `Idempotency-Key` กันเปิด/ปิดซ้ำจากการ retry
- `online=false` ระหว่างมี `active_job_id` → server ตอบ 409 `active_job` หรือรับเป็น `pause_after_current_job=true` (ให้เลือกแบบเดียว — mockup ถามผ่าน dialog ก่อนแล้วส่ง `pause_after_current_job: true`)
- ที่เกี่ยวแต่ยังไม่มีในแบบ: ออนไลน์ต้องส่งตำแหน่งเป็นระยะ (location heartbeat) + สิทธิ์ตำแหน่งเบื้องหลัง — server ใช้ heartbeat ที่ขาดหายเป็นเหตุบังคับออฟไลน์ได้

### ไฟล์ที่แตะ
- ใหม่: `src/ui/availability.js` (state · presets · แถบ/pill/แถวสวิตช์/การ์ด/snackbar/dialog · จำลอง API · ตัวช่วยใน review panel) · `src/styles/availability.css` · `src/i18n/en-8.js`
- `src/styles/system.css`: **สวิตช์กลางเป็น M3** (52×32 · ขอบ outline 2px ตอนปิด · หัว 16→24 + ✓ · busy · locked) แทนของเดิมใน app.css (50×28 ไม่มีขอบ คอนทราสต์ราว 1.3:1 ไม่ผ่าน WCAG 1.4.11) — มีผลกับสวิตช์ใน C-22 M-17 R-15 ด้วย (ใหญ่ขึ้น 2×4px · สีเขียวเดิม)
- `src/styles/tokens.css`: `--switch-w/h` `--on-success` `--inverse-surface/on-surface/primary` (light/dark) · `app.css`: ลบสวิตช์เดิม + `--inverse-primary` ตามสี role ร้าน/ไรเดอร์
- `src/ui/p2.js` R-03 ใหม่ · R-10 R-11 pill · `src/ui/rider.js` R-12 R-15 pill + แถวสถานะรับงาน · `src/ui/shell.js` dock รับ `.snackbar` · `src/app-state.js` `avail` แทน `riderOnline` · `src/app.js` ต่อ action + preset (ลบ `rider-online` `p2-task-type` เดิม) · `src/ui/modals-extra.js` dialog `avail-pause` · `src/data/notifications.js` push `r-offline` (สำคัญ) · `src/ui/notifications.js` ผลของ push · `src/data/screens.js` สถานะ R-03 13 แบบ · `src/ui/demo.js` แผงจำลอง server · `src/board.js` preset + เฟรมพิเศษ (dialog · pill R-10/R-11 · แถว R-15) · `src/ui/home-icons.js` + `index.html` `board.html` (ไอคอน 4 · ลิงก์ css) · `scripts/shots.mjs --r9`
- review panel (R-03 R-10 R-11 R-12 R-15): "ผลของการกดสวิตช์ครั้งถัดไป" (สำเร็จ / timeout / ปฏิเสธ 3 แบบ — ใช้ครั้งเดียวแล้วกลับเป็นสำเร็จ) · "มีงานที่กำลังทำ / ส่งงานที่ทำอยู่เสร็จ" · "ระบบบังคับออฟไลน์" · สถานะหน้า R-03 เลือกได้ 13 แบบ
- board: R-03 14 เฟรม (ออฟไลน์ · ออนไลน์ · pending สวิตช์หลัก · pending ประเภทงาน · error snackbar · ปฏิเสธ 3 แบบ · มีงาน · พักหลังงาน · บังคับออฟไลน์ · loading · ผิดพลาด · dialog) + R-10 online/pending pill + R-11 online + R-15 online + push `r-offline` · รวม 176 เฟรม

### ตัดสินใจเอง / ยังไม่ทำ
- ไม่ได้ทำ sample A/B/C เพราะเจ้าของสั่งเปลี่ยนตรง ๆ และ coordinator ให้ตัดสินเอง → ลง D-033 สถานะ "รอเจ้าของยืนยัน"
- เหตุบังคับออฟไลน์ "ไม่ได้ใช้งานนาน 30 นาที" เป็นตัวเลขสมมติ (กฎธุรกิจยังไม่เคาะ)
- R-01 (สมัคร) ยังใช้ checkbox เลือกประเภทรถ — ถูกแล้วเพราะเป็นฟอร์มที่กดส่งทีหลัง ไม่ใช่ค่าที่มีผลทันที
- ยังไม่ส่งออก token สวิตช์/inverse ไป `figma/tokens.json` (`scripts/export-tokens.mjs` ยังไม่รู้จัก token ใหม่)
- ภาพเก่า `review-shots/26-R-03-rider-home.png` `r8-R-03-rider-home.png` เป็นแบบก่อน R9 (เก็บไว้เทียบ)
