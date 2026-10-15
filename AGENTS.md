# AGENTS — ทีมของโปรเจค RMA Delivery

> **อ่านไฟล์นี้เมื่อ:** จะ spawn subagent · เลือกระดับ audit · ไม่แน่ใจว่าเรื่องนี้ใครตัดสิน
> นิยามเต็มของ agent แต่ละตัวอยู่ที่ `.claude/agents/<ชื่อ>.md` · ที่มาของ model/effort = `D:\new_rma_pos\SKILL.md` (ผลใช้งานจริง)

## ใครตัดสินเรื่องอะไร
| ใคร | เขตของตัวเอง | ห้าม |
|---|---|---|
| **เจ้าของ** | เคาะขั้นสุดทุกเรื่อง · กฎธุรกิจ · verify บนเครื่องจริง · ถือสารระหว่าง Claude ↔ Manus | — |
| **Claude** (session หลัก + subagent) | architecture · โค้ด Flutter · model/API contract · security · เอกสาร | ออกแบบหน้าตาเอง |
| **Manus** | UX/UI ทั้งหมด: style, design token, mockup ทุกหน้า, flow การกดบนจอ | ตัดสินโครง API / โค้ด / กฎธุรกิจ |

## Subagent ของ Claude
| Agent | ประเภท | ใช้เมื่อ | model · effort | แก้โค้ด |
|---|---|---|---|---|
| `architect` | คนคิด | เริ่ม feature ใหญ่ · เลือกแนวทาง/stack · เพิ่ม dependency | opus · high | ✗ (ADR ได้) |
| `researcher` | คนคิด | ต้องข้อมูลนอกโปรเจค: package, ราคา Maps/payment/OTP, พฤติกรรมแอปคู่แข่ง | opus · medium | ✗ |
| `ui-designer` | คนออกแบบ | เจ้าของบอกหน้าจอไม่สวย/ไม่เหมือนแอปมือถือ · หน้าใหม่ · ปรับ token · ทำตัวอย่างเทียบ A/B/C | opus · high | ✓ เฉพาะ `mockup/` |
| `flutter-dev` | คนเขียน | มีแผน + มีแบบจาก Manus แล้ว ลงมือ implement | opus · high | ✓ |
| `qa-tester` | คนเขียน | เขียน test · หา edge case | opus · high | ✓ เฉพาะ test |
| `opus-high-auditor` | คนตรวจ | ตรวจแผน/โค้ดงานกลาง · ตรวจซ้ำงานยาก | opus · high | ✗ |
| `opus-xhigh-auditor` | คนตรวจ | audit แรกงานยาก · ตรวจซ้ำงานยากมาก | opus · xhigh | ✗ |
| `opus-max-auditor` | คนตรวจ | audit แรกงานยากมาก | opus · max | ✗ |
| `security-auditor` | คนตรวจ | ก่อน release · แตะ token/สิทธิ์/ข้อมูลส่วนบุคคล/payment | opus · xhigh | ✗ |
| `retrospective` | ตรวจกระบวนการ | งานจบรอบ · ต้องสั่งแก้ซ้ำหลายรอบ | opus · high | ✗ โค้ด · ✓ เอกสาร |

งาน UI/mockup → `ui-designer` (opus · high · โหลด design skills + ถ่ายภาพตรวจเองได้ · ใช้ได้ตั้งแต่ session ถัดไป ก่อนหน้านั้นใช้ general-purpose + model opus แทน) · ไม่มี `backend-dev` — backend เป็นของทีมเดิม (D-008) ต้องการอะไรจาก API ให้เขียนเป็นคำขอใน `docs/STATUS.md`

## กฎ model / effort
- **เลือก model ตามลักษณะงาน (D-030):**
  - **`sonnet`** = ทำตามสเปกที่ระบุเป็นข้อชัดเจน + มีสคริปต์/เทสตรวจ + ไม่แตะส่วนวิกฤต (เช่น แก้ mockup ตาม feedback รายข้อ · งานแก้คำ/ข้อความ)
  - **`opus`** = งานออกแบบที่ต้องใช้วิจารณญาณ · วางโครงสร้าง/architecture · โค้ด Flutter ที่แตะเงิน/สถานะ order/payment/สิทธิ์/ข้อมูลส่วนบุคคล · **งาน audit/ตรวจทุกระดับ** · ไม่แน่ใจ → `opus`
  - ไฟล์ agent ใน `.claude/agents/` ยังตั้ง `opus` ทุกตัว · จะใช้ `sonnet` ให้ส่ง `model: sonnet` ตอน spawn · บอกเจ้าของทุกครั้งว่าใช้ model ไหนเพราะอะไร
  - **ไม่ใช้ `fable`** (ไม่มีโควตา อย่าลอง spawn)
- ไม่มีโมเดลสูงกว่า Opus → อยากได้ลึกขึ้น = เพิ่ม `effort` · ค่า default ผูกกับไฟล์ agent แต่ตั้งรายครั้งได้ด้วย parameter `effort` ตอน spawn · spawn `sonnet` ให้ตั้ง `effort: high` เสมอ (ไม่ปล่อย default)
- **อย่า spawn ถ้าไม่จำเป็น** — spawn ใหม่เริ่มจาก context ว่าง ต้องป้อนทุกอย่างใหม่ = แพง · งานเล็กทำใน session หลัก

| ขนาดงาน (นิยามใน `SKILL.md` §1) | audit ครั้งแรก | ตรวจซ้ำหลังแก้ |
|---|---|---|
| ง่าย | ไม่ต้อง | — |
| กลาง | `opus-high-auditor` 1 ตัว | ไม่ต้อง (เทส + analyze พอ) |
| ยาก | `opus-xhigh-auditor` **2 ตัวแยกอิสระ** (คนละมุม) | `opus-high-auditor` 1 ตัว |
| ยากมาก | `opus-max-auditor` **2 ตัวแยกอิสระ** | `opus-xhigh-auditor` 1 ตัว |

## กฎการใช้ auditor
- ต้องเป็น **agent คนละตัวกับคนคิด/คนเขียน** — ตัวที่เพิ่งเขียนตาบอดบั๊กตัวเอง
- prompt ต้องครบ (มันไม่เห็นบทสนทนา): ไฟล์/diff ที่แก้ · เจตนา · จุดที่ต้องระวัง · ผลเทส · รูปแบบรายงาน
- **รันเทสก่อน audit เสมอ** แล้วแนบผล · 2 ตัว = แบ่งมุม ห้ามให้ตรวจหัวข้อเดียวกัน
- ถามต่อยอดเรื่องเดิม → `SendMessage` หาตัวเดิม · ตรวจซ้ำหลังแก้ → spawn ตัวใหม่ระดับต่ำกว่า 1 ขั้น พร้อม diff + รายงานรอบแรก
- ผล audit = **ข้อเสนอ** → เคาะกับเจ้าของก่อนแก้ · auditor ขัดกัน = รันพิสูจน์เอง · ไม่ใช้ `/code-review ultra`
- ไม่แน่ใจระดับงาน = เสนอพร้อมเหตุผลให้เจ้าของเคาะ
