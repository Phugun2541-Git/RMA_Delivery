# CLAUDE.md — RMA Delivery

> Pointer ไม่ใช่คลังความรู้ · ไฟล์นี้โหลดทุก prompt → **ห้ามเกิน 100 บรรทัด** (เป้า ~70)
> รายละเอียดอยู่ใน `SKILL.md` / `AGENTS.md` / `docs/` / `ai-collab/` — อ่านเฉพาะไฟล์ที่เกี่ยวกับงานตรงหน้า

## 1. การสื่อสาร
- ตอบ **ภาษาไทย** · คงศัพท์เทคนิค ชื่อ package ชื่อไฟล์ error message เป็นอังกฤษ
- **comment / commit message / ชื่อตัวแปร = อังกฤษ** · comment เท่าที่จำเป็น (อธิบาย *ทำไม*)
- สั่งงาน → ตอบ 2–4 บรรทัด · อธิบาย → ลงลึกได้ · ไม่แน่ใจ → บอก + วิธีเช็ค **ห้ามเดาแบบมั่นใจ**
- เจ้าของเป็น **ผู้ใช้** ระบบแบบ Grab ไม่ใช่คนเคยสร้าง → เห็น flow/เมนู/ข้อกำหนดที่ขาดหรือน่าจะพลาด **ทักทันทีพร้อมข้อเสนอ**

## 2. โปรเจค
- **แอป delivery แบบ Grab** (Flutter · Android/iOS · ชื่อชั่วคราว) — **MVP = อาหาร + เรียกรถรับส่งคน** · ภายหลัง = ส่งของ + บริการ (ซ่อมแอร์/แม่บ้าน)
- **แอปเดียว 3 role สลับในแอป:** ลูกค้า · ร้านค้า · ไรเดอร์/คนขับ (+ admin back-office เป็นเว็บ แยกโปรเจค) — เมนู/flow ต่อ role อยู่ `docs/PRODUCT.md`
- **แอปเป็น client อย่างเดียว** — ไม่มี DB ในเครื่อง รับส่ง API กับ backend ที่ **ทีมเดิมเป็นคนทำ** (PostgreSQL) · Claude ไม่เขียน backend
- **ระบบพี่น้อง:** Smart Kitchen (POS ร้าน · พัฒนาแล้ว · ร้านเลือกผูกเพื่อดึงเมนู/ส่ง order เข้าครัว/ตัดสต็อก) ·
  Food Hub (เว็บสั่งอาหารของร้านใน Smart Kitchen — ขอบเขตซ้ำกับแอปนี้ **ยังคุยกับทีมไม่จบ**)
- **ภายนอก:** Google Maps · e-payment · LINE LIFF · push notification
- **แบ่งงาน AI:** Claude = architecture + โค้ด + model/API · **Manus = UX/UI เท่านั้น** (คุยผ่าน `ai-collab/`)
- ยังไม่เคาะ: state management · รูปแบบ API ของทีม backend → ดู "คำถามค้าง" ใน `docs/STATUS.md`

## 3. Hard Rules (ห้ามฝ่าฝืน)
1. **ห้ามมี DB ในเครื่อง** (sqflite/hive/isar ฯลฯ) · เก็บได้แค่ token ใน secure storage + ค่าตั้งค่า (theme/ภาษา)
2. **เงินและสถานะ order = server ตัดสิน** — แอปแสดงค่าที่ server ตอบ ห้ามคำนวณยอดจ่ายจริงเอง
3. **ปุ่มที่ยิง API ต้องกดย้ำไม่ได้** — disable + loading จนจบ · request สร้าง order/ชำระเงินต้องมี idempotency key
4. **UI ทุกหน้าต้องผ่าน checklist ใน `SKILL.md` §3** (แป้นพิมพ์ไม่บัง · ไม่ overflow · ปัดย้อนกลับ = ปุ่มย้อนกลับ · skeleton · จำกัดขนาดรูป)
5. **หน้าตา = ของ Manus** — ทำตาม mockup ใน `manus/RMA-Delivery-source/` · ห้ามคิดสี/สไตล์เอง · Claude แก้โค้ด mockup ได้เฉพาะเรื่องโครงสร้างปุ่ม/flow/state (D-020 · งานค้างดู `ai-collab/CLAUDE-R3-HANDOFF.md`)
6. **ห้าม hardcode ข้อความและสี** — ข้อความผ่าน l10n (th/en) · สีผ่าน theme (light/dark)
7. **ห้ามแก้หรือสร้างอะไรใน `D:\new_rma_pos`** (อ่านอ้างอิงได้) · `D:\_claude-template` แก้ได้เมื่อเจอสิ่งที่ควรเป็นมาตรฐานข้ามโปรเจค
8. ห้าม `print()` หลุด production · ห้าม log token / เบอร์โทร / ที่อยู่ / พิกัด
9. **git ทุกคำสั่งต้องขออนุญาตก่อนเป็นครั้งๆ** — บอกว่าจะรันอะไร บน branch ไหน · คำสั่งที่ทำข้อมูลหายต้องบอกว่าจะเสียอะไร
10. ห้ามลบไฟล์ของ user โดยไม่ถาม · ห้ามเพิ่ม dependency โดยไม่แจ้งเหตุผล + ทางเลือก
11. ห้ามใส่ secret / API key / URL server ลงโค้ด — อ่านผ่าน config layer (`--dart-define` / env)

