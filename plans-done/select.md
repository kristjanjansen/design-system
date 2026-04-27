# Plan: Select

## Background

Brand1/Brand2 both use react-aria for custom dropdown with portal popover. We can start with native `<select>` and add a custom dropdown later.

## Two-phase approach

### Phase 1: Native Select (implement now)

Use native `<select>` element. Works everywhere, accessible by default, mobile-friendly.

```ts
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  placeholder?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  className?: string;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

Or with option groups:

```ts
interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

type SelectOptions = (SelectOption | SelectOptionGroup)[];
```

**HTML structure:**

```html
<div class="ds-select">
  <FieldLabel ...>
  <div class="select-wrapper">
    <select>
      <option value="" disabled selected>Placeholder</option>
      <option value="a">Option A</option>
      <optgroup label="Group">
        <option value="b">Option B</option>
      </optgroup>
    </select>
    <span class="chevron"><IconChevronDownSm /></span>
  </div>
  <FieldMessages ...>
</div>
```

Key decisions:

- **Native `<select>`** — no popover, no portal, no keyboard handling code
- **`options` prop as data** — not `<Item>` children (simpler API, serializable)
- **Custom chevron** — hide native arrow with `appearance: none`, add our own
- **`onChange` returns string** — single select only (no multiple)
- **Wrapper div** — same pattern as Input/InputPassword for border + chevron positioning
- **Placeholder** via disabled first `<option>`

CSS: same input-wrapper pattern. `appearance: none` on `<select>`, custom chevron as flex child.

### Phase 2: SelectMenu (future)

Custom dropdown with search, icons, descriptions, multi-select. Would use:

- `<Popover>` component (build separately)
- Listbox with keyboard navigation
- Search/filter input
- Option icons/descriptions

This is a separate component (`SelectMenu`) — the native `Select` stays for simple use cases.

## Why native first

- Zero JS for dropdown behavior
- Mobile shows native picker (better UX than custom)
- Accessible by default — no ARIA needed
- Works without JS (progressive enhancement)
- Covers 80% of use cases

Brand2's custom select is ~400 lines. Native is ~50 lines.

## File structure

```
src/components/Select/
  Select.tsx
  Select.css
  Select.test.tsx
```

## CSS

```css
@scope (.ds-select) {
  .select-wrapper {
    display: flex;
    align-items: center;
    border: var(--ds-border-width) solid var(--ds-color-border);
    border-radius: var(--ds-radius);
    background: var(--ds-color-bg);
  }

  select {
    appearance: none;
    flex: 1;
    padding: var(--ds-spacing-10) var(--ds-spacing-14);
    font-size: var(--ds-font-size-lg);
    font-family: inherit;
    color: var(--ds-color-fg);
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .chevron {
    display: flex;
    padding-right: var(--ds-spacing-14);
    color: var(--ds-color-muted);
    pointer-events: none;
  }
}
```

## Tests

- Renders native select element
- Options rendered from data
- Option groups rendered with optgroup
- Placeholder shown as disabled first option
- onChange returns selected value
- Supports controlled value
- Supports disabled, required
- Error/description rendering
- Chevron icon visible
- Label linked via htmlFor
- forwardRef to select element

## Comparison

|             | Brand1            | Brand2            | Ours (Phase 1)         |
| ----------- | ----------------- | ----------------- | ---------------------- |
| Type        | Custom dropdown   | Custom dropdown   | Native select          |
| Library     | react-aria        | react-aria        | none                   |
| Options API | `<Item>` children | `<Item>` children | `options` array        |
| Search      | No                | No                | No                     |
| Multiple    | No                | No                | No                     |
| Mobile UX   | Custom (worse)    | Custom (worse)    | Native picker (better) |
| Bundle      | +react-aria       | +react-aria       | 0                      |
| Lines       | ~300              | ~400              | ~50                    |
