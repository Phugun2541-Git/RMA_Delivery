// Live behaviours that need timers or pointer tracking: countdowns and the draggable tracking sheet.
const fmt = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function createLive(app, state, api) {
  let timer = null;
  let dragStart = null;
  let dragged = false;

  function tick() {
    const now = Date.now();
    state.deadlines ??= {};
    const els = [...app.querySelectorAll("[data-live-countdown]")];
    const active = new Set(els.map((el) => `${state.currentId}:${el.dataset.liveCountdown}:${el.dataset.expireGo || ""}`));
    Object.keys(state.deadlines).forEach((key) => { if (!active.has(key)) delete state.deadlines[key]; });
    for (const el of els) {
      const key = `${state.currentId}:${el.dataset.liveCountdown}:${el.dataset.expireGo || ""}`;
      state.deadlines[key] ??= now + Number(el.dataset.liveCountdown) * 1000;
      const left = Math.max(0, Math.ceil((state.deadlines[key] - now) / 1000));
      el.textContent = fmt(left);
      el.classList.toggle("is-warning", left <= 10 && left > 0);
      el.classList.toggle("is-critical", left <= 5 && left > 0);
      if (left <= 0) {
        delete state.deadlines[key];
        api.showToast(el.dataset.expireMsg || "หมดเวลา", false);
        if (el.dataset.expireGo) api.navigate(el.dataset.expireGo);
        return;
      }
    }
    if (!els.length && timer) { clearInterval(timer); timer = null; }
  }

  app.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest("[data-sheet-handle]");
    dragStart = handle ? event.clientY : null;
  });
  document.addEventListener("pointerup", (event) => {
    if (dragStart === null) return;
    const dy = event.clientY - dragStart;
    dragStart = null;
    if (Math.abs(dy) < 24) return;
    dragged = true;
    setTimeout(() => { dragged = false; }, 300);
    state.trackOpen = dy < 0;
    api.render();
  });

  // Drag-to-reorder for option rows (M-08). The "move up" button in the editor stays as the fallback.
  let reorder = null;
  app.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest("[data-reorder-handle]");
    if (!handle) return;
    reorder = { group: handle.dataset.group, from: Number(handle.dataset.option) };
    handle.setPointerCapture?.(event.pointerId);
    handle.closest("[data-reorder-row]")?.setAttribute("aria-grabbed", "true");
  });
  document.addEventListener("pointerup", (event) => {
    if (!reorder) return;
    const drag = reorder;
    reorder = null;
    const over = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-reorder-row]");
    if (!over || over.dataset.group !== drag.group) { api.render(); return; }
    const to = Number(over.dataset.option);
    if (to === drag.from) { api.render(); return; }
    const size = drag.group === "topping" ? 3 : 4;
    const order = [...(state.optionOrder[drag.group] || Array.from({ length: size }, (_, i) => i))];
    order.splice(order.indexOf(to), 0, order.splice(order.indexOf(drag.from), 1)[0]);
    state.optionOrder[drag.group] = order;
    api.showToast("เรียงลำดับตัวเลือกใหม่แล้ว", false);
    api.render();
  });

  // New order / new job notification sound (WebAudio, no asset files). Honors state.soundOn.
  let audio = null;
  function chime() {
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      [[880, 0], [1175, 0.2]].forEach(([freq, offset]) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        const t = audio.currentTime + offset;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.connect(gain).connect(audio.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch { /* audio unavailable: stay silent */ }
  }

  return {
    start() {
      tick();
      if (!timer && app.querySelector("[data-live-countdown]")) timer = setInterval(tick, 1000);
      const id = state.currentId;
      if (id === "M-04" || id === "R-04") {
        if (state.chimedFor !== id) { state.chimedFor = id; if (state.soundOn !== false) chime(); }
      } else state.chimedFor = "";
    },
    consumeDrag() { const was = dragged; dragged = false; return was; }
  };
}
