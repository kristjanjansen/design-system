import { type ButtonHTMLAttributes, type ElementType, type ReactNode, forwardRef } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost";
  size?: "default" | "small";
  as?: ElementType;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "default",
    as: Tag = "button",
    iconStart,
    iconEnd,
    className,
    children,
    ...rest
  },
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
      {iconStart && <span className="ds-button-icon">{iconStart}</span>}
      {children}
      {iconEnd && <span className="ds-button-icon">{iconEnd}</span>}
    </Tag>
  );
});
