# plan: badge

## status: done

## overview

simple presentational component. no JS logic — server-safe, no "use client" needed.

## implementation

- `Badge.tsx` — forwardRef span, variant/size/icon props
- `Badge.css` — 5 color variants (neutral/success/warning/error/info), 2 sizes, pill shape, forced-colors support
- `Badge.test.tsx` — 12 tests: variants, sizes, icon rendering, ref forwarding, className passthrough
- exported from `src/index.ts`, CSS imported in `src/style.css`
- example page added to design-system-example
- Figma: Badge page with component set (5 variants × 2 sizes) + 4 themed frames

## decisions

- `variant="error"` not `"alert"` or `"danger"` — matches our `--ds-color-error` token naming
- pill shape (999px radius) always — matches button style
- no variant-specific default icons (unlike EDS) — keep it simple, pass icon explicitly when needed
- success/warning colors hardcoded in CSS (oklch). error/info/neutral use existing tokens
- Figma badge backgrounds are hardcoded light tints (CSS uses color-mix which auto-adapts to dark mode)
