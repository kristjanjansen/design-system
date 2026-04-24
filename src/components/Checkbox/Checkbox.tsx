import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { CheckIcon } from "./icons/CheckIcon.tsx";
import { IndeterminateIcon } from "./icons/IndeterminateIcon.tsx";
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
      <label className="control" htmlFor={inputId}>
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
            aria-describedby={describedBy}
            onChange={onChange ? (e) => onChange(e.target.checked, e) : undefined}
            {...rest}
          />
          <span className="icon icon--check" aria-hidden="true">
            <CheckIcon />
          </span>
          <span className="icon icon--indeterminate" aria-hidden="true">
            <IndeterminateIcon />
          </span>
        </span>
        {label && <span className="label">{label}</span>}
      </label>
      {error && (
        <span id={errorId} aria-live="polite" className="error">
          {error}
        </span>
      )}
      {description && !error && (
        <span id={descId} className="description">
          {description}
        </span>
      )}
    </div>
  );
});
