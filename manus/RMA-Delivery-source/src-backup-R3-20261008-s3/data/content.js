export const PEOPLE = {
  customer: { name: "พิมพ์ชนก วัฒนกุล", short: "คุณพิม", phone: "08x-xxx-3278", initials: "พช", email: "pimchanok.w@example.com" },
  merchant: { name: "ครัวบ้านสวน รัชดา", owner: "คุณอรทัย สุขใจ", phone: "02-xxx-4938", initials: "คบ", rating: "4.8", orders: 27 },
  courier: { name: "ธนกร ใจดี", phone: "09x-xxx-6412", initials: "ธก", plate: "1กข 4821 กทม.", bike: "Honda Click 160 · สีดำ", car: "Toyota Vios · สีเงิน", carPlate: "5กก 2814 กทม." }
};

export const ADDRESS = "คอนโดสวรรยา ทาวเวอร์, 115/32 ซอยรัชดาภิเษก 8 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310";
export const PICKUP = "ครัวบ้านสวน รัชดา · 88/12 ซอยประชาราษฎร์บำเพ็ญ";
export const DESTINATION = "คอนโดสวรรยา ทาวเวอร์ · ห้วยขวาง";
export const ORDER_NO = "RM-261007-1842";

export const PHOTOS = {
  food1: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/332yyLZqKz936U435hPLBc.jpg",
  food2: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/6m4DpbjyzGniUpLadFL8DM.jpg",
  food3: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/g5xqt7NeHuFHCTphtHja24.jpg",
  food4: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/dMa2HYJjj4FqU7PZwK7f3E.png",
  food5: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/wayDaA6PT5kxYpxPV6gZPM.jpg",
  food6: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/hj84qSCYkcdwUQPSJtZVLS.png",
  food7: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/dEATAimXKdC2c9TNZjQDNW.jpg",
  food8: "https://files.manuscdn.com/search-media/310519663976415546/CpgbanbjWY9WsK6juXDpqr/JP2g2H3pzXMkxSjZteCzph.jpg"
};

export const STORES = [
  { name: "ครัวบ้านสวน รัชดา", cuisine: "อาหารตามสั่ง · ไทย", rating: "4.8", reviews: "1.2k", km: "1.2 กม.", eta: "20–30 นาที", fee: 10, offer: "ลด 20% สูงสุด ฿40", photo: PHOTOS.food1, open: true, tag: "ร้านประจำ" },
  { name: "เฮียตี๋ ก๋วยเตี๋ยวเรือ", cuisine: "ก๋วยเตี๋ยว · อาหารจานเดียว", rating: "4.7", reviews: "860", km: "1.8 กม.", eta: "25–35 นาที", fee: 12, offer: "ส่งฟรีเมื่อครบ ฿180", photo: PHOTOS.food2, open: true, tag: "ขายดี" },
  { name: "บ้านขนมไทยคุณยาย", cuisine: "ของหวาน · เครื่องดื่ม", rating: "4.9", reviews: "502", km: "2.4 กม.", eta: "18–28 นาที", fee: 15, offer: "ลด ฿20 เมื่อครบ ฿120", photo: PHOTOS.food3, open: true, tag: "คะแนนสูง" },
  { name: "ข้าวมันไก่ประตูน้ำ รัชดา", cuisine: "ข้าวมันไก่ · ไทย", rating: "4.6", reviews: "641", km: "3.1 กม.", eta: "30–40 นาที", fee: 18, offer: "", photo: PHOTOS.food4, open: false, tag: "เปิดพรุ่งนี้ 09:00" }
];

