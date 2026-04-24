# Plan: RadioGroup + Radio

## Background

EDS/ELV both use react-aria for radio state/keyboard. We skip react-aria — use native HTML radio inputs with shared `name` attribute (same philosophy as Accordion's native `name` grouping).

## Components

### RadioGroup

Wrapper that provides shared name and manages selection.

```ts
interface RadioGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
}
```

**HTML structure:**

```html
<fieldset class="ds-radio-group" role="radiogroup">
  <FieldLabel as="legend">Group label</FieldLabel>
  <div class="options" data-direction="vertical|horizontal">{children}</div>
  <FieldMessages />
</fieldset>
```

Key decisions:

- `<fieldset>` + `<legend>` — semantically correct for grouped controls. Screen readers announce the group label
- FieldLabel renders as `<legend>` instead of `<label>` (no `htmlFor` needed for groups)
- `name` auto-generated via `useId()` if not provided — ensures radio exclusivity
- State via React Context — RadioGroup provides `{ name, value, onChange, disabled }`, Radio reads it
- `direction` prop for horizontal/vertical layout (flex-direction)

### Radio

Individual radio option. Must be inside RadioGroup.

```ts
interface RadioProps {
  children?: ReactNode;
  value: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}
```

**HTML structure:**

```html
<div class="ds-radio">
  <input type="radio" name="{ctx.name}" value="{value}" id="{autoId}" />
  <span class="indicator" />
  <FieldLabel htmlFor="{autoId}" inline>{children}</FieldLabel>
</div>
```

Key decisions:

- Native `<input type="radio">` — browser handles exclusivity, keyboard nav (arrow keys), form submission
- Custom indicator via CSS `::after` on `.indicator` (filled circle when checked)
- FieldLabel with `inline` prop (regular weight, like Checkbox)
- `disabled` can be set per-Radio or inherited from RadioGroup via context
- No `forwardRef` — Radio is a compound child, not a standalone element

## Keyboard (native)

Native radio groups handle arrow key navigation automatically when inputs share the same `name`:

- Arrow up/left: previous option
- Arrow down/right: next option
- Tab: moves to/from the group (not between options)
- Space: selects focused option

No custom keyboard handling needed.

## CSS

```css
@scope (.ds-radio-group) {
  :scope { display: flex; flex-direction: column; gap: var(--ds-spacing-8); }
  .options { display: flex; flex-direction: column; gap: var(--ds-spacing-8); }
  .options[data-direction="horizontal"] { flex-direction: row; }
}

@scope (.ds-radio) {
  :scope { display: flex; align-items: center; gap: var(--ds-spacing-10); }

  input[type="radio"] { appearance: none; width: 1.25em; height: 1.25em; ... }
  input[type="radio"]:checked { border-color: var(--ds-color-accent); }
  input[type="radio"]:checked::after { /* filled circle */ }
  input[type="radio"]:focus-visible { outline: var(--ds-outline-width) solid var(--ds-color-outline); }
  input[type="radio"]:disabled { opacity: var(--ds-opacity-disabled); }
}
```

Indicator: `appearance: none` + custom border circle + `::after` filled dot when checked. Same pattern as Checkbox but circular.

## File structure

```
src/components/RadioGroup/
  RadioGroup.tsx
  RadioGroup.css
  RadioGroup.test.tsx
  Radio.tsx
  RadioContext.ts
```

## Tests

- RadioGroup renders fieldset with role radiogroup
- Radio renders native radio input
- Selection via click
- Arrow key navigation (native)
- Controlled value/onChange
- Uncontrolled defaultValue
- Disabled group disables all radios
- Disabled individual radio
- Direction horizontal/vertical
- Required indicator on group label
- Error/description on group
- forwardRef not needed (compound component)
