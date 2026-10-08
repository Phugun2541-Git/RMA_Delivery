# RMA Delivery — REVIEW NOTES (R1)

วันที่ทำ mockup: 8 ตุลาคม 2569 · ใช้ประชุม review ก่อนล็อก design system/API · อ้างอิง `ai-collab/SCREENS.md` และ `ai-collab/DECISIONS.md`.

## 1. ทิศทางดีไซน์

- **Warm urban utility:** พื้นผิว ivory/slate อุ่น ๆ กับ royal plum-indigo `#5945C7` ให้ความรู้สึกเป็นบริการเมืองที่ไว้ใจได้ และแยกโทนจากเขียว/ส้ม/ชมพูของคู่แข่งตาม brief.
- เน้นอ่านง่ายและทำงานระหว่างมือเดียว/หน้าครัว: ปุ่มเด่น, ราคา/สถานะเห็นชัด, touch target หลักอย่างน้อย 48px; ใช้ลำดับข้อมูลแทนการตกแต่งหนัก.
- ใช้ component, type scale, chip/badge และสี semantic ชุดเดียวกันทุก role; โครงหน้ามือถือฐาน 390px อยู่กับ review rail บน desktop และเต็มจอบนจอเล็ก.
- แผนที่เป็น schematic, bottom sheet ใช้เฉพาะเนื้อหาต่อเนื่อง, snackbar สื่อผลการกระทำ; animation สั้นและเคารพ `prefers-reduced-motion`.
- Light/dark เป็น draft สำหรับ review ไม่ล็อก final; **ไม่มีโลโก้** ตาม D-011 — ใช้ข้อความ “RMA Delivery” เท่านั้น. ภาพอาหารที่ใส่ใน platform project card เป็น thumbnail เพื่อให้ค้นโครงการ ไม่ใช่โลโก้ในแอป.

## 2. ขอบเขตและ flow ที่ครอบคลุม

ทำครบ **81/81 screen IDs** ตาม source list: A 7, C 34 (เพิ่ม C-39), M 17, R 18, S 5; hash route อยู่ใน `/#/<ID>` และมี route manifest 81 หน้า + root (รวม 82 routes).

- เข้าระบบครั้งแรก: A-01 → A-02 → A-03 → A-04 → A-05 → A-07 → C-01.
- ลูกค้าสั่งอาหาร: C-01 → C-04 → C-06 → C-07 → C-08 → C-09 → C-11 → C-12 → C-15.
- ลูกค้าใช้ดีล: C-01 → C-39 → กดรับคูปอง → C-10 → C-09; กดดีลของร้าน → C-06 และทางเข้าค้นอาหารจาก C-01 → C-04 ยังคงอยู่.
- ลูกค้าเรียกรถ: C-01 → C-33 → C-35 → C-36 → C-37 → C-38.
- ร้านรับ order: M-04 → M-05 (กำลังทำ → พร้อมส่ง → ส่งมอบไรเดอร์) → M-03.
- ไรเดอร์ส่งอาหาร: R-03 → R-04 → R-05 → R-06 → R-07 → R-08 → R-09.
- งานพ่วงอาหาร: R-05 → R-04 → R-18 → R-06 → R-07 → R-08 → R-09; ลูกค้าเห็นงานแวะใน C-12.
- คนขับรับส่งคน: R-03 → R-04 → R-16 → R-17 → R-09.
- สมัครร้าน/ไรเดอร์ และสลับ role: C-19/A-06 ↔ M-01/M-02, R-01/R-02 และ C-19 ↔ M-17 ↔ R-15.
- กลุ่ม **phase ถัดไป** ติดป้ายตาม source: C-30, C-31, C-32, C-34; C-33 และ C-35–C-38 เป็น flow เรียกรถรับส่งคน MVP.

mock ทุกอย่างอยู่ใน browser: cart/checkout, theme, state, role mode, เมนูขายหมด, order status, chat และ ride/payment response เป็นตัวอย่างในหน้าเว็บเท่านั้น; ไม่มี backend, API, OTP จริง, การโอนเงินจริง, geocoding, Maps SDK หรือ push notification.

## 3. ตารางสมมติฐานที่ทีมต้องเคาะ

