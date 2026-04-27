# plan: disabled state

## status: pending

## problem

`opacity: var(--ds-opacity-disabled)` (0.5) applied to entire elements. in dark mode, dimmed dark elements become nearly invisible. also compounds badly when disabled inside a container with its own background.

## current usage

7 components use `opacity: var(--ds-opacity-disabled)`:

- Button
- Switch (track)
- Checkbox (indicator)
- Radio (indicator)
- Accordion
- Select (option)
- InputPassword (toggle)

disabled text already fixed — uses `var(--ds-color-muted)` via color-mix migration.

## approach

replace blanket opacity with per-component styling:

### button

- use muted text color + lighter bg instead of opacity
- `color: var(--ds-color-muted); background: color-mix(...); cursor: default;`

### switch, checkbox, radio (indicators)

- lighter border + desaturated fill
- `border-color: color-mix(in oklch, var(--ds-color-border), var(--ds-tint) var(--ds-light-disabled));`

### accordion

- muted text + no pointer events (already has `pointer-events: none`)
- remove opacity, use `color: var(--ds-color-muted);`

### select option

- muted text, keep current approach

### inputpassword toggle

- muted icon color, no opacity

## remove from variables.css

```css
/* remove */
--ds-opacity-disabled: 0.5;
```

also remove from all 4 theme files.

## forced-colors

`forced-colors: active` sections currently override opacity to 1 and set GrayText. keep GrayText approach — it's the right pattern for high contrast mode.
