# design-system

For design intent, tokens, theming, and Figma rules, see [DESIGN.md](DESIGN.md).

## File structure

```
src/components/{Name}/{Name}.tsx + .css + .test.tsx    (colocated, no index files)
src/components/internal/                                (FieldLabel, FieldMessages, RequiredIndicator)
src/components/{Name}/icons/                            (TSX icon components)
src/variables.css                                       (design tokens)
src/themes/brand1.css, brand2.css, index.css            (theme overrides)
src/style.css                                           (combined CSS entry)
```

## Conventions

- Component naming follows NuxtUI: `Input`, `Textarea`, `Button`, `Switch`, `Checkbox`, `Accordion`
- One export per component in `src/index.ts`: `export { Component, type Props } from "..."`
- No index files — `Input/Input.tsx` not `Input/index.tsx`
- Colocated tests — `Input/Input.test.tsx` next to component
- Internal primitives in `internal/` — not exported from package
- Icons centralized in `src/icons/` with barrel `index.ts`. Named `Icon{Name}Sm.tsx`
- Icons from Brand1 Figma `global/` set, `fill="currentColor"`

## When adding a new component

1. Create `src/components/{Name}/{Name}.tsx + .css + .test.tsx`
2. Export from `src/index.ts`
3. Add CSS import to `src/style.css`
4. Update example app to show the new component
5. Add Figma component set + themed frames (follow component page rules below)
6. Add instance to Figma "All components" page
7. Run `vp check && vp test && vp pack` before committing

## Plans

Implementation plans and future work live in `plans/`. Read before starting related work.

## Component template

Every component follows this structure. Use as reference when creating or modifying components.

### TSX pattern

```tsx
import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from "react";
import { FieldLabel } from "../internal/FieldLabel.tsx";
import { FieldMessages } from "../internal/FieldMessages.tsx";
import "./ComponentName.css";

export interface ComponentNameProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  infoHint?: ReactNode;
  suffix?: ReactNode;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComponentName = forwardRef<HTMLInputElement, ComponentNameProps>(
  function ComponentName(
    {
      label,
      description,
      error,
      onChange,
      id,
      className,
      required,
      infoHint,
      suffix,
      disabled,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = error ? `${inputId}-error` : undefined;
    const descId = description ? `${inputId}-desc` : undefined;
    const describedBy =
      [errorId, !error ? descId : undefined].filter(Boolean).join(" ") || undefined;

    return (
      <div className={["ds-component-name", className].filter(Boolean).join(" ")}>
        <FieldLabel
          htmlFor={inputId}
          required={required}
          infoHint={infoHint}
          suffix={suffix}
          disabled={disabled}
        >
          {label}
        </FieldLabel>
        {/* input element with ref, id, aria-invalid, aria-required, aria-describedby */}
        <FieldMessages
          error={error}
          description={description}
          errorId={errorId}
          descriptionId={descId}
        />
      </div>
    );
  },
);
```

### Rules

- **Always `forwardRef`** — every component forwards a ref to its primary HTML element
- **`useId()` for auto IDs** — `const autoId = useId(); const inputId = id ?? autoId;`
- **Named function inside forwardRef** — `forwardRef<El, Props>(function Name(props, ref) { ... })`, not arrow
- **className on outer div** — `["ds-name", className].filter(Boolean).join(" ")`
- **Extend native HTML attributes** — `Omit<HTMLAttributes, "onChange">` then provide custom `onChange`

### onChange conventions

| Pattern                | Signature        | Used by                                                  |
| ---------------------- | ---------------- | -------------------------------------------------------- |
| Direct input event     | `(value, event)` | Input, InputPassword, Textarea, Select, Checkbox, Switch |
| Computed/context value | `(value)`        | RadioGroup, InputNumber                                  |

Use `(value, event)` when wrapping a single native event. Use `(value)` when the value is derived from multiple sources (arrow keys, blur clamping) or forwarded through context.

### CSS pattern

```css
@scope (.ds-component-name) {
  :scope {
    /* outer wrapper */
  }
  .input {
    /* the actual form element */
  }

  @media (forced-colors: active) {
    /* Windows High Contrast */
  }
  @media (prefers-reduced-motion: reduce) {
    /* disable transitions */
  }
}
```

