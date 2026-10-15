# ส่งต่อ mockup เข้า Figma (สำหรับทีม UX/UI)

## ไฟล์
- `board.html` — ทุกหน้าจอ + สถานะสำคัญ เป็นเฟรม 390×844 เรียงเป็นแถวตาม role (A เริ่มต้น · C ลูกค้า · M ร้านค้า · R ไรเดอร์ · S ระบบกลาง · N แจ้งเตือน push)
- `figma/tokens.json` — สี/ระยะ/มุมโค้ง/ขนาดตัวอักษร รูปแบบ Tokens Studio (set: global · light · dark · role-* · customer-*)
- `index.html` — mockup กดได้จริง (ใช้ดู flow)

## ขั้นตอน A: นำหน้าจอเข้า Figma (html.to.design)
1. เปิดลิงก์ board ที่เจ้าของส่งให้ (หรือรัน `Start-Preview.bat` แล้วเปิด `http://127.0.0.1:5174/board.html`)
2. เลือกโหมดก่อน: `?theme=dark` สำหรับมืด · `?lang=en` สำหรับอังกฤษ · `?palette=saffron` สำหรับโทนสีลูกค้า (ค่าเริ่มต้น Aurora)
3. ติดตั้งส่วนขยาย Chrome **html.to.design** (by .to.design) แล้วเปิดแอป/ปลั๊กอินชื่อเดียวกันใน Figma
4. ในส่วนขยาย เลือก **Entire page** (หรือ Selection ถ้าจะเอาทีละแถว) → Capture → คัดลอก/ดาวน์โหลดผล
5. ใน Figma เปิดปลั๊กอิน html.to.design → วางผล (Import) · ถ้าหน้ากว้างมากให้เลือก "แถว" ทีละ role (Selection) เพื่อไม่ให้ค้าง
6. ตรวจว่าฟอนต์ **IBM Plex Sans Thai** และ **Inter** มีในเครื่อง/Figma (ไอคอนเป็น Material Symbols Rounded — ติดตั้งฟอนต์นี้ด้วยถ้าไอคอนกลายเป็นข้อความ)

## ขั้นตอน B: นำ tokens เข้า Figma Variables
1. ติดตั้งปลั๊กอิน **Tokens Studio for Figma**
2. Settings → Add new → เลือก Local/JSON → วางเนื้อหา `figma/tokens.json` (หรือโหลดไฟล์)
3. ในแท็บ Themes มีชุด Light / Dark / merchant / rider / customer-<โทน> ให้เลือก
4. Export → **Styles & Variables** → สร้าง Variables (Collection แยกตาม theme ได้)

## ข้อจำกัดที่ต้องรู้
- สิ่งที่ import เป็น **เลเยอร์ธรรมดา** — ไม่ใช่ Component, ไม่มี Auto layout, ไม่มี Variants · ทีมต้องสร้าง Component/Auto layout ใหม่เองจากเฟรมเหล่านี้
- สีที่ import เป็นค่าสีตรง ๆ ไม่ผูก Variables อัตโนมัติ — ต้อง map เอง (ใช้ชื่อใน tokens.json)
- สถานะ hover/focus/animation ไม่ถูกจับ (ใน board ปิด animation ไว้แล้ว)
- รูปอาหารเป็นรูปจากเว็บสำหรับ mockup ภายในเท่านั้น (เช็คลิขสิทธิ์ก่อนใช้จริง)
- ถ้าแก้ mockup แล้วอยากได้ tokens ใหม่: `node scripts/export-tokens.mjs`
