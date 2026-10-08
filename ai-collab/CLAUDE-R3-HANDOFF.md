# งานส่งต่อ: Claude แก้ mockup รอบ R3 (ลบไฟล์นี้เมื่องานจบ)

> **อ่านไฟล์นี้เมื่อ:** session ใหม่ถูกสั่งให้ "แก้ mockup R3 ต่อ" · อัปเดตล่าสุด 2026-10-08 (session 2)
> เจ้าของสั่งให้ **Claude แก้โค้ด mockup เอง** สำหรับรายการ R2 (D-020) · Manus ยังเป็นเจ้าของหน้าตา/สี

## 1. สถานะตอนนี้
- **P1 ทั้งหมดที่สคริปต์ตรวจได้ผ่านแล้ว:** `node ai-collab/r2-check.mjs` = **OK 55 · FAIL 0** (ไม่มีหน้าเปล่า ผ่านด่าน STUB/DEAD โดยไม่แก้สคริปต์ และไม่แก้ baseline)
- ลำดับ FAIL ระหว่างทาง: เริ่ม 25 → จบโครงกลาง 23 → จบลูกค้า 18 → จบร้านค้า 14 → จบไรเดอร์ 0
- `node --check` ผ่านทุกไฟล์ · smoke test render ทุกหน้า × ทุก state × 12 ชุดค่า ไม่มี exception / `undefined` / `NaN`
- ลองกดจริงใน browser (เฉพาะ logic ผ่าน JS): ใส่ตะกร้า C-07→C-06 · R-08 ปุ่มยืนยันปลดล็อกหลังถ่ายรูป · R-16 ปุ่มเดียวเปลี่ยนตาม `rideStep` · SOS/ปฏิเสธ/ปิดร้าน/ออกจากระบบ เปิด modal ถูกต้อง · เก็บคูปอง C-39 · ดูภาพจริงแค่ R-04 และ R-05 (สีและระยะ**ยังไม่ได้ตรวจทั้งหมดด้วยตา**)
- **ฉบับสำรองก่อนแก้ (session นี้):** `manus/RMA-Delivery-source/src-backup-R3-20261008-s2/` · ของ session ก่อน: `manus/_backup/claude-0-before-revert/`

## 2. โครงสร้างโค้ดที่เพิ่ม/เปลี่ยน (session นี้)
| ไฟล์ | ทำอะไร |
|---|---|
| `src/ui/actions.js` (ใหม่) | `handleCoreAction(action, el, api)` — handler ใหม่ทั้งหมด (demo / sos / reason / dialog / ride step / proof / เมนู C-07 / ชำระ / ธีม-ภาษา …) · app.js เรียกก่อน chain เดิม |
| `src/ui/modals.js` + `modals-extra.js` (ใหม่) | `modalMarkup` ย้ายออกจาก app.js · modal ใหม่: ออกจากระบบ, SOS, เหตุผลปฏิเสธ/ยกเลิก (`REASONS`), dialog ตามชนิด (`DIALOGS`), ฟอร์มแจ้งปัญหา, ปิดร้านชั่วคราว, ติดต่อลูกค้าไม่ได้, ข้อกำหนด/ความเป็นส่วนตัว |
| `src/ui/demo.js` (ใหม่) | ตัวช่วยสาธิตใน **review panel** (นอกกรอบมือถือ) ต่อหน้า — ปุ่ม `data-action="demo"` ตั้ง state / ไปหน้า |
| `src/ui/components.js` | `appBar` มี `trailing` · เพิ่ม `sosButton` `iconButton` `segmented` `accountFooter` · ปุ่ม bottom nav ของแท็บที่ active ไม่มี `data-route` แล้ว (ใช้ `data-action="nav-top"` เลื่อนขึ้นบน) |
| `src/ui/home-icons.js` + `index.html` | เพิ่มไอคอน close/sos/navigation/add/remove/more/call/… และเพิ่มชื่อไอคอนใน Google Fonts subset (เรียงตามตัวอักษร) |
| `src/app.js` | state ใหม่: `rideStep rideStage proofTaken offerKind menuExtras menuChoice savedCoupons reasonKind dialogKind issueType payOutcome appLang soundOn dealFilter shopPause orderTab` · ราคาเมนูรวมท็อปปิ้ง (`item.extra`) · `ctx.orderCash` · ตัด handler ซ้ำเดิม · handler `logout / open-issue-form / cannot-reach / collect-coupon` **ต้องอยู่ใน app.js** เพราะด่าน DEAD ของสคริปต์ค้นหาแค่ไฟล์นั้น |
| `src/data/content.js` / `screens.js` | `choiceTitle` `extraTitle` ต่อเมนู · state ของ M-10 (5 สถานะ) |
| `src/ui/merchant.js` `rider.js` | `head()` เหลือ app bar อย่างเดียว (ตัดหัวซ้ำ+eyebrow) · เขียนใหม่: M-03, M-10, M-17, R-04, R-05, R-08, R-15, R-16, R-17, R-18 |
| `src/ui/p2.js` | แก้: C-33 (sticky), M-04, M-06, M-07 (ชิปหมวด), R-03 (ปุ่มออนไลน์ sticky), R-06 (sticky), R-07 (แผนที่+SOS+นำทาง) |
| `src/ui/customer.js` | เขียนใหม่: C-07, C-11, C-19, C-22, C-36, C-37, C-39 · C-17/C-23 เปิดฟอร์มแจ้งปัญหา (ไม่วน) · ตัด eyebrow ออกจาก heading |
| `src/ui/renderers.js` `auth.js` | A-01 ไม่มีปุ่ม (แตะเพื่อไปต่อ) · A-02 ภาษาเป็นชิป · A-04 ตัดปุ่มสาธิต · C-20 ตัดข้อความ dev · สถานะย่อย C-11 |

