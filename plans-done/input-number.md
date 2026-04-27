# Plan: InputNumber

## Background

Brand1 uses `react-number-format` (NumericFormat) inside Textfield. Brand2 uses `react-aria`'s `useNumberField`. Both render `type="text"`, neither has stepper buttons.

We want zero external dependencies. Use native `<input>` with our own formatting.

## Approach

No external library. Use `Intl.NumberFormat` for display formatting + native keyboard handling. The browser's `Intl` API handles locales, currency, units, decimal/thousand separators natively — same as what react-aria wraps internally.

## Component

```ts
interface InputNumberProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  inputStart?: ReactNode; // visual prefix inside input (€, $)
  inputEnd?: ReactNode; // visual suffix inside input (kg, kWh)
  onChange?: (value: number | undefined, event?: React.ChangeEvent<HTMLInputElement>) => void;
}
```

## Key decisions

### No external library

- `Intl.NumberFormat` handles currency, units, decimals, thousand separators, locale
- Arrow up/down stepping: ~20 lines of JS
- Min/max clamping on blur: ~5 lines
- No `react-number-format` (1.2MB), no `react-aria` dependency

### `onChange` returns `number | undefined`

Following Brand2 pattern — raw number, not formatted string. `undefined` when field is empty.

### `type="text"` with `inputMode="decimal"`

Not `type="number"` because:

- Browser number inputs have inconsistent UX (spinner buttons, no formatting)
- Can't do thousand separators or currency symbols
- `inputMode="decimal"` shows numeric keyboard on mobile

### Format on blur, raw on focus

- **Focused**: show raw number for easy editing (e.g. `1050.10`)
- **Blurred**: show formatted display (e.g. `1 050,10 €`)
- Same pattern as Brand1 and Brand2

### Prefix/suffix slots

Visual elements inside the input border — like Brand1's `inputStart`/`inputEnd` and Brand2's `startContent`/`endContent`. Separate from `Intl.NumberFormat`'s built-in currency/unit symbols.

Use cases:

- `inputStart={<IconEuroSm />}` — icon before value
- `inputEnd="kWh"` — unit text after value
- `formatOptions={{ style: 'currency', currency: 'EUR' }}` — Intl handles the symbol

### Arrow key stepping

```ts
onKeyDown={(e) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    setValue(prev => Math.min((prev ?? 0) + (step ?? 1), max ?? Infinity));
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setValue(prev => Math.max((prev ?? 0) - (step ?? 1), min ?? -Infinity));
  }
}
```

### Min/max clamping on blur

```ts
onBlur={() => {
  if (value !== undefined) {
    if (min !== undefined && value < min) setValue(min);
    if (max !== undefined && value > max) setValue(max);
  }
}
```

## Implementation sketch

```tsx
export const InputNumber = forwardRef(function InputNumber({ ... }, ref) {
  const [rawValue, setRawValue] = useState(defaultValue);
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    [locale, formatOptions]
  );

  // Format for display
  useEffect(() => {
    if (!isFocused && rawValue !== undefined) {
      setDisplayValue(formatter.format(rawValue));
    }
  }, [rawValue, isFocused, formatter]);

  return (
    <div className="ds-input-number">
      <FieldLabel ...>{label}</FieldLabel>
      <div className="input-wrapper">
        {inputStart && <span className="input-start">{inputStart}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={isFocused ? (rawValue?.toString() ?? "") : displayValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { clamp(); setIsFocused(false); }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ...
        />
        {inputEnd && <span className="input-end">{inputEnd}</span>}
      </div>
      <FieldMessages ... />
    </div>
  );
});
```

## CSS

Same wrapper pattern as InputPassword — flex container with border on the wrapper, not the input.

## File structure

```
src/components/InputNumber/
  InputNumber.tsx
  InputNumber.css
  InputNumber.test.tsx
```

No icons needed (no stepper buttons).

## Tests

- Renders text input with inputMode="decimal"
- Arrow up/down increments/decrements by step
- Min/max clamps on blur
- Formats with Intl.NumberFormat on blur
- Shows raw value on focus
- onChange returns number
- Currency formatting: `formatOptions={{ style: 'currency', currency: 'EUR' }}`
- Locale: `locale="et-EE"` formats with comma decimal, space thousand separator
- inputStart/inputEnd rendering
- Supports all field props (label, error, description, required, disabled)
- forwardRef contract check

## What we skip

- Stepper buttons (neither Brand1 nor Brand2 renders them — add later if needed)
- Hidden input for form submission (consumers use controlled state)
- `inputValueAlign` (Brand2) — add later if needed
- `isAllowed` validation callback (react-number-format) — use `min`/`max` instead

## Comparison

|               | Brand1              | Brand2      | Ours                     |
| ------------- | ------------------- | ----------- | ------------------------ |
| Library       | react-number-format | react-aria  | none (Intl.NumberFormat) |
| onChange      | string              | number      | number                   |
| min/max       | no                  | yes         | yes                      |
| Step/arrows   | no                  | yes         | yes                      |
| Locale        | manual              | automatic   | automatic                |
| Stepper UI    | no                  | no          | no                       |
| Bundle impact | +1.2MB              | +react-aria | 0                        |
