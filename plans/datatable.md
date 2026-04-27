# plan: datatable

## status: pending

## DataTable — data-driven (react only, no tanstack)

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

### why no tanstack for us

- zero deps philosophy — react only
- DataTable sorting/pagination is simple enough without it
- tanstack adds ~50kb for features we don't need (virtualization, column resizing, grouping)
- consumer who needs tanstack uses our Table components directly with their own setup

## reference: eds DataTable

eds uses `@tanstack/react-table` with `getCoreRowModel`, `getSortedRowModel`, `getPaginationRowModel`, `createColumnHelper`, `flexRender`. manages sort + pagination state internally, renders sort icons in header buttons, wraps eds Table compound components, uses eds Pagination component.

## sorting

### how ELS does it (elektrilevi-public-ui)

ELS Table has **no built-in sorting logic** — sorting is consumer-side. the Table provides building blocks:

- `TableHeaderCell` has `isPressable` prop + `onPress` handler + `iconRight` slot
- consumer manages `{ key, direction }` state, passes `aria-sort` to header cells
- clicking same column toggles `asc` ↔ `desc`, different column resets to `asc`
- 3 dedicated sort icons: `SvgSortXs` (unsorted), `SvgSortLowestXs` (asc), `SvgSortHighestXs` (desc)
- uses `react-aria` `useButton` + `useFocusRing` for accessible pressable headers

```tsx
// ELS consumer pattern
<TableHeaderCell
  isPressable
  onPress={() => handleSort("name")}
  iconRight={getSortIcon("name")}
  aria-sort={getAriaSort("name")}
>
  Name
</TableHeaderCell>
```

### our approach

**DataTable** — sorting is built-in:

```tsx
<DataTable
  data={users}
  columns={[
    { key: "name", label: "Name", sort: true },
    { key: "age", label: "Age", sort: "desc" }, // default sort direction
  ]}
/>
```

- manages `{ key, direction }` state internally
- `column.sort: true` = sortable, `"asc"/"desc"` = sortable + initial sort direction
- `column.sorter` for custom compare function
- DataTable renders sort buttons, icons, and `aria-sort` inside TableHeaderCell internally

### sort icons needed

| icon             | purpose                    | EDS library source                |
| ---------------- | -------------------------- | --------------------------------- |
| `IconSortXs`     | unsorted / both directions | `global/sort` 16px (if available) |
| `IconSortAscXs`  | ascending indicator        | `global/sort-lowest` 16px         |
| `IconSortDescXs` | descending indicator       | `global/sort-highest` 16px        |

check EDS Icon Library for exact names and keys. follow icons.md workflow to add.

### sort header CSS

```css
.ds-table-sort-button {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-spacing-8);
  background: none;
  border: none;
  font: inherit;
  font-weight: 600;
  color: inherit;
  cursor: pointer;
  padding: 0;
}

.ds-table-sort-button:focus-visible {
  outline: var(--ds-outline-width) solid var(--ds-color-outline);
  outline-offset: var(--ds-outline-offset);
  border-radius: var(--ds-radius);
}

.ds-table-sort-icon {
  color: var(--ds-color-muted);
}

.ds-table-sort-icon--active {
  color: var(--ds-color-fg);
}
```

## accessibility

- `aria-sort="ascending|descending|none"` on sortable headers
- sort button inside `<th>` — native keyboard accessible
- sort icon with `aria-hidden="true"`

## files

| file                                          | purpose             |
| --------------------------------------------- | ------------------- |
| `src/components/DataTable/DataTable.tsx`      | data-driven wrapper |
| `src/components/DataTable/DataTable.css`      | sort button styles  |
| `src/components/DataTable/DataTable.test.tsx` | tests               |
