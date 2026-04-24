import { type ButtonHTMLAttributes, forwardRef } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "default" | "small";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "default", className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={["ds-button", `ds-button--${variant}`, `ds-button--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
});
