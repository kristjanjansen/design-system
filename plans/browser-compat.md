# Plan: Browser Compatibility (2023+)

## Target

Chrome 110+, Safari 16+, Firefox 110+ (early 2023 browsers).

## Strategy

Progressive enhancement. Core functionality works everywhere, modern features enhance where supported. No polyfills — CSS fallbacks only.

## Breaking changes (must fix)

### 1. `@scope` → BEM classes

`@scope` has no Firefox support at all. Revert to BEM-prefixed class names.

Before:

```css
@scope (.ds-input) {
  .input { ... }
  .label { ... }
}
```

After:

```css
.ds-input { ... }
.ds-input-field { ... }
.ds-input-label { ... }
```

This is the biggest change — every component CSS and TSX file. But it's mechanical: find/replace within each component.

### 2. `oklch()` relative color syntax → pre-computed fallbacks

Relative color syntax (`oklch(from var(...) calc(l - 0.05) c h)`) has no 2023 support. These are used for hover/disabled/focus derived colors.

Options:

- **A. Pre-compute hex fallbacks** — add a fallback declaration before each oklch line
- **B. Use CSS variables for each derived color** — `--ds-color-border-hover` etc.
- **C. Use `color-mix()`** — Chrome 111+, Safari 16.2+, Firefox 113+. Good 2023 support

Option C is cleanest. Replace:

```css
border-color: oklch(from var(--ds-color-border) calc(l - 0.05) c h);
```

With:

```css
border-color: color-mix(in oklch, var(--ds-color-border), black 10%);
```

`color-mix()` has good 2023 support and achieves similar darkening/lightening. The shift tokens (`--ds-l-hover` etc.) would become percentage-based mix values.

For base `oklch()` values (not relative), add hex fallback:

```css
--ds-color-fg: #1a1a1a;
--ds-color-fg: oklch(0.15 0 0);
```

### 3. `light-dark()` → separate selectors

Replace:

```css
--ds-color-fg: light-dark(oklch(0.15 0 0), oklch(0.93 0 0));
```

With separate `[data-theme]` selectors (what we had before merging):

```css
[data-theme="brand1-light"] {
  --ds-color-fg: oklch(0.15 0 0);
}
[data-theme="brand1-dark"] {
  --ds-color-fg: oklch(0.93 0 0);
}
```

This means splitting `brand1.css` and `brand2.css` back into `brand1-light.css`, `brand1-dark.css` etc. More files but universal support.

## Graceful degradation (acceptable)

### 4. `@property` — colors don't transition between themes

No Firefox support until 128 (2024). Colors still work, they just snap instead of transitioning when switching themes. Acceptable.

Keep `@property` declarations — they're ignored by browsers that don't support them.

### 5. `interpolate-size: allow-keywords` — accordion opens instantly

No Safari/Firefox support. Accordion still opens/closes, just without height animation. Acceptable.

Keep the declaration — ignored by unsupported browsers. Accordion content still appears via `display` change.

### 6. `@starting-style` — error messages appear instantly

No Firefox support. Errors still show, just without fade-in animation. Acceptable.

### 7. `field-sizing: content` — textarea stays fixed height

No Safari/Firefox support. Textarea works normally with `rows` prop. Acceptable.

### 8. `text-wrap: balance` — text wraps normally

Partial 2023 support. Falls back to default wrapping. Acceptable.

### 9. `details[name]` — exclusive accordion groups don't auto-close

Chrome 120 (late 2023). AccordionGroup exclusive mode doesn't work in older browsers — all accordions can be open simultaneously. The React context fallback from the plan exists if needed.

### 10. `::details-content` — no animated open/close

Very new pseudo-element. Accordion still functions via native `<details>` open/close behavior.

## Implementation order

1. **Replace `@scope` with BEM classes** — biggest change, do first
2. **Add `oklch()` hex fallbacks** on base token values
3. **Replace relative color syntax with `color-mix()`** — hover/disabled/focus states
4. **Split theme files** back to separate light/dark per brand (undo `light-dark()`)
5. **Test in Firefox 110** — the strictest target (no @scope, no @property, no @starting-style)
6. **Keep all modern features** as progressive enhancements — they're ignored when unsupported

## Alternative: build-time transforms

Instead of manually writing fallbacks, use PostCSS plugins:

- `postcss-oklab-function` — converts oklch to rgb
- `@csstools/postcss-light-dark-function` — polyfills light-dark()
- `@csstools/postcss-relative-color-syntax` — polyfills relative colors

This would let us keep the modern source code and generate fallbacks at build time. Requires adding PostCSS to the build pipeline (tsdown supports PostCSS plugins).

## Recommendation

**Use PostCSS transforms** if the source code should stay modern. **Manual fallbacks** if you want zero build dependencies. The PostCSS route is less work and keeps the codebase clean — the modern CSS stays as-is, fallbacks are generated automatically.
