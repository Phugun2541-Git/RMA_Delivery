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
| `flutter-dev` | คนเขียน | มีแผน + มีแบบจาก Manus แล้ว ลงมือ implement | opus · high | ✓ |
| `qa-tester` | คนเขียน | เขียน test · หา edge case | opus · high | ✓ เฉพาะ test |
| `opus-high-auditor` | คนตรวจ | ตรวจแผน/โค้ดงานกลาง · ตรวจซ้ำงานยาก | opus · high | ✗ |
| `opus-xhigh-auditor` | คนตรวจ | audit แรกงานยาก · ตรวจซ้ำงานยากมาก | opus · xhigh | ✗ |
| `opus-max-auditor` | คนตรวจ | audit แรกงานยากมาก | opus · max | ✗ |
| `security-auditor` | คนตรวจ | ก่อน release · แตะ token/สิทธิ์/ข้อมูลส่วนบุคคล/payment | opus · xhigh | ✗ |
| `retrospective` | ตรวจกระบวนการ | งานจบรอบ · ต้องสั่งแก้ซ้ำหลายรอบ | opus · high | ✗ โค้ด · ✓ เอกสาร |

ไม่มี `ui-designer` — เป็นงานของ Manus · ไม่มี `backend-dev` — backend เป็นของทีมเดิม (D-008) ต้องการอะไรจาก API ให้เขียนเป็นคำขอใน `docs/STATUS.md`

## กฎ model / effort
- **ทุกตัว = `opus`** รวมคนเขียน (`sonnet` ใช้ได้แค่งานแก้คำ/ปรับข้อความง่ายๆ) · **ไม่ใช้ `fable`** (ไม่มีโควตา อย่าลอง spawn)
- ไม่มีโมเดลสูงกว่า Opus → อยากได้ลึกขึ้น = เลือก agent ที่ `effort` สูงขึ้น (effort ผูกกับไฟล์ ตั้งรายครั้งไม่ได้)
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
