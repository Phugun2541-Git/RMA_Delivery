import en1 from "./en-1.js";
import en2 from "./en-2.js";
import en3 from "./en-3.js";
import en4 from "./en-4.js";
import en5 from "./en-5.js";
import { PATTERNS } from "./patterns.js";

const DICT = { ...en1, ...en2, ...en3, ...en4, ...en5 };
const THAI = /[ก-฾เ-๛]/;
const NUM = /\d[\d,.:]*/g;
// Review tooling (side panel, rail, drawer) stays Thai; only the phone, modals and toasts are translated.
const ROOTS = "#screen-host, #modal-root, #toast-region";
const ATTRS = ["placeholder", "aria-label", "title", "alt"];

const fill = (template, nums) => { let i = 0; return template.replace(/\{n\}/g, () => nums[i++] ?? ""); };

function lookupDict(s) {
  if (DICT[s] !== undefined) return DICT[s];
  const nums = [];
  const normalized = s.replace(NUM, (m) => { nums.push(m); return "{n}"; });
  return DICT[normalized] !== undefined ? fill(DICT[normalized], nums) : null;
}

function lookupPattern(s) {
  for (const [re, make] of PATTERNS) {
    const m = s.match(re);
    if (m) return make(m, translate);
  }
  return null;
}

// Translate one Thai string: dictionary, then " · " style segments, then dynamic patterns.
// Unknown parts stay Thai so gaps are visible.
export function translate(text) {
  const core = String(text).trim();
  if (!core || !THAI.test(core)) return text;
  let out = lookupDict(core);
  if (out === null) {
    const sep = [" · ", " → ", " / "].find((x) => core.includes(x));
    if (sep) out = core.split(sep).map((part) => translate(part)).join(sep);
  }
  if (out === null) out = lookupPattern(core);
  return out === null ? text : text.replace(core, () => out);
}

function translateNode(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.parentElement?.closest("textarea, script, style")) continue;
    if (THAI.test(node.nodeValue)) { const next = translate(node.nodeValue); if (next !== node.nodeValue) node.nodeValue = next; }
  }
  if (root.nodeType !== 1) return;
  for (const el of [root, ...root.querySelectorAll("*")]) {
    for (const attr of ATTRS) {
      const v = el.getAttribute?.(attr);
      if (v && THAI.test(v)) el.setAttribute(attr, translate(v));
    }
    if (el.tagName === "INPUT" && THAI.test(el.getAttribute("value") || "") && el.value === el.getAttribute("value")) {
      el.value = translate(el.value);
    }
  }
}

export function translateRoots(scope = document) {
  scope.querySelectorAll(ROOTS).forEach(translateNode);
}

export function startTranslator(app, getLang) {
  const observer = new MutationObserver((mutations) => {
    if (getLang() !== "en") return;
    for (const m of mutations) {
      const nodes = m.type === "characterData" ? [m.target] : [...m.addedNodes];
      for (const node of nodes) {
        const el = node.nodeType === 1 ? node : node.parentElement;
        if (!el || !el.closest(ROOTS)) continue;
        if (node.nodeType === 3) { if (THAI.test(node.nodeValue)) { const next = translate(node.nodeValue); if (next !== node.nodeValue) node.nodeValue = next; } }
        else translateNode(node);
      }
    }
  });
  observer.observe(app, { childList: true, subtree: true, characterData: true });
  return { apply: () => { if (getLang() === "en") translateRoots(app); } };
}

export const missingFor = (text) => THAI.test(translate(text));
