import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import "./Table.css";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  density?: "default" | "compact";
  caption?: ReactNode;
  captionVisible?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { striped, density = "default", caption, captionVisible, children, className, ...rest },
  ref,
) {
  return (
    <div className="ds-table-wrapper">
      {caption && captionVisible && <div className="ds-table-caption">{caption}</div>}
      <div className="ds-table-container">
        <table
          ref={ref}
          className={[
            "ds-table",
            striped && "ds-table--striped",
            density === "compact" && "ds-table--compact",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label={typeof caption === "string" ? caption : undefined}
          {...rest}
        >
          {caption && !captionVisible && (
            <caption className="ds-table-caption--hidden">{caption}</caption>
          )}
          {children}
        </table>
      </div>
    </div>
  );
});

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ children, ...rest }, ref) {
    return (
      <thead ref={ref} {...rest}>
        {children}
      </thead>
    );
  },
);

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { children, ...rest },
  ref,
) {
  return (
    <tbody ref={ref} {...rest}>
      {children}
    </tbody>
  );
});

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ children, ...rest }, ref) {
    return (
      <tfoot ref={ref} {...rest}>
        {children}
      </tfoot>
    );
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected, children, ...rest },
  ref,
) {
  return (
    <tr ref={ref} data-selected={selected || undefined} {...rest}>
      {children}
    </tr>
  );
});

export interface TableHeaderCellProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: "start" | "center" | "end";
  scope?: string;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell({ align, scope = "col", children, ...rest }, ref) {
    return (
      <th ref={ref} scope={scope} data-align={align} {...rest}>
        {children}
      </th>
    );
  },
);

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: "start" | "center" | "end";
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align, children, ...rest },
  ref,
) {
  return (
    <td ref={ref} data-align={align} {...rest}>
      {children}
    </td>
  );
});
