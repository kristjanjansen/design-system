# plan: table

## status: pending

## two components

### Table — static markup (no deps)

compound components wrapping native `<table>` HTML. no state, no logic, just styled semantic elements.

```tsx
<Table striped>
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell align="end">Age</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Alice</TableCell>
      <TableCell align="end">32</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

components: Table, TableHeader, TableBody, TableFooter, TableRow, TableHeaderCell, TableCell

props:

- Table: `striped`, `density` (default/compact), `caption`, `captionVisible`
- TableHeaderCell: `align` (start/center/end), `scope` (auto: col in thead, row in tbody)
- TableCell: `align` (start/center/end)
- TableRow: `selected`

### DataTable — data-driven (react only, no tanstack)

wraps Table components. takes data array + column definitions. handles sorting, pagination internally.

```tsx
<DataTable
  data={users}
  columns={[
    { key: "name", label: "Name", sort: true },
    { key: "email", label: "Email" },
    { key: "age", label: "Age", align: "end", sort: "desc" },
  ]}
  pageSize={10}
  striped
/>
```

props:

```tsx
interface DataTableColumn<T> {
  key: keyof T & string;
  label?: ReactNode;
  align?: "start" | "center" | "end";
  sort?: boolean | "asc" | "desc";
  sorter?: (a: T, b: T) => number;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  striped?: boolean;
  density?: "default" | "compact";
  caption?: string;
}
```

internal implementation:

- `useMemo` for sorted data
- `useState` for sort state + pagination
- default sorter: `a < b ? -1 : a > b ? 1 : 0`
- render: `column.render?.(value, row) ?? String(value)`
- pagination: simple prev/next buttons

## reference: eds DataTable

eds uses `@tanstack/react-table` with `getCoreRowModel`, `getSortedRowModel`, `getPaginationRowModel`, `createColumnHelper`, `flexRender`. manages sort + pagination state internally, renders sort icons in header buttons, wraps eds Table compound components, uses eds Pagination component.

### why no tanstack for us

- zero deps philosophy — react only
- DataTable sorting/pagination is simple enough without it
- tanstack adds ~50kb for features we don't need (virtualization, column resizing, grouping)
- consumer who needs tanstack uses our Table components directly with their own setup

## accessibility

### Table (static)

- native `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` — implicit ARIA roles
- `scope="col"` auto-set on TableHeaderCell in thead
- `scope="row"` when TableHeaderCell used in tbody
- `<caption>` for table identification (visually hidden by default)

### DataTable

- `aria-sort="ascending|descending|none"` on sortable headers
- sort button inside `<th>` — native keyboard accessible
- sort icon with `aria-hidden="true"`

## css

```css
@scope (.ds-table-container) {
  :scope {
    overflow-x: auto;
  }

  .ds-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--ds-font-size-body);
  }

  .ds-table--striped tbody tr:nth-child(odd) {
    background: color-mix(in oklch, var(--ds-color-bg), var(--ds-mix-direction) 3%);
  }

  .ds-table--compact td,
  .ds-table--compact th {
    padding: var(--ds-spacing-8);
  }

  th {
    text-align: start;
    font-weight: 600;
    padding: var(--ds-spacing-10) var(--ds-spacing-14);
    border-bottom: var(--ds-border-width) solid var(--ds-color-border);
  }

  td {
    padding: var(--ds-spacing-10) var(--ds-spacing-14);
    border-bottom: 1px solid color-mix(in oklch, var(--ds-color-border), transparent 50%);
  }

  tr[data-selected] td {
    background: color-mix(in oklch, var(--ds-color-accent), transparent 90%);
  }

  [data-align="center"] {
    text-align: center;
  }
  [data-align="end"] {
    text-align: end;
  }
}
```

## files

| file                                          | purpose                      |
| --------------------------------------------- | ---------------------------- |
| `src/components/Table/Table.tsx`              | Table + scrollable container |
| `src/components/Table/TableHeader.tsx`        | thead                        |
| `src/components/Table/TableBody.tsx`          | tbody                        |
| `src/components/Table/TableFooter.tsx`        | tfoot                        |
| `src/components/Table/TableRow.tsx`           | tr                           |
| `src/components/Table/TableHeaderCell.tsx`    | th with scope                |
| `src/components/Table/TableCell.tsx`          | td                           |
| `src/components/Table/Table.css`              | styles                       |
| `src/components/Table/Table.test.tsx`         | tests                        |
| `src/components/DataTable/DataTable.tsx`      | data-driven wrapper          |
| `src/components/DataTable/DataTable.css`      | sort button styles           |
| `src/components/DataTable/DataTable.test.tsx` | tests                        |
