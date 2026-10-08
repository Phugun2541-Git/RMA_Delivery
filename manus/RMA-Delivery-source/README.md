# RMA Delivery Mobile Mockup

Prototype สำหรับ review UI ภาษาไทยของแอปมือถือ RMA Delivery: ลูกค้า, ร้านค้า และไรเดอร์/คนขับ; 80 หน้าจอ; hash deep links เช่น `/#/C-06`. Static client-only ไม่มี backend และไม่ใช่โค้ด Flutter.

## Requirements

- Node.js 20 หรือใหม่กว่า
- ไม่ต้องติดตั้ง dependency

## Run locally (Windows PowerShell)

**วิธีง่ายที่สุด:** แตก ZIP แล้วดับเบิลคลิก `Start-RMA-Preview.bat` ที่อยู่ในโฟลเดอร์หลัก `RMA-Delivery-source` (อย่าเปิดจากโฟลเดอร์ `scripts`). สคริปต์จะเริ่ม preview จาก source, เปิด C-01 ใน browser และตรวจว่าพอร์ตว่างหรือไม่ให้เอง; ไม่ต้อง build และไม่ต้องติดตั้ง dependency. คงหน้าต่าง terminal ไว้ระหว่างดู แล้วปิดหน้าต่างหรือกด `Ctrl+C` เพื่อหยุด server.

**เปิดด้วย PowerShell:** เปิด PowerShell ที่โฟลเดอร์หลักของโปรเจกต์ แล้วรัน:

```powershell
Set-Location "C:\path\to\RMA-Delivery-source"
node .\scripts\serve.mjs
```

จากนั้นเปิด `http://127.0.0.1:5173/#/C-01`. หาก PowerShell อยู่ในโฟลเดอร์ `scripts` อยู่แล้ว ให้ใช้ `node .\serve.mjs` แทน; คำสั่ง `node .\scripts\serve.mjs` ต้องรันจากโฟลเดอร์หลัก. ไม่ต้องรัน `build.mjs` สำหรับ preview นี้. หากพอร์ต 5173 ถูกใช้อยู่ ให้ตั้ง `$env:PORT = '5174'` แล้วเริ่ม server ใหม่; เปิด `http://127.0.0.1:5174/#/C-01`.

## Project layout

- `src/data/` — screen registry, flows และข้อมูลสมมติภาษาไทย
- `src/ui/` — auth/customer/merchant/rider/shared renderers และ shared components
- `src/styles/` — tokens light/dark และ responsive app styles
- `scripts/` — static build และ loopback preview server
- `dist/` — production-ready static output ที่สร้างจาก source
- `tokens-draft.md`, `REVIEW-NOTES.md` — เอกสาร review รอบ R1

## Prototype limits

ทุก interaction ใช้ข้อมูลจำลองใน browser. ไม่มี login/OTP จริง, order backend, Smart Kitchen API, payment processing, map/geocoding, file upload, โทรออกหรือแจ้งเตือนจริง. ภาพและ Google Fonts โหลดจาก HTTPS assets; มี CSS placeholder/fallback บางส่วน. ห้ามใช้ตัวเลข/ข้อมูลตัวอย่างเป็นข้อกำหนดธุรกิจ.
