# Plan: InputPassword

## Background

EDS builds password toggle into Textfield via `type="password"` + `showPasswordToggle` prop. ELV has no password toggle — just passes `type="password"` to the browser. We create a dedicated `InputPassword` component following NuxtUI naming.

## Approach

Separate component, not a mode of `Input`. Reasons:

- `Input` stays simple — no conditional icon rendering
- Password-specific props (`showToggle`, `toggleLabel`) don't pollute the generic `Input` interface
- Follows NuxtUI pattern: `Input`, `InputNumber`, `InputPassword` etc.

## Component

```ts
interface InputPasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  toggleLabel?: string; // aria-label for show/hide button, required for a11y
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

No `type` prop — always password. No `showToggle` prop — the toggle is always present (if you don't want it, use `<Input type="password">`).

## Implementation

```tsx
export function InputPassword({ toggleLabel = "Toggle password visibility", ... }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="ds-input-password">
      <FieldLabel ...>{label}</FieldLabel>
      <div className="input-wrapper">
        <input type={visible ? "text" : "password"} ... />
        <button
          type="button"
          className="toggle"
          onClick={() => setVisible(!visible)}
          aria-label={toggleLabel}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <FieldMessages ... />
    </div>
  );
}
```

## Key decisions

- **Toggle always present** — no prop to hide it. Use `<Input type="password">` for no toggle
- **`aria-pressed`** on the button — announces toggle state. No `aria-live` needed
- **`toggleLabel` prop** — consumers pass translated string for the button's aria-label
- **Icons** — `EyeIcon` and `EyeOffIcon` from EDS Figma library (`global/eye`, `global/eye-hide`)
- **Button inside input border** — flex child, not absolute positioned (matches EDS pattern)
- **Focus ring on toggle** — `box-shadow` inset, not outline (stays within the input border)
- **`type="button"`** on toggle — prevents form submission on click

## CSS

The input wrapper is a flex container (like EDS):

```css
.input-wrapper {
  display: flex;
  align-items: center;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius);
  background: var(--ds-color-bg);
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  padding: var(--ds-spacing-10) var(--ds-spacing-14);
}

.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5em;
  height: 2.5em;
  flex-shrink: 0;
  margin: 2px;
  border: none;
  border-radius: calc(var(--ds-radius) * 0.5);
  background: none;
  color: var(--ds-color-muted);
  cursor: pointer;
}

.toggle:focus-visible {
  box-shadow: inset 0 0 0 2px var(--ds-color-outline);
}
```

Focus/hover/error states on the wrapper, not the inner input. The wrapper gets the border, outline, and state colors.

## Icons

Import from EDS Figma library:

- `global/eye` (24px) — password hidden, show icon
- `global/eye-hide` (24px) — password visible, hide icon

Export SVG from Figma → TSX components in `InputPassword/icons/`.

## File structure

```
src/components/InputPassword/
  InputPassword.tsx
  InputPassword.css
  InputPassword.test.tsx
  icons/
    EyeIcon.tsx
    EyeOffIcon.tsx
```

## Tests

- Renders password input by default
- Toggle switches type between password and text
- Toggle has aria-pressed
- Toggle has aria-label from toggleLabel prop
- Supports all field props (label, error, description, required, disabled)
- Forwards ref to the input element
- forwardRef contract check

## What we skip from EDS

- `aria-describedby` linking toggle button to field label/description — adds complexity, `aria-label` on button is sufficient
- `showPasswordToggle` prop — always show toggle, use `Input type="password"` if you don't want it

---

## Status: DONE

Implemented as planned. Key details:

- Icons centralized to `src/icons/IconEyeSm.tsx` and `src/icons/IconEyeHideSm.tsx` (from EDS Figma `global/eye`, `global/eye-hide`)
- Toggle button has `tabIndex={-1}` (focus stays on input, toggle via click only)
- Uses shared `FieldLabel` and `FieldMessages` from `internal/`
- 12 tests covering toggle, aria-pressed, aria-label, disabled, required, onChange, ref
