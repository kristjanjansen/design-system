# plan: variables rework

## status: pending

## separate theme files

replace `light-dark()` with 4 separate files:

```
src/themes/brand1-light.css
src/themes/brand1-dark.css
src/themes/brand2-light.css
src/themes/brand2-dark.css
```

consumer imports what they need:

```tsx
import "@kristjanjansen/design-system/css/style.css";
import "@kristjanjansen/design-system/css/themes/brand1-light.css";
import "@kristjanjansen/design-system/css/themes/brand1-dark.css";
```

benefits:

- no `light-dark()` browser support concern
- easier to read/debug — one value per variable
- consumer controls which themes ship (tree-shaking at import level)
- adding a new theme = one new file

## font sizes

move `--ds-font-size-*` scale out of variables.css. two options:

**option A: keep as tokens** — used by Heading, Text, FieldLabel, FieldMessages, Button, Accordion. shared scale is useful.

**option B: inline in components** — Heading/Text CSS defines sizes per variant. other components use literal `1rem`. no tokens.

recommendation: **option A** — the scale is shared across too many components to inline. rename to semantic names:

```css
--ds-font-size-tiny: 0.75rem; /* text-ds-tiny */
--ds-font-size-small: 0.875rem; /* text-ds-small */
--ds-font-size-body: 1rem; /* text-ds-body */
--ds-font-size-h6: 1.125rem; /* text-ds-h6 */
--ds-font-size-h5: 1.25rem; /* text-ds-h5 */
--ds-font-size-h4: 1.5rem; /* text-ds-h4 */
--ds-font-size-h3: 1.75rem; /* text-ds-h3 */
--ds-font-size-h2: 2.25rem; /* text-ds-h2 */
--ds-font-size-h1: 3rem; /* text-ds-h1 */
```

## easing

name by what they do:

```css
--ds-easing-out: cubic-bezier(0.14, 0.25, 0.54, 1); /* current default, decelerate */
--ds-easing-inout: cubic-bezier(0.4, 0, 0.2, 1); /* symmetric, material-style */
```

## durations

currently all `0.1s` — wrong. use numbered scale:

```css
--ds-duration-100: 0.1s; /* hover, color shifts */
--ds-duration-200: 0.2s; /* expand, toggle */
--ds-duration-300: 0.35s; /* accordion, modal */
```

## disabled state

`opacity: 0.5` problems:

- dark mode: dimmed dark element nearly invisible
- compounds: disabled inside a card with bg — card shows through
- inconsistent: some components also shift colors + opacity

alternatives:

- **color-only:** use muted fg + lighter border, no opacity. explicit per-state colors.
- **reduced opacity + color shift:** keep opacity but less aggressive (0.7) and also lighten text
- **per-component:** each component handles disabled differently. checkbox grays out, button uses opacity, input uses bg shift.

recommendation: replace blanket `opacity: 0.5` with component-specific disabled styling. use `--ds-color-fg` with lightness shift for text, lighter border, slightly different bg. no opacity.

## color shifts → color-mix

replace `oklch(from var(...) calc(l - ...) c h)` with `color-mix()` + percentage tokens:

```css
--ds-light-hover: 5%;
--ds-light-focus: 15%;
--ds-light-disabled: 30%;
```

usage:

```css
/* before */
border-color: oklch(from var(--ds-color-border) calc(l - var(--ds-l-hover)) c h);

/* after */
border-color: color-mix(in oklch, var(--ds-color-border), black var(--ds-light-hover));
```

benefits:

- readable: "5% darker" vs "subtract 0.05 from lightness channel"
- no `oklch(from ...)` — `color-mix()` has broader support (chrome 111+ vs 122+)
- percentage tokens work directly in `color-mix()`
- dark mode: use `white` instead of `black` to lighten

```css
/* light mode */
border-color: color-mix(in oklch, var(--ds-color-border), black var(--ds-light-hover));

/* dark mode — theme overrides direction */
border-color: color-mix(in oklch, var(--ds-color-border), white var(--ds-light-hover));
```

or use a direction token:

```css
--ds-mix-direction: black; /* light theme */
--ds-mix-direction: white; /* dark theme */
border-color: color-mix(
  in oklch,
  var(--ds-color-border),
  var(--ds-mix-direction) var(--ds-light-hover)
);
```

removes need for negative shift values in dark mode.

## tailwind config

