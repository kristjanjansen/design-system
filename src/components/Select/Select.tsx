"use client";

import {
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { IconChevronDownXs } from "../../icons/index.ts";
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
  labelEnd?: ReactNode;
  placeholder?: string;
  options: (SelectOption | SelectOptionGroup)[];
  onChange?: (value: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Render prop for custom trigger. Receives `<selectedcontent />` to display the selected value. Uses base-select custom button slot. */
  trigger?: (selectedContent: ReactNode) => ReactElement;
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
    labelEnd,
    disabled,
    placeholder,
    options,
    value,
    defaultValue,
    trigger,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = error ? `${selectId}-error` : undefined;
  const descId = description ? `${selectId}-desc` : undefined;
  const describedBy = [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={["ds-select", trigger ? "ds-select--custom-trigger" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <FieldLabel htmlFor={selectId} required={required} labelEnd={labelEnd} disabled={disabled}>
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
          onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
          {...rest}
        >
          {trigger && trigger(<selectedcontent />)}
          {placeholder && (
            <option value="" disabled={!trigger}>
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
        {!trigger && (
          <span className="chevron">
            <IconChevronDownXs />
          </span>
        )}
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
