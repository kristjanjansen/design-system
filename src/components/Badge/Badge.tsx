import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import "./Badge.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "error" | "info";
  size?: "default" | "small";
  icon?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", size = "default", icon, children, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={[`ds-badge ds-badge--${variant} ds-badge--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {icon && (
        <span className="ds-badge-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
});