| รหัสหน้า | สมมติว่าอะไรใน mockup | ทีมต้องเคาะอะไร |
|---|---|---|
| A-03/A-04 | เบอร์ถูกปิดบางหลัก, OTP ตัวอย่างคือ `123456`, login/LINE ไม่เชื่อม provider; ตัวนับและ resend จำลอง | OTP provider, จำนวนครั้ง/อายุรหัส, lockout, LINE login และ verification policy |
| C-04/C-06/C-09 | ร้านตัวอย่าง 4 ร้าน, ส่ง ฿10, service fee ฿5, minimum order ฿99 สำหรับร้านหลัก | ระยะ/โซนส่ง, minimum, วิธีคิด service fee, ภาษีและร้านที่อยู่นอก Smart Kitchen |
| C-10/C-11/C-14 | โค้ด RMA40 ลด 20% สูงสุด ฿40 เมื่อครบ ฿150; ส่งฟรีลด ฿15; มี PromptPay/บัตร/เงินสดเป็นภาพจำลอง; คืนเงิน 3–5 วันทำการ | วิธีชำระจริง, เก็บเงินสด/เก็บปลายทาง, เงื่อนไขโค้ด, ยกเลิกได้ถึงสถานะไหน, ใครรับผิดชอบค่าธรรมเนียม/คืนเงินและ SLA |
| C-35/C-38 | ตัวอย่างรถ/ราคา/จำนวนที่นั่ง/ETA: มอเตอร์ไซค์ 1 ที่ ฿42/3 นาที; รถประหยัด 4 ที่ ฿86/6 นาที; รถใหญ่ 6 ที่ ฿125/9 นาที; พรีเมียม 4 ที่ ฿174/8 นาที | ชนิดรถและราคาในพื้นที่, dynamic pricing, จำนวนสัมภาระ/คน, ค่ารอ/ยกเลิก, คูปอง, วิธีคิดราคาสุดท้าย |
| C-36/C-37/R-16/R-17 | หา/พบคนขับ, ETA, จุดรับ, การโทร/ฉุกเฉินเป็น state จำลอง; ค่าโดยสารตัวอย่างคนขับ/ผู้โดยสาร ฿86 | matching timeout, safety/insurance, การแชร์ trip, SOP ฉุกเฉินและช่องทางจริง, no-show และ waiting fee |
| M-04/M-11/M-12 | ร้านมีเวลา accept 45 วินาที, รอบโอนอังคาร/ศุกร์; ตัวอย่าง platform fee 15% | เวลารับ order จริง, commission/fee และฐานคำนวณ, payout cut-off, VAT/เอกสารบัญชี, เงื่อนไขร้านปิด |
| M-10/M-06 | ร้านหลัก sync 18 เมนูจาก Smart Kitchen และสต็อกอัปเดตแบบจำลอง | วิธีผูก account, API/event contract, authoritative source ของเมนู/ราคา/stock, retry/idempotency, วิธีจัดการร้านที่ไม่มี POS |
| R-04/R-18/C-12 | งานพ่วงเพิ่ม 1.4 กม., 8 นาที, ค่าตอบแทน +฿18; ตัวอย่างระบุสูงสุด 2 order | รัศมี/พื้นที่ที่อนุญาต, จำนวนงานพ่วงสูงสุด, คำนวณรายได้, ปฏิเสธได้หรือไม่ และสื่อ ETA ให้ลูกค้าอย่างไร |
| R-05/R-06/R-07/R-08 | ส่งอาหารด้วยมอเตอร์ไซค์; ค่าตอบแทนตัวอย่าง ฿52 + ทิป; เลขรถ/บุคคลเป็นข้อมูลแต่งขึ้น | สูตรรายได้และ incentive, proof-of-delivery, handling เงินสด, dispute และเอกสารคนขับตาม D-016 |
| R-03/R-16/R-17 | เลือกประเภทที่พร้อมรับทีละแบบ; ระหว่างรับส่งคนไม่มีงานเข้า; ระหว่างส่งอาหารอาจรับเฉพาะงานพ่วงอาหาร ตาม D-014 | วิธี enforce ที่ backend และ race conditions ตอนมี event/offer ค้างขณะสลับประเภทงาน |
| C-30/C-31/C-32/C-34 | สร้างงานส่งของและบริการ (ซ่อมแอร์/แม่บ้าน) เป็นภาพอนาคต; ตัวอย่างยังไม่สร้างธุรกรรม | catalog, ขอบเขตงาน, ราคา, cancellation, การจอง/ผู้ให้บริการ และ release criteria ของ phase ถัดไป |
| ทุก role | ชื่อลูกค้า/ร้าน/ไรเดอร์, เบอร์, ที่อยู่, เลขทะเบียน, bank account, รีวิว, order และยอดรายงานเป็นข้อมูลสมมติ; theme เก็บใน localStorage | เปลี่ยน fixtures ก่อนสาธิตต่อภายนอก; ยืนยัน privacy copy, profile consent และ data retention ใน product จริง |

> ตัวเลขค่าตอบแทน/ค่าธรรมเนียม/ราคาในตารางเป็น **สมมติฐานเพื่อให้ review เห็นภาพเท่านั้น** ไม่ใช่คำมั่นหรือข้อกำหนดธุรกิจ.

## 4. เทียบรายการหน้า

