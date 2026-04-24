# Plan: Theming Layer

## Overview

Add multi-brand, light/dark theming via `data-theme` attribute on the root element. Themes override `--ds-*` tokens — component CSS stays untouched.

## How it works

```html
<html data-theme="brand1-light"></html>
```

Each theme is a `[data-theme="..."]` selector that reassigns the `--ds-*` custom properties. Components consume tokens, never raw colors, so they adapt automatically.

## File structure

```
src/
  tokens.css                    ← base tokens (default/fallback = brand1-light)
  themes/
    brand1-light.css            ← explicit brand1-light (same as base, for symmetry)
    brand1-dark.css             ← dark variant
    brand2-light.css            ← second brand, light
    brand2-dark.css             ← second brand, dark
    index.css                   ← imports all themes
```

## Implementation

### 1. Restructure tokens.css

Keep `:root` as the fallback (no `data-theme` needed for default). This ensures the system works without any `data-theme` attribute.

```css
@layer ds {
  :root {
    /* base tokens — serves as brand1-light default */
  }
}
```

### 2. Create theme files

Each theme file overrides only color and shift tokens inside `@layer ds`. Spacing, font sizes, radius, and border-width stay in base — they're structural, not thematic.

**Tokens that themes override:**

- `--ds-color-fg`
- `--ds-color-muted`
- `--ds-color-error`
- `--ds-color-border`
- `--ds-color-bg`
- `--ds-color-outline`
- `--ds-l-hover`
- `--ds-l-focus`
- `--ds-l-disabled`
- `--ds-l-muted-disabled`
- `--ds-c-disabled`

**Tokens that themes do NOT override** (shared across all themes):

- `--ds-font-size-*`
- `--ds-radius`
- `--ds-border-width`
- `--ds-spacing-*`

Example `brand1-dark.css`:

```css
@layer ds {
  [data-theme="brand1-dark"] {
    --ds-color-fg: oklch(0.93 0 0);
    --ds-color-muted: oklch(0.6 0.02 260);
    --ds-color-error: oklch(0.65 0.22 25);
    --ds-color-border: oklch(0.3 0.01 260);
    --ds-color-bg: oklch(0.15 0 0);
    --ds-color-outline: oklch(1 0 0);

    --ds-l-hover: 0.05;
    --ds-l-focus: 0.15;
    --ds-l-disabled: -0.25;
    --ds-l-muted-disabled: -0.1;
    --ds-c-disabled: 0.01;
  }
}
```

Key dark mode considerations:

- `--ds-l-disabled` goes **negative** (darkens instead of lightens, since fg is already light)
- `--ds-l-hover` direction stays the same (lighter border = more visible on dark bg)
- Error/muted colors need higher L to maintain WCAG AA contrast against dark bg
- Outline inverts to white

### 3. Theme index file

`src/themes/index.css` imports all themes:

```css
@import "./brand1-light.css";
@import "./brand1-dark.css";
@import "./brand2-light.css";
@import "./brand2-dark.css";
```

### 4. Export from library

Update `src/index.ts`:

```ts
import "./tokens.css";
import "./themes/index.css";
```

Or export themes separately so consumers can pick only what they need:

```json
{
  "exports": {
    "./themes/brand1-dark.css": "./dist/themes/brand1-dark.css",
    "./themes/all.css": "./dist/themes/index.css"
  }
}
```

### 5. Consumer usage

```tsx
// Import base + all themes
import "design-system/style.css";

// Or import base + specific theme
import "design-system/style.css";
import "design-system/themes/brand1-dark.css";

// Set theme
<html data-theme="brand1-dark">
```

Runtime switching:

```ts
document.documentElement.dataset.theme = "brand2-light";
```

### 6. Auto dark mode (optional)

A theme file can use `prefers-color-scheme` as a fallback when no `data-theme` is set:

```css
@layer ds {
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
      /* brand1-dark tokens */
    }
  }
}
```

This auto-applies dark mode from OS preference but is overridden by any explicit `data-theme`.

## Design decisions

- Themes live in `@layer ds` so they participate in the same cascade layer as base tokens
- `data-theme` on root, not `class`, to keep theming separate from styling concerns
- Theme naming: `{brand}-{mode}` pattern
- Base tokens double as `brand1-light` — no `data-theme` needed for the default
- Structural tokens (spacing, radius, font sizes) are NOT themed — override per-brand only if truly needed
- Dark mode shift tokens may invert direction — document this per theme
- All themed colors must meet WCAG AA contrast against their corresponding `--ds-color-bg`