## 3. งานที่ยังค้าง (อัปเดต session 4 — P3 ทำแล้ว)
**P3 ทั้งหมดทำแล้ว (สคริปต์ OK 55 / FAIL 0):** ภาษา th/en สลับข้อความจริง (`src/i18n/` แปลที่ชั้น DOM ผ่าน MutationObserver · ภาษาไทยไม่ถูกแตะ ไบต์เหมือนเดิม รวมถึง C-01) · M-08 ลากเรียง (pointer events + ปุ่ม "ย้ายขึ้น" เป็น fallback) · เสียงแจ้งเตือน M-04/R-04 (WebAudio, เคารพ `soundOn`) · C-05 ปุ่ม × แยก + ค้นหาล่าสุด/ยอดนิยมก่อนพิมพ์ + แท็บผลลัพธ์ · R-12 ช่วงเวลาเปลี่ยนข้อมูลจริง + ชื่อวัน · P3 ที่ Manus ทำไว้แล้ว (C-01 บริการเร็ว ๆ นี้, C-20, C-24, A-03/A-04, A-07, M-02, R-02) ตรวจแล้วอยู่ครบ
**ข้อจำกัดที่รู้:** คำแปล en = ร่างของ Claude · ข้อความที่ไม่เคย render ในสถานะที่ทดสอบอาจยังเป็นไทยใน en (ดูรายการจาก `node` smoke ในรายงาน) · ข้อความที่พิมพ์เอง (แชท) ไม่แปล · review panel/แถบซ้ายคงไทย (เครื่องมือ reviewer) · เสียงเป็น beep สังเคราะห์ (browser ต้องมีการกดหน้าเว็บอย่างน้อย 1 ครั้งก่อนจึงเล่นเสียงได้)
**การตัดสินใจที่เจ้าของเคาะแล้ว:** D-021…D-024 (ดู `DECISIONS.md`) — ห้ามเปลี่ยนเอง
**ส่งต่อ Manus:** `to-manus.md` รอบ R4 + `SESSION-HANDOFF.md` §2A เขียนแล้ว
**สำรอง:** `src-backup-R3-20261008-s4/` (ก่อน P3) · `-s3/` (ก่อน P2) · `-s2/` (ก่อน P1)

