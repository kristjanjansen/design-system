import { type ReactNode, useId, useState } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { RadioContext } from "./RadioContext.ts";
import "./RadioGroup.css";

export interface RadioGroupProps {
  children: ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  children,
  label,
  description,
  error,
  required,
  infoHint,
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  direction = "vertical",
  disabled,
  className,
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const errorId = error ? `${groupName}-error` : undefined;
  const descId = description ? `${groupName}-desc` : undefined;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  return (
    <RadioContext.Provider
      value={{ name: groupName, value: currentValue, onChange: handleChange, disabled }}
    >
      <fieldset
        className={["ds-radio-group", className].filter(Boolean).join(" ")}
        role="radiogroup"
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, descId].filter(Boolean).join(" ") || undefined}
      >
        <FieldLabel as="legend" required={required} infoHint={infoHint} disabled={disabled}>
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
    </RadioContext.Provider>
  );
}
