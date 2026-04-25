import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import "./Text.css";

type TextTag = "p" | "span" | "div" | "label";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg";
  weight?: 400 | 600;
  as?: TextTag;
  children: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { size = "md", weight = 400, as: Tag = "p", children, className, style, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={[`ds-text ds-text--${size}`, className].filter(Boolean).join(" ")}
      style={weight !== 400 ? { fontWeight: weight, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
});