ship `tailwind.css` that maps DS tokens to tailwind v4 `@theme`:

```css
@theme {
  /* 
  text-ds-fg,
  bg-ds-fg
  border-ds-fg 
  */
  --color-ds-fg: var(--ds-color-fg);
  --color-ds-muted: var(--ds-color-muted);
  --color-ds-error: var(--ds-color-error);
  --color-ds-border: var(--ds-color-border);
  --color-ds-bg: var(--ds-color-bg);
  --color-ds-page: var(--ds-color-page);
  --color-ds-accent: var(--ds-color-accent);

  /* text-ds-tiny → font-size + line-height compound */
  --font-size-ds-tiny: var(--ds-font-size-tiny);
  --font-size-ds-tiny--line-height: var(--ds-line-height-tiny);
  --font-size-ds-small: var(--ds-font-size-small);
  --font-size-ds-small--line-height: var(--ds-line-height-small);
  --font-size-ds-body: var(--ds-font-size-body);
  --font-size-ds-body--line-height: var(--ds-line-height-body);
  --font-size-ds-h6: var(--ds-font-size-h6);
  --font-size-ds-h6--line-height: var(--ds-line-height-h6);
  --font-size-ds-h5: var(--ds-font-size-h5);
  --font-size-ds-h5--line-height: var(--ds-line-height-h5);
  --font-size-ds-h4: var(--ds-font-size-h4);
  --font-size-ds-h4--line-height: var(--ds-line-height-h4);
  --font-size-ds-h3: var(--ds-font-size-h3);
  --font-size-ds-h3--line-height: var(--ds-line-height-h3);
  --font-size-ds-h2: var(--ds-font-size-h2);
  --font-size-ds-h2--line-height: var(--ds-line-height-h2);
  --font-size-ds-h1: var(--ds-font-size-h1);
  --font-size-ds-h1--line-height: var(--ds-line-height-h1);

  /* p-ds-8, gap-ds-10, m-ds-14 */
  --spacing-ds-8: var(--ds-spacing-8);
  --spacing-ds-10: var(--ds-spacing-10);
  --spacing-ds-14: var(--ds-spacing-14);

  /* rounded-ds */
  --radius-ds: var(--ds-radius);
  /* border-ds */
  --border-width-ds: var(--ds-border-width);

  /* shadow-ds-100, shadow-ds-500 */
  --shadow-ds-100: var(--ds-shadow-100);
  --shadow-ds-200: var(--ds-shadow-200);
  --shadow-ds-300: var(--ds-shadow-300);
  --shadow-ds-400: var(--ds-shadow-400);
  --shadow-ds-500: var(--ds-shadow-500);

  /* duration-ds-100, duration-ds-300 */
  --duration-ds-100: var(--ds-duration-100);
  --duration-ds-200: var(--ds-duration-200);
  --duration-ds-300: var(--ds-duration-300);

  /* ease-ds-out, ease-ds-inout */
  --ease-ds-out: var(--ds-easing-out);
  --ease-ds-inout: var(--ds-easing-inout);
}
```

consumer usage:

```css
@import "tailwindcss";
@import "@kristjanjansen/design-system/css/tailwind.css";
```

gives utilities: `text-ds-fg`, `bg-ds-page`, `text-ds-xl`, `p-ds-8`, `rounded-ds`, `shadow-ds-200`, `duration-ds-200`, `ease-ds-out`.

after color-mix rework, add hover/focus derived colors:

```css
@theme {
  --color-ds-border-hover: color-mix(
    in oklch,
    var(--ds-color-border),
    var(--ds-mix-direction) var(--ds-light-hover)
  );
  --color-ds-accent-hover: color-mix(
    in oklch,
    var(--ds-color-accent),
    var(--ds-mix-direction) var(--ds-light-hover)
  );
}
```

not included: font-family (consumer sets on body), shift tokens (internal), opacity (component concern).

## summary of changes

1. split themes into 4 files, drop `light-dark()`
2. keep font-size tokens as-is
3. numbered durations (`--ds-duration-100/200/300`)
4. named easings (`--ds-easing-out`, `--ds-easing-inout`)
5. replace disabled opacity with color-based styling
6. replace oklch relative syntax with `color-mix()` + `--ds-light-*` percentage tokens
7. remove `@property` declarations (done)
8. ship `tailwind.css` with `@theme` mapping DS tokens
