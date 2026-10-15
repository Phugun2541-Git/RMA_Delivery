# ส่งต่อ mockup เข้า Figma (สำหรับทีม UX/UI)

อัปเดต R8 (2026-10-15 · D-032): สีพื้นแบบ grouped (พื้นเทา · รายการ/การ์ด/sheet ขาว) + ปุ่ม ชิป ไอคอน และแถบเมนูล่างแบบ Material 3

## ลิงก์
- mockup กดได้จริง (ดู flow): **https://claude.ai/artifact/QipcQjoZRvFidQrNJ3yDMK**
- บอร์ดทุกหน้าจอ (ใช้ import เข้า Figma): **https://claude.ai/artifact/UfjuSUNRsgb1RdgV2WJPzG**

## ไฟล์
- `board.html` — ทุกหน้าจอ + สถานะสำคัญ เป็นเฟรม 390×844 เรียงเป็นแถวตาม role (A เริ่มต้น · C ลูกค้า · M ร้านค้า · R ไรเดอร์ · S ระบบกลาง · N แจ้งเตือน push)
- `figma/tokens.json` — สี · ระยะ · มุมโค้ง · ขนาดตัวอักษร · **ขนาดชิ้นส่วน (R8)** รูปแบบ Tokens Studio
- `index.html` — mockup กดได้จริง

## ชื่อเฟรม = รหัสหน้าจอ
- ทุกเฟรมขึ้นต้นด้วยรหัสจาก `ai-collab/SCREENS.md` เช่น `C-16 · ประวัติรายการ` · ถ้าเป็นสถานะอื่นของหน้าเดียวกันจะต่อท้าย เช่น `C-09 · Checkout · เปลี่ยนวิธีชำระเงิน (sheet)`
- แถว N = แบนเนอร์แจ้งเตือนของระบบ ชื่อเฟรม `push → <หน้าที่เปิด>`
- ตั้งชื่อ Frame/Component ใน Figma ตามรหัสเดิม จะได้คุยกับทีมพัฒนาด้วยรหัสเดียวกัน

## ขั้นตอนสำหรับทีม UX/UI

### A. นำหน้าจอเข้า Figma (html.to.design)
1. เปิด **https://claude.ai/artifact/UfjuSUNRsgb1RdgV2WJPzG** ใน Google Chrome
2. เลือกชุดที่ต้องการด้วยการต่อท้ายลิงก์ (ใช้ร่วมกันได้ด้วย `&`)
   - ธีมมืด: `?theme=dark`
   - ภาษาอังกฤษ: `?lang=en`
   - โทนสีฝั่งลูกค้า: `?palette=lagoon` · `rosewood` · `saffron` · `chili` (ไม่ใส่ = Aurora)
   - ตัวอย่าง: `https://claude.ai/artifact/UfjuSUNRsgb1RdgV2WJPzG?theme=dark&palette=saffron`
   - หน้าเดียวเต็มจอ: `?only=C-16` (หรือ `?only=C-09:payment-sheet`)
3. ติดตั้งส่วนขยาย Chrome **html.to.design** (by .to.design) และเปิดปลั๊กอินชื่อเดียวกันใน Figma
4. ในส่วนขยาย เลือก **Entire page** (หรือ **Selection** เพื่อเอาทีละแถว role ถ้าหน้ายาวมาก) → Capture
5. ใน Figma เปิดปลั๊กอิน html.to.design → Import ผลที่ capture ไว้
6. ทำซ้ำสำหรับธีมมืด / ภาษาอังกฤษ / โทนสีที่ต้องการ แยกเป็น Page ใน Figma
7. ตรวจฟอนต์: **IBM Plex Sans Thai**, **Inter** และ **Material Symbols Rounded** ต้องมีในเครื่อง/ใน Figma (ถ้าไอคอนกลายเป็นตัวหนังสือ เช่น "check" แปลว่ายังไม่มีฟอนต์ไอคอน)

### B. นำ tokens เข้า Figma Variables (Tokens Studio)
1. ติดตั้งปลั๊กอิน **Tokens Studio for Figma**
2. Settings → Add new → Local document / JSON → วางเนื้อหา `figma/tokens.json`
3. แท็บ **Themes** มีชุดให้เลือก: `Light · Aurora` · `Dark · Aurora` · `merchant · light/dark` · `rider · light/dark` · `customer <โทน> · light/dark` (ชุดโทนลูกค้าเปิด set ของหน้า C-01 ให้แล้ว)
4. Export → **Styles & Variables** → เลือกสร้าง Variables (แยก Collection ตาม theme เพื่อสลับ light/dark ได้ใน Figma)
5. ผูกสีของเลเยอร์ที่ import มาเข้ากับ Variables เอง (ชื่อตรงกับ tokens.json)

