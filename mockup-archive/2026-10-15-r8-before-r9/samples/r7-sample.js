// R7 proposal sample: C-16 (history) rendered as A (current screenshot) / B (tonal, Material 3) / C (grouped, iOS).
// Self-contained on purpose: only files under samples/ are referenced so the page can be published on its own.
// Row data mirrors ORDER_HISTORY / SERVICE_ICON / STATUS_TONE in src/ui/p2.js (read-only copy).

const ROWS = [
  { icon: "restaurant", tone: "success", title: "สั่งอาหาร", sub: "ครัวบ้านสวน รัชดา", meta: "RM-261007-1842 · วันนี้ 12:18", amount: "฿229", status: "กำลังดำเนินการ", st: "brand" },
  { icon: "restaurant", tone: "success", title: "สั่งอาหาร", sub: "ครัวบ้านสวน รัชดา", meta: "RM-261006-0842 · 6 ต.ค. 12:08", amount: "฿194", status: "เสร็จแล้ว", st: "success" },
  { icon: "directions_car", tone: "brand", title: "เรียกรถ", sub: "ห้วยขวาง → อโศก", meta: "RM-RIDE-261007-63 · 5 ต.ค. 21:16", amount: "฿86", status: "เสร็จแล้ว", st: "success" },
  { icon: "inventory_2", tone: "info", title: "ส่งของ", sub: "ลาดพร้าว → รัชดา", meta: "RM-261005-2103 · 5 ต.ค. 16:40", amount: "฿65", status: "ยกเลิก", st: "danger" }
];
const STATUS = ["ทั้งหมด", "กำลังดำเนินการ", "เสร็จแล้ว", "ยกเลิก"];
const NAV = [["หน้าหลัก", "home"], ["ดีล", "auto_awesome"], ["รายการ", "receipt_long"], ["ข้อความ", "chat_bubble"], ["บัญชี", "person"]];
const FILTERS = ["ทั้งหมด", "อาหาร", "เรียกรถ"];

const ms = (name, cls = "") => `<span class="ms ${cls}" aria-hidden="true">${name}</span>`;
const status = () => `<div class="sb"><span>9:41</span><span class="sb-icons"><i></i><i></i><i></i><b></b></span></div>`;

function row(r) {
  return `<button type="button" class="row"><span class="row-lead tone-${r.tone}">${ms(r.icon, "lead-ms")}</span><span class="row-copy"><strong>${r.title}</strong><span class="row-sub">${r.sub}</span><small>${r.meta}</small></span><span class="row-end"><strong>${r.amount}</strong><small class="st-${r.st}">${r.status}</small></span>${ms("chevron_right", "row-chev")}</button>`;
}
function nav(active = 2) {
  return `<nav class="nav" aria-label="เมนูหลัก">${NAV.map(([label, icon], i) => `<button type="button" class="nav-item${i === active ? " is-active" : ""}" ${i === active ? 'aria-current="page"' : ""}><span class="nav-ind">${ms(icon, "nav-ms")}${i === 3 ? '<span class="badge nav-badge">2</span>' : ""}</span><span class="nav-label">${label}</span></button>`).join("")}</nav>`;
}
const bell = () => `<button type="button" class="icon-btn bell" aria-label="แจ้งเตือน">${ms("notifications")}<span class="badge">1</span></button>`;

// B: M3 top app bar · [dropdown control + search] row · primary tabs · flat list on the tonal page · M3 navigation bar
function screenB() {
  return `<div class="phone p-b" data-proposal="b">${status()}
    <header class="top"><h2 class="title">รายการของคุณ</h2>${bell()}</header>
    <div class="scroll">
      <div class="toolbar"><button type="button" class="ctl ctl-drop">${ms("tune", "ctl-ms")}<span>ทุกบริการ</span>${ms("expand_more", "ctl-ms")}</button><label class="search">${ms("search", "search-ms")}<input placeholder="ค้นหารายการ" aria-label="ค้นหารายการ" /></label></div>
      <div class="tabs" role="tablist">${STATUS.map((s, i) => `<button type="button" role="tab" class="tab${i === 0 ? " is-active" : ""}" aria-selected="${i === 0}"><span>${s}</span></button>`).join("")}</div>
      <div class="list-head">ล่าสุด</div>
      <div class="list">${ROWS.map(row).join("")}</div>
    </div>
    ${nav()}<div class="home-ind"><i></i></div></div>`;
}

