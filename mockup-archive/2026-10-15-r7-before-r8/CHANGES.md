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
