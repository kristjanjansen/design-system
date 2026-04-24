import { type TextareaHTMLAttributes, forwardRef, useId } from "react";
import "./TextArea.css";

export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  label?: string;
  description?: string;
  error?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, description, error, onChange, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["ds-text-area", className].filter(Boolean).join(" ")}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <textarea
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
