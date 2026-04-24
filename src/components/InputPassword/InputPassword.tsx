import { type InputHTMLAttributes, type ReactNode, forwardRef, useId, useState } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import { IconEyeSm } from "../../icons/IconEyeSm.tsx";
import { IconEyeHideSm } from "../../icons/IconEyeHideSm.tsx";
import "./InputPassword.css";

export interface InputPasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  toggleLabel?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  function InputPassword(
    {
      label,
      description,
      error,
      onChange,
      id,
      className,
      required,
      infoHint,
      suffix,
      disabled,
      toggleLabel = "Toggle password visibility",
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = error ? `${inputId}-error` : undefined;
    const descId = description ? `${inputId}-desc` : undefined;
    const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined;
    const [visible, setVisible] = useState(false);

    return (
      <div className={["ds-input-password", className].filter(Boolean).join(" ")}>
        <FieldLabel
          htmlFor={inputId}
          required={required}
          infoHint={infoHint}
          suffix={suffix}
          disabled={disabled}
        >
          {label}
        </FieldLabel>
        <div
          className={["input-wrapper", error ? "input-wrapper--error" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className="input"
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            required={required}
            disabled={disabled}
            onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
            {...rest}
          />
          <button
            type="button"
            className="toggle"
            onClick={() => setVisible(!visible)}
            aria-label={toggleLabel}
            aria-pressed={visible}
            disabled={disabled}
            tabIndex={-1}
          >
            {visible ? <IconEyeHideSm /> : <IconEyeSm />}
          </button>
        </div>
        <FieldMessages
          error={error}
          description={description}
          errorId={errorId}
          descriptionId={descId}
        />
      </div>
    );
  },
);
