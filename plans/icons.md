# Plan: Icons

## Source

EDS Icon Library: https://www.figma.com/design/sTJPsqapZPL2Ci6lfNUL9N/EDS-Icon-Library

Icons are in `global/` prefix, two sizes: 16px and 24px.

## Naming convention

| Library name          | Size | DS Figma name         | DS code name          |
| --------------------- | ---- | --------------------- | --------------------- |
| `global/check`        | 16px | `IconCheckXs`         | `IconCheckXs`         |
| `global/chevron-down` | 16px | `IconChevronDownXs`   | `IconChevronDownXs`   |
| `global/radio`        | 16px | `IconRadioXs`         | `IconRadioXs`         |
| — (custom)            | 16px | `IconIndeterminateXs` | `IconIndeterminateXs` |
| `global/eye`          | 24px | `IconEyeSm`           | `IconEyeSm`           |
| `global/eye-hide`     | 24px | `IconEyeHideSm`       | `IconEyeHideSm`       |
| `global/chevron-down` | 24px | `IconChevronDownSm`   | `IconChevronDownSm`   |
| `global/check`        | 24px | `IconCheckSm`         | `IconCheckSm`         |

Sizes: Xs = 16px, Sm = 24px. Pattern: `Icon{Name}{Size}`.

## Workflow: adding a new icon

### 1. Find in EDS Icon Library

Open the library file, find the icon in `↳ Icons Functional` page under `global/` prefix.

### 2. Import to DS Figma file

```
figma.importComponentByKeyAsync(key)
```

Place instance on the Icons page in the correct size row (Xs top, Sm bottom). Rename to `Icon{Name}{Size}`.

### 3. Export SVG

Screenshot or export the icon from Figma. Or copy the SVG path data.

### 4. Create TSX component

```tsx
// src/icons/Icon{Name}{Size}.tsx
export function Icon{Name}{Size}() {
  return (
    <svg viewBox="0 0 {size} {size}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="..." fill="currentColor" />
    </svg>
  );
}
```

### 5. Export from barrel

Add to `src/icons/index.ts`.

### 6. Use in component

Import and use. Icons use `fill="currentColor"` to inherit color from parent.

## Current icons

### Xs (16px)

- **IconCheckXs** — checkbox checked indicator
- **IconChevronDownXs** — accordion trigger, select dropdown
- **IconIndeterminateXs** — checkbox indeterminate (custom, not in EDS library)
- **IconRadioXs** — radio selected dot

### Sm (24px)

- **IconEyeSm** — password toggle (visible)
- **IconEyeHideSm** — password toggle (hidden)

## done: icon sizing

all icons now have explicit `width` and `height` on the SVG element matching the viewBox:

- Xs icons: `width="16" height="16"`
- Sm icons: `width="24" height="24"`

component CSS (`width: 1.25em` etc.) overrides these when icons are used inside components. standalone icons use the explicit dimensions.

## pending: icon buttons

icon-only button support — removed from Button component, needs its own plan:

- circular button with centered icon
- sizes: default (2.5rem), small (2rem)
- requires `aria-label` for accessibility
- could be a separate `IconButton` component or a Button variant
- needs tooltip for hover label (see next-components plan)

```tsx
// option A: prop on Button
<Button isIcon aria-label="Settings"><IconSunSm /></Button>

// option B: separate component
<IconButton icon={<IconSunSm />} label="Settings" />
```

decide when implementing tooltip.

## EDS library component keys

| Icon                  | Size | Key                                        |
| --------------------- | ---- | ------------------------------------------ |
| `global/check`        | 16px | `095c78ee56ddfcba94b225a0d3b3095b1ccbc2cd` |
| `global/check`        | 24px | `e36b339b4087fd44b6c87a1dc542f5c4c3d518fd` |
| `global/chevron-down` | 16px | `d391ae656ff81d1f77724a490ef900ac035fbede` |
| `global/chevron-down` | 24px | `463e45ded65a505c18c4641515839f51c61c298b` |
| `global/eye`          | 24px | `182ce6c9b639354ba3b0e5b10a2784ccfca6b83a` |
| `global/eye-hide`     | 24px | `492b15919abdc3ea82e648f54bd809d9bacf01e5` |
| `global/radio`        | 16px | `14ddca585111a1ff3f8e051cf1a146c466cb18b0` |
