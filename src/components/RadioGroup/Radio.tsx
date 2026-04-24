import { useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { useRadioGroup } from "./RadioContext.ts";

export interface RadioProps {
  children?: React.ReactNode;
  value: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({ children, value, description, disabled, className }: RadioProps) {
  const ctx = useRadioGroup();
  const autoId = useId();
  const descId = description ? `${autoId}-desc` : undefined;
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
        aria-describedby={descId}
        onChange={() => ctx?.onChange?.(value)}
      />
      <div className="radio-content">
        <FieldLabel htmlFor={autoId} disabled={isDisabled} inline>
          {children}
        </FieldLabel>
        <FieldMessages description={description} descriptionId={descId} />
      </div>
    </div>
  );
}
