# Plan: Shared Form Field Primitives

## Problem

Each form component implements its own label, description, and error rendering inline. This duplicates styling, accessibility patterns, and layout logic.

## What to extract

### 1. `FieldLabel` — always `<label>`

One component for all form fields. Always renders `<label htmlFor={id}>`. No wrapping `<label>` on Checkbox/Switch — FieldLabel IS the label, linked via `htmlFor`.

```ts
interface FieldLabelProps {
  children: ReactNode;
  htmlFor: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  className?: string;
}
```

Features:
- Always `<label>` element with `htmlFor` — consistent across all form fields
- Required: `<RequiredIndicator />` after text
- InfoHint: slot for popover/tooltip trigger, inline after label
- Suffix: italic muted text ("optional", "max 200 chars")
- Disabled: dimmed via oklch shift
- Returns null if no children

### 2. `FieldMessages` — error + description

```ts
interface FieldMessagesProps {
  error?: string;
  description?: string;
  errorId?: string;
  descriptionId?: string;
}
```

Features:
- Error: `aria-live="polite"`, `@starting-style` fade-in
- Description: muted, hidden when error is shown
- `aria-describedby` linked via IDs passed from parent

### 3. `RequiredIndicator`

```tsx
<span aria-hidden="true">✱</span>
```

## Structure

```
src/components/internal/
  FieldLabel.tsx
  FieldLabel.css
  FieldMessages.tsx
  FieldMessages.css
  RequiredIndicator.tsx
```

Not exported from `index.ts`. Used only by form components.

## Migration pattern

### Before (Checkbox)
```tsx
<label className="control" htmlFor={inputId}>
  <span className="indicator">...</span>
  <span className="label">{label}</span>
</label>
```

### After (Checkbox)
```tsx
<div className="control">
  <span className="indicator">
    <input id={inputId} ... />
    ...
  </span>
  <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
</div>
<FieldMessages error={error} description={description} ... />
```

Every component uses the same `<label htmlFor>` + `<input id>` association. No wrapping labels.

## New props on form components

| Prop | Type | Components |
|---|---|---|
| `required` | `boolean` | All (visual indicator + `aria-required`) |
| `infoHint` | `ReactNode` | TextField, TextArea |
| `suffix` | `ReactNode` | TextField, TextArea, Checkbox |

## Accessibility improvements

- `aria-required="true"` set on input when `required` prop is true
- Required indicator is `aria-hidden` (screen readers get `aria-required` from the input, not visual cue)
- `aria-describedby` consistently links to both error and description IDs (currently some components only link to one)
- FieldMessages error uses `aria-live="polite"` (already done, now centralized)
- Remove `aria-checked` from Checkbox — native checkbox doesn't need it (only Switch with `role="switch"` does)
- InfoHint trigger should have `aria-label` describing what info it provides

## CSS

FieldLabel and FieldMessages CSS lives in `internal/`. Component CSS files simplify — remove label/error/description rules that move to primitives.

Primitives use `@layer ds` but NOT `@scope` — they render inside various component scopes and shouldn't add their own.

## What we skip

- `link` in label (EDS) — consumers put links in `suffix` or `infoHint`
- `descriptionSeverity: "warning"` (EDS) — add later if needed
- `validationBehavior: "native"` (ELV) — no react-aria dependency
- Popover placement for infoHint — consumer controls via their ReactNode

## Order

1. Create `internal/` with FieldLabel, FieldMessages, RequiredIndicator
2. Migrate TextField (simplest)
3. Migrate TextArea (same)
4. Migrate Checkbox (remove wrapping label, use FieldLabel with htmlFor)
5. Migrate Switch (same as Checkbox)
6. Update tests
7. Verify all a11y: required indicators, aria-describedby, aria-required
