import type { ReactNode } from "react";
import { useTabsContext } from "./TabsContext.ts";

export interface TabProps {
  value: string;
  children: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export function Tab({ value, children, description, disabled }: TabProps) {
  const { activeValue, setActiveValue, tabsId } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      type="button"
      id={`${tabsId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${tabsId}-panel-${value}`}
      aria-disabled={disabled || undefined}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={["ds-tab", isActive && "ds-tab--active"].filter(Boolean).join(" ")}
      onClick={() => setActiveValue(value)}
    >
      <span className="ds-tab-label">{children}</span>
      {description && <span className="ds-tab-description">{description}</span>}
    </button>
  );
}
