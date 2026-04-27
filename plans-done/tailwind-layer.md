# plan: tailwind @layer ds conflict

## status: done

## problem

DS component CSS uses `@layer ds`. Tailwind v4's preflight (in `@layer base`) resets `border-width: 0`, `border-radius: 0`, `margin: 0`, `padding: 0` on all elements. When both are in the same stylesheet pipeline (e.g. Next.js), `@layer base` can override `@layer ds` depending on layer declaration order.

In the Vite example app this works because DS CSS is imported via JS (`import "...style.css"` in main.tsx), creating separate `<style>` blocks. In Next.js, CSS gets merged into one stylesheet where layer ordering matters.

## current behavior

- Example app (Vite): works — JS imports create independent style blocks
- Next.js: broken — Tailwind preflight resets badge border-radius, border-width, font-weight etc.

## alternatives

### A: Remove `@layer ds` from component CSS

Remove the `@layer` wrapper entirely. Component CSS becomes unlayered, which always beats any `@layer` in CSS cascade.

- **Pro**: simplest fix, guaranteed to work in any bundler/framework
- **Pro**: unlayered CSS beating layered CSS is the spec — no ordering tricks needed
- **Con**: loses cascade control if consumers also write unlayered CSS
- **Con**: need to ensure `@scope` provides enough isolation (it does — we already use it)
- **Migration**: find/replace `@layer ds {` in all component CSS files, remove outer wrapper

### B: Disable Tailwind preflight

Tailwind v4: `@import "tailwindcss" preflight(none)` or `@import "tailwindcss/utilities"` (skip base entirely).

- **Pro**: no DS changes needed
- **Pro**: DS already provides its own resets via component CSS
- **Con**: consumer loses Tailwind's normalize — may affect non-DS elements
- **Con**: consumer-side config, not something DS can enforce
- **Migration**: document in README/CLAUDE.md

### C: Declare layer order explicitly

Add `@layer base, components, utilities, ds;` at the top of the consumer's CSS to ensure `ds` wins.

- **Pro**: no DS code changes
- **Pro**: explicit and predictable
- **Con**: consumer must add this line — easy to forget
- **Con**: framework-specific (Next.js merges CSS differently than Vite)
- **Migration**: document in README, add to Next.js template

### D: Use `@layer` with higher specificity in component CSS

Wrap component selectors in `:where()` or use `@layer ds` but with `!important` on critical properties.

- **Pro**: no consumer changes
- **Con**: `!important` is a code smell, hard to override for consumers
- **Con**: `:where()` lowers specificity which is the opposite of what we want

## recommendation

**Option A** — remove `@layer ds` from component CSS. Keep `@layer ds` only on variables/themes (which don't conflict with preflight since they're just custom properties on `:root`). Component CSS with `@scope` provides sufficient isolation without `@layer`.

This is the simplest, most portable fix. It works regardless of bundler, framework, or CSS import strategy.

## implementation

1. Remove `@layer ds {` wrapper from all component CSS files (Badge, Button, Table, Tabs, Input, etc.)
2. Keep `@layer ds {` in `variables.css` and theme files — custom properties don't conflict
3. Keep `@layer ds {` in `tailwind.css` — theme mapping for Tailwind
4. Test in example app (Vite) and Next.js app
5. Verify `@scope` still provides class isolation