- All values via `--ds-*` tokens — **never hardcode colors in component CSS**. Every color must reference a `--ds-color-*` variable so it adapts across themes. If a new color is needed, add it to all 4 theme files first.
- Dynamic colors via `color-mix(in oklch, var(--ds-color-*), var(--ds-mix-direction) var(--ds-light-hover))`
- **No `@layer ds` on component CSS** — component CSS is unlayered so it always beats Tailwind's `@layer base` preflight resets. `@layer ds` is only used in `variables.css` and theme files (custom properties don't conflict). `@scope` provides class isolation.
- **Use rem everywhere** for sizing (font-size, padding, spacing, radius). Exceptions: `em` for values that must scale with parent font-size (e.g. icon size inside text), `px` for borders/outlines
- **Follow EDS design for brand1, ELV for brand2.** Before implementing any component, **read the actual CSS source files** in `enefit-design-system/components/{Name}/` and `elektrilevi-public-ui/components/{Name}/`. Extract exact values: padding, font-size, font-weight, line-height, border-width, border-radius, gap, colors, transitions, and responsive breakpoints. Also read the token values from `output/variables/` in both codebases. Never guess — always read the CSS first.
  - EDS paths: `enefit-design-system/components/{Name}/{Name}.css`, tokens in `output/variables/variables.css`
  - ELV paths: `elektrilevi-public-ui/components/{Name}/{Name}.css`, tokens in `output/variables/spacing.css`, `colors.css`, `transitions.css`, `shadows.css`
  - Map EDS/ELV token values to the closest `--ds-*` variable. If no match exists, add a new `--ds-spacing-*` or component var
- **Component CSS vars for brand differences** — use `--ds-{component}-{property}` vars (e.g. `--ds-table-header-bg`, `--ds-button-font-weight`) defined in `variables.css` with overrides in brand2 theme files. **Never use `:is([data-theme="brand2-*"])` selectors** in component CSS — all brand logic belongs in theme files
- Group component vars at the bottom of `variables.css` and theme files under `/* component overrides */`

### Test pattern

Every component test file includes: forwardRef test, label linking, onChange callback, error/aria-invalid, disabled state. Import test utils from `vite-plus/test`, not `vitest`.

### Accessibility checklist

- `aria-invalid` when `error` is truthy
- `aria-required` when `required` is truthy
- `aria-describedby` linking to error and description IDs
- `aria-live="polite"` on error messages (handled by FieldMessages)
- `forced-colors` media query for Windows High Contrast
- `prefers-reduced-motion` media query to disable transitions

### Browser support notes

- `field-sizing: content` (Textarea): Chrome 123+, no Firefox/Safari fallback
- `appearance: base-select` (Select popover): progressive enhancement via `@supports`
- `::details-content` (Accordion animation): progressive enhancement
- `:-webkit-autofill` override on all input components to prevent Chrome's lilac autofill background
- `:read-only:not(:disabled)` — use this selector instead of `:read-only` alone, since disabled inputs match `:read-only` in some browsers

### EDS/ELV deep-dive checklist

Before implementing or fixing any component, extract these exact values from both source CSS files:

1. **Padding** — check for inner element padding too (e.g. EDS badge has padding on both container AND inner label)
2. **Font size, weight, line-height** — EDS uses typography tokens (e.g. `label-small-400`), line-heights often differ from our body text tokens
3. **Border** — some components have border in one brand but not the other (e.g. badge: no border in EDS, `1px solid rgba(0,0,0,0.05)` in ELV)
4. **Border-radius** — can differ fundamentally between brands (badge: 999px vs 2px)
5. **Gap** — between items (e.g. tab gap: 1rem in EDS, 0 in ELV)
6. **Active/selected state** — mechanism can differ (tabs: underline vs box-border)
7. **Responsive breakpoints** — EDS scales tab font-size at laptop breakpoint, ELV doesn't
8. **Alignment** — EDS tabs left-aligned, ELV centered; descriptions always left-aligned

### Next.js integration

