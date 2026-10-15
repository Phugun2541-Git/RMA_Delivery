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
