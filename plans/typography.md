# plan: typography expansion

## status: pending

## current state

We have: `h1`–`h6`, `body`, `small`, `tiny`. All headings are weight 600, text inherits weight. No letter-spacing. No display/lead/overline styles.

## what EDS and ELV have that we don't

| Style    | EDS name      | ELV equivalent | Purpose                                                                       |
| -------- | ------------- | -------------- | ----------------------------------------------------------------------------- |
| Display  | `display`     | —              | Hero text, 3rem→4rem, weight 400, negative letter-spacing                     |
| Lead     | `leadtext`    | `text-lg`      | Intro paragraph, 1.25rem→1.5rem, weight 300, slight negative letter-spacing   |
| Overline | `subheadline` | —              | Category labels, 0.75rem→1rem, weight 700, uppercase, positive letter-spacing |

## proposed additions

### New text styles

| Token name | Font size   | Line height     | Weight | Letter spacing | Use case                   |
| ---------- | ----------- | --------------- | ------ | -------------- | -------------------------- |
| `display`  | 3rem → 4rem | 3.5rem → 4.5rem | 400    | -0.02em        | Hero sections              |
| `lead`     | 1.25rem     | 1.75rem         | 300    | -0.01em        | Intro paragraphs           |
| `overline` | 0.75rem     | 1rem            | 700    | 0.05em         | Category labels, uppercase |

### Why these names (not EDS names)

- `display` — standard name, same as EDS, no confusion
- `lead` — clearer than EDS's `leadtext`, matches Bootstrap/Tailwind convention
- `overline` — clearer than EDS's `subheadline` which sounds like it goes under a headline. `overline` = small text ABOVE a headline, which is its actual use

### New CSS variables

```css
/* variables.css */
--ds-font-size-display: 3rem;
--ds-line-height-display: 3.5rem;
--ds-letter-spacing-display: -0.02em;

--ds-font-size-lead: 1.25rem;
--ds-line-height-lead: 1.75rem;
--ds-letter-spacing-lead: -0.01em;

--ds-font-size-overline: 0.75rem;
--ds-line-height-overline: 1rem;
--ds-letter-spacing-overline: 0.05em;

/* heading letter-spacing (from EDS) */
--ds-letter-spacing-h1: -0.02em;
--ds-letter-spacing-h2: -0.01em;

/* responsive overrides at laptop */
--ds-font-size-display: 4rem;
--ds-line-height-display: 4.5rem;
```

### Heading component changes

Add `level="display"` option:

```tsx
<Heading level="display">Hero Title</Heading>
```

Renders as `<h1>` with display size. Could also accept `as` prop to override element.

### Text component changes

Add `variant` prop:

```tsx
<Text>Default body text</Text>
<Text variant="lead">Intro paragraph with lighter weight</Text>
<Text variant="small">Small text</Text>
<Text variant="tiny">Tiny text</Text>
<Text variant="overline">CATEGORY LABEL</Text>
```

Overline auto-applies `text-transform: uppercase`.

### Tailwind mapping

```css
@theme {
  /* existing */
  --font-size-ds-body: var(--ds-font-size-body);
  --font-size-ds-small: var(--ds-font-size-small);
  --font-size-ds-tiny: var(--ds-font-size-tiny);
  --font-size-ds-h1 ... ds-h6: ...

  /* new */
  --font-size-ds-display: var(--ds-font-size-display);
  --font-size-ds-display--line-height: var(--ds-line-height-display);
  --font-size-ds-lead: var(--ds-font-size-lead);
  --font-size-ds-lead--line-height: var(--ds-line-height-lead);
  --font-size-ds-overline: var(--ds-font-size-overline);
  --font-size-ds-overline--line-height: var(--ds-line-height-overline);

  --letter-spacing-ds-tight: -0.02em;
  --letter-spacing-ds-normal: 0;
  --letter-spacing-ds-wide: 0.05em;
}
```

Usage: `text-ds-display`, `text-ds-lead`, `text-ds-overline`, `tracking-ds-tight`, `tracking-ds-wide`

### Letter spacing on headings

EDS applies negative letter-spacing on large headings (display, h1, h2). This makes large text feel tighter and more polished. Add to heading CSS:

```css
.ds-heading--display {
  letter-spacing: var(--ds-letter-spacing-display);
}
.ds-heading--h1 {
  letter-spacing: var(--ds-letter-spacing-h1);
}
.ds-heading--h2 {
  letter-spacing: var(--ds-letter-spacing-h2);
}
```

### Weight system

Current: Text accepts `weight` prop (400 | 600).

EDS uses 300 (lead), 400 (default), 500 (label), 600 (semi), 700 (bold/overline).
ELV uses 400 (default) and 700 (bold/heading).

Proposal: keep `weight` prop but accept named values:

```tsx
<Text weight="light">300 — lead text</Text>
<Text weight="normal">400 — default</Text>
<Text weight="medium">500 — labels</Text>
<Text weight="semibold">600 — emphasis</Text>
<Text weight="bold">700 — strong</Text>
```

Tailwind: use standard `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold` — no custom mapping needed.

## implementation order

1. Add CSS variables (font-size, line-height, letter-spacing) to variables.css + responsive overrides
2. Add letter-spacing to Heading CSS for display/h1/h2
3. Add `level="display"` to Heading component
4. Add `variant="lead|overline"` to Text component
5. Add named weight values to Text
6. Update tailwind.css with new font-size and letter-spacing tokens
7. Update example app + Next.js app with new styles
8. Update Figma typography page

## not adding

- EDS's `text-line` vs `text-paragraph` distinction (different line-heights for same size). Too granular — consumers can override line-height directly
- EDS's label typography (tiny/small/default/large × 400/600). Labels use the same tokens as text
- `minimum` size (0.625rem) — too small for practical use
