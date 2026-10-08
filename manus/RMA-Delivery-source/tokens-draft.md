# RMA Delivery — tokens draft (R1)

สถานะ: **ร่างสำหรับ review** ไม่ใช่การล็อก design system — สอดคล้องกับ `src/styles/tokens.css` ใน source ปัจจุบัน

## Color tokens

| Token | Light | Dark | ใช้เมื่อไหร่ |
|---|---|---|---|
| `--bg` | `#F7F4EF` | `#111018` | พื้นที่ app/workspace |
| `--surface` | `#FFFEFC` | `#1C1A24` | card, panel, input, phone screen |
| `--surface-2` | `#F0ECE6` | `#272430` | กลุ่มข้อมูล, skeleton, field รอง |
| `--surface-3` | `#E9E4DD` | `#312D3A` | สวิตช์/พื้นผิวชั้นที่สาม |
| `--text` | `#211D2B` | `#F5F1FC` | ข้อความหลัก |
| `--text-soft` | `#514C5B` | `#D6D0E0` | ข้อความรองที่ยังต้องอ่านชัด |
| `--muted` | `#635E6B` | `#B6AFBF` | คำอธิบาย/metadata |
| `--line` | `#E5DFD8` | `#3B3645` | เส้นแบ่งและขอบ |
| `--brand` | `#5945C7` | `#B5AAFF` | สีหลักและ CTA |
| `--brand-strong` | `#44339C` | `#D0C9FF` | สีเน้นข้อความ/ไอคอนบน brand-soft |
| `--on-brand` | `#FFFFFF` | `#171420` | สีข้อความบนปุ่ม brand |
| `--brand-soft` | `#EEEAFE` | `#302A4C` | chip/card เลือกอยู่/เน้นแบบอ่อน |
| `--accent` | `#8B5D00` | `#FFC96A` | ดาว รีวิว และ accent อุ่น |
| `--focus` | `#7A4A00` | `#FFC96A` | focus-visible outline |
| `--success` | `#16734F` | `#73DDB0` | สถานะสำเร็จ |
| `--success-soft` | `#E5F4EC` | `#19372D` | พื้นหลังสถานะสำเร็จ |
| `--warning` | `#8C5708` | `#FFD084` | สถานะรอ/เตือน |
| `--warning-soft` | `#FFF2D7` | `#45351B` | พื้นหลังเตือน |
| `--danger` | `#B83A43` | `#FF9299` | ยกเลิก/ผิดพลาด/ปุ่มอันตราย |
| `--on-danger` | `#FFFFFF` | `#29131A` | สีข้อความบนปุ่ม danger |
| `--danger-soft` | `#FDEBED` | `#47262D` | พื้นหลัง error/danger |
| `--info` | `#315B9B` | `#9ABAF2` | ข้อมูล/งานพ่วง/คำแนะนำ |
| `--info-soft` | `#E8F0FC` | `#242F43` | พื้นหลังข้อมูล |

**Role-scoped brand overrides** อยู่ภายใน `.phone` เท่านั้น: ลูกค้าใช้ Plum ค่า base ด้านบน; ร้านค้าใช้ `--brand` `#176E66`/`#73D0C5`, `--brand-strong` `#125650`/`#A6E7DF`, `--brand-soft` `#E7F3F1`/`#1A3937`, `--on-brand` `#FFFFFF`/`#0F2926`; ไรเดอร์ใช้ `--brand` `#345FA5`/`#A3BFF5`, `--brand-strong` `#284A86`/`#C5D6FF`, `--brand-soft` `#EAF0FB`/`#263349`, `--on-brand` `#FFFFFF`/`#182236` (เรียง Light/Dark). สี semantic success/warning/danger/info ไม่เปลี่ยนตาม role.

## Radius, spacing, type และ motion

| Token | ค่า | ใช้เมื่อไหร่ |
|---|---:|---|
| `--radius-xs` | `10px` | pill/corner เล็ก |
| `--radius-sm` | `14px` | input/control/card รอง |
| `--radius-md` | `20px` | card หลัก |
| `--radius-lg` | `28px` | sheet/พื้นผิวใหญ่ |
| `--radius-pill` | `999px` | chip และ badge ทรงแคปซูล |
| `--space-1` | `4px` | ระยะย่อย |
| `--space-2` | `8px` | ระยะระหว่าง icon/label |
| `--space-3` | `12px` | padding/ระยะ component |
| `--space-4` | `16px` | spacing มาตรฐาน |
| `--space-5` | `20px` | ระยะ section |
| `--space-6` | `24px` | padding กลุ่มใหญ่ |
| `--space-8` | `32px` | ระยะ section ใหญ่ |
| `--space-10` | `40px` | spacing ใหญ่ |
| `--font-xs` | `12px` | label/small |
| `--font-sm` | `14px` | ข้อความรอง |
| `--font-md` | `16px` | body default |
| `--font-lg` | `20px` | subheading |
| `--font-xl` | `24px` | heading |
| `--font-2xl` | `30px` | display/ยอดสำคัญ |
| `--tap` | `48px` | ขนาดกดขั้นต่ำของ control หลัก |
| `--ease` | `180ms cubic-bezier(.2,.75,.25,1)` | feedback transition |

`--shadow`: light `0 20px 55px rgba(38, 27, 59, .13)` / dark `0 20px 55px rgba(0, 0, 0, .38)` — panel/device/sheet.  
`--shadow-soft`: light `0 5px 18px rgba(38, 27, 59, .07)` / dark `0 5px 18px rgba(0, 0, 0, .24)` — card/raised control.
`--shadow-card`: light `0 10px 24px rgba(38, 27, 59, .065), 0 2px 6px rgba(38, 27, 59, .035)` / dark `0 10px 26px rgba(0, 0, 0, .27), 0 2px 7px rgba(0, 0, 0, .16)` — shared card/map surfaces.

## Typography

`"IBM Plex Sans Thai", Inter, system-ui, sans-serif` (IBM Plex Sans Thai และ Inter โหลดจาก Google Fonts; มี system fallback). Body 16px; hierarchy 12/14/16/20/24/30px. ชุดฟอนต์ใช้รองรับภาษาไทยและละติน; ก่อน production ให้ทีมล็อกไฟล์/เวอร์ชันและเงื่อนไขโหลดเครือข่ายให้ตรงแอป Flutter.

## Contrast note

เลือกคู่ foreground/background ของ body, muted, brand CTA และสถานะให้ผ่านเกณฑ์ AA ที่ตรวจใน mockup; การตรวจนี้เป็น token-pair audit ไม่ใช่การรับรอง WCAG ครบทุกหน้า/ทุกสภาวะ และควรทดสอบสีเมื่อทีมปรับ final.
