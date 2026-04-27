"use client";

import { createContext, useContext } from "react";

export interface SwitchGroupContextValue {
  name: string;
  values: string[];
  onChange: (value: string, checked: boolean) => void;
  disabled?: boolean;
}

export const SwitchGroupContext = createContext<SwitchGroupContextValue | undefined>(undefined);
export const useSwitchGroup = () => useContext(SwitchGroupContext);