## 4. กติกาที่ยังต้องยึด
1. ห้ามเขียนไฟล์ภาษาไทยผ่าน PowerShell / heredoc — ใช้ Edit/Write หรือไฟล์ Python ที่เขียนด้วย Write แล้วรัน
2. แก้ที่ renderer ของหน้านั้น — ห้ามเพิ่ม `.replace()` บน HTML ที่ render แล้ว · ห้ามหน้า placeholder
3. ไม่เปลี่ยน: รหัสหน้าจอ · hash URL · ทิศทาง Aurora · สีแยก role · `DECISIONS.md` · หน้า `C-01`
4. จบงานกลุ่มไหน รัน `r2-check.mjs` + `node --check` ทุกไฟล์ที่แก้

## 5. จบงานต้องทำ
- เจ้าของเปิดดูหน้าจอจริง (รายการหน้าที่ต้องดูด้วยตาอยู่ในรายงานท้าย session) → แล้วค่อยลบ `src-backup-R3-*`, `manus/_backup/`
- `docs/STATUS.md` ปรับแล้ว · `ai-collab/SCREENS.md` ยังไม่ต้องแก้ (ไม่มีหน้าเพิ่ม — ฟอร์มแจ้งปัญหาเป็น modal ไม่ใช่ `C-40`; ถ้าอยากเป็นหน้าแยกให้เสนอรหัสใน `REVIEW-NOTES.md`)
- แจ้ง Manus ผ่าน `manus/RMA-Delivery-source/SESSION-HANDOFF.md` ว่า Claude แก้อะไร (ยังไม่ได้ทำ — ทำเมื่อเจ้าของตรวจรับ)

---

## 5. Owner review feedback — 2026-10-08 (after P1–P3) · งานค้างรอบถัดไป

เจ้าของเปิดดู mockup แล้วสั่งแก้ตามนี้ (ยังไม่ได้ทำ ยกเว้นที่ติ๊ก):

### 5.0 ทำแล้วใน session นี้
- [x] C-01 สีหาย: `app.js` ไม่ได้ตั้ง `data-home-palette` บน `<html>` (หายตั้งแต่ R3 recovery ไม่มีใน backup ชุดไหน มีแค่ใน `manus/_recovered-2026-10-07-2205/src/app.js`) → เพิ่มบรรทัดตั้งค่า default `aurora` ใน `render()` แล้ว · **ยังไม่ได้ยืนยันด้วยตาบน browser**

### 5.1 โครงกลาง
- [x] (ทำแล้ว 8 ต.ค. · `app.js` 393 บรรทัด ใกล้เพดาน 400 · **ยังไม่ได้ยืนยันด้วยตา**) กู้ตัวเลือกโทนสี 3 แบบของ C-01 ใน review panel (Aurora + อีก 2 โทน: lagoon และอีกหนึ่ง — ดู `HOME_PALETTES`, markup `palette-options`, handler `[data-home-palette]` ใน `manus/_recovered-2026-10-07-2205/src/app.js` บรรทัด ~16–25, 53, 102, 164–165 · ค่า localStorage `rma-home-palette` · CSS ตัวแปรอยู่ใน `home.css` ครบแล้ว ต้องเช็กว่า CSS ของ `.palette-option` ยังอยู่ใน `app.css` หรือไม่)

### 5.2 ลูกค้า
- [ ] C-01: ส่วน "บริการเพิ่มเติม" layout ยังไม่สวย · "ร้านอร่อยใกล้คุณ" ต้องแสดงดาว/คะแนนของร้าน (C-01 อนุมัติแล้ว — รอบนี้เจ้าของสั่งแก้เอง)
- [ ] C-07: ผ่าน แต่แก้ตัวเลือกรายการให้เป็น checkbox/radio ที่เห็นชัด (กลุ่มบังคับเลือก 1 = radio · ท็อปปิ้ง = checkbox) — หมายเหตุ: สวนทางกับ G8 ของ R2 ที่ให้เป็นแถวเลือก → ใช้ control ที่ออกแบบแล้ว ไม่ใช่ input ดิบของ browser
- [ ] C-12: ผ่าน แต่แก้ layout ข้อมูลใน bottom sheet
- [ ] C-04, C-06: **ย้อนกลับไปแบบเดิมก่อนแก้** (ก่อน P1 = `manus/RMA-Delivery-source/src-backup-R3-20261008-s2/`) แล้วแก้แถวรายการ: รูปอยู่ซ้ายเต็มความสูงแถว · รายละเอียดอยู่ขวา · ปุ่ม + เป็นวงกลม ชิดขวาล่าง
- [ ] C-13 (แชท): **ย้อนกลับไปแบบเดิมก่อนแก้** (ก่อน P2 = `src-backup-R3-20261008-s3/` · ถ้าหมายถึงก่อน P1 ใช้ `-s2`) — ต้องตัดสินใจว่าจะเก็บ logic แชทตาม role (G12) + ปุ่มแชทใน M-05 ไว้หรือไม่ → ถามเจ้าของ

