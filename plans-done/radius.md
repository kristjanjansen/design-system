# plan: border radius scale

## status: done

## current state

single `--ds-radius` token (0.5rem brand1, 0.25rem brand2). used by all components. badge needs a smaller radius, modal will need a larger one.

## EDS reference

| name                 | value | usage          |
| -------------------- | ----- | -------------- |
| `eds/radius/none`    | 0     | —              |
| `eds/radius/minimum` | 2px   | badge (ELS)    |
| `eds/radius/small`   | 4px   | small elements |
| `eds/radius/main`    | 8px   | inputs, cards  |
| `eds/radius/modal`   | 16px  | modal, dialog  |
| `eds/radius/full`    | 999px | buttons, pills |

## our scale

| token                 | brand1 | brand2  | usage                           |
| --------------------- | ------ | ------- | ------------------------------- |
| `--ds-radius-none`    | 0      | 0       | —                               |
| `--ds-radius-minimum` | 2px    | 2px     | —                               |
| `--ds-radius-small`   | 4px    | 2px     | badge                           |
| `--ds-radius-main`    | 0.5rem | 0.25rem | inputs, select, accordion, card |
| `--ds-radius-modal`   | 1rem   | 0.5rem  | modal, dialog                   |
| `--ds-radius-full`    | 999px  | 999px   | buttons                         |

replace existing `--ds-radius` with `--ds-radius-main`. no alias.

## component mapping

| component      | current            | new                      |
| -------------- | ------------------ | ------------------------ |
| Button         | `999px` hardcoded  | `var(--ds-radius-full)`  |
| Badge          | `var(--ds-radius)` | `var(--ds-radius-small)` |
| Input          | `var(--ds-radius)` | `var(--ds-radius-main)`  |
| InputNumber    | `var(--ds-radius)` | `var(--ds-radius-main)`  |
| InputPassword  | `var(--ds-radius)` | `var(--ds-radius-main)`  |
| Select         | `var(--ds-radius)` | `var(--ds-radius-main)`  |
| Textarea       | `var(--ds-radius)` | `var(--ds-radius-main)`  |
| Accordion      | `var(--ds-radius)` | `var(--ds-radius-main)`  |
| Checkbox       | `var(--ds-radius)` | `var(--ds-radius-small)` |
| Modal (future) | —                  | `var(--ds-radius-modal)` |

## CSS implementation

```css
/* src/variables.css */
--ds-radius-none: 0;
--ds-radius-minimum: 2px;
--ds-radius-small: 4px;
--ds-radius-main: 0.5rem;
--ds-radius-modal: 1rem;
--ds-radius-full: 999px;
```

```css
/* src/themes/brand2-light.css + brand2-dark.css */
--ds-radius-small: 2px;
--ds-radius-main: 0.25rem;
--ds-radius-modal: 0.5rem;
```

## tailwind mapping

```css
@theme {
  --radius-ds-none: var(--ds-radius-none);
  --radius-ds-minimum: var(--ds-radius-minimum);
  --radius-ds-small: var(--ds-radius-small);
  --radius-ds: var(--ds-radius-main);
  --radius-ds-modal: var(--ds-radius-modal);
  --radius-ds-full: var(--ds-radius-full);
}
```

## Figma

add to Main collection (all 4 theme modes):

| variable         | brand1-light | brand1-dark | brand2-light | brand2-dark |
| ---------------- | ------------ | ----------- | ------------ | ----------- |
| `radius/none`    | 0            | 0           | 0            | 0           |
| `radius/minimum` | 2            | 2           | 2            | 2           |
| `radius/small`   | 4            | 4           | 2            | 2           |
| `radius/main`    | 8            | 8           | 4            | 4           |
| `radius/modal`   | 16           | 16          | 8            | 8           |
| `radius/full`    | 999          | 999         | 999          | 999         |

rename existing `radius` variable to `radius/main`. rebind component instances to appropriate scale token.

scope: `CORNER_RADIUS` on all variables.

## implementation steps

1. add radius scale to `variables.css`
2. add brand2 overrides to theme files
3. update Badge to use `--ds-radius-small`
4. update Button to use `--ds-radius-full`
5. update all components using `--ds-radius` to `--ds-radius-main`
6. update tailwind.css — replace `--radius-ds` with scale tokens
7. add Figma variables + rebind components
8. update Checkbox to use `--ds-radius-small`
