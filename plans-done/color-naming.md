# plan: color naming + component variables

## status: done

## problems

1. `--ds-color-bg` vs `--ds-color-bg-success` — confusing hierarchy
2. `--ds-color-accent` is both button primary bg AND info text — overloaded
3. `--ds-color-page` vs `--ds-color-bg` distinction unclear to consumers
4. no system for surface/tint colors (badge backgrounds)
5. component-specific overrides (button size, badge radius) scattered in `:is()` selectors

## current colors

```
--ds-color-fg           text foreground
--ds-color-muted        secondary text
--ds-color-error        error text + borders
--ds-color-success      success text (badge)
--ds-color-warning      warning text (badge)
--ds-color-border       borders
--ds-color-bg           component background (input, card)
--ds-color-page         page background
--ds-color-accent       primary/accent (button bg, ghost text, info)
--ds-color-outline      focus outline
--ds-color-bg-success   badge bg (NAMING CONFLICT)
--ds-color-bg-warning   badge bg
--ds-color-bg-error     badge bg
--ds-color-bg-info      badge bg
```

## how EDS/ELV do it

**EDS**: highly specific, bakes element type into name:

```
--eds-color-action-bg-accent-default      (accent button bg, default state)
--eds-color-action-text-accent-default    (accent button text)
--eds-color-static-bg-success-alternative (badge success bg)
--eds-color-static-text-success-body      (badge success text)
```

pattern: `--eds-color-{context}-{element}-{semantic}-{state}`
context = action (stateful) / static (fixed)
element = bg / text / icon / stroke

**ELV**: generic palette, no element type in names:

```
--primary-500      (mid-tone primary)
--success-200      (light success)
--danger-600       (dark danger)
--neutral-border   (neutral for borders)
```

relies on Tailwind utilities for element distinction: `text-primary-500`, `bg-success-200`

**our approach**: middle ground. group by element type (fg/bg/border) but keep names short. no state suffixes (CSS handles states via selectors).

## proposed naming

follow `--ds-color-{element}-{variant}` pattern. keep `--ds-color-` prefix.

### core palette (global)

```
--ds-color-fg                 primary text
--ds-color-fg-muted           secondary/muted text (was: --ds-color-muted)
--ds-color-fg-accent          accent-colored text (ghost button, links)
--ds-color-fg-error           error text
--ds-color-fg-success         success text
--ds-color-fg-warning         warning text
--ds-color-fg-on-accent       text on accent bg (white)
--ds-color-fg-on-error        text on error bg (white)

--ds-color-bg                 component background (inputs, cards)
--ds-color-bg-page            page background (was: --ds-color-page)
--ds-color-bg-accent          accent fill (primary button)
--ds-color-bg-error           error fill (danger button)
--ds-color-bg-success         success tint (badge bg)
--ds-color-bg-warning         warning tint (badge bg)
--ds-color-bg-info            info tint (badge bg)
--ds-color-bg-neutral         neutral tint (badge bg, tertiary button)
--ds-color-bg-hover           subtle hover bg (ghost button hover)

--ds-color-border             default border
--ds-color-border-error       error border
--ds-color-outline            focus outline
```

### tailwind mapping

```css
@theme {
  /* text */
  --color-ds-fg: var(--ds-color-fg);
  --color-ds-fg-muted: var(--ds-color-fg-muted);
  --color-ds-fg-accent: var(--ds-color-fg-accent);
  --color-ds-fg-error: var(--ds-color-fg-error);
  --color-ds-fg-success: var(--ds-color-fg-success);
  --color-ds-fg-warning: var(--ds-color-fg-warning);

  /* backgrounds */
  --color-ds-bg: var(--ds-color-bg);
  --color-ds-bg-page: var(--ds-color-bg-page);
  --color-ds-bg-accent: var(--ds-color-bg-accent);
  --color-ds-bg-error: var(--ds-color-bg-error);
  --color-ds-bg-success: var(--ds-color-bg-success);
  --color-ds-bg-warning: var(--ds-color-bg-warning);
  --color-ds-bg-info: var(--ds-color-bg-info);
  --color-ds-bg-neutral: var(--ds-color-bg-neutral);

  /* border */
  --color-ds-border: var(--ds-color-border);
  --color-ds-outline: var(--ds-color-outline);
}
```

tw usage: `text-ds-fg-muted`, `bg-ds-bg-accent`, `border-ds-border`, `bg-ds-bg-page`

### migration mapping

