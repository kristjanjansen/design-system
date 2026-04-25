import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import "./Heading.css";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: HeadingTag;
  children: ReactNode;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, as, children, className, ...rest },
  ref,
) {
  const Tag = as ?? (`h${level}` as HeadingTag);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={[`ds-heading ds-heading--h${level}`, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
});
