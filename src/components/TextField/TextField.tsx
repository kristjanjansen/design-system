import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import "./TextField.css";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  label?: string;
  description?: string;
  error?: string;
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  infoHint?: ReactNode;
  suffix?: ReactNode;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, description, error, onChange, id, className, required, infoHint, suffix, disabled, ...rest },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = error ? `${inputId}-error` : undefined;
    const descId = description ? `${inputId}-desc` : undefined;
    const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={["ds-text-field", className].filter(Boolean).join(" ")}>
        <FieldLabel htmlFor={inputId} required={required} infoHint={infoHint} suffix={suffix} disabled={disabled}>
          {label}
        </FieldLabel>
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
        <FieldMessages error={error} description={description} errorId={errorId} descriptionId={descId} />
      </div>
    );
  },
);
