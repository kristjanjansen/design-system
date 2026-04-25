import { type ButtonHTMLAttributes, type ElementType, forwardRef } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost";
  size?: "default" | "small";
  as?: ElementType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "default", as: Tag = "button", className, children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={[`ds-button ds-button--${variant} ds-button--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
});
