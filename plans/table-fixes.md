# plan: table fixes

## status: pending

## border prop (inspired by ELV)

ELV uses granular border options instead of a variant prop:

```
border-all, border-horizontal, border-vertical,
border-top, border-bottom, border-left, border-right, border-none
```

This is more flexible than a `variant="ghost"` boolean — `ghost` is just `border="none"`.

### proposed API — start minimal

ELV has 8 border options but most are rarely used. Start with what we actually need:

```tsx
<Table border="all">...</Table>   // container border + radius (EDS default)
<Table border="none">...</Table>  // no container border (EDS ghost / ELV default)
```

Type: `border?: "all" | "none"`

Default: `"all"` for brand1, `"none"` for brand2 (via component var `--ds-table-default-border`).

Add `"horizontal"`, `"bottom"` etc. only when a real use case comes up — don't preemptively implement ELV's full set.

### CSS

```css
.ds-table-container--border-all {
  border: var(--ds-table-container-border);
  border-radius: var(--ds-table-container-radius);
}

.ds-table-container--border-none {
  border: none;
  border-radius: 0;
}
```

## responsive density — skip for now

Auto-compact via container queries is clever but adds complexity without a clear use case yet. Consumers can set `density="compact"` explicitly. Revisit when a real need arises.

## selected row background — designer decision needed

Current: `color-mix(in oklch, var(--ds-color-bg-accent), transparent 90%)` — 10% tint of accent.

- Brand1: greenish tint (from green accent)
- Brand2: bluish tint (from blue accent)

This works mechanically but the brand1 green tint hasn't been validated by a designer. Options:

1. **Keep color-mix** — auto-adapts, no new token needed
2. **Add `--ds-color-bg-selected` token** — designer picks exact color per theme
3. **Remove selected styling** — neither EDS nor ELV has it. Consumer responsibility.

**Blocked on:** designer decision for brand1 selected row color. Tag for review.

## figma

Table is not yet in Figma. Start with the standard look only — no variants.

1. **Single component** (no component set): default bordered table, default density
   - Auto-layout vertical frame (the table)
   - Header row: auto-layout horizontal, fill bound to `table/header-bg`, text color to `table/header-color`
   - Data rows: auto-layout horizontal, separator via bottom stroke bound to `color/border/default`
   - Cells: text with padding matching CSS tokens
   - Container border + radius bound to `table/container-radius`

2. **Variables to bind:**
   - `table/header-bg`, `table/header-color`, `table/header-border` (already created)
   - `table/container-radius` (already created)

3. **Themed frames:** 4 frames (2×2 grid) showing default table with 3 columns, 3 rows. Brand2 frames show blue header, no container border.

4. **"All components" page:** Add table instance

Striped, compact, and border variants come later with design decisions.

## implementation order

1. Replace `variant` concept with `border` prop
2. Remove current container border logic, use border classes
3. Update example app
4. Designer review for selected row color

## files

| file                                            | change                            |
| ----------------------------------------------- | --------------------------------- |
| `src/components/Table/Table.tsx`                | add `border` prop, remove variant |
| `src/components/Table/Table.css`                | border variant classes            |
| `design-system-example/src/pages/TablePage.tsx` | update examples                   |