- **CSS imports**: Import ALL DS CSS via `@import` in `globals.css`, before `@import "tailwindcss"`. Component CSS is unlayered so it beats Tailwind preflight. The `@theme` block in tailwind.css needs DS variables in the same CSS pipeline — importing DS CSS via JS won't work.
  ```css
  @import "@kristjanjansen/design-system/style.css";
  @import "@kristjanjansen/design-system/brand1-light.css";
  /* ... other themes ... */
  @import "tailwindcss";
  @import "@kristjanjansen/design-system/tailwind.css";
  ```
- **Fonts**: Use `next/font/google` for Inter + Roboto Flex. Map to DS via CSS: `[data-theme^="brand1"] { --ds-font-family: var(--font-inter), system-ui, sans-serif; }`
- **`"use client"` on context files**: All `*Context.ts` files that use `createContext` must have `"use client"` directive, otherwise barrel imports fail in Next.js server components.
- **Package updates**: Next.js app uses tarball install (`npm pack` + `npm install *.tgz`). After DS changes, must rebuild: `vp pack && npm pack`, then reinstall in the Next.js project.

## Build

- `vp pack` with `unbundle: true` — per-component JS for tree-shaking
- Combined CSS: `design-system/css/style.css`. Per-component: `design-system/css/*.css`
- Linting: oxlint with `jsx-a11y`, `react`, `import` plugins + `sort-imports`
- `vp check` runs format + lint + type check. `vp test` runs Vitest. Always run both together: `vp check && vp test`

## Figma MCP

- File: https://www.figma.com/design/NiBvhCdGieWhAcyuwn2K7W/design-system
- **CRITICAL: always resize frames to fit content after changes.** Set `layoutSizingVertical = "HUG"` on all themed frames, component variants, and inner frames after creating or modifying content. Frames default to FIXED height after `resize()` — this causes excess whitespace.
- **All text must bind `fontFamily` to `font/family` variable** so brand2 renders in Roboto Flex. Semi Bold text must also bind `fontStyle` to `font/style-semibold`
- Text styles support `setBoundVariable()` for `fontFamily`, `fontSize`, `fontStyle` — use STRING vars for family/style, FLOAT for size
- Don't assume Figma API limitations — test before claiming features don't exist
- Font style names differ: Inter = "Semi Bold" (space), Roboto Flex = "SemiBold" (no space). Use `listAvailableFontsAsync()` to discover
- Screenshot individual variants, not component sets (too zoomed out at set level)
- **Never use `ALL_SCOPES` on variables.** Always set explicit scopes so variables only appear in relevant property pickers:
  - Colors: `FRAME_FILL`/`SHAPE_FILL` for backgrounds, `TEXT_FILL` for text, `STROKE_COLOR` for borders
  - Spacing: `WIDTH_HEIGHT`, `GAP`
  - Radius: `CORNER_RADIUS`
  - Border/outline width: `STROKE_FLOAT`
  - Font: `FONT_FAMILY`, `FONT_STYLE`, `FONT_SIZE`

### Page structure

Pages mirror the example app sidebar order:
Design System, Accordion, Badge, Button, Checkbox, Heading, Input, InputNumber, InputPassword, Radio, Select, Switch, Table, Tabs, Text, Textarea, Icons

Merged pages:

- CheckboxGroup instances merged into Checkbox page (single + group in same brand frames)
- SwitchGroup instances merged into Switch page
- RadioGroup renamed to Radio
- Typography split into Heading + Text

### Component page rules

1. Component set at x=3000, no background — out of view of brand frames
2. 4 themed frames in a single row: brand1-light, brand2-light, brand1-dark, brand2-dark. 48px gap between frames.
3. Frames: HUG height, 48px gap, 24px padding, no corner radius, fill bound to `color/page`
4. **No brand labels inside frames** — the frame name is sufficient. All states shown. Instances fill width
5. **Labels reflect component state** — use "Default", "Checked", "Error", "Disabled" etc. matching example app labels. Never generic "Label" or "Button" text.
6. Disabled/readonly fills: `color/bg` at 0.7 opacity — never hardcoded colors
7. Dark-mode-safe fills: never hardcode light colors for stripes/highlights — use variable-bound fills with low opacity

---

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
