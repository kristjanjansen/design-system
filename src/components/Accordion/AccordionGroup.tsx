import { type ReactNode, createContext, useContext, useId } from "react";

export const AccordionContext = createContext<string | undefined>(undefined);
export const useAccordionGroup = () => useContext(AccordionContext);

export interface AccordionGroupProps {
  exclusive?: boolean;
  className?: string;
  children: ReactNode;
}

export function AccordionGroup({ exclusive, className, children }: AccordionGroupProps) {
  const groupId = useId();
  const name = exclusive ? groupId : undefined;

  return (
    <AccordionContext.Provider value={name}>
      <div className={["ds-accordion-group", className].filter(Boolean).join(" ")}>{children}</div>
    </AccordionContext.Provider>
  );
}