## สรุป design system (R8)

| กลุ่ม | ค่า | token |
|---|---|---|
| พื้นหน้า | เทา #F2F1F6 · มืด #0E0D12 | `color.bg` |
| รายการ / การ์ด / sheet / ชิปที่ไม่ได้เลือก | ขาว #FFFFFF · มืด #1C1B21 · รายการเป็นแถบขาวเต็มกว้าง ไม่มีมุมโค้ง ไม่มีกรอบ | `color.surface` |
| แถบเมนูล่าง / แถบปุ่มล่าง | #F9F9FB · มืด #17161C · ไม่มีเส้นด้านบน แยกด้วยโทนสี | `color.chrome` |
| เส้นคั่น | #E2E1E7 · มืด #313038 (เส้นบาง ตั้งใจให้จาง) | `color.line` |
| เส้นขอบชิป/ตัวควบคุม | #84828C (3.78:1 บนขาว · 3.37:1 บนเทา) · มืด #76747F (3.73:1 · 4.22:1) | `color.outline` |
| สถานะ "เลือกแล้ว" | brand-soft + brand 12% + ✓ 18 · ตัวอักษร brand-strong (≥ 5.2:1 ทุกโทน) | `color.sel` |
| ชิป | สูง 32 · มุม 8 · padding 12 · พื้นที่กด 48 | `component.chip.*` |
| ตัวควบคุม (dropdown · ช่องค้นหา · segmented · ปุ่มเล็ก) | สูง 40 · มุม 20 · padding 16 · พื้นที่กด 48 · segmented แบ่งช่องเท่ากัน | `component.control.*` |
| ปุ่มหลัก | สูง 48 · มุม 24 · padding 24 | `component.button.*` |
| ไอคอน | 24 ทุกที่ · พื้นที่กด 48 · ไม่มีกล่อง (วงกลม 40 ขึ้นเฉพาะตอนกด) · ไอคอนนำหน้ารายการอยู่ในวงกลม 40 | `component.icon.*` · `component.list.leadingCircle` |
| แถบเมนูล่าง | Material 3 navigation bar สูง 64 · pill 56×32 รอบไอคอนที่เลือก · ป้าย 12 | `component.nav.*` |
| การ์ด / sheet | มุม 16 / 28 · ไม่มีเงา ไม่มีกรอบ (ยกเว้นการ์ดลอยบนแผนที่มีเงาอ่อน) | `component.card.radius` · `component.sheet.radius` |
| state layer | hover 8% · กด 12% ของสีตัวอักษร | `state.hover` · `state.press` |

ข้อยกเว้นที่ตั้งใจ: ปุ่ม SOS เป็นวงกลมแดงอ่อนมองเห็นตลอด · ปุ่มโทร/แชท/นำทางในเนื้อหาเป็นวงกลมสีอ่อน (M3 tonal icon button) · ปุ่มนำทางบนแผนที่เป็นสี่เหลี่ยมมุมมน 56 (FAB)

## ข้อจำกัดที่ต้องรู้
- สิ่งที่ import เป็น **เลเยอร์ธรรมดา** — ไม่ใช่ Component · ไม่มี Auto layout · ไม่มี Variants → ทีมต้อง **สร้าง Component ใหม่จาก tokens** (ชิป 32 · ตัวควบคุม 40 · ปุ่ม 48 · nav bar 64) แล้วค่อยแทนที่เลเยอร์ที่ import มา
- สีที่ import เป็นค่าสีตรง ๆ ไม่ผูก Variables อัตโนมัติ — ต้อง map เอง
- สถานะ hover / กด / focus / animation ไม่ถูกจับ (ในบอร์ดปิด animation ไว้) · พื้นที่กด 48 ที่ใหญ่กว่าตัวชิ้นส่วนเป็นพื้นที่ใส มองไม่เห็นในภาพ
- light/dark อยู่คนละลิงก์ (`?theme=dark`) เพราะสีผูกกับทั้งหน้า
- รูปอาหารเป็นรูปจากเว็บสำหรับ mockup ภายในเท่านั้น (เช็คลิขสิทธิ์ก่อนใช้จริง)
- แก้ mockup แล้วอยากได้ tokens ใหม่: `node scripts/export-tokens.mjs`