// C: large title on the grouped page · search field · one chip row (service + status) · white list band · tab bar
function screenC() {
  return `<div class="phone p-c" data-proposal="c">${status()}
    <header class="top"><h2 class="title">รายการของคุณ</h2>${bell()}</header>
    <div class="scroll">
      <label class="search">${ms("search", "search-ms")}<input placeholder="ค้นหารายการ" aria-label="ค้นหารายการ" /></label>
      <div class="chip-row"><button type="button" class="chip chip-drop"><span>ทุกบริการ</span>${ms("expand_more", "chip-ms")}</button><span class="chip-sep" aria-hidden="true"></span>${STATUS.map((s, i) => `<button type="button" class="chip${i === 0 ? " is-on" : ""}" aria-pressed="${i === 0}">${s}</button>`).join("")}</div>
      <div class="list-head">ล่าสุด</div>
      <div class="list">${ROWS.map(row).join("")}</div>
    </div>
    ${nav()}<div class="home-ind"><i></i></div></div>`;
}

function screenA() {
  return `<div class="phone p-a"><img class="shot shot-light" src="./assets/a-c16-light.png" width="390" height="844" alt="C-16 ปัจจุบัน โหมดสว่าง" /><img class="shot shot-dark" src="./assets/a-c16-dark.png" width="390" height="844" alt="C-16 ปัจจุบัน โหมดมืด" /></div>`;
}

// Component strip: the same parts on each proposal so sizes compare directly.
function strip(p) {
  const seg = (items, on) => `<div class="seg" role="group">${items.map((x, i) => `<button type="button" class="seg-btn${i === on ? " is-on" : ""}" aria-pressed="${i === on}">${p === "b" && i === on ? ms("check", "seg-ms") : ""}<span>${x}</span></button>`).join("")}</div>`;
  const chips = `<div class="chips">${FILTERS.map((x, i) => `<button type="button" class="chip${i === 0 ? " is-on" : ""}" aria-pressed="${i === 0}">${p === "b" && i === 0 ? ms("check", "chip-ms") : ""}${x}</button>`).join("")}</div>`;
  const back = p === "c" ? ms("arrow_back_ios_new", "back-ms") : ms("arrow_back");
  return `<div class="strip p-${p}" aria-label="ชิ้นส่วน ${p.toUpperCase()}">
    <div class="strip-row"><span class="strip-label">ภาษา</span>${seg(["ไทย", "English"], 0)}</div>
    <div class="strip-row"><span class="strip-label">ธีม</span>${seg(["สว่าง", "มืด", "ตามระบบ"], 0)}</div>
    <div class="strip-row"><span class="strip-label">ตัวกรอง</span>${chips}</div>
    <div class="strip-row"><span class="strip-label">ไอคอน</span><div class="icons"><button type="button" class="icon-btn back" aria-label="ย้อนกลับ">${back}</button><span class="icon-note">ย้อนกลับ</span>${bell()}<span class="icon-note">กระดิ่ง</span></div></div>
    <div class="strip-row"><span class="strip-label">ปุ่ม</span><div class="btns"><button type="button" class="btn btn-2">ยกเลิก</button><button type="button" class="btn btn-1">ยืนยัน</button></div></div>
  </div>`;
}