| old                  | new                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `--ds-color-fg`      | `--ds-color-fg` (same)                                                                         |
| `--ds-color-muted`   | `--ds-color-fg-muted`                                                                          |
| `--ds-color-error`   | `--ds-color-fg-error` (text) / `--ds-color-bg-error` (bg) / `--ds-color-border-error` (border) |
| `--ds-color-success` | `--ds-color-fg-success`                                                                        |
| `--ds-color-warning` | `--ds-color-fg-warning`                                                                        |
| `--ds-color-accent`  | `--ds-color-fg-accent` (text) / `--ds-color-bg-accent` (bg)                                    |
| `--ds-color-bg`      | `--ds-color-bg` (same)                                                                         |
| `--ds-color-page`    | `--ds-color-bg-page`                                                                           |
| `--ds-color-border`  | `--ds-color-border` (same)                                                                     |
| `--ds-color-outline` | `--ds-color-outline` (same)                                                                    |

### figma variable naming

`/` separator creates groups in Figma variable panel. CSS uses `-`.

| css variable              | figma variable         |
| ------------------------- | ---------------------- |
| `--ds-color-fg`           | `color/fg/default`     |
| `--ds-color-fg-muted`     | `color/fg/muted`       |
| `--ds-color-fg-accent`    | `color/fg/accent`      |
| `--ds-color-fg-error`     | `color/fg/error`       |
| `--ds-color-fg-success`   | `color/fg/success`     |
| `--ds-color-fg-warning`   | `color/fg/warning`     |
| `--ds-color-bg`           | `color/bg/default`     |
| `--ds-color-bg-page`      | `color/bg/page`        |
| `--ds-color-bg-accent`    | `color/bg/accent`      |
| `--ds-color-bg-error`     | `color/bg/error`       |
| `--ds-color-bg-success`   | `color/bg/success`     |
| `--ds-color-bg-warning`   | `color/bg/warning`     |
| `--ds-color-bg-info`      | `color/bg/info`        |
| `--ds-color-bg-neutral`   | `color/bg/neutral`     |
| `--ds-color-border`       | `color/border/default` |
| `--ds-color-border-error` | `color/border/error`   |
| `--ds-color-outline`      | `color/outline`        |

## component-specific variables

### decision: yes

component vars let themes customize components without knowing class names. the `:is([data-theme="brand2-*"])` approach doesn't scale — it puts brand knowledge into component CSS. component vars move brand differences into theme files where they belong.

### pattern

`--ds-{component}-{property}` with defaults referencing the scale:

```css
/* variables.css — defaults (brand1) */
--ds-badge-radius: var(--ds-radius-full);
--ds-button-radius: var(--ds-radius-full);
--ds-button-padding-y: var(--ds-spacing-14);
--ds-button-padding-x: var(--ds-spacing-20);
--ds-button-font-size: var(--ds-font-size-body);
--ds-button-font-weight: 600;

/* brand2 theme — overrides */
--ds-badge-radius: var(--ds-radius-minimum);
--ds-button-padding-y: var(--ds-spacing-14);
--ds-button-padding-x: var(--ds-spacing-28);
--ds-button-font-size: var(--ds-font-size-h6);
--ds-button-font-weight: 700;
```

### what moves to component vars

only properties that **differ between brands**. if all brands use the same value, use the scale token directly.

| component | property          | brand1       | brand2        | var                        |
| --------- | ----------------- | ------------ | ------------- | -------------------------- |
| Badge     | radius            | full (999px) | minimum (2px) | `--ds-badge-radius`        |
| Button    | radius            | full (999px) | full (999px)  | no — same for both         |
| Button    | padding-x default | spacing-20   | spacing-28    | `--ds-button-padding-x`    |
| Button    | padding-x small   | spacing-14   | spacing-24    | `--ds-button-padding-x-sm` |
| Button    | font-size default | body         | h6            | `--ds-button-font-size`    |
| Button    | font-size small   | small        | body          | `--ds-button-font-size-sm` |
| Button    | font-weight       | 600          | 700           | `--ds-button-font-weight`  |

### removes `:is()` selectors

once component vars are in place, the brand2 `:is()` overrides in Button.css can be removed. the theme file handles everything.

### figma

component vars map to Figma variables in the Main collection, different values per theme mode. same pattern as radius scale.

## implementation order

1. rename colors in all 4 theme files
2. update all component CSS references
3. update variables.test.ts color parsing
4. update tailwind.css mapping
5. rename Figma variables
6. update CLAUDE.md color reference
7. update consumer apps
