"use client";

import { type ReactNode, forwardRef, useId, useState } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { CheckboxGroupContext } from "./CheckboxContext.ts";

export interface CheckboxGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  labelEnd?: ReactNode;
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
}

export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroup(
    {
      children,
      label,
      description,
      error,
      required,
      labelEnd,
      name,
      value: controlledValue,
      defaultValue,
      onChange,
      direction = "vertical",
      disabled,
      className,
    },
    ref,
  ) {
    const autoName = useId();
    const groupName = name ?? autoName;
    const errorId = error ? `${groupName}-error` : undefined;
    const descId = description ? `${groupName}-desc` : undefined;

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
    const currentValues = isControlled ? controlledValue : internalValue;

    const handleChange = (val: string, checked: boolean) => {
      const next = checked ? [...currentValues, val] : currentValues.filter((v) => v !== val);
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    };

    return (
      <CheckboxGroupContext.Provider
        value={{ name: groupName, values: currentValues, onChange: handleChange, disabled }}
      >
        <fieldset
          ref={ref}
          className={["ds-checkbox-group", className].filter(Boolean).join(" ")}
          role="group"
          aria-describedby={
            [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined
          }
        >
          <FieldLabel as="legend" required={required} labelEnd={labelEnd} disabled={disabled}>
            {label}
          </FieldLabel>
          <div className="options" data-direction={direction}>
            {children}
          </div>
          <FieldMessages
            error={error}
            description={description}
            errorId={errorId}
            descriptionId={descId}
          />
        </fieldset>
      </CheckboxGroupContext.Provider>
    );
  },
);
