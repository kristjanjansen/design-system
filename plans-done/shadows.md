# plan: shadows

## status: done (tokens + select)

## implemented

5 shadow tokens in `variables.css` matching brand1 scale, using oklch. no dark mode overrides — shadows are black with opacity, universal across brands.

```css
--ds-shadow-100: 0 1px 3px oklch(0 0 0 / 0.1), 0 1px 8px oklch(0 0 0 / 0.1);
--ds-shadow-200: 0 0 4px oklch(0 0 0 / 0.05), 0 8px 24px oklch(0 0 0 / 0.07);
--ds-shadow-300: 0 2px 4px oklch(0 0 0 / 0.05), 0 8px 24px oklch(0 0 0 / 0.1);
--ds-shadow-400: 0 0 60px oklch(0 0 0 / 0.15);
--ds-shadow-500: 0 4px 40px oklch(0 0 0 / 0.07), 0 8px 40px oklch(0 0 0 / 0.1);
```

select `::picker(select)` now uses `var(--ds-shadow-200)`.

## reference

brand1: https://enefit-design-system.pages.dev/docs/variables/shadows

| token | brand1 usage                            | brand2 equivalent   |
| ----- | --------------------------------------- | ------------------- |
| `100` | segmented control, switch thumb, slider | `--shadow-default`  |
| `200` | card, map, dropdown                     | `--shadow-dropdown` |
| `300` | floating button, action list            | —                   |
| `400` | — (unused)                              | —                   |
| `500` | modal, toast, datepicker, infohint      | `--shadow-modal`    |

brand2 also has `--shadow-smooth` (0 1px 4px) and `--shadow-focus` (0 0 0 3px).

## dark mode elevation

ref: https://www.jamesrobinson.io/post/a-guide-to-dark-mode-design

shadows are nearly invisible on dark backgrounds. increasing opacity alone (brand1 approach: 0.1→0.3) helps slightly but the real solution is **surface brightness** — elevated elements get lighter backgrounds.

approach for later:

- elevated components (popover, dialog, tooltip) use a slightly lighter bg in dark mode
- could add `--ds-color-surface-elevated` that's lighter than `--ds-color-bg` in dark mode, same as `--ds-color-bg` in light mode
- or use oklch lightness shift: `oklch(from var(--ds-color-bg) calc(l + 0.05) c h)` on elevated containers
- edge lighting (subtle 1px lighter border on top/left of elevated elements) also helps define boundaries

for now: shadows work. revisit when implementing popover/dialog/tooltip.

## where to use later

| component | shadow |
| --------- | ------ |
| tooltip   | `100`  |
| popover   | `200`  |
| dialog    | `500`  |