// Spec captions. <code data-hex="--var"> is filled with the rendered colour of that variable inside the proposal.
const hex = (v) => `<code data-hex="${v}"></code>`;
const SPECS = {
  a: {
    name: "A · ปัจจุบัน (R6)",
    lead: "ของจริงตอนนี้ — ปัญหาที่เจ้าของชี้",
    rows: [
      ["ชิป / segmented", "สูงขั้นต่ำ 48 · pill · padding 7/12 · ตัวอักษร 11px · ป้ายสั้น (ไทย) จึงกลายเป็นวงกลม ส่วนป้ายยาว (English) เป็นแคปซูล"],
      ["ปุ่มเล็ก", "ตัวกรองบริการ 48 pill 14px · ปุ่ม inline 48 r13 12px · pill สถานะ 24 · ไม่มีขั้นขนาดร่วมกัน"],
      ["ไอคอน", "ย้อนกลับ / กระดิ่ง = กล่อง 48 r16 มีเส้นขอบ + เงา + gradient แต่ไอคอนข้างในแค่ 20 · ไอคอนแถว 22 ในวง 48"],
      ["เมนูล่าง", "สูง ~64 · ไอคอน 20 · ป้าย 9px · แท็บที่เลือก = กล่องมน ~70×48 สี brand-soft + เส้นขอบ · พื้น gradient + เงา"],
      ["สีพื้น", "หน้า #F7F4EF (มืด #111018) + แสงสี brand มุมขวาบน · รายการวางบนพื้นหน้า · เมนูล่าง/กล่องไอคอน #FFFEFC (มืด #1C1A24) · เส้น #E5DFD8 · 3 ระดับสีอุ่นใกล้กันมาก แยกชั้นไม่ออก"]
    ]
  },
  b: {
    name: "B · Tonal (Material 3)",
    lead: "พื้นเดียวไล่ระดับโทนจากสีแบรนด์ · Android-first",
    rows: [
      ["ขนาดปุ่ม 3 ขั้น", "ชิป <b>32</b> r8 pad 12 · ตัวควบคุม (dropdown, ช่องค้นหา, segmented, ปุ่ม inline) <b>40</b> r20 pad 16 · ปุ่มหลัก <b>48</b> r24 · ตัวอักษร 14 ทุกขนาด (ปุ่มหลัก 15)"],
      ["ที่เลือกอยู่", "เติมสี secondary container (brand-soft) + ✓ 18 · ไม่มีเงา · segmented กว้างเท่ากันทุกช่อง"],
      ["ไอคอน", "glyph <b>24</b> ทุกที่ (app bar · เมนูล่าง · หน้าแถว) · 18 ในชิป/ปุ่ม · พื้นที่กด <b>48</b> ไม่มีกล่อง (มีวงกลม 40 เฉพาะตอนกด) · ไอคอนแถวในวง 40"],
      ["เมนูล่าง", "M3 navigation bar สูง <b>64</b> (+ระยะขอบเครื่อง) · ไม่มีเส้น/เงา แยกด้วยโทนสี · ตัวชี้ pill <b>56×32</b> r16 รอบไอคอนเท่านั้น · ไอคอนเติมสีเมื่อเลือก · ป้าย 12px"],
      ["สีพื้น", `หน้า+รายการ ${hex("--page")} · การ์ด/sheet ${hex("--c-low")} · เมนูล่าง ${hex("--c-mid")} · ช่องค้นหา/ที่เลือก ${hex("--c-high")} · เส้นคั่น ${hex("--divider")} · ขอบชิป ${hex("--outline")}`],
      ["Flutter", "ColorScheme.fromSeed(brand) สร้างระดับพื้นให้ทุกโทนสีเอง · NavigationBar · FilterChip · SegmentedButton · TabBar"]
    ]
  },
  c: {
    name: "C · Grouped (iOS / Grab)",
    lead: "พื้นเทา · สิ่งที่อ่าน/กดอยู่บนสีขาว · iOS-first",
    rows: [
      ["ขนาดปุ่มขั้นเดียว", "ชิป · dropdown · ช่องค้นหา · segmented · ปุ่ม inline สูง <b>36</b> แคปซูล r18 pad 14 ทั้งหมด · ปุ่มหลัก <b>50</b> แคปซูล · ตัวอักษร 14 (ปุ่มหลัก 16)"],
      ["ที่เลือกอยู่", "ชิป = เติมสีแบรนด์ ตัวอักษรขาว · ไม่เลือก = พื้นขาวไม่มีขอบ · segmented = รางเทา + ตัวเลื่อนขาว กว้างเท่ากันทุกช่อง"],
      ["ไอคอน", "glyph <b>24</b> · ย้อนกลับ = ‹ chevron <b>22</b> สีแบรนด์ ไม่มีกล่อง · พื้นที่กด <b>44</b> · กระดิ่งสีแบรนด์ (tint แบบ iOS) · ไอคอนแถว 20 ในสี่เหลี่ยมมน 36 r10"],
      ["เมนูล่าง", "tab bar สูง <b>52</b> (+ระยะขอบเครื่อง) · เส้นบาง 1px ด้านบน ไม่มีเงา · ไม่มีกล่อง/pill — ที่เลือก = ไอคอนเติมสี + ป้ายสีแบรนด์ · ป้าย 11px"],
      ["สีพื้น", `หน้า ${hex("--page")} · รายการ/การ์ด/sheet/ชิป ${hex("--list")} · แถบบน-ล่าง ${hex("--chrome")} · ราง segmented ${hex("--fill")} · เส้นคั่น ${hex("--divider")}`],
      ["Flutter", "สร้าง widget เอง (ไม่ใช้ Cupertino ทั้งชุด) · ใช้ได้ทั้ง Android/iOS · ต้องเขียน tab bar + segmented ของเราเอง"]
    ]
  }
};

