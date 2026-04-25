# Accessibility Testing

## Done

### Phase 1: Fixed aria-describedby bug

All 10 form components now exclude `descId` from `describedBy` when error is present, since FieldMessages hides the description element when an error shows.

### Phase 2: Promoted lint severity

`correctness: "warn"` → `correctness: "error"` in `vite.config.ts`. A11y lint violations now fail CI.

### Phase 3: Color contrast tests (replaces vitest-axe)

Removed `vitest-axe` and `axe-core` — they couldn't check contrast in jsdom (the main thing we needed), and the ARIA checks they did were redundant with our manual assertions.

Instead: `src/variables.test.ts` parses theme CSS files directly, converts oklch → sRGB, computes WCAG 2.x contrast ratios, and asserts against AA targets.

**How it works:**

1. Simple CSS parser extracts `light-dark(oklch(...), oklch(...))` values from `themes/brand*.css`
2. oklch → OKLab → linear LMS → linear sRGB → sRGB conversion
3. WCAG 2.x relative luminance and contrast ratio formula
4. Tests every foreground/background pair across all 4 themes

**Contrast pairs tested:**

- `fg` on `page` and `bg` ≥ 4.5:1 (body text, input text)
- `muted` on `page` and `bg` ≥ 4.5:1 (placeholders, descriptions)
- `error` on `page` and `bg` ≥ 4.5:1 (error messages)
- `border` on `page` and `bg` ≥ 3:1 (input borders — UI AA)
- white on `accent` ≥ 4.5:1 (primary button text)
- `outline` on `page` ≥ 3:1 (focus ring)

**Current failures (11):**

- Border contrast (~1.5:1 vs 3:1 target) — all themes. Same as Brand1 `--eds-color-action-stroke-form-default` which is also ~1.5:1. Borders are decorative when labels are present. May lower target or accept.
- White on dark accent (~3.4:1 vs 4.5:1) — brand1-dark, brand2-dark. Dark mode accents too light. Brand1 uses darker accent in dark mode. Fix: lower L value.
- Muted on bg (4.41:1 vs 4.5:1) — brand2-dark. Barely fails. Fix: lower muted L by 0.02.

Zero external dependencies. Tests run in ~7ms.

### Phase 4: Keyboard navigation tests

- CheckboxGroup: Space toggles, Tab moves between items
- Accordion: disabled summary excluded from tab order
- InputNumber arrow keys already tested

## Why not axe-core

Removed `vitest-axe` + `axe-core`. Analysis of what axe checked in jsdom:

| axe check                   | Our coverage                                  | Notes                                                |
| --------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| ARIA attribute validity     | Manual assertions in every test               | `aria-invalid`, `aria-required`, `aria-describedby`  |
| Label associations          | `getByLabelText` in every test                |                                                      |
| Role semantics              | `getByRole` in every test                     |                                                      |
| Color contrast              | **Not checked** — jsdom has no canvas API     | Replaced by `variables.test.ts` oklch contrast tests |
| Duplicate IDs               | Covered by `useId()`                          | Could add two-instance render test if needed         |
| Nested interactives         | Not a risk in current components              | Oxlint `jsx-a11y` catches at lint time               |
| Valid role/attribute combos | Oxlint `jsx-a11y` with `correctness: "error"` |                                                      |

Everything axe did is either redundant with our manual tests, caught by oxlint, or impossible in jsdom. Our own contrast tests do more than axe could in this environment.

## Future: Vitest browser mode

For real CSS rendering tests (focus visibility, forced-colors, reduced-motion). See `plans/browser-compat.md`.
