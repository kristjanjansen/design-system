import { type ReactNode } from "react";
import { RequiredIndicator } from "./RequiredIndicator.tsx";
import "./FieldLabel.css";

export interface FieldLabelProps {
  children?: ReactNode;
  htmlFor: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function FieldLabel({
  children,
  htmlFor,
  required,
  infoHint,
  suffix,
  disabled,
  className,
}: FieldLabelProps) {
  if (!children) return null;

  return (
    <label
      htmlFor={htmlFor}
      className={["ds-field-label", disabled ? "ds-field-label--disabled" : "", className].filter(Boolean).join(" ")}
    >
      <span className="ds-field-label-text">
        {children}
        {required && <RequiredIndicator />}
        {suffix && <span className="ds-field-label-suffix">{suffix}</span>}
      </span>
      {infoHint && <span className="ds-field-label-hint">{infoHint}</span>}
    </label>
  );
}
