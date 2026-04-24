import { type ReactNode, type TextareaHTMLAttributes, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import "./Textarea.css";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, description, error, onChange, id, className, required, infoHint, suffix, disabled, ...rest },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = error ? `${inputId}-error` : undefined;
    const descId = description ? `${inputId}-desc` : undefined;
    const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={["ds-textarea", className].filter(Boolean).join(" ")}>
        <FieldLabel htmlFor={inputId} required={required} infoHint={infoHint} suffix={suffix} disabled={disabled}>
          {label}
        </FieldLabel>
        <textarea
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
