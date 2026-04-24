import { createContext, useContext } from "react";

export interface RadioContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const RadioContext = createContext<RadioContextValue | undefined>(undefined);
export const useRadioGroup = () => useContext(RadioContext);
