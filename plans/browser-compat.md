# Plan: Browser Compatibility (2023+)

## Target

Chrome 110+, Safari 16+, Firefox 110+ (early 2023 browsers).

## Strategy

LightningCSS 1.32 (bundled in vite-plus) for build-time transforms where possible. Manual rewrites for `@scope`. Progressive enhancement for everything else.

## LightningCSS — what it actually does

```ts
// vite.config.ts
css: {
  lightningcss: {
    targets: browserslistToTargets(browserslist("chrome 110, safari 16, firefox 110")),
  },
},
```

**Transpiles (static values only):**

- `oklch(50% 0.1 50)` → `rgb()` fallback (must use percentage L notation, not `oklch(0.5 ...)`)
- `oklch(from blue calc(l * 0.8) c h)` → static evaluation (literal colors only)
- `light-dark(#fff, #000)` → separate fallbacks
- CSS nesting → flat selectors
- Logical properties → physical
- Vendor prefixes

**Cannot transpile (parsed, passed through):**

- `oklch(from var(...) ...)` — variables are runtime, can't be evaluated at build time
- `@layer` — not flattened, just parsed
- `@scope` — not downleveled
- `@property` — not polyfilled
- `@starting-style`, `field-sizing`, `interpolate-size`, `::details-content`

## Manual changes required

### 1. `@scope` → BEM classes

No Firefox support. No build tool can transform it. Revert to BEM-prefixed class names.

```css
/* Before */
@scope (.ds-input) {
  .input { ... }
}

/* After */
.ds-input { ... }
.ds-input__field { ... }
```

Biggest change — every component CSS and TSX file. Mechanical find/replace.

### 2. `oklch(from var(...))` → explicit derived-color tokens

We use relative oklch with CSS variables for hover/disabled/focus states:

```css
border-color: oklch(from var(--ds-color-border) calc(l - var(--ds-l-hover)) c h);
```

LightningCSS can't evaluate this — `var()` is runtime. Options:

- **A. Pre-compute hex fallbacks** — add a fallback line before each oklch line
- **B. Define derived tokens per theme** — `--ds-color-border-hover`, `--ds-color-border-focus` etc.

Option B is cleaner: each theme file defines all derived colors, no runtime calculation needed.

### 3. `oklch()` base values — use percentage notation

LightningCSS only downlevels oklch with percentage lightness. Our tokens need `oklch(35% 0.01 260)` not `oklch(0.35 0.01 260)`.

## Graceful degradation (acceptable)

| Feature                 | Fallback behavior                                   |
| ----------------------- | --------------------------------------------------- |
| `@property`             | Colors snap instead of transitioning between themes |
| `interpolate-size`      | Accordion opens instantly, no height animation      |
| `@starting-style`       | Error messages appear instantly, no fade-in         |
| `field-sizing: content` | Textarea stays fixed height, works with `rows`      |
| `text-wrap: balance`    | Normal text wrapping                                |
| `details[name]`         | Exclusive accordion groups don't auto-close         |
| `::details-content`     | No animated open/close, native details still works  |

## Implementation order

1. **Add LightningCSS targets** in `vite.config.ts` — handles `oklch()` base values, `light-dark()`, nesting, prefixes
2. **Fix oklch percentage notation** — ensure all base tokens use `oklch(35% ...)` not `oklch(0.35 ...)`
3. **Replace `@scope` with BEM classes** — manual rewrite
4. **Add derived-color tokens** — replace `oklch(from var(...))` with explicit theme tokens
5. **Test in Firefox 110** — strictest target
