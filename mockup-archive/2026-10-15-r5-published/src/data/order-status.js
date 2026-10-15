// Single source of wording for the food-order status flow (docs/PRODUCT.md §3).
// C-12 timeline, the status pill and the customer push notifications all read from here.
export const ORDER_STATUS = Object.freeze({
  accepted: { title: "ร้านรับออเดอร์แล้ว", pill: "กำลังทำอาหาร" },
  toShop: { title: "ไรเดอร์กำลังไปรับอาหาร", pill: "ไรเดอร์กำลังไปรับอาหาร" },
  pickedUp: { title: "ไรเดอร์รับอาหารแล้ว กำลังมาส่ง", pill: "ไรเดอร์กำลังมาส่ง" },
  arrived: { title: "ไรเดอร์ถึงแล้ว", pill: "ไรเดอร์ถึงแล้ว" },
  delivered: { title: "ส่งสำเร็จ", pill: "ส่งสำเร็จ" }
});
export const ORDER_FLOW = Object.freeze(["accepted", "toShop", "pickedUp", "arrived", "delivered"]);

// Merchant-side status (M-05) → the tracking phase the customer sees
export const PHASE_FROM_MERCHANT = Object.freeze({ "กำลังทำ": "accepted", "พร้อมส่ง": "toShop", "ส่งมอบไรเดอร์แล้ว": "pickedUp" });

export function trackingView(phase, cancelled) {
  if (cancelled) {
    return { done: 1, label: "ยกเลิกแล้ว", steps: [["ออเดอร์ถูกยกเลิก", "12:41 น."], ["คืนเงินเข้าช่องทางเดิม", "3–5 วันทำการ"]] };
  }
  const done = ORDER_FLOW.indexOf(phase) + 1;
  const sub = [
    phase === "accepted" ? "12:18 น. · กำลังทำอาหาร" : "12:18 น.",
    phase === "accepted" ? "รอไรเดอร์รับงาน" : phase === "toShop" ? "กำลังเดินทางไปร้าน" : "12:30 น.",
    done >= 3 ? "12:39 น." : "รอรับอาหารจากร้าน",
    done >= 4 ? "12:44 น." : "ถึงโดยประมาณ 12:45 น.",
    done >= 5 ? "12:46 น." : "ให้คะแนนได้หลังส่งสำเร็จ"
  ];
  return { done, label: ORDER_STATUS[phase].pill, steps: ORDER_FLOW.map((key, i) => [ORDER_STATUS[key].title, sub[i]]) };
}