- **เพิ่ม:** `C-39` ดีล / โปรโมชัน — ตรงกับรายการกลางใน `SCREENS.md` และ D-018; เพิ่มใน source metadata, review panel และ route manifest แล้ว.
- **รวม:** ไม่มี.
- **เสนอให้ตัด:** ไม่มี.
- รักษารหัสเดิมทั้งหมดและคง gap `C-25`–`C-29` ตาม source; ไม่มีการสร้างรหัสทดแทนหรือแก้ไฟล์กลางนอกเขต Manus. ป้าย phase ของ C-30/31/32/34 สอดคล้อง `SCREENS.md`; C-33 และ C-39 เป็น MVP.

## 5. Bottom navigation และสลับ role

| Role | 5 แท็บ | เหตุผล |
|---|---|---|
| ลูกค้า | หน้าหลัก C-01 · ดีล C-39 · รายการ C-16 · ข้อความ C-18 · บัญชี C-19 | โปรโมชันและคูปองอยู่ใกล้มือ; การค้นร้าน/อาหารยังเข้าจาก C-01 → C-04 และประวัติ/ติดตาม/การสื่อสารยังอยู่ในแท็บเดิม |
| ร้านค้า | ออเดอร์ M-03 · เมนู M-06 · รายงาน M-13 · ช่วยเหลือ M-16 · บัญชี M-17 | ให้การรับ/จัดการ order เป็นจุดแรก; เมนูและยอดขายอยู่ใกล้มือ; บัญชี/Smart Kitchen อยู่รวมในหน้าร้าน |
| ไรเดอร์ | แผนที่ R-03 · งาน R-10 · รายได้ R-11 · รายงาน R-12 · บัญชี R-15 | เน้นความพร้อมออนไลน์/พื้นที่, งาน, รายได้ และเอกสารรถ; จำกัด 5 แท็บตาม brief |

ปุ่ม `⋯` มุมขวาบนเปิดหน้าบัญชีของ role ปัจจุบัน (C-19/M-17/R-15); ปุ่ม “สลับ role” บนหน้าบัญชีไป A-06. เหตุผล: ลดการสลับผิดระหว่างกำลังทำงาน และทำให้ผู้ใช้เห็น context ก่อนเปลี่ยน. Review rail เป็นทางลัด reviewer อีกเส้นหนึ่ง ไม่ใช่การสลับข้อมูลบัญชีจริง.

## 6. คำถามสำหรับ review

### ถึง Claude — เทคนิค/API
1. API ownership และ state transition/event contract ของ order ตั้งแต่ Smart Kitchen → Delivery → rider → customer คืออะไร; สถานะไหนเป็น source of truth?
2. Smart Kitchen sync: วิธี auth/bind ร้าน, menu/stock change event, retry และ conflict behavior ที่ backend รองรับมีอะไรบ้าง?
3. API ต้องแยก rider task type/active job อย่างไรเพื่อ enforce D-014 และป้องกันงานชนกัน; job bundle payload รวม ETA/ค่าตอบแทนอย่างไร?
4. Navigation/deep-link route ID จาก 80 mock screens ควร map เป็น Flutter route/feature boundaries อย่างไร; `C-30`–`C-34` จะ version/gate phase อย่างไร?
5. Payment/cancellation/refund API, callback idempotency, delivery fee, commission และ role-specific session/permission contract ที่ต้องส่งให้ frontend มีอะไรบ้าง?

### ถึงเจ้าของ — ธุรกิจ/การปฏิบัติงาน
1. ยืนยันค่าธรรมเนียมร้าน, ค่าส่ง/service fee, รอบโอน, payment channels, cash collection และ refund timeline.
2. เคาะ vehicle catalog, fare/ETA, wait/no-show/cancel fees, seat/luggage policy และมาตรฐาน safety/ฉุกเฉิน.
3. เคาะระยะ/พื้นที่และจำนวนงานพ่วงสูงสุด, extra compensation/ETA, accept timeout และกติกาปฏิเสธ.
4. ยืนยันข้อมูล/เอกสารสมัครร้านและคนขับ (โดยเฉพาะรายการจริงตาม D-016), การอนุมัติและเวลารอ.
5. กำหนด Smart Kitchen contract และ onboarding ร้านที่ไม่มี Smart Kitchen; ใครเป็นเจ้าของราคา/สต็อก.
6. ระบุขอบเขต catalog/ผู้ให้บริการ/การจองของส่งของและบริการก่อนเริ่ม phase ต่อไป.
7. เมื่อชื่อผลิตภัณฑ์เคาะแล้ว ค่อยตัดสิน brand/logo; รอบนี้ใช้ placeholder ตาม D-011.

## 7. ขอบเขตการตรวจ

- Smoke-render ทุก screen ID และ state fixtures, build static output, ตรวจ 81 hash routes จาก source; ทดสอบ click-flow เชิงโครงสร้างของ C-39, coupon, M-07/M-08 และ Merchant → Rider → Customer แล้ว. Browser visual QA ยังต้องทำเมื่อ local preview เปิดให้ In-App Browser เข้าถึงได้.
- Asset ภาพอาหารใช้ URL ที่ค้นมาและมี CSS gradient fallback; ต้องตรวจสิทธิ/เลือกภาพ production ที่อนุญาตก่อนเผยแพร่แอปจริง. Google Fonts ต้องมี network; system fallback อยู่ใน stack.
- ไม่มีข้อมูล/การชำระเงินจริงหรือ API. ปุ่มโทร/นำทาง/อัปโหลด/ฉุกเฉินและการกรอกบางส่วนเป็น prototype response; อย่าใช้แทนระบบ production.

