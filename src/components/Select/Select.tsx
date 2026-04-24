import { type ReactNode, type SelectHTMLAttributes, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { IconChevronDownSm } from "../../icons/index.ts";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  placeholder?: string;
  options: (SelectOption | SelectOptionGroup)[];
  onChange?: (value: string) => void;
}

function isOptionGroup(opt: SelectOption | SelectOptionGroup): opt is SelectOptionGroup {
  return "options" in opt;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
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
    disabled,
    placeholder,
    options,
    value,
    defaultValue,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = error ? `${selectId}-error` : undefined;
  const descId = description ? `${selectId}-desc` : undefined;
  const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["ds-select", className].filter(Boolean).join(" ")}>
      <FieldLabel
        htmlFor={selectId}
        required={required}
        infoHint={infoHint}
        suffix={suffix}
        disabled={disabled}
      >
        {label}
      </FieldLabel>
      <div
        className={["select-wrapper", error ? "select-wrapper--error" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <select
          ref={ref}
          id={selectId}
          className="input"
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) =>
            isOptionGroup(opt) ? (
              <optgroup key={opt.label} label={opt.label}>
                {opt.options.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.disabled}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ),
          )}
        </select>
        <span className="chevron">
          <IconChevronDownSm />
        </span>
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