### 5.3 ร้านค้า
- [ ] M-06: แถวรายการเมนูพัง (ดูภาพที่เจ้าของส่ง: ชื่อ+ราคา+สถานะถูกห่อเป็นกล่องปุ่มสีเทามีขอบ ตัวหนังสือชิดกัน "จัดการจาก Smart Kitchen" หลุดไปอยู่ใต้กล่อง และแถวล่างถูกปุ่ม sticky "+ เพิ่มเมนูใหม่" บัง) → น่าจะเป็น `<button>` ที่ไม่มี class/reset ครอบแถว · ต้องจัดเป็นแถวรายการปกติ + เว้นระยะล่างให้พ้นปุ่ม sticky

### 5.4 ไรเดอร์
- ไม่มีแก้ · **คำถามค้างถึงทีม (business):** โมเดลรายได้/การเก็บค่า service ของแพลตฟอร์มมาจากไหนบ้าง (ค่าคอมฯ ร้าน · ส่วนแบ่งค่าส่ง/ค่าโดยสารจากไรเดอร์ · ค่าบริการจากลูกค้า ฯลฯ) → ใส่ "คำถามค้าง" ใน `docs/STATUS.md`

### 5.5 สำคัญ — หลัก UI ทั้งแอป (ทำทีหลัง · ต้องไล่ทุกหน้า)
- เจ้าของ: **อย่าทำ container ซ้อนเยอะ** ให้เนื้อหาอยู่บนพื้นเดียวกัน โดยเฉพาะรายการและส่วนต่างๆ แบ่งด้วย **เส้นคั่น** แทนกล่อง (ไม่นับ card จริงและปุ่ม) เพราะเป็นแนว mobile ที่ถูกต้อง
- เจ้าของอนุญาตให้หา skill ด้าน mobile UI จาก git repo ที่น่าเชื่อถือมาเพิ่มได้ (ต้องแจ้งแหล่ง + เหตุผลก่อนติดตั้ง)
- ควรจดเป็น decision ใหม่ใน `ai-collab/DECISIONS.md` (D-025) และใส่ใน brief ถึง Manus เพราะเป็นเรื่องหน้าตา

### 5.6 ข้อควรระวังสำหรับ session ถัดไป
- งาน 5.2/5.3/5.5 ส่วนใหญ่เป็น **layout/หน้าตา** ซึ่งตาม Hard Rule 5 + D-020 เป็นของ Manus → ถามเจ้าของก่อนว่าให้ Claude แก้เองหรือส่ง brief ให้ Manus
- มีการแก้ `src` โดยฝ่ายอื่น (น่าจะ Manus รอบ R4) เวลา 14:32–14:34 วันที่ 8 ต.ค.: `app.js`, `components.js`, `live.js`, `app.css` (+56 บรรทัด "R4 visual polish") · backup ของฝ่ายนั้น = `manus/_backup/R4-P1-20261008-143230/` → ก่อนย้อนไฟล์ใดจาก `-s2/-s3` ต้องย้อนเฉพาะ case ของหน้านั้น ห้ามทับทั้งไฟล์
- สำรอง `src` ก่อนเริ่มทุกครั้ง · `node ai-collab/r2-check.mjs` ต้องคง FAIL 0 (การย้อน C-04/C-06/C-13 อาจทำให้บางด่าน FAIL → รายงานเจ้าของ ไม่แก้สคริปต์เอง)
