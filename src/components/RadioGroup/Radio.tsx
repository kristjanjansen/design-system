"use client";

import { forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { IconRadioXs } from "../../icons/index.ts";
import { useRadioGroup } from "./RadioContext.ts";

export interface RadioProps {
  children?: React.ReactNode;
  value: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, value, description, disabled, className },
  ref,
) {
  const ctx = useRadioGroup();
  const autoId = useId();
  const descId = description ? `${autoId}-desc` : undefined;
  const isDisabled = disabled || ctx?.disabled;

  return (
    <div className={["ds-radio", className].filter(Boolean).join(" ")}>
      <span className="indicator">
        <input
          ref={ref}
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
        <span className="icon" aria-hidden="true">
          <IconRadioXs />
        </span>
      </span>
      <div className="radio-content">
        <FieldLabel htmlFor={autoId} disabled={isDisabled} inline>
          {children}
        </FieldLabel>
        <FieldMessages description={description} descriptionId={descId} />
      </div>
    </div>
  );
});
