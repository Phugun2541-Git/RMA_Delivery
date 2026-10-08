# แผน R1 — RMA Delivery Mobile Mockup

## ขอบเขต
เว็บแอป static เดียว ไม่มี backend สำหรับ mockup บนมือถือ ความกว้างฐาน 390px และขยายเต็มจอบนมือถือจริง ครบ 80 หน้าจอ A (7), C (33), M (17), R (18), S (5) ตาม `ai-collab/SCREENS.md` พร้อม hash URL เช่น `/#/C-06`, แผง review และ interaction ด้วยข้อมูลตัวอย่างไทยที่ต่อเนื่องกัน ขอบเขตผู้ใช้: ลูกค้า ร้านค้า และไรเดอร์/คนขับ; MVP อาหารกับรับส่งคน และติดป้าย phase ถัดไปสำหรับ C-30, C-31, C-32 และ C-34; C-33 (เรียกรถ) เป็น MVP.

## Design direction (อนุมัติ 2026-10-07)
- **Design Movement:** warm urban utility — อรรถประโยชน์แบบแอปเมืองร่วมสมัย ผสานพื้นผิวอุ่นและระบบข้อมูลที่ชัด
- **Core Principles:** อ่านง่ายก่อนตกแต่ง; จุดกดใหญ่และมีสถานะชัด; ใช้สีเป็นตัวบอกงาน/สถานะ; หน้าตาแต่ละ role ใช้ภาษากลางเดียวกัน
- **Color Philosophy:** warm ivory/slate เป็นฐานกลาง; royal plum-indigo เป็นสีหลักที่ต่างจากสีเขียว/ส้ม/ชมพูของคู่แข่ง; สีสถานะแยกการสำเร็จ/เตือน/ผิดพลาด และตรวจ contrast AA
- **Layout Paradigm:** mobile-first single-column, sticky role navigation and bottom action; desktop แสดงอุปกรณ์มือถือกว้าง 390px เคียง review rail
- **Signature Elements:** แถบ accent สีคราม-พลัม; chip สถานะทรง capsule ที่อ่านได้; ลายเส้นแผนที่/จุดแวะเชิง schematic
- **Interaction Philosophy:** ทุก control ให้ผลตอบสนองทันทีใน mock; ปุ่มหลักมี active/loading/disabled; action แจ้ง snackbar หรือ sheet; state selector เปิดสถานะสำหรับ review
- **Animation:** transition 180ms สำหรับ state/sheet, 240ms สำหรับ navigation; reduced-motion respected; ไม่มี blur/parallax
- **Typography:** IBM Plex Sans Thai สำหรับไทย + Inter สำหรับเลข/ละติน โดยมี system fallback; hierarchy 12/14/16/20/24/30px; ราคาและตัวเลขสำคัญ tabular
- **Brand Essence:** บริการเมืองที่เชื่อมอาหารกับการเดินทางให้เข้าใจง่าย — ชัดเจน, เป็นมิตร, ไว้ใจได้
- **Brand Voice:** กระชับ สุภาพ เป็นกันเอง; ตัวอย่าง “มื้อนี้อยากกินอะไรดี?” และ “ไรเดอร์กำลังไปรับออเดอร์ของคุณ”
- **Wordmark & Logo:** ไม่มีโลโก้ตามข้อกำหนด; ใช้ plain-text placeholder “RMA Delivery” เท่านั้น
- **Signature Brand Color:** Royal Plum Indigo `#5945C7`
- **Visual refinement pass (7 ต.ค. 2569):** ใช้ Aurora เป็นฐาน; ภาพอาหารอยู่เฉพาะด้านหลัง greeting/address/search ของ C-01 และชิดขวา ไม่ทำภาพเต็มหน้า/การ์ดรูปใหม่; ถ่ายทอด canvas gradient บาง, surface/card เงานุ่ม และ Material Symbols Rounded ผ่าน shared components ครบ 80 routes.
- **Role accent:** Customer ใช้ Plum base, Merchant ใช้ deep teal, Rider ใช้ blue; สี success/warning/danger/info ยังคงเป็น semantic และไม่เปลี่ยนตาม role.

## Implementation
- แยกหน้าจอเป็น metadata ตามรหัส และ renderer ตาม page family (auth, customer discovery/order/trip/profile, merchant, rider, shared states) เพื่อลดการซ้ำและคุมความสม่ำเสมอ โดยหน้าทั้ง 80 มี content/actions เฉพาะบริบท ไม่ใช่หน้าเปล่า
- ใช้ vanilla HTML/CSS/JavaScript modules และ browser History API hash routes; route state และ theme/state selector เก็บใน session/local storage เฉพาะ prototype เท่านั้น
- ข้อมูลในตัว: ลูกค้า “พิมพ์ชนก วัฒนกุล”, ร้าน “ครัวบ้านสวน รัชดา”, ไรเดอร์ “ธนกร ใจดี”; ตัวอย่าง order `RM-261007-1842`; ชื่อ/เบอร์/ที่อยู่/ทะเบียนสมมติและปิดบางหลัก
- ใช้ local interactions: ปุ่ม/แท็บ/back/sheets/dialog/snackbar, searchable demo data, editable forms, cart quantity/amount recalculation, mock order lifecycle, rider dispatch/pickup/drop-off, switching role, map canvas schematic.
- Images ใช้ URL จาก asset search ที่เลือกสำหรับหน้าร้าน/อาหาร พร้อม fallback ภาพ placeholder ใน CSS; ไม่ต่อ Maps/payment/auth จริง
- Review panel มีสารบัญ role, 80 routes, 9 flow shortcuts ตามข้อ 4 ใน brief (รวมทางเดินรับงานพ่วง 5b), current screen ID, theme switch และ state selector เฉพาะหน้าที่มี state fixtures
- Responsive breakpoints: desktop review workspace + 390px phone shell; <= 520px phone shell เต็มจอและ review panel เป็น floating drawer; ทดสอบ width 320px และ text zoom-safe layout.

## Project structure
- `index.html` — document shell, metadata, font preload, route mount points.
- `src/styles/tokens.css` — light/dark CSS variables; `src/styles/app.css` — shared components and responsive layout.
- `src/data/screens.js` — screen IDs, labels, roles, categories, phase tags.
- `src/data/content.js` — Thai demo data, routes/flows, store/menu/person fixtures and per-screen copy.
- `src/ui/components.js` — app bars, cards, buttons, forms, bottom nav, sheets, dialog, snackbar, badges.
- `src/ui/renderers.js` — role/page family composition and screen-specific panels.
- `src/app.js` — hash navigation, review panel, theme/state, dialogs and mock interactions.
- `public/manus-routes.json` — complete route declaration including each hash screen.
- `scripts/serve.mjs`, `scripts/build.mjs` — local strict-port server and dependency-free static build to `dist/`.
- `tokens-draft.md`, `REVIEW-NOTES.md` — requested handoff docs; `TODO.md` — complete outcome clauses.

## Build/publish workflow
Use the initialized Local First project as the source of truth; create static source files in this directory. Build `dist/` locally and preserve that output in the Managed checkpoint because the platform static build is the no-build command `true` with `dist` as its output directory. Generate `tokens-draft.md` and `REVIEW-NOTES.md` from the actual shipped CSS/data, and package source plus `dist/` while excluding `.manus-webdev/`, `.git` metadata, `.work/`, runtime logs and other machine-only artifacts. Synchronize the reviewed website source and request publication using the WebDev checkpoint/publish flow. Only return a permanent public URL if publication succeeds; otherwise state the precise blocker and provide local preview separately.
