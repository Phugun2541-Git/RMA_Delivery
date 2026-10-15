---
name: mobile-flat-ui
description: Layout rules for RMA Delivery mobile screens (Manus web mockup and the future Flutter app) — flat surfaces with dividers instead of nested containers, list-row anatomy (thumb left / details right / round add button), bottom sheets, option controls (radio/checkbox). Use when building or fixing any screen layout, list row, sheet, or option picker in this project.
---

# Mobile flat UI — RMA Delivery

Owner rule (D-025): **content sits on one surface; sections and list items are separated by dividers, not boxes.**
Colours/spacing still come from the tokens (`mockup/src/styles/tokens.css` — Claude owns UI since D-028) — this skill decides *structure*, not palette.

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
- **Never draw two lines next to each other** (owner review): a list group draws only its top rule; rows draw a bottom rule except the last. Consecutive sections are split by ONE thick band (`block()`), not a line + a gap + a line.
- Shared helpers in the mockup: `listGroup` · `listRow` · `block` · `profileRow` · `settingsGroup` · `roleSwitchRow` (`src/ui/components.js`).

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

## 6. Patterns approved in R6 (owner OK 2026-10-15 · D-031)
- **Less text:** cut eyebrows above titles and sentences that repeat the title. Secondary facts = icon + short label (`★ 4.8 · ⏱ 20–30 นาที · 🛵 ฿10`) using Material Symbols, not emoji (renders the same on every device).
- **Empty state:** no box — icon, one short title, one context-specific line, ONE action.
- **History / order list (Grab reference):** leading service icon tile · title + status chip · one meta line (time · order no.) · amount right · chevron. Same row for C-16, R-10, R-11, M-03, M-12.
- **Main tab screens:** large title, no back button. Back button only on pushed screens.
- **Notifications:** bell + unread badge in the header of every role's main screens → that role's inbox; OS heads-up banner (app icon · app name · time · title · 1-line body); OS shade screen for missed ones; badges drop when read.
- **Picker sheet (payment method):** rows = leading icon tile · title · 1-line secondary (e.g. `Visa •••• 4242`) · trailing radio · inset dividers · one pinned primary button "ใช้ …".
- **Role switch:** flat list, role-colored icon, one line, status chip only when relevant, current role = check mark.
- **Icons:** every Material Symbols name must be in the `icon_names=` subset (`scripts/icon-check.mjs`); icon tiles are square and never shrink; images `object-fit: cover`.
- **No fake keyboards** in the mockup — the phone has its own.

## 6b. Surfaces + control sizes (R8 · D-032, owner chose "C surfaces + B controls")
- Page bg light grey; lists/cards/sheets = **full-width white bands, square edges, no border/shadow**, grey gap between bands — this is how D-025 reads now. Never a rounded box inside a band.
- Sizes: chip 32 (r8, ✓ when selected) · control 40 (dropdown, search, segmented equal-width, inline button) · primary button 48 · icons 24 in a 48 hit area with **no visible box** (back, bell, app-bar actions) · list leading icon in a 40 circle · M3 nav bar 64 with 56×32 pill indicator, 12px labels.
- Exceptions kept on purpose: SOS stays a visible red circle · in-content call/chat/navigate = tonal circles · nav button on a map = FAB 56.
- All of it lives in `mockup/src/styles/tokens.css` + `system.css` — change tokens/components, never per-page overrides.

## 7. Checklist before calling a screen done
- [ ] No card inside card · lists are flat with inset dividers
- [ ] Rows survive 320px width and long Thai text (ellipsis, no overlap)
- [ ] Touch targets ≥ 48px · last row clear of sticky bar
- [ ] Light + dark checked (tokens only, no hex in markup)
- [ ] Screenshot reviewed — look at it, remove one accessory
- [ ] Text cut to the essential · icons render (icon-check OK) · main tabs have no back button
