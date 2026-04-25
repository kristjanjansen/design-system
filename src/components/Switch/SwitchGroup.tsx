import { type ReactNode, forwardRef, useId, useState } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { SwitchGroupContext } from "./SwitchContext.ts";
import "./SwitchGroup.css";

export interface SwitchGroupProps {
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
  disabled?: boolean;
  className?: string;
}

export const SwitchGroup = forwardRef<HTMLFieldSetElement, SwitchGroupProps>(function SwitchGroup(
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
    <SwitchGroupContext.Provider
      value={{ name: groupName, values: currentValues, onChange: handleChange, disabled }}
    >
      <fieldset
        ref={ref}
        className={["ds-switch-group", className].filter(Boolean).join(" ")}
        role="group"
        aria-describedby={
          [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined
        }
      >
        <FieldLabel as="legend" required={required} labelEnd={labelEnd} disabled={disabled}>
          {label}
        </FieldLabel>
        <div className="options">{children}</div>
        <FieldMessages
          error={error}
          description={description}
          errorId={errorId}
          descriptionId={descId}
        />
      </fieldset>
    </SwitchGroupContext.Provider>
  );
});
