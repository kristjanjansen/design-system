import { type DetailedHTMLProps, type DetailsHTMLAttributes, type ReactNode } from "react";
import { useAccordionGroup } from "./AccordionGroup.tsx";
import { IconChevronDownSm } from "../../icons/index.ts";
import "./Accordion.css";

export interface AccordionProps extends Omit<
  DetailedHTMLProps<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>,
  "children"
> {
  title: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  variant?: "ghost" | "default";
  children: ReactNode;
  onToggle?: (open: boolean) => void;
}

export function Accordion({
  title,
  defaultOpen,
  disabled,
  variant = "ghost",
  children,
  onToggle,
  className,
  name,
  ...rest
}: AccordionProps) {
  const groupName = useAccordionGroup();

  return (
    <details
      className={[
        "ds-accordion",
        `ds-accordion--${variant}`,
        disabled ? "ds-accordion--disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      open={defaultOpen}
      name={name ?? groupName}
      onToggle={onToggle ? (e) => onToggle((e.target as HTMLDetailsElement).open) : undefined}
      {...rest}
    >
      <summary className="trigger" tabIndex={disabled ? -1 : undefined}>
        <span className="icon">
          <IconChevronDownSm />
        </span>
        <span className="title">{title}</span>
      </summary>
      <div className="content">{children}</div>
    </details>
  );
}
