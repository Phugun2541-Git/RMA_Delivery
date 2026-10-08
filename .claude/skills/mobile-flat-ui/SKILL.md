---
name: mobile-flat-ui
description: Layout rules for RMA Delivery mobile screens (Manus web mockup and the future Flutter app) — flat surfaces with dividers instead of nested containers, list-row anatomy (thumb left / details right / round add button), bottom sheets, option controls (radio/checkbox). Use when building or fixing any screen layout, list row, sheet, or option picker in this project.
---

# Mobile flat UI — RMA Delivery

Owner rule (D-025): **content sits on one surface; sections and list items are separated by dividers, not boxes.**
Colours/spacing still come from Manus tokens (`src/styles/tokens.css`) — this skill decides *structure*, not palette.

Sources: Material 3 Lists & Dividers (m3.material.io/components/lists, /divider) · Apple HIG Lists and tables ·
Anthropic `frontend-design` skill (installed beside this one — its "SaaS-card kit" anti-pattern is exactly what D-025 bans).

## 1. Containers — when a box is allowed
| Allowed as a box (card/surface) | Must be flat (same bg + divider) |
|---|---|
| A real object you tap as one thing and that floats over content: promo banner, active-order card, map overlay sheet | Lists (stores, menu items, orders, settings rows, FAQ) |
| Bottom sheet / dialog / modal | Sections of a page (summary, price lines, info rows) |
| Buttons, chips, inputs | A group of options inside a sheet |

- **Never nest** card → card. If a card's child also looks like a card, flatten the child.
- Section = small heading (`--font-sm` bold) + rows + 1px `--line` divider. Gap between sections 16–24px, not a box.
- List divider is inset to start where the text starts (after the thumbnail), Material/iOS style. Last row: no divider.

## 2. List row anatomy
```
| [thumb  ] Title (1–2 lines, ellipsis)          |
| [full   ] meta line (muted, 1 line)            |
| [height ] ★ 4.8 · info            price  (+)  |
```
- Thumb on the **left**, square, stretches the row height (min 84px), radius `--radius-sm`.
- Details right, `min-width:0` so long Thai names ellipsis instead of overflowing.
- Add/primary action = **circle 36–40px** visual inside a ≥48px hit area, pinned **bottom-right**. Show qty badge when > 0.
- Whole row is tappable when it navigates; the inner button stops propagation.
- Sold out: dim thumb + text badge, no add button.
- Rating always visible on store rows: star icon + number (+ count when known).

## 3. Option pickers (menu customisation)
- "Choose 1" group → **radio** rows; "choose any" → **checkbox** rows. Row = control first (leading), label, price delta at the end (`+฿12`); 48px min height; divider between rows; no card around each row.
- Draw the control (custom circle / rounded square with check) — not the browser default input — but keep `role="radio"/"checkbox"` + `aria-checked` so it maps 1:1 to Flutter `RadioListTile` / `CheckboxListTile`.
- Required group shows a "จำเป็น" tag until chosen; CTA disabled with a one-line reason.

## 4. Bottom sheets
- Handle → title row → key fact rows (label left muted / value right) separated by dividers → actions.
- One primary action full width; secondary actions as text/icon buttons, not stacked full-width buttons (max 2 full-width).
- Content scrolls inside the sheet; the primary action stays visible (sticky).

## 5. Sticky bars
- Any scroll area under a sticky bottom bar needs bottom padding ≥ bar height + 16px so the last row is never hidden.

## 6. Checklist before calling a screen done
- [ ] No card inside card · lists are flat with inset dividers
- [ ] Rows survive 320px width and long Thai text (ellipsis, no overlap)
- [ ] Touch targets ≥ 48px · last row clear of sticky bar
- [ ] Light + dark checked (tokens only, no hex in markup)
- [ ] Screenshot reviewed — look at it, remove one accessory
