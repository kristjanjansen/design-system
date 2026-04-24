import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import "./Switch.css";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  label?: string;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(
    { label, onChange, id, className, checked, defaultChecked, disabled, ...rest },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className={["ds-switch", className].filter(Boolean).join(" ")}>
        <div className="track">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className="input"
            checked={checked}
            defaultChecked={defaultChecked}
            aria-checked={checked ?? defaultChecked}
            disabled={disabled}
            onChange={onChange ? (e) => onChange(e.target.checked, e) : undefined}
            {...rest}
          />
          <span className="thumb" />
        </div>
        <FieldLabel htmlFor={inputId} disabled={disabled}>
          {label}
        </FieldLabel>
      </div>
    );
  },
);
