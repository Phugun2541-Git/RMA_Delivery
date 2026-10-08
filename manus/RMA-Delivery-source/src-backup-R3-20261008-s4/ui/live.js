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

  return {
    start() { tick(); if (!timer && app.querySelector("[data-live-countdown]")) timer = setInterval(tick, 1000); },
    consumeDrag() { const was = dragged; dragged = false; return was; }
  };
}
