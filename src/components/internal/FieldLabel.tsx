import { type ReactNode } from "react";
import { RequiredIndicator } from "./RequiredIndicator.tsx";
import "./FieldLabel.css";

export interface FieldLabelProps {
  children?: ReactNode;
  htmlFor?: string;
  as?: "label" | "legend";
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  inline?: boolean;
  className?: string;
}

export function FieldLabel({
  children,
  htmlFor,
  as = "label",
  required,
  infoHint,
  suffix,
  disabled,
  inline,
  className,
}: FieldLabelProps) {
  if (!children) return null;

  const Tag = as;

  return (
    <Tag
      {...(as === "label" && htmlFor ? { htmlFor } : {})}
      className={[
        "ds-field-label",
        inline ? "ds-field-label--inline" : "",
        disabled ? "ds-field-label--disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="ds-field-label-text">
        {children}
        {required && <RequiredIndicator />}
        {suffix && <span className="ds-field-label-suffix">{suffix}</span>}
      </span>
      {infoHint && <span className="ds-field-label-hint">{infoHint}</span>}
    </Tag>
  );
}
