import type { ReactNode } from "react";
import { useTabsContext } from "./TabsContext.ts";

export interface TabPanelProps {
  value: string;
  children: ReactNode;
}

export function TabPanel({ value, children }: TabPanelProps) {
  const { activeValue, tabsId } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${tabsId}-panel-${value}`}
      aria-labelledby={`${tabsId}-tab-${value}`}
      className="ds-tab-panel"
    >
      {children}
    </div>
  );
}
