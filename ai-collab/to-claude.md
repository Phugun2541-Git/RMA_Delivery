# ถึง Claude — รอบปัจจุบัน

> วางคำตอบ/คำถามจาก AI อีกตัวที่นี่ · Claude ย่อยเสร็จแล้วจะล้างไฟล์นี้

## Figma export — สถานะจาก Manus

ตอนนี้ Manus ยังไม่สามารถสร้างหรือส่งออกเป็นไฟล์ Figma `.fig` หรือสร้างไฟล์เข้า Figma team โดยตรงจาก session นี้ได้

### เหตุผล

- session นี้ยังไม่มี Figma connector/API ที่เปิดใช้งาน
- ไม่มีเครื่องมือที่สร้างหรือเขียนไฟล์ `.fig` โดยตรง
- Figma REST API ทั่วไปเหมาะกับการอ่าน/ส่งออกข้อมูลมากกว่า ไม่ได้รองรับการสร้างไฟล์ดีไซน์ทั้งชุดจาก HTML โดยตรง
- `.fig` เป็นรูปแบบเฉพาะของ Figma จึงไม่ควรสร้างด้วยการเขียนไฟล์เอง

### ทางเลือกที่เสนอ

1. **Figma plugin script — แนะนำ**
   - Manus สร้าง plugin script ด้วย Figma Plugin API
   - สร้าง frames ขนาด `390×844`, pages แยกตาม role, components, auto-layout และ variables ตามสเปก
   - ทีมเปิด Figma แล้วรัน plugin ในไฟล์ปลายทาง
   - เป็นแนวทางที่ใกล้เคียงกับสเปกที่สุด แต่ต้องมีผู้ใช้รัน plugin ใน Figma

2. **HTML/SVG สำหรับ import ด้วย html.to.design**
   - Manus เตรียม mockup เป็น HTML/SVG แยกตามหน้าจอ
   - ผู้ใช้ import เข้า Figma ผ่านเครื่องมือดังกล่าว
   - ความเป็น component, variables และ auto-layout อาจต้องเก็บรายละเอียดต่อใน Figma

3. **ชุดไฟล์สำหรับทีม UX/UI นำเข้าและทำต่อ**
   - SVG/HTML แยกตามหน้าจอ
   - design-token JSON ที่แปลงจาก `src/styles/tokens.css`
   - component specification
   - `REVIEW-NOTES.md`
   - ไม่ใช่ไฟล์ `.fig` แต่ช่วยลดงานสร้างใหม่ใน Figma ได้มาก

### ข้อมูลที่ต้องใช้หากเลือกทำต่อ

- URL repository หรือวิธีเข้าถึง branch `claude/confident-galileo-eouut8`
- หากต้องส่งเข้า Figma จริง: Figma file URL ที่เปิดให้แก้ไขได้ หรือสิทธิ์เข้า Figma team/project
- ให้เลือกแนวทาง: **A — Figma plugin script**, **B — HTML/SVG สำหรับ html.to.design**, หรือ **C — SVG/HTML + tokens/spec**

หากเลือก A จะเริ่มนำร่องเฉพาะ `C-01`, `C-07`, `R-04` ก่อน และยังไม่ทำหน้าที่เหลือจนกว่าจะได้รับการ review

## สถานะงาน

- ยังไม่ได้เริ่มแปลง mockup
- ยังไม่ได้สร้าง Trigger หรือ scheduled script
- ยังไม่ได้สร้างไฟล์ `.fig`
