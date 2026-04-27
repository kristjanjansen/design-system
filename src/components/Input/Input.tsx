"use client";

import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import "./Input.css";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  labelEnd?: ReactNode;
  inputStart?: ReactNode;
  inputEnd?: ReactNode;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
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
    inputStart,
    inputEnd,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const describedBy = [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined;
  const hasSlots = inputStart || inputEnd;

  return (
    <div className={["ds-input", className].filter(Boolean).join(" ")}>
      <FieldLabel htmlFor={inputId} required={required} labelEnd={labelEnd} disabled={disabled}>
        {label}
      </FieldLabel>
      {hasSlots ? (
        <div
          className={["input-wrapper", error ? "input-wrapper--error" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {inputStart && <span className="input-start">{inputStart}</span>}
          <input
            ref={ref}
            id={inputId}
            className="input input--slotted"
            aria-invalid={error ? true : undefined}
            required={required}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
            {...rest}
          />
          {inputEnd && <span className="input-end">{inputEnd}</span>}
        </div>
      ) : (
        <input
          ref={ref}
          id={inputId}
          className="input"
          aria-invalid={error ? true : undefined}
          required={required}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
          {...rest}
        />
      )}
      <FieldMessages
        error={error}
        description={description}
        errorId={errorId}
        descriptionId={descId}
      />
    </div>
  );
});
