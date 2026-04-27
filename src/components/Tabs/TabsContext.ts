"use client";

import { createContext, useContext } from "react";

export interface TabsContextValue {
  activeValue: string;
  setActiveValue: (value: string) => void;
  activateOnFocus: boolean;
  tabsId: string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab/TabPanel must be used inside <Tabs>");
  return ctx;
}
