import { type ReactNode, createContext, forwardRef, useContext, useId } from "react";

export const AccordionContext = createContext<string | undefined>(undefined);
export const useAccordionGroup = () => useContext(AccordionContext);

export interface AccordionGroupProps {
  exclusive?: boolean;
  className?: string;
  children: ReactNode;
}

export const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  function AccordionGroup({ exclusive, className, children }, ref) {
    const groupId = useId();
    const name = exclusive ? groupId : undefined;

    return (
      <AccordionContext.Provider value={name}>
        <div ref={ref} className={["ds-accordion-group", className].filter(Boolean).join(" ")}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