## 8. สถานะ QA และ handoff

- `node --check` ผ่านทุกโมดูล; smoke render ผ่าน **81/81 หน้าจอ**; static build ได้ **82 routes** (root + 81 deep links); route-link assertions ผ่าน **184 links**; interaction assertions ของ C-39, M-07/M-08, handoff links, back-to navigation และ C-06 menu UX ผ่าน.
- Token audit เทียบ CSS variables กับ draft ครบ 23 color tokens; ตรวจ 38 คู่สีของ Light/Dark, คู่ต่ำสุด **4.91:1**. เป็นการตรวจ token pairs ไม่ใช่ WCAG audit ทั้งผลิตภัณฑ์.
- Browser spot-check หลัง navigation/menu patch ผ่านบน preview จริง: C-01 → C-04 → global back กลับ C-01; direct C-06 มี compact icon back 1 ปุ่ม, account button บน app bar 0 ปุ่ม, C-06 แสดง “เพิ่ม”/quantity/modifier note/sticky cart และ screenshot ตรวจ layout แล้ว. Full visual QA ของ C-01 light/dark, C-12, M-03, R-03, R-05 และ viewport 390/320px ยังไม่ถือว่าผ่าน.
- Publish **ยังไม่สำเร็จ**: `git fetch manus` ผ่าน Managed Git ล้มเหลวด้วย Windows Schannel `SEC_E_NO_CREDENTIALS`; ไม่มี checkpoint/remote commit จึงยังไม่มี permanent URL. Static `dist/` และ build config พร้อมแล้ว. เมื่อ Git credential ของ WebDev ใช้งานได้ จึง fetch/ตรวจ canonical main, checkpoint, publish และตรวจ public URL ต่อ; ห้ามอ้าง sandbox URL แทน.


### Follow-up: credential helper diagnosis (7 ตุลาคม 2569)

- `GET config` ยืนยัน provider เป็น Manus, static build ใช้ `dist/`, `auto_publish=false`, และยังไม่มี live deployment; project `secrets` ว่างเป็นค่าของแอป ไม่ใช่หลักฐานสถานะ Managed Git credentials.
- การ fetch ปกติให้ `SEC_E_NO_CREDENTIALS`. การทดสอบ TLS backend แบบชั่วคราวครั้งเดียวเปิดเผยว่า Git เรียก `__addon_git_credential` ไม่สำเร็จ (`Permission denied`); จากนั้น fallback ต้องใช้ `/dev/tty` ซึ่งไม่มีใน command host จึงอ่าน username ไม่ได้. นี่ชี้ไปที่การ launch/permission boundary ของ Host credential helper มากกว่าพิสูจน์ว่า password/token ของบัญชีผิด.
- ไม่มีการอ่าน แสดง หรือขอ credential value และหยุด retry หลังผล permission error. เมื่อ Manus Desktop/WebDev credential helper ใช้งานได้ ให้ fetch และตรวจ canonical main ผ่าน Managed Git, ทำ checkpoint แล้วเรียก one-time publish; ไม่ต้องส่ง credential ทางแชต.
- `GET logs?type=system` ตอบ `not_applicable` เพราะยังไม่มี deployment; จึงไม่มี production logs ให้ตรวจ.


## 9. C-01 visual pilot — reference and scope (7 ตุลาคม 2569)