function column(p) {
  const s = SPECS[p];
  const screen = p === "a" ? screenA() : p === "b" ? screenB() : screenC();
  return `<section class="col col-${p}" aria-label="${s.name}">
    <header class="col-head"><h2>${s.name}</h2><p>${s.lead}</p></header>
    <div class="frame-wrap">${screen}</div>
    <dl class="spec">${s.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
    <h3 class="strip-title">ชิ้นส่วนเทียบขนาด</h3>
    ${strip(p)}
  </section>`;
}

const root = document.getElementById("columns");
root.innerHTML = ["a", "b", "c"].map(column).join("");

// Resolve any CSS colour (incl. color-mix) to hex via a 1px canvas.
const cv = document.createElement("canvas"); cv.width = cv.height = 1;
const cx = cv.getContext("2d", { willReadFrequently: true });
function toHex(color) {
  cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = color; cx.fillRect(0, 0, 1, 1);
  const [r, g, b] = cx.getImageData(0, 0, 1, 1).data;
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function fillHex() {
  for (const p of ["b", "c"]) {
    const phone = root.querySelector(`.phone.p-${p}`);
    const probe = document.createElement("i"); probe.style.cssText = "position:absolute;width:0;height:0"; phone.append(probe);
    root.querySelectorAll(`.col-${p} [data-hex]`).forEach((el) => {
      probe.style.backgroundColor = `var(${el.dataset.hex})`;
      const value = toHex(getComputedStyle(probe).backgroundColor);
      el.textContent = value; el.style.setProperty("--sw", value);
    });
    probe.remove();
  }
}

// Page controls: theme (defaults to the OS setting), customer palette, hit-area overlay.
const html = document.documentElement;
function setTheme(t) {
  html.dataset.theme = t;
  document.querySelectorAll("[data-theme-set]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeSet === t)));
  fillHex();
}
const params = new URLSearchParams(location.search);
const initial = params.get("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.querySelectorAll("[data-theme-set]").forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.themeSet)));
const pal = document.getElementById("palette");
pal.addEventListener("change", () => { html.dataset.palette = pal.value; fillHex(); });
if (params.get("palette")) { pal.value = params.get("palette"); html.dataset.palette = pal.value; }
document.getElementById("show-hit").addEventListener("change", (e) => html.classList.toggle("show-hit", e.target.checked));
if (params.get("hit") === "1") { document.getElementById("show-hit").checked = true; html.classList.add("show-hit"); }

// Small interactions inside B/C so the owner can feel the selected states.
root.addEventListener("click", (e) => {
  const t = e.target.closest(".tab, .chip:not(.chip-drop), .seg-btn, .nav-item");
  if (!t || t.closest(".p-a")) return;
  const group = t.parentElement;
  const isB = !!t.closest(".p-b");
  group.querySelectorAll(":scope > .tab, :scope > .chip:not(.chip-drop), :scope > .seg-btn, :scope > .nav-item").forEach((x) => {
    const on = x === t;
    x.classList.toggle("is-active", on && (x.classList.contains("tab") || x.classList.contains("nav-item")));
    x.classList.toggle("is-on", on && (x.classList.contains("chip") || x.classList.contains("seg-btn")));
    if (x.hasAttribute("aria-pressed")) x.setAttribute("aria-pressed", String(on));
    if (x.hasAttribute("aria-selected")) x.setAttribute("aria-selected", String(on));
    if (x.classList.contains("nav-item")) on ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current");
    // B marks the selected chip / segment with a leading check (M3); C uses fill only.
    if (isB && (x.classList.contains("chip") || x.classList.contains("seg-btn"))) {
      x.querySelector(".chip-ms, .seg-ms")?.remove();
      if (on) x.insertAdjacentHTML("afterbegin", ms("check", x.classList.contains("chip") ? "chip-ms" : "seg-ms"));
    }
  });
});

setTheme(initial);
document.fonts?.ready.then(fillHex);
