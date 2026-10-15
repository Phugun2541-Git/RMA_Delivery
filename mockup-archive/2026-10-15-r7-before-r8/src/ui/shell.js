// Splits a rendered screen into the three regions of the phone shell:
// top (app bar, pinned) · body (the only scrollable region) · dock (sticky action bars + bottom nav, pinned to the bottom edge).
const DOCK_BARS = ".sticky-action,.chat-compose,.p2-cart-fab,.p2-quick-replies";

export function splitShell(html) {
  const box = document.createElement("div");
  box.innerHTML = html;
  // Some states emit their own wrapper; flatten so there is exactly one .screen-content
  box.querySelectorAll(".screen-content").forEach((node) => node.replaceWith(...node.childNodes));
  const bars = [];
  const navs = [];
  [...box.children].forEach((el) => {
    if (el.matches(".bottom-nav")) navs.push(el);
    else if (el.matches(DOCK_BARS)) bars.push(el);
  });
  const first = box.firstElementChild;
  const top = first && first.matches("header.appbar") ? first : null;
  [top, ...bars, ...navs].filter(Boolean).forEach((el) => el.remove());
  const dockHtml = [...bars, ...navs].map((el) => el.outerHTML).join("");
  return { top: top ? top.outerHTML : "", body: box.innerHTML, dock: dockHtml };
}

export function hostMarkup(screenHtml) {
  const { top, body, dock } = splitShell(screenHtml);
  return `${top ? `<div class="screen-top">${top}</div>` : ""}<div class="screen-scroll"><div class="screen-content">${body}</div></div>${dock ? `<div class="screen-dock">${dock}</div>` : ""}`;
}
