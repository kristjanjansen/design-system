# Accessibility Testing

## Done

### Phase 1: Fixed aria-describedby bug

All 10 form components now exclude `descId` from `describedBy` when error is present, since FieldMessages hides the description element when an error shows.

### Phase 2: Promoted lint severity

`correctness: "warn"` → `correctness: "error"` in `vite.config.ts`. A11y lint violations now fail CI.

### Phase 3: Added vitest-axe

- Installed `vitest-axe` + `axe-core`
- `vitest-axe/extend-expect` doesn't work with vite-plus — used `expect.extend(matchers)` in `src/test-setup.ts` instead
- Created `src/test-utils.ts` with `expectNoAxeViolations` helper
- Added axe tests (default + error states) to all 12 component test files

### Phase 4: Keyboard navigation tests

- CheckboxGroup: Space toggles, Tab moves between items
- Accordion: disabled summary excluded from tab order
- InputNumber arrow keys already tested
- Native keyboard behaviors (details toggle, radio arrows) can't be tested in jsdom — needs browser mode

## Future: Vitest browser mode

vite-plus bundles `browser-playwright.js`. Browser mode would enable:

- Real color contrast checking (axe-core needs canvas API, jsdom doesn't have it — the `HTMLCanvasElement getContext()` warnings)
- Native keyboard behavior testing (details toggle, radio arrow keys)
- CSS media query testing (`forced-colors`, `prefers-reduced-motion`)

```ts
// vite.config.ts addition
test: {
  browser: {
    enabled: false,
    provider: "playwright",
    instances: [{ browser: "chromium" }],
  },
},
```

Browser a11y tests would live in `*.a11y.test.tsx`, run via `vp test --browser`.
