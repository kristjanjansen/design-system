import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import "./InputNumber.css";

export interface InputNumberProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value" | "defaultValue"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  inputStart?: ReactNode;
  inputEnd?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  onChange?: (value: number | undefined) => void;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  {
    label,
    description,
    error,
    onChange,
    id,
    className,
    required,
    infoHint,
    suffix,
    inputStart,
    inputEnd,
    disabled,
    min,
    max,
    step = 1,
    value: controlledValue,
    defaultValue,
    formatOptions,
    locale,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const describedBy = [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<number | undefined>(defaultValue);
  const numValue = isControlled ? controlledValue : internalValue;

  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState("");

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    [locale, formatOptions],
  );

  const displayValue = useMemo(() => {
    if (numValue === undefined) return "";
    return formatter.format(numValue);
  }, [numValue, formatter]);

  useEffect(() => {
    if (!isFocused) {
      setInputText(displayValue);
    }
  }, [displayValue, isFocused]);

  const setValue = useCallback(
    (newValue: number | undefined) => {
      if (!isControlled) setInternalValue(newValue);
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  const clamp = useCallback(
    (val: number): number => {
      let clamped = val;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      return clamped;
    },
    [min, max],
  );

  const handleFocus = () => {
    setIsFocused(true);
    setInputText(numValue !== undefined ? String(numValue) : "");
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputText === "") {
      setValue(undefined);
      return;
    }
    const parsed = Number.parseFloat(inputText.replace(",", "."));
    if (Number.isNaN(parsed)) {
      setInputText(displayValue);
      return;
    }
    setValue(clamp(parsed));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = (numValue ?? 0) + step;
      setValue(clamp(next));
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (numValue ?? 0) - step;
      setValue(clamp(next));
    }
  };

  return (
    <div className={["ds-input-number", className].filter(Boolean).join(" ")}>
      <FieldLabel
        htmlFor={inputId}
        required={required}
        infoHint={infoHint}
        suffix={suffix}
        disabled={disabled}
      >
        {label}
      </FieldLabel>
      <div
        className={["input-wrapper", error ? "input-wrapper--error" : ""].filter(Boolean).join(" ")}
      >
        {inputStart && <span className="input-start">{inputStart}</span>}
        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          className="input"
          value={isFocused ? inputText : displayValue}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={numValue}
          role="spinbutton"
          required={required}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {inputEnd && <span className="input-end">{inputEnd}</span>}
      </div>
      <FieldMessages
        error={error}
        description={description}
        errorId={errorId}
        descriptionId={descId}
      />
    </div>
  );
});
