"use client";

import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { useSwitchGroup } from "./SwitchContext.ts";
import "./Switch.css";

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  /** String value used when inside a SwitchGroup. */
  value?: string;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    description,
    error,
    onChange,
    id,
    className,
    checked,
    defaultChecked,
    disabled,
    value,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const group = useSwitchGroup();

  const inGroup = group !== undefined && value !== undefined;
  const isChecked = inGroup ? group.values.includes(value) : checked;
  const isDisabled = disabled || group?.disabled;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const describedBy = [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inGroup) {
      group.onChange(value, e.target.checked);
    }
    onChange?.(e.target.checked, e);
  };

  return (
    <div className={["ds-switch", className].filter(Boolean).join(" ")}>
      <div className="control">
        <div className="track">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className="input"
            name={inGroup ? group.name : undefined}
            value={value}
            checked={inGroup ? isChecked : checked}
            defaultChecked={inGroup ? undefined : defaultChecked}
            aria-checked={inGroup ? isChecked : (checked ?? defaultChecked)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            disabled={isDisabled}
            onChange={handleChange}
            {...rest}
          />
          <span className="thumb" />
        </div>
        <FieldLabel htmlFor={inputId} disabled={isDisabled} inline>
          {label}
        </FieldLabel>
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
