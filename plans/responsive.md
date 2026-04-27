# plan: responsiveness

## status: pending

## context

ds currently has fixed typography sizes — no responsive scaling. EDS and ELS both use viewport media queries for typography. neither uses container queries.

### how EDS does it

2 Figma variable modes: "Mobile & Tablet" and "Laptop & Desktop". single breakpoint at `--laptop` (1024px). **all** typography is responsive — headings, body, labels:

```
display:  48/56 → 64/72
h1:       28/36 → 48/56
h2:       24/32 → 36/44
h3:       20/28 → 28/40
h4:       18/24 → 24/28
h5:       16/20 → 20/24
h6:       16/20 → 18/24
```

CSS uses `--mobile` and `--laptop` suffixed variables per style. Figma variable modes drive the output.

### how ELS does it

2-tier responsive at `--md` (768px). **only headings** scale — body text stays fixed:

```
h1: 2rem → 2.5rem
h2: 1.75rem → 2rem
h3: 1.5rem → 1.625rem
```

### shared breakpoints (EDS/ELS)

| name | EDS    | ELS    |
| ---- | ------ | ------ |
| sm   | 360px  | 360px  |
| md   | 768px  | 768px  |
| lg   | 1024px | 1024px |
| xl   | 1152px | 1152px |
| 2xl  | 1680px | 1680px |

## our approach

### breakpoints

adopt same values as EDS/ELS, semantic names:

```css
/* src/variables.css */
--ds-breakpoint-mobile: 22.5rem; /* 360px */
--ds-breakpoint-tablet: 48rem; /* 768px */
--ds-breakpoint-laptop: 64rem; /* 1024px */
--ds-breakpoint-desktop: 72rem; /* 1152px */
--ds-breakpoint-widescreen: 105rem; /* 1680px */
```

custom media queries (lightningcss resolves these at build time):

```css
@custom-media --mobile (min-width: 22.5rem);
@custom-media --tablet (min-width: 48rem);
@custom-media --laptop (min-width: 64rem);
@custom-media --desktop (min-width: 72rem);
@custom-media --widescreen (min-width: 105rem);
```

### tailwind mapping

```css
/* src/tailwind.css */
@theme {
  --breakpoint-mobile: 22.5rem;
  --breakpoint-tablet: 48rem;
  --breakpoint-laptop: 64rem;
  --breakpoint-desktop: 72rem;
  --breakpoint-widescreen: 105rem;
}
```

## phase 1: responsive typography

single breakpoint like ELS: scale headings at `--laptop` (1024px). body/small/tiny stay fixed — they're already readable at all sizes.

### current sizes (fixed)

```
h1: 3rem / 3.5rem
h2: 2.5rem / 3rem
h3: 2rem / 2.5rem
h4: 1.5rem / 2rem
h5: 1.25rem / 1.75rem
h6: 1.125rem / 1.5rem
body: 1rem / 1.5rem
small: 0.875rem / 1.25rem
tiny: 0.75rem / 1.25rem
```

### proposed: mobile-first + scale at --laptop

| token | mobile             | laptop+ (≥1024px) |
| ----- | ------------------ | ----------------- |
| h1    | 2rem / 2.5rem      | 3rem / 3.5rem     |
| h2    | 1.75rem / 2.25rem  | 2.5rem / 3rem     |
| h3    | 1.5rem / 2rem      | 2rem / 2.5rem     |
| h4    | 1.25rem / 1.75rem  | 1.5rem / 2rem     |
| h5    | 1.125rem / 1.5rem  | 1.25rem / 1.75rem |
| h6    | 1rem / 1.375rem    | 1.125rem / 1.5rem |
| body  | 1rem / 1.5rem      | (no change)       |
| small | 0.875rem / 1.25rem | (no change)       |
| tiny  | 0.75rem / 1.25rem  | (no change)       |

### implementation: responsive variables

`--ds-font-size-h1` etc. are defined as mobile values by default. a `@media (--laptop)` block rewrites them to desktop values. components and tailwind just use `var(--ds-font-size-h1)` — no `-mobile` suffixes, no responsive logic in components.

```css
/* src/variables.css */
:root {
  /* mobile-first (default) */
  --ds-font-size-h1: 2rem;
  --ds-line-height-h1: 2.5rem;
  --ds-font-size-h2: 1.75rem;
  --ds-line-height-h2: 2.25rem;
  --ds-font-size-h3: 1.5rem;
  --ds-line-height-h3: 2rem;
  --ds-font-size-h4: 1.25rem;
  --ds-line-height-h4: 1.75rem;
  --ds-font-size-h5: 1.125rem;
  --ds-line-height-h5: 1.5rem;
  --ds-font-size-h6: 1rem;
  --ds-line-height-h6: 1.375rem;

  /* body/small/tiny — no change at any breakpoint */
  --ds-font-size-body: 1rem;
  --ds-line-height-body: 1.5rem;
  --ds-font-size-small: 0.875rem;
  --ds-line-height-small: 1.25rem;
  --ds-font-size-tiny: 0.75rem;
  --ds-line-height-tiny: 1.25rem;
}

@media (--laptop) {
  :root {
    --ds-font-size-h1: 3rem;
    --ds-line-height-h1: 3.5rem;
    --ds-font-size-h2: 2.5rem;
    --ds-line-height-h2: 3rem;
    --ds-font-size-h3: 2rem;
    --ds-line-height-h3: 2.5rem;
    --ds-font-size-h4: 1.5rem;
    --ds-line-height-h4: 2rem;
    --ds-font-size-h5: 1.25rem;
    --ds-line-height-h5: 1.75rem;
    --ds-font-size-h6: 1.125rem;
    --ds-line-height-h6: 1.5rem;
  }
}
```