- เจ้าของให้ใช้ภาพแนบล่าสุดเป็นแนวทางหลัก: พื้นหลัง cool off-white/blue-lilac ที่นุ่มและมี depth, การ์ดบริการ 4 สีตามความหมาย (ม่วง/ฟ้า/amber/mint), ไอคอน filled ที่เด่นขึ้น, hero promo มีภาพอาหารและข้อความอ่านชัด, แถบ bottom navigation สีขาวและ active state ชัด.
- ปรับ **เฉพาะ C-01** เป็น pilot; คงข้อมูลที่อยู่, search, order tracking และ routes เดิม. ยังไม่เอาสี/ไอคอนไปแทนหน้าจออื่นจนเจ้าของตรวจและยืนยันว่า “เอาตามนี้”.
- Reference gallery: [Mobbin — food delivery app screens](https://mobbin.com/explore/mobile/app-categories/food-delivery-app) (ตัวอย่าง app/screens จาก DoorDash, Uber Eats, Grab, Deliveroo ฯลฯ; ใช้ดู pattern ไม่คัดลอกแบรนด์หรือ layout ตรง ๆ).
- Mobile pattern reference: [Justinmind — Mobile navigation patterns](https://www.justinmind.com/blog/mobile-navigation/) กล่าวถึง bottom navigation 3–5 destinations ที่เอื้อมด้วยนิ้วโป้งได้, labels ที่สม่ำเสมอ, feedback หลังแตะ และ card UI ที่ช่วยแบ่งข้อมูลเป็นส่วนและปรับตามขนาดจอ.
- Icon system candidate: [Google Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols) และ [Material Design 3 Icons](https://m3.material.io/styles/icons) — Material Symbols Rounded รองรับ fill/weight/grade/optical-size variable axes; subset ด้วยชื่อไอคอนเพื่อลด payload; ใช้เฉพาะ C-01 ในรอบทดลองและยังไม่ถือเป็นการล็อก icon system ของทุก role. เอกสาร Google ระบุ Apache License 2.0.


### Follow-up: C-01 visual pilot — round 2 (7 ตุลาคม 2569)

- เจ้าของขอปรับส่วนหัว/ชื่อผู้ใช้, การ์ดบริการ 4 ใบ, ขอบ/มุม/เงา และพื้นหลังที่เดิมโล่ง; ขอใช้ gradient กับการ์ดและกำหนดน้ำหนัก/ขนาด/สีข้อความให้ชัดขึ้น.
- ปรับ C-01 เท่านั้น: ใช้ layered CSS gradients เป็นพื้นหลัง ambient โทน brand-lilac/blue พร้อม warm accent อ่อน ๆ แทนภาพ raster เพื่อให้เบาและปรับตาม theme tokens ได้; ไม่เปลี่ยน global background ของ role/page อื่น.
- การ์ดบริการใช้ semantic accent แยกสี (food = brand, ride = info, parcel = accent, services = success), pastel gradient + radial tint, border/radius 24px และเงาโทนเดียวกับ accent; ชื่อบริการ 16px/700 และคำอธิบาย 11px/500 สี `--text-soft`.
- ส่วนหัวเน้น kicker 12px/700, ชื่อ 24px/700, supporting line 12px/500 และ avatar surface gradient; มี media override สำหรับ viewport ไม่เกิน 360px. CSS อยู่ใน scope `.customer-home`/`.screen-content:has(> .customer-home)`.
- ตรวจภาพ C-01 หลังแก้ผ่าน In-App Browser ที่ `/#/C-01`; browser console error = 0. ยังเป็น candidate ให้เจ้าของ review; **ห้ามนำ style ไปใช้กับอีก 79 หน้า จนกว่าเจ้าของจะฟันธง**.


### Follow-up: C-01 palette comparison — 7 ตุลาคม 2569

- เจ้าของต้องการเปลี่ยนโทนพื้นหลัง, เพิ่มความชัดของ gradient การ์ดบริการทั้งสี่ และทดลองหลาย theme; ขอเอาวงกลม/ลูกศรบนการ์ดออก และให้ไอคอนส่งของเป็นสีขาวเหมือนไอคอนบริการอื่น โดยส่วนอื่นคงเดิม.
- เพิ่มตัวเลือก palette ชั่วคราวสามแบบใน Review Panel เมื่ออยู่หน้า C-01: **Aurora** (ม่วง/ฟ้า/มิ้นต์), **Lagoon** (ทีล/คราม/ฮันนี่), **Rosewood** (เบอร์รี/สเลต/เซจ). ผู้รีวิวสลับดูได้; ค่าที่เลือกจำใน localStorage key `rma-home-palette`.
- แต่ละ palette ปรับเฉพาะ CSS variables ของ canvas และ accent/service cards บน C-01; ธีม Dark มี wash colors แยกตามพาเลต. ไม่เปลี่ยนสี global และไม่กระทบ A/M/R/S หรือหน้าลูกค้าอื่น.
- ซ่อน affordance ลูกศรวงกลมของ service cards และกำหนด package icon ให้เป็นสีขาวบน amber gradient ที่เข้มขึ้น; ไม่เปลี่ยนข้อความหรือเส้นทางของการ์ด.
- ตัวเลือกทั้งสามยังเป็น **แบบรอเจ้าของเลือก**; ยังไม่ถือเป็น design decision ถาวรและห้ามนำไปขยายอีก 79 หน้าจอจนกว่าจะฟันธง.


### Superseded experiment: Aurora background texture — 7 ตุลาคม 2569

- ก่อนหน้าได้ทดลองเพิ่ม halftone dots และ contour arcs บน Aurora ตามคำขอในรอบก่อน.
- ต่อมาเจ้าของขอเปลี่ยนจากลายเป็นภาพอาหาร; texture ชุดนี้ถูกแทนที่และไม่แสดงแล้ว.
- ผลที่ตรงกับเจตนารอบล่าสุดอยู่ในหัวข้อ “Correction: focus the visual inside the circled header” ด้านล่าง; Aurora ยังคงเป็นธีมที่เจ้าของชอบ.


### Superseded: full-page food-background interpretation — 7 ตุลาคม 2569

- เจ้าของขอเปลี่ยนลายพื้นหลังเป็นภาพอาหารที่วางจาง ๆ ไม่ทับ UI และให้ถอดไอคอนบัญชีมุมขวาบนเพราะมี bottom navigation แล้ว; ต่อมาอนุญาตให้สร้างภาพใหม่เองเพื่อเลี่ยงลิขสิทธิ์.
- ตรวจตัวเลือก stock จาก image search แล้วไม่ใช้: ภาพจากผลค้นหา index 1 มี Getty Images watermark/credit (https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/oLnWqRj8iQMaDP7qXiw4NT.jpg); อีกสองภาพมี Shutterstock watermark (https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/MF4jbodgdkJizQBhipUGjb.jpg และ https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/UKZxUxaXx4NkaFhk736ZPT.jpg). หน้าค้นหา/หน้ารูปที่ตรวจประกอบ: https://unsplash.com/s/photos/thai-food และ https://www.pexels.com/photo/delicious-asian-rice-bowl-with-beans-31302309/ (ภาพ Pexels มีพื้นหลังมืด; ไม่เลือก).
- ในรอบแรกจึงสร้างภาพอาหารและวางเป็น background เต็มหน้า; ภาพ/overlay แนวทางนี้ถูกยกเลิกหลังเห็น screenshot และไม่ได้ใช้ใน source รุ่นปัจจุบัน.


Implementation detail (superseded): ภาพเต็มหน้าที่เคยบันทึกเป็น `src/assets/home-food-background.png` ถูกลบจาก source แล้ว. การถอดปุ่ม avatar และคงทางเข้าบัญชีใน bottom navigation ยังเป็นข้อสรุปปัจจุบัน; รูปแบบ visual ปัจจุบันบันทึกไว้ใน Correction.


### Superseded attempt: visible food-image card — 7 ตุลาคม 2569

- ในรอบก่อนผมเข้าใจผิดและใส่ภาพอาหารเป็น card ใหม่ใน greeting row ทั้งที่เจ้าของต้องการภาพเบื้องหลังเฉพาะกรอบที่วงไว้; markup และ style ของ card นั้นถูกถอดออกแล้ว.
- ภาพปัจจุบันแสดงผ่าน `.home-top-zone::before` เป็น background หลัง greeting, address และ search เดิมเท่านั้น; wrapper ใช้จัดกลุ่มและไม่มีพื้นผิว/ขอบ/เงาให้เห็น.
- ไฟล์ภาพกะเพราไก่ไข่ดาว JPEG 800×600 ประมาณ 110 KB ยังคงใช้เป็น asset; ปัจจุบันถูก fade ด้วย overlay ตาม light/dark theme โดยไม่มี animation หรือ image card.
- ขอบเขตเปลี่ยนเฉพาะ C-01. ปุ่มบัญชีมุมขวาบนยังคงถอดออกตามคำขอก่อนหน้า; ทางเข้าบัญชีใน bottom navigation ไม่เปลี่ยน.


### Owner clarification: photo only behind the marked top region — 7 ตุลาคม 2569

The previous adjustment incorrectly introduced a visible food-image card in the greeting row. The owner clarified that no new card or redesign was requested: place the food photo behind the existing orange-marked region only. The visible image-card element and its styling have therefore been removed. Current implementation uses a transparent, layout-only `.home-top-zone` wrapper to scope a faded CSS background image behind the existing greeting, address card, and search control; it adds no border, radius, shadow, visible surface, or new interaction. Existing address/search styles remain unchanged, and the image fades within this region rather than covering the rest of C-01. The optimized food photo remains a single 800×600 JPEG (~110 KB). Changes are limited to C-01; the top-right account icon stays removed as previously requested, with account access still available in bottom navigation.


## 10. Visual refinement pass — Aurora across the 80 routes (7 ต.ค. 2569)

**สถานะล่าสุด supersede ข้อจำกัด “C-01 pilot only / ห้ามขยาย” ในบันทึกรอบก่อน:** เจ้าของเลือก Aurora และอนุมัติให้นำ shared visual language ไปใช้กับทุกหน้าจอ.

เจ้าของเลือก Aurora ว่าสบายตาและให้ขยายภาษาดีไซน์ของ C-01 ไปยังทั้ง 80 หน้าจอ โดยขอบเขตนี้หมายถึง shared design language ไม่ใช่การนำภาพอาหารไปวางทุกหน้า ภาพอาหารของ C-01 จึงอยู่เป็น background เฉพาะกรอบเดิมด้านหลัง greeting/address/search; ไม่มีการสร้าง image card ใหม่หรือเปลี่ยนเป็นภาพเต็มหน้า

| พื้นที่ | การปรับใน source | หมายเหตุ |
|---|---|---|
| C-01 background | `home-top-zone::before` ใช้ภาพอาหารเดิมที่ scale ตามสัดส่วน, เยื้องขวา `calc(100% + 18px)`, ขนาด `auto 84%`; เพิ่ม veil ฝั่งข้อความและลด opacity ใน dark mode | เฉพาะกรอบบนที่เจ้าของวงไว้; จูนต่อได้จากการดู preview จริง |
| ทุกหน้าจอ | เพิ่ม Aurora-like radial canvas gradient, card gradient + `--shadow-card`, heading hierarchy, borders, field/button states, active navigation และ surface สำหรับ dialog/sheet | ใช้ shared CSS ไม่ rewrite flow/ข้อมูล 80 ชุด |
| Customer / Merchant / Rider | Customer ใช้ Plum base; Merchant deep teal `#176E66`; Rider blue `#345FA5`; dark variants อยู่ใน `.phone[data-role]` | role color เปลี่ยน brand CTA/active state; semantic status colors แยกเหมือนเดิม |
| Icons | app bar, bottom navigation, review theme/drawer controls และ glyph เดี่ยวใน `.state-illustration` ใช้ Material Symbols Rounded | icon names เป็น subset เฉพาะที่ใช้จริง; ปุ่มและ route เดิมคงอยู่ |

**QA หลังแก้:** `node --check` ผ่าน 11/11 JS modules; renderer smoke ผ่าน 80/80 routes; CSS bracket balance ผ่านทั้ง `tokens.css`, `app.css`, `home.css`; Material Symbols 33 mapped glyphs ถูกประกาศครบใน Google Fonts subset. Contrast audit เฉพาะคู่สี role accent ที่เปลี่ยนได้ 6.07:1–8.98:1; ไม่ใช่การรับรอง WCAG ครบทุกหน้า/ทุกสถานะ. ไม่ได้ build ตามขอบเขต source-edit และ In-App Browser ยังไม่มี screenshot render ล่าสุด จึงควรเปิด `Start-RMA-Preview.bat` เพื่อตรวจ visual จริง โดยเฉพาะการอ่านหัวข้อ C-01 และ dark mode บน M-03/R-03.

**คงเดิม:** ทุก route/interaction, business rules, sample data, flow, และภาพร้าน/อาหารหน้าอื่น; ไม่เพิ่ม backend, dependency หรือการเชื่อมบริการจริง. Publish/zip ไม่ได้ทำในรอบ visual นี้.


### Follow-up: C-06 menu add / modifier UX — 8 ตุลาคม 2569

- เจ้าของชี้ว่าหน้ารายการเมนูควรเป็นการ **เพิ่มลงตะกร้า** ไม่ใช่ flow “เลือก” แบบเดิม; จึงเปลี่ยน CTA เป็น “เพิ่ม”, แสดง `− / จำนวน / ＋` เมื่อมีรายการแล้ว และแสดง sticky cart summary เมื่อ cart ไม่ว่าง.
- เมนูที่มี `choices` หรือ `extra` แสดงคำใบ้ “ปรับแต่งได้” และปุ่ม “เพิ่ม” เปิด C-07 modifier sheet ซึ่งมี radio สำหรับตัวเลือกบังคับ, checkbox สำหรับ add-on และ quantity control ก่อนกดเพิ่มลงตะกร้า; เมนูไม่มี modifier เพิ่มได้ทันทีจาก list.
- ใช้แนวทางจาก [GrabMerchant — Option Groups](https://help.grab.com/merchant/en-th/4408375426713) (ตัวเลือกย่อยและราคาเพิ่ม), [Material 3 — Top app bar](https://m3.material.io/components/app-bars/guidelines) (back icon ใน app bar) และ [Apple HIG — Navigation and search](https://developer.apple.com/design/human-interface-guidelines/navigation-and-search) (back affordance มาตรฐานและลดข้อความซ้ำ). Grab help page อาจแสดง error ใน fetch แต่ URL เป็นเอกสารทางการของ Grab และ pattern ถูก cross-check กับผลค้นหา.
- QA: `node --check` ทุกโมดูลผ่าน, menu UX assertion ผ่าน (`เพิ่ม`, quantity, modifier note, cart bar, ไม่มี `เลือก` ใน C-06), render smoke 81/81 และ browser screenshot C-06 ตรวจ compact app bar/รายการ/ตะกร้าจริง; ยังไม่ประกาศ full visual pass ทุก viewport.


## 10. ตอบ R2 — UX/UI pass 8 ตุลาคม 2569

### ทำแล้วในรอบนี้
- ทำตามลำดับ G4/G6/G10/G11/G13 และ flow หลักอาหาร/รับงาน: ลด header ซ้ำ, ใช้ compact sheet/CTA แบบ sticky, ยืนยันก่อน action สำคัญ, ไม่แสดงเบอร์โทรตรง ๆ ใน flow งาน, เพิ่มออกจากระบบ/เอกสาร, และแก้ C-07 → cart → C-06 ให้เห็นผลชัด.
- C-17 ใช้ modal แจ้งปัญหาแทนการพาไป C-23 เพื่อไม่ให้เกิดลูป; ไม่เพิ่ม route ใหม่เพราะยังไม่ได้แก้ `SCREENS.md` ตามกติกา.
- R-18 เพิ่มลำดับ รับ A → รับ B → ส่ง B → ส่ง A; R-16/R-17 แสดงวิธีชำระอย่างเดียว ไม่ให้คนขับเปลี่ยนวิธีชำระ.

### ยังไม่ทำ / เหตุผล
- ยังไม่อ้างว่าปิด P1 ทั้ง R2: ข้อ P1 ที่อยู่นอกชุด flow หลัก (A-05/A-06, C-01/C-37 state เต็ม, M-03/M-04/M-06/M-10/M-14/M-15, R-06/R-07/R-08 และรายการอื่น) ต้องทำต่อเป็น batch แยก เพื่อไม่แก้ข้ามกติกาและไม่ทำให้ state ที่มีอยู่เสีย.
- ไม่สร้าง C-40 ในรอบนี้: R2 เสนอเป็นทางเลือก แต่การเพิ่ม hash route ต้องเสนอและแก้ `SCREENS.md`/metadata ให้ครบก่อน.
- ไม่รายงาน visual QA ผ่าน: รอบนี้ตรวจ syntax/build/render เชิงโครงสร้างแล้ว แต่ยังต้องเปิด browser ตรวจ source ที่แก้จริงก่อนยืนยันหน้าตา.


## 11. ตอบ R2 — P1 completion pass

รอบนี้ปิด P1 ที่กระทบ flow หลักและสถานะธุรกิจเพิ่มแล้ว: A-05/A-06, C-01, C-09/C-11, M-03/M-04/M-06/M-10/M-14/M-15 และ R-04/R-06/R-07/R-08 รวมถึง confirmation, proof-of-delivery, payment selection และการเข้าถึงหน้าที่เคย orphaned. ตรวจ code ได้ syntax/build/render ครบ แต่ยังไม่ถือว่า visual QA ผ่านจนกว่าจะเปิด browser ตรวจจริง.

ข้อที่ยังเป็น visual follow-up ไม่ควรปิดเงียบ: G3 การย้าย Unicode/emoji ทุกจุดไป Material Symbols Rounded ยังไม่ครบทุก renderer และ C-12/R-03/R-05 ยังต้องปรับ full map + bottom-sheet/ปุ่มนำทางให้เห็นตาม brief ด้วยการตรวจหน้าจอจริง. จึงไม่รายงานว่า P1 ทั้งหมดผ่าน visual review ในรอบนี้.

- P1 map pass เพิ่ม C-12 tracking stage/bottom sheet และ R-05 full map/navigation action; `node --check`, build และ render smoke ผ่าน. ยังไม่เรียก visual pass และยังไม่เริ่ม P2 จนกว่าจะปิด G3 icon migration.


## P2 batch ล่าสุด
ทำ G7 และต่อ flow ที่เคยเป็น toast-only ใน M-14/M-15/M-16, R-10/R-11/R-14 รวมถึง C-06/C-10/C-13 แล้ว. `node --check`, static build และ render smoke ผ่าน; browser visual/interaction ยังต้องตรวจจริงและยังไม่ประกาศผ่าน.


P2 extended เพิ่ม G8/G9 base controls และต่อ R-03/R-06 actions; syntax/build/render ผ่าน. ยังมี P2 screens ที่ต้องทำต่อและยังไม่มี browser visual pass จึงยังไม่ปิด P2 ทั้งหมด.


## Recovery review
เกิด encoding regression จากการเขียน source ภาษาไทยด้วย PowerShell ระหว่าง P2 continuation. กู้คืน 4 renderer/controller จาก working copy ที่ตรวจแล้ว และ QA ใหม่ผ่าน 82 routes/81 screens, render smoke 81/81. เนื่องจาก recovery มาจากสำเนาก่อน P2 บางส่วน จึงยังไม่ถือ P2 complete และต้อง reapply ด้วย `functions.edit` แบบตรวจทีละไฟล์.


## ตอบ R2 — R3 ขั้น 3
เพื่อให้กติกากลางมีพฤติกรรมสม่ำเสมอ จึงย้ายหน้าที่อยู่ในชุดตรวจ G ไปใช้ renderer ต้นทางแบบ compact: หน้าละหนึ่ง action หลัก, CTA อยู่ใน sticky action เมื่อเป็นขั้นตอน, ไม่มี eyebrow ซ้ำ, ไม่มีข้อมูลติดต่อเต็มหรือปุ่มสาธิตในมือถือ และรายละเอียดรองคงไว้ใน review flow. แนวทางนี้ตรงกับ G1–G6 และรักษาสี/ทิศทาง Aurora โดยไม่ใช้ post-render replacement.
