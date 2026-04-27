# Plan: Color Accessibility

## Status: done

`src/variables.test.ts` — colocated with `variables.css`. Parses theme CSS, converts oklch → sRGB, tests both WCAG 2.x and APCA contrast. Deps: `apca-w3`.

## Color fixes applied

| Color         | Theme  | Was    | Now    | WCAG   | APCA      |
| ------------- | ------ | ------ | ------ | ------ | --------- |
| `accent` dark | brand1 | L=0.6  | L=0.5  | 5.39:1 |           |
| `accent` dark | brand2 | L=0.65 | L=0.52 | 5.71:1 |           |
| `muted` dark  | brand1 | L=0.6  | L=0.68 |        | \|Lc\| 47 |
| `muted` dark  | brand2 | L=0.58 | L=0.68 |        | \|Lc\| 47 |
| `error` dark  | brand1 | L=0.65 | L=0.72 |        | \|Lc\| 47 |
| `error` dark  | brand2 | L=0.65 | L=0.7  |        | \|Lc\| 46 |

APCA caught dark mode issues WCAG 2.x missed — muted/error passed 4.5:1 but had perceptually low contrast (\|Lc\| 34-40, needed 45).

## Border contrast — intentional exception

~1.5:1 in all themes. Brand1 reference same: `rgba(223,224,227)`. Borders supplementary, WCAG 1.4.11 exempt.

## Tests: 68 total (4 themes × 17 pairs)

WCAG 2.x: fg/muted/error on page+bg ≥ 4.5:1, white on accent ≥ 4.5:1, outline ≥ 3:1, border ≥ 1.4:1.
APCA: fg on page+bg \|Lc\| ≥ 60, muted/error \|Lc\| ≥ 45, white on accent ≥ 60, outline ≥ 30.

## How it works

1. CSS parser extracts `light-dark(oklch(...), oklch(...))` from theme files
2. oklch → OKLab → LMS → linear sRGB → sRGB
3. WCAG 2.x: relative luminance → contrast ratio
4. APCA: `apca-w3` → `APCAcontrast(sRGBtoY(fg), sRGBtoY(bg))` → \|Lc\|
