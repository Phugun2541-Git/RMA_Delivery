# ai-collab — ช่องสื่อสาร Claude ↔ Manus

> **อ่านไฟล์นี้เมื่อ:** จะส่งงานให้ Manus · รับงานจาก Manus · ไม่แน่ใจว่าไฟล์ไหนใครแก้ได้
> Manus เริ่มทุก session จาก context ว่าง — สิ่งที่ไม่ได้เขียนลงไฟล์ = Manus ไม่รู้

## ใครแก้ไฟล์ไหน
| ที่ | เก็บอะไร | ใครแก้ |
|---|---|---|
| `manus/RMA-Delivery-source/` | **web mockup** (source of truth ของหน้าตาแอป) + `REVIEW-NOTES.md` + `tokens-draft.md` | Manus (หน้าตา) · Claude (โครงสร้าง ตาม D-020) |
| `ai-collab/r2-check.mjs` + `r2-baseline.json` | สคริปต์ตรวจ mockup: render ทุกหน้าแล้วเช็คตามรายการ R2 + จับหน้าเปล่า | Claude |
| `manus/RMA-Delivery-source/SESSION-HANDOFF.md` | ไฟล์เริ่มงานของ Manus: งานค้าง · สิ่งที่เจ้าของยืนยัน · โครงโค้ด | Manus (Claude แก้ได้เมื่อเจ้าของสั่ง) |
| `ai-collab/SCREENS.md` | รายการหน้าจอกลาง + รหัส + สถานะ | Claude (Manus เสนอผ่าน `REVIEW-NOTES.md`) |
| `ai-collab/DECISIONS.md` | ข้อที่เคาะแล้ว 1 บรรทัดต่อข้อ | Claude |
| `ai-collab/to-manus.md` | brief จาก Claude ถึง Manus — **รอบปัจจุบันเท่านั้น** | Claude |
| `ai-collab/to-claude.md` | คำถาม/คำตอบจาก Manus ถึง Claude | เจ้าของวาง · Claude ล้างเมื่อย่อยเสร็จ |

## กติกา
1. **Manus แก้ได้เฉพาะใน `manus/`** · **Claude แก้โค้ด mockup ได้เฉพาะโครงสร้างปุ่ม/flow/state** (D-020) ไม่แตะสี/สไตล์ — แก้แล้วต้องจดลง `manus/RMA-Delivery-source/SESSION-HANDOFF.md` ให้ Manus รู้
2. **รหัสหน้าจอคือภาษากลาง** — `SCREENS.md` กับ `manus/.../src/data/screens.js` ต้องตรงกัน · อ้างหน้าด้วยรหัสเสมอ (เช่น `C-12`)
3. **เจ้าของสั่ง Manus โดยตรงได้** (ไล่ปรับ mockup) — Manus ต้องจดสิ่งที่สั่งลง `SESSION-HANDOFF.md` · ถ้ากระทบรายการหน้าจอหรือข้อที่เคาะแล้ว บอก Claude ให้ลง `SCREENS.md` / `DECISIONS.md`
4. **จบรอบต้องเคลียร์** — ข้อสรุปลง `DECISIONS.md` · สถานะลง `SCREENS.md` · ล้าง `to-manus.md` กับ `to-claude.md` ให้เหลือแต่หัวไฟล์ · ไม่เก็บประวัติแชท
5. เรื่องที่ 2 ฝั่งเห็นไม่ตรงกัน → เขียนทั้ง 2 มุมสั้นๆ ให้เจ้าของเคาะ ห้ามเลือกเงียบๆ
6. เปิดดู mockup: ดับเบิลคลิก `manus/RMA-Delivery-source/Start-RMA-Preview.bat` → `http://127.0.0.1:5173/#/<รหัสหน้า>`
