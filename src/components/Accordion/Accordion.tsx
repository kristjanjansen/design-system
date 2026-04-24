import { type DetailedHTMLProps, type DetailsHTMLAttributes, type ReactNode } from "react";
import { useAccordionGroup } from "./AccordionGroup.tsx";
import { ChevronIcon } from "./icons/ChevronIcon.tsx";
import "./Accordion.css";

export interface AccordionProps extends Omit<
  DetailedHTMLProps<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>,
  "children"
> {
  title: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onToggle?: (open: boolean) => void;
}

export function Accordion({
  title,
  defaultOpen,
  disabled,
  children,
  onToggle,
  className,
  name,
  ...rest
}: AccordionProps) {
  const groupName = useAccordionGroup();

  return (
    <details
      className={["ds-accordion", disabled ? "ds-accordion--disabled" : "", className]
        .filter(Boolean)
        .join(" ")}
      open={defaultOpen}
      name={name ?? groupName}
      onToggle={onToggle ? (e) => onToggle((e.target as HTMLDetailsElement).open) : undefined}
      {...rest}
    >
      <summary className="trigger" tabIndex={disabled ? -1 : undefined}>
        <span className="title">{title}</span>
        <span className="icon">
          <ChevronIcon />
        </span>
      </summary>
      <div className="content">{children}</div>
    </details>
  );
}