export const MENU = [
  { name: "กะเพราหมูกรอบไข่ดาว", desc: "หมูกรอบคั่วพริกแห้ง ใบกะเพราหอม ไข่ดาวขอบกรอบ", price: 89, photo: PHOTOS.food5, category: "จานเดียว", choiceTitle: "ระดับความเผ็ด", choices: ["เผ็ดปกติ", "เผ็ดน้อย", "เผ็ดมาก"], extraTitle: "เพิ่มความอร่อย", extra: ["ไข่ดาว +12", "ไข่เจียว +15", "เพิ่มหมูกรอบ +25"] },
  { name: "ข้าวผัดกุ้งแม่น้ำ", desc: "ข้าวหอมมะลิผัดกระทะไฟแรง กุ้งสด 4 ตัว", price: 125, photo: PHOTOS.food6, category: "จานเดียว", choiceTitle: "ระดับความเผ็ด", choices: ["ไม่ใส่พริก", "พริกน้อย", "พริกปกติ"], extraTitle: "เพิ่มความอร่อย", extra: ["ไข่ดาว +12", "เพิ่มกุ้ง +35"] },
  { name: "ผัดไทยกุ้งสด", desc: "เส้นจันท์เหนียวนุ่ม ซอสมะขามโฮมเมด", price: 119, photo: PHOTOS.food7, category: "จานเดียว", choiceTitle: "ถั่วลิสง", choices: ["ไม่ใส่ถั่ว", "แยกถั่ว", "ใส่ถั่ว"], extraTitle: "เพิ่มความอร่อย", extra: ["เพิ่มกุ้ง +35"] },
  { name: "แกงเขียวหวานไก่", desc: "กะทิสด ใบโหระพา มะเขือเปราะ", price: 99, photo: PHOTOS.food8, category: "กับข้าว", soldOut: true },
  { name: "ชาไทยเย็น", desc: "ชาไทยชงสด หวานน้อยได้", price: 45, photo: PHOTOS.food3, category: "เครื่องดื่ม", choiceTitle: "ระดับความหวาน", choices: ["หวานปกติ", "หวานน้อย", "ไม่หวาน"], extraTitle: "เพิ่มความอร่อย", extra: ["เพิ่มไข่มุก +10"] },
  { name: "ข้าวเหนียวมะม่วง", desc: "มะม่วงน้ำดอกไม้สุก ข้าวเหนียวมูนกะทิ", price: 89, photo: PHOTOS.food4, category: "ของหวาน" }
];

export const CATEGORIES = ["ทั้งหมด", "อาหารตามสั่ง", "ก๋วยเตี๋ยว", "เครื่องดื่ม", "ของหวาน", "สุขภาพดี"];
export const COUPONS = [
  { code: "RMA40", title: "ลด 20% สูงสุด ฿40", sub: "เมื่อสั่งครบ ฿150 · ใช้ได้ถึง 31 ต.ค. 2569", value: 40 },
  { code: "ส่งฟรี", title: "ค่าส่งลด ฿15", sub: "ร้านที่ร่วมรายการ · เหลือ 2 สิทธิ์", value: 15 },
  { code: "NEW80", title: "ลด ฿80 สำหรับสมาชิกใหม่", sub: "ยอดขั้นต่ำ ฿300 · ใช้ไม่ได้กับ order นี้", value: 0, disabled: true }
];

export const VEHICLES = [
  { id: "motorbike", name: "มอเตอร์ไซค์", seats: 1, eta: "3 นาที", price: 42, note: "เร็วสุด · เหมาะกับเดินทางคนเดียว", icon: "◉" },
  { id: "economy", name: "รถยนต์ประหยัด", seats: 4, eta: "6 นาที", price: 86, note: "นั่งสบาย · กระเป๋าเดินทาง 2 ใบ", icon: "▰" },
  { id: "family", name: "รถใหญ่ 6 ที่นั่ง", seats: 6, eta: "9 นาที", price: 125, note: "เหมาะกับครอบครัวและสัมภาระ", icon: "▣" },
  { id: "premium", name: "พรีเมียม", seats: 4, eta: "8 นาที", price: 174, note: "รถรุ่นใหม่ · คนขับคะแนนสูง", icon: "✦" }
];

export const FLOW_SHORTCUTS = [
  { title: "1 · เข้าระบบครั้งแรก", route: ["A-01","A-02","A-03","A-04","A-05","A-07","C-01"] },
  { title: "2 · ลูกค้าสั่งอาหาร", route: ["C-01","C-04","C-06","C-07","C-08","C-09","C-11","C-12","C-15"] },
  { title: "3 · ลูกค้าเรียกรถ", route: ["C-01","C-33","C-35","C-36","C-37","C-38"] },
  { title: "4 · ร้านรับ order", route: ["M-04","M-05","M-03"] },
  { title: "5 · ไรเดอร์ส่งอาหาร", route: ["R-03","R-04","R-05","R-06","R-07","R-08","R-09"] },
  { title: "5b · รับงานพ่วง", route: ["R-05","R-04","R-18","R-06","R-07","R-08","R-09"] },
  { title: "6 · คนขับรับส่งคน", route: ["R-03","R-04","R-16","R-17","R-09"] },
  { title: "7 · สมัครร้าน / ไรเดอร์", route: ["C-19","A-06","M-01","M-02","A-06","R-01","R-02"] },
  { title: "8 · สลับ role", route: ["C-19","A-06","M-17","A-06","R-15"] }
];
