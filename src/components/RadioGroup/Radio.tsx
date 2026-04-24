import { useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { useRadioGroup } from "./RadioContext.ts";

export interface RadioProps {
  children?: React.ReactNode;
  value: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({ children, value, disabled, className }: RadioProps) {
  const ctx = useRadioGroup();
  const autoId = useId();
  const isDisabled = disabled || ctx?.disabled;

  return (
    <div className={["ds-radio", className].filter(Boolean).join(" ")}>
      <input
        type="radio"
        name={ctx?.name}
        value={value}
        id={autoId}
        className="input"
        checked={ctx?.value !== undefined ? ctx.value === value : undefined}
        disabled={isDisabled}
        onChange={() => ctx?.onChange?.(value)}
      />
      <FieldLabel htmlFor={autoId} disabled={isDisabled} inline>
        {children}
      </FieldLabel>
    </div>
  );
}
