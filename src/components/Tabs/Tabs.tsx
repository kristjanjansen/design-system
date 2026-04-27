"use client";

import {
  Children,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  forwardRef,
  isValidElement,
  useId,
  useState,
} from "react";
import { Tab } from "./Tab.tsx";
import { TabPanel } from "./TabPanel.tsx";
import "./Tabs.css";
import { TabsContext } from "./TabsContext.ts";

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  activateOnFocus?: boolean;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, defaultValue, onChange, activateOnFocus = true, children, className, ...rest },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const activeValue = value ?? internal;
  const tabsId = useId();

  const setActiveValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  const tabs: ReactElement[] = [];
  const panels: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === Tab) tabs.push(child);
      else if (child.type === TabPanel) panels.push(child);
    }
  });

  function handleKeyDown(e: KeyboardEvent) {
    const tabElements = [
      ...e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'),
    ];
    const current = tabElements.indexOf(e.target as HTMLElement);
    let next = -1;

    if (e.key === "ArrowRight") next = (current + 1) % tabElements.length;
    if (e.key === "ArrowLeft") next = (current - 1 + tabElements.length) % tabElements.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabElements.length - 1;

    if (next >= 0) {
      e.preventDefault();
      tabElements[next].focus();
      if (activateOnFocus) {
        tabElements[next].click();
      }
    }
  }

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue, activateOnFocus, tabsId }}>
      <div ref={ref} className={["ds-tabs", className].filter(Boolean).join(" ")} {...rest}>
        <div role="tablist" className="ds-tabs-list" onKeyDown={handleKeyDown}>
          {tabs}
        </div>
        {panels}
      </div>
    </TabsContext.Provider>
  );
});
