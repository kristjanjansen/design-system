import { type InputHTMLAttributes, forwardRef, useId } from "react";
import "./TextField.css";

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, error, onChange, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["ds-text-field", className].filter(Boolean).join(" ")}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
        {...rest}
      />
      {error && (
        <span id={errorId} aria-live="polite" className="error">
          {error}
        </span>
      )}
      {description && !error && (
        <span id={descId} className="description">
          {description}
        </span>
      )}
    </div>
  );
});