components stay unchanged — they already use `var(--ds-font-size-h1)`:

```css
/* Heading.css — no responsive logic needed */
.ds-heading--h1 {
  font-size: var(--ds-font-size-h1);
  line-height: var(--ds-line-height-h1);
}
```

tailwind mapping stays unchanged too:

```css
@theme {
  --font-size-ds-h1: var(--ds-font-size-h1);
  --font-size-ds-h1--line-height: var(--ds-line-height-h1);
  /* ... automatically responsive via the variable */
}
```

## phase 2: component container queries (future)

### why container queries for components

- components don't know their viewport context — a card in a sidebar vs full-width
- container queries let components adapt to their own available space
- neither EDS nor ELS uses them, but they're well-supported (Chrome 105+, Safari 16+, Firefox 110+)

### candidates

| component           | container query use                                |
| ------------------- | -------------------------------------------------- |
| DataTable           | stack columns or scroll horizontally below a width |
| AccordionGroup      | adjust padding/gaps at narrow widths               |
| Button (full-width) | auto full-width below container threshold          |

### how it would work

```css
@scope (.ds-data-table) {
  :scope {
    container-type: inline-size;
  }

  @container (max-width: 30rem) {
    /* compact/stacked layout */
  }
}
```

**note:** `@container` conditions **cannot use CSS custom properties** — same limitation as `@media`. values must be literals. so `@container (max-width: var(--ds-breakpoint-tablet))` won't work. each component hardcodes its own threshold based on what makes sense for that component's layout (not tied to global breakpoints).

no rush — implement per-component when the need arises.

## figma considerations

### figma structure

#### "Main" collection (main, 4 theme modes)

add breakpoint variables — constant across all theme modes:

| variable                | value |
| ----------------------- | ----- |
| `breakpoint/mobile`     | 360   |
| `breakpoint/tablet`     | 768   |
| `breakpoint/laptop`     | 1024  |
| `breakpoint/desktop`    | 1152  |
| `breakpoint/widescreen` | 1680  |

#### "Responsive" collection (new, 5 modes)

| variable         | Mobile | Tablet | Laptop | Desktop | Widescreen |
| ---------------- | ------ | ------ | ------ | ------- | ---------- |
| `frame/width`    | 360    | 768    | 1024   | 1152    | 1680       |
| `font-size/h1`   | 32     | 32     | 48     | 48      | 48         |
| `font-size/h2`   | 28     | 28     | 40     | 40      | 40         |
| `font-size/h3`   | 24     | 24     | 32     | 32      | 32         |
| `font-size/h4`   | 20     | 20     | 24     | 24      | 24         |
| `font-size/h5`   | 18     | 18     | 20     | 20      | 20         |
| `font-size/h6`   | 16     | 16     | 18     | 18      | 18         |
| `line-height/h1` | 40     | 40     | 56     | 56      | 56         |
| `line-height/h2` | 36     | 36     | 48     | 48      | 48         |
| `line-height/h3` | 32     | 32     | 40     | 40      | 40         |
| `line-height/h4` | 28     | 28     | 32     | 32      | 32         |
| `line-height/h5` | 24     | 24     | 28     | 28      | 28         |
| `line-height/h6` | 22     | 22     | 24     | 24      | 24         |

typography switches at Laptop boundary — Mobile/Tablet get mobile sizes, Laptop+ get desktop sizes. matches CSS `@media (--laptop)`.

body/small/tiny stay in Main — they don't change responsively.

#### text style binding

heading text styles bind `fontSize` and `lineHeight` to Responsive collection variables. `fontFamily` and `fontStyle` stay bound to Main (brand-dependent, not size-dependent).

#### designer workflow

1. bind frame width to `frame/width` variable
2. switch Responsive mode → frame resizes + headings scale together
3. theme mode (brand1-light etc.) stays independent on Main
4. a single frame has both a theme mode and a responsive mode

#### component page updates

add responsive preview frames on the Typography/Heading page:

- frame bound to `frame/width`, Responsive mode = Mobile
- frame bound to `frame/width`, Responsive mode = Laptop
- both showing h1–h6 to compare scales side by side

#### responsive form example page

"Responsive" Figma page with a simple form (Heading, Input, Textarea, Button) shown as a grid:

|              | Mobile (360) | Tablet (768) | Laptop (1024) |
| ------------ | ------------ | ------------ | ------------- |
| brand1-light | form         | form         | form          |
| brand1-dark  | form         | form         | form          |
| brand2-light | form         | form         | form          |
| brand2-dark  | form         | form         | form          |

- columns = Responsive collection modes (frame width bound to `frame/width`)
- rows = Main collection theme modes
- each cell is a frame with both modes set
- shows how typography + theme interact at each breakpoint
- 48px gap between frames, column labels on top, row labels on left

#### implementation steps

1. add `breakpoint/*` variables to Main collection
2. create "Responsive" collection with 5 modes
3. add `frame/width`, `font-size/*`, `line-height/*` variables
4. rebind heading text styles from Main font-size to Responsive font-size
5. add responsive preview frames to Typography page, bind width to `frame/width`
6. HUG all frames

### frame widths for responsive previews

| width  | represents |
| ------ | ---------- |
| 360px  | mobile     |
| 768px  | tablet     |
| 1024px | desktop    |

add a "Responsive" page in Figma showing typography at each width.
