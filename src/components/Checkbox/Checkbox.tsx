import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { IconCheckXs } from "../../icons/index.ts";
import { IconIndeterminateXs } from "../../icons/index.ts";
import { useCheckboxGroup } from "./CheckboxContext.ts";
import "./Checkbox.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  /** String value used when inside a CheckboxGroup. */
  value?: string;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    error,
    indeterminate,
    onChange,
    id,
    className,
    checked,
    defaultChecked,
    required,
    disabled,
    value,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const group = useCheckboxGroup();

  const inGroup = group !== undefined && value !== undefined;
  const isChecked = inGroup ? group.values.includes(value) : checked;
  const isDisabled = disabled || group?.disabled;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const describedBy = [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inGroup) {
      group.onChange(value, e.target.checked);
    }
    onChange?.(e.target.checked, e);
  };

  return (
    <div className={["ds-checkbox", className].filter(Boolean).join(" ")}>
      <div className="control">
        <span className="indicator">
          <input
            ref={(node) => {
              if (node) node.indeterminate = indeterminate ?? false;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={inputId}
            type="checkbox"
            className="input"
            name={inGroup ? group.name : undefined}
            value={value}
            checked={inGroup ? isChecked : checked}
            defaultChecked={inGroup ? undefined : defaultChecked}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            disabled={isDisabled}
            onChange={handleChange}
            {...rest}
          />
          <span className="icon icon--check" aria-hidden="true">
            <IconCheckXs />
          </span>
          <span className="icon icon--indeterminate" aria-hidden="true">
            <IconIndeterminateXs />
          </span>
        </span>
        <FieldLabel htmlFor={inputId} required={required} disabled={isDisabled} inline>
          {label}
        </FieldLabel>
      </div>
      <FieldMessages
        error={error}
        description={description}
        errorId={errorId}
        descriptionId={descId}
      />
    </div>
  );
});
