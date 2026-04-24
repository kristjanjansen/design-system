# system-design — Design Decisions

## Colors

- `oklch` for all values. Derive variants via relative color syntax: `oklch(from var(--base) calc(l - var(--shift)) c h)`
- Shift tokens (`--ds-l-hover`, `--ds-l-focus`, `--ds-l-disabled`, `--ds-c-disabled`) — never hardcode variants
- `@property` registers color tokens with `syntax: "<color>"` for smooth theme transitions
- `--ds-color-accent` for interactive highlights — green (brand1), blue (brand2)

## Tokens

- CSS custom properties prefixed `--ds-`
- `em` for font sizes, spacing, radius. `px` for border/outline widths
- Naming: `--ds-color-{name}`, `--ds-l-{state}`, `--ds-c-{state}`, `--ds-spacing-{px}`
- Motion: `--ds-duration-fast/normal/slow` (100ms), `--ds-easing`
- Font: `--ds-font-family`, `--ds-font-stretch` — themed per brand

## CSS

- `@layer ds` for all styles. `@scope` per component — bare inner class names (`.input`, `.label`)
- `:focus-visible` not `:focus`. `prefers-reduced-motion` disables transitions. `forced-colors` for high contrast
- `@starting-style` for error fade-in. `field-sizing: content` on Textarea. `text-wrap: balance` on text
- `font-stretch: var(--ds-font-stretch)` on inputs explicitly (form elements don't inherit it)
- Transitions: `transition-property` listing color properties only, shared duration/easing

## Theming

- `data-theme="brand1-light|brand1-dark|brand2-light|brand2-dark"` on root
- `light-dark()` collapses light+dark into one file per brand. `color-scheme` set per theme
- Base `:root` = brand1-light default. `prefers-color-scheme: dark` auto-fallback
- Themeable: colors, radius, border-width, outline, font-family, opacity. Shared: spacing, font sizes

## Components

- Naming follows NuxtUI: `Input`, `Textarea`, `Button`, `Switch`, `Checkbox`, `Accordion`
- `onChange`: value first — `(value, event)` for fields, `(checked, event)` for Switch/Checkbox
- `forwardRef` on all. Native HTML attributes via `Omit<HTMLAttributes, ...>` passthrough
- `useId()` for auto `id` + `htmlFor` linking. `aria-invalid`, `aria-describedby`, `aria-required` set from props
- Shared `FieldLabel` + `FieldMessages` primitives in `internal/` (not exported). Always `<label>` element
- Accordion: native `<details>` + `interpolate-size`. `name` attribute for exclusive groups. `variant="ghost|default"`
- Icons: TSX components from EDS Figma `global/` set, `fill="currentColor"`

## File structure

```
src/components/{Name}/{Name}.tsx + .css + .test.tsx    (colocated, no index files)
src/components/internal/                                (FieldLabel, FieldMessages, RequiredIndicator)
src/components/{Name}/icons/                            (TSX icon components)
src/variables.css                                       (design tokens)
src/themes/brand1.css, brand2.css, index.css            (theme overrides)
src/style.css                                           (combined CSS entry)
```

## Build

- `vp pack` with `unbundle: true` — per-component JS for tree-shaking
- Combined `style.css` for convenience, per-component CSS via `system-design/css/*.css`
- Linting: oxlint with `jsx-a11y`, `react`, `import` plugins

## For consumer-side agents

1. Read `node_modules/system-design/CLAUDE.md` for conventions
2. Read `src/index.ts` for exports, `src/components/{Name}/{Name}.tsx` for props
3. Read `src/variables.css` for tokens, `src/themes/` for brand overrides
4. `value` + `onChange` = controlled. `defaultValue` = uncontrolled. Don't use `value` without `onChange`
5. `import { Button, Input, ... } from "system-design"` + `import "system-design/css/style.css"`

## Figma

- File: https://www.figma.com/design/NiBvhCdGieWhAcyuwn2K7W/Test
- Design Tokens collection: 4 modes (brand1-light/dark, brand2-light/dark)
- Text styles with `fontFamily`/`fontSize`/`fontStyle` bound to variables (auto-switch Inter ↔ Roboto Flex)
- Icons imported from EDS Icon Library (`global/` set)

### Component page rules

1. Component set at x=2000, no background — out of view
2. 4 themed frames in 2×2 grid (lights top, darks bottom). "All components" page: single row
3. Frames: 400px wide, equal height, 48px gap, 24px padding, 8px radius, fill bound to `color/page`
4. Theme label: 11px muted 0.5 opacity. All states shown. Instances fill width
5. Pages: "All components" first, alphabetical middle, "Icons" last
6. Disabled/readonly fills: `color/bg` at 0.7 opacity — never hardcoded colors
7. Labels reflect state (e.g. "Email" for error, "Username" for disabled)
8. Don't assume Figma API limitations — test before claiming features don't exist

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
