import { type ReactNode } from "react";
import { Text } from "../Text/Text.tsx";
import { RequiredIndicator } from "./RequiredIndicator.tsx";
import "./FieldLabel.css";

export interface FieldLabelProps {
  children?: ReactNode;
  htmlFor?: string;
  as?: "label" | "legend";
  required?: boolean;
  labelStart?: ReactNode;
  labelEnd?: ReactNode;
  disabled?: boolean;
  inline?: boolean;
  className?: string;
}

export function FieldLabel({
  children,
  htmlFor,
  as = "label",
  required,
  labelStart,
  labelEnd,
  disabled,
  inline,
  className,
}: FieldLabelProps) {
  if (!children) return null;

  return (
    <Text
      as={as as "label"}
      size="md"
      weight={inline ? 400 : 600}
      {...(as === "label" && htmlFor ? { htmlFor } : {})}
      className={["ds-field-label", disabled ? "ds-field-label--disabled" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {labelStart && <span className="ds-field-label-start">{labelStart}</span>}
      <span className="ds-field-label-text">
        {children}
        {required && <RequiredIndicator />}
      </span>
      {labelEnd && <span className="ds-field-label-end">{labelEnd}</span>}
    </Text>
  );
}
