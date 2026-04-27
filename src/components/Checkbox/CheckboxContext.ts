"use client";

import { createContext, useContext } from "react";

export interface CheckboxGroupContextValue {
  name: string;
  values: string[];
  onChange: (value: string, checked: boolean) => void;
  disabled?: boolean;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | undefined>(undefined);
export const useCheckboxGroup = () => useContext(CheckboxGroupContext);
