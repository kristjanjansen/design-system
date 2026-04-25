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
- Icons from EDS Figma `global/` set, `fill="currentColor"`

## When adding a new component

1. Create `src/components/{Name}/{Name}.tsx + .css + .test.tsx`
2. Export from `src/index.ts`
3. Add CSS import to `src/style.css`
4. Update consumer app to show the new component
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
@layer ds {
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
}
```

- All values via `--ds-*` tokens
- Dynamic colors via `oklch(from var(--ds-color-*) calc(l - var(--ds-l-hover)) c h)`
- `@layer ds` for cascade control, `@scope` for class isolation

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

## Build

- `vp pack` with `unbundle: true` — per-component JS for tree-shaking
- Combined CSS: `design-system/css/style.css`. Per-component: `design-system/css/*.css`
- Linting: oxlint with `jsx-a11y`, `react`, `import` plugins + `sort-imports`
- `vp check` runs format + lint + type check. `vp test` runs Vitest. Always run both together: `vp check && vp test`

## For consumer-side agents

1. Read `node_modules/design-system/CLAUDE.md` then `DESIGN.md` for design decisions
2. Read `src/index.ts` for exports, `src/components/{Name}/{Name}.tsx` for props
3. Read `src/variables.css` for tokens, `src/themes/` for brand overrides
4. `value` + `onChange` = controlled. `defaultValue` = uncontrolled. Don't use `value` without `onChange`
5. `import { Button, Input, ... } from "design-system"` + `import "design-system/css/style.css"`

## Figma MCP

- File: https://www.figma.com/design/NiBvhCdGieWhAcyuwn2K7W/Test
- **CRITICAL: always set `layoutSizingVertical = "HUG"` on inner frames after creating content.** Frames default to FIXED height after `resize()` — this causes components to render with excess whitespace. Apply HUG to: component variants, input wrappers, triggers, content frames.
- Text styles support `setBoundVariable()` for `fontFamily`, `fontSize`, `fontStyle` — use STRING vars for family/style, FLOAT for size
- Don't assume Figma API limitations — test before claiming features don't exist
- Font style names differ: Inter = "Semi Bold" (space), Roboto Flex = "SemiBold" (no space). Use `listAvailableFontsAsync()` to discover
- Screenshot individual variants, not component sets (too zoomed out at set level)

### Component page rules

1. Component set at x=2000, no background — out of view
2. 4 themed frames in 2×2 grid (lights top, darks bottom). "All components" page: single row
3. Frames: 400px wide, equal height, 48px gap, 24px padding, 8px radius, fill bound to `color/page`
4. Theme label: 11px muted 0.5 opacity. All states shown. Instances fill width
5. Pages: "All components" first, alphabetical middle, "Icons" last
6. Disabled/readonly fills: `color/bg` at 0.7 opacity — never hardcoded colors
7. Labels reflect state (e.g. "Email" for error, "Username" for disabled)

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
