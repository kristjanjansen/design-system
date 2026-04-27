# plan: table

## status: done

## Table — static markup (no deps)

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

## accessibility

- native `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` — implicit ARIA roles
- `scope="col"` auto-set on TableHeaderCell in thead
- `scope="row"` when TableHeaderCell used in tbody
- `<caption>` for table identification (visually hidden by default)

## files

| file                                       | purpose                      |
| ------------------------------------------ | ---------------------------- |
| `src/components/Table/Table.tsx`           | Table + scrollable container |
| `src/components/Table/TableHeader.tsx`     | thead                        |
| `src/components/Table/TableBody.tsx`       | tbody                        |
| `src/components/Table/TableFooter.tsx`     | tfoot                        |
| `src/components/Table/TableRow.tsx`        | tr                           |
| `src/components/Table/TableHeaderCell.tsx` | th with scope                |
| `src/components/Table/TableCell.tsx`       | td                           |
| `src/components/Table/Table.css`           | styles                       |
| `src/components/Table/Table.test.tsx`      | tests                        |
