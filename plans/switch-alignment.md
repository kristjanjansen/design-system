# plan: switch alignment

## status: pending

## problem

switch control is always left, label right. need option to flip: label left, switch right (common in settings pages).

## approach

add `align` prop to Switch:

```tsx
<Switch label="Notifications" />              // default: switch left, label right
<Switch label="Notifications" align="end" />  // switch right, label left
```

css: `align="end"` adds `justify-content: space-between; flex-direction: row-reverse` on `.control` wrapper. switch stays visually on the right, label fills remaining space.

## rtl

use css logical properties throughout switch css:

- `margin-left: auto` → `margin-inline-start: auto`
- `padding-left` → `padding-inline-start`

with logical properties, `align="end"` works correctly in both ltr and rtl without extra code.

## also applies to

- Checkbox — label left, checkbox right
- Radio — label left, radio right

could be a shared prop on all toggle-style components. or handle via FieldLabel layout.

## brand1/brand2

neither has this prop — their switches are always switch-left, label-right. but settings UIs commonly need the opposite.
