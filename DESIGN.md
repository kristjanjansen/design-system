# Design Intent

## Colors

- `oklch` for all values. Derive variants via relative color syntax: `oklch(from var(--base) calc(l - var(--shift)) c h)`
- Shift tokens (`--ds-l-hover`, `--ds-l-focus`, `--ds-l-disabled`, `--ds-c-disabled`) — never hardcode variants
- `@property` registers color tokens with `syntax: "<color>"` for smooth theme transitions
- `--ds-color-accent` for interactive highlights — green (brand1), blue (brand2)

## Tokens

- CSS custom properties prefixed `--ds-`
- `em` for font sizes, spacing, radius. `px` for border/outline widths
- Naming: `--ds-color-{name}`, `--ds-l-{state}`, `--ds-c-{state}`, `--ds-spacing-{px}`
- Motion: `--ds-duration-fast/normal/slow` (100ms), `--ds-easing: cubic-bezier(0.14, 0.25, 0.54, 1)`
- Font: `--ds-font-family`, `--ds-font-stretch` — themed per brand

## CSS patterns

- `@layer ds` for all styles. `@scope` per component — bare inner class names (`.input`, `.label`)
- `:focus-visible` not `:focus`. `prefers-reduced-motion` disables transitions. `forced-colors` for high contrast
- `@starting-style` for error fade-in. `field-sizing: content` on Textarea. `text-wrap: balance` on text
- `font-stretch: var(--ds-font-stretch)` on inputs explicitly (form elements don't inherit it)
- Transitions: `transition-property` listing color properties only, shared duration/easing

## Theming

- `data-theme="brand1-light|brand1-dark|brand2-light|brand2-dark"` on root
- `light-dark()` collapses light+dark into one file per brand. `color-scheme` set per theme
- Base `:root` = brand1-light default. `prefers-color-scheme: dark` auto-fallback
- Themeable: colors, radius, border-width, outline, font-family, opacity. Shared: spacing, font sizes

## Component states

- **Default**: base border, base background
- **Hover**: border darkens by `--ds-l-hover`
- **Focus**: outline appears via `:focus-visible`, border darkens by `--ds-l-focus`
- **Error**: error color border/message/outline
- **Disabled**: lightened border, muted bg, muted text, `cursor: default`
- **Read-only**: muted bg, desaturated border, normal text, `cursor: default`

## Component API

- `onChange`: value first — `(value, event)` for fields, `(checked, event)` for Switch/Checkbox
- `forwardRef` on all. Native HTML attributes via `Omit<HTMLAttributes, ...>` passthrough
- `useId()` for auto `id` + `htmlFor`. `aria-invalid`, `aria-describedby`, `aria-required` from props
- Shared `FieldLabel` + `FieldMessages` in `internal/`. Always `<label>` element with `htmlFor`
- Error: `aria-live="polite"` (not `role="alert"`)
- Accordion: native `<details>` + `interpolate-size`. `name` for exclusive. `variant="ghost|default"`

## Figma

- File: https://www.figma.com/design/NiBvhCdGieWhAcyuwn2K7W/Test
- Design Tokens collection: 4 modes (brand1-light/dark, brand2-light/dark)
- Text styles with `fontFamily`/`fontSize`/`fontStyle` bound to variables (Inter ↔ Roboto Flex)
- Icons from EDS Icon Library (`global/` set)

### Component page rules

1. Component set at x=2000, no background — out of view
2. 4 themed frames in 2×2 grid (lights top, darks bottom). "All components" page: single row
3. Frames: 400px wide, equal height, 48px gap, 24px padding, 8px radius, fill bound to `color/page`
4. Theme label: 11px muted 0.5 opacity. All states shown. Instances fill width
5. Pages: "All components" first, alphabetical middle, "Icons" last
6. Disabled/readonly fills: `color/bg` at 0.7 opacity — never hardcoded colors
7. Labels reflect state (e.g. "Email" for error, "Username" for disabled)
8. Don't assume Figma API limitations — test before claiming features don't exist