## 4. Workflow
เข้าใจโจทย์ → อ่าน doc ที่เกี่ยว → เสนอแผนสั้นๆ → รอ OK → ลงมือ → รันตรวจ → สรุป (ขั้นเต็ม + ขนาดงาน = `SKILL.md`)
- แตะ > 3 ไฟล์ หรือแตะส่วนวิกฤต (เงิน · สถานะ order · payment · auth/สิทธิ์ตาม role · ข้อมูลส่วนบุคคล · Smart Kitchen) → **เสนอแผนก่อนเสมอ**
- subagent อยู่ `.claude/agents/` — รายชื่อ + model/effort + ใช้ตัวไหนเมื่อไหร่ = `AGENTS.md`
- คุยกับ Manus: เขียน brief ลง `ai-collab/to-manus.md` → เจ้าของถือสาร → **จบรอบต้องเคลียร์ไฟล์** (กติกา `ai-collab/README.md`)
- ก่อนบอกว่า "เสร็จ": analyze ไม่มี issue ใหม่ · เทสที่เกี่ยวเขียว · UI checklist ผ่าน · ของค้างจดใน `docs/STATUS.md` (ไม่ทิ้ง TODO ในโค้ด)

## 5. อ่านไฟล์ไหนเมื่อไหร่
| กำลังทำ… | อ่าน |
|---|---|
| **ตอนนี้ทำถึงไหน / งานถัดไป / คำถามค้าง** | **`docs/STATUS.md`** ← เริ่มที่นี่เสมอ |
| ขนาดงาน → ขั้นตอน · UI checklist · Definition of Done | `SKILL.md` |
| จะ spawn agent / เลือกระดับ audit | `AGENTS.md` |
| role · เมนู · flow · สถานะ order · จุดเด่นที่เสนอ | `docs/PRODUCT.md` |
| รายการหน้าจอ + รหัส (`C-xx` `M-xx` `R-xx`) + สถานะออกแบบ/ทำโค้ด | `ai-collab/SCREENS.md` |
| ข้อที่เคาะแล้วกับ Manus/เจ้าของ | `ai-collab/DECISIONS.md` |
| แบบหน้าจอ (web mockup ของ Manus) · token · สิ่งที่ Manus สมมติ | `manus/RMA-Delivery-source/` — หน้า = `src/ui/*.js` ตามรหัส · สี/ระยะ = `src/styles/tokens.css` · `REVIEW-NOTES.md` |

ยังไม่ได้สร้าง (สร้างเมื่อเคาะ stack): `docs/ARCHITECTURE.md` · `docs/API-CONTRACT.md` · `docs/SECURITY.md` · `docs/DESIGN-SYSTEM.md` — โครงอยู่ที่ `D:\_claude-template\docs\`

## 6. คำสั่ง
ยังไม่ได้ `flutter create` และยังไม่มี git repo (รอเคาะ stack) · เมื่อสร้างแล้วใช้ **fvm** นำหน้าทุกคำสั่ง แล้วมาแก้ส่วนนี้ให้เป็นของจริง

```bash
fvm flutter analyze      # ต้องไม่มี issue ใหม่
fvm flutter test         # ต้องเขียว
fvm flutter run
```
