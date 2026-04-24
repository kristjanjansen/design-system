import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { IconCheckSm } from "../../icons/index.ts";
import { IconIndeterminateSm } from "../../icons/index.ts";
import "./Checkbox.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
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
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined;

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
            checked={checked}
            defaultChecked={defaultChecked}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            onChange={onChange ? (e) => onChange(e.target.checked, e) : undefined}
            {...rest}
          />
          <span className="icon icon--check" aria-hidden="true">
            <IconCheckSm />
          </span>
          <span className="icon icon--indeterminate" aria-hidden="true">
            <IconIndeterminateSm />
          </span>
        </span>
        <FieldLabel htmlFor={inputId} required={required} disabled={disabled} inline>
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
