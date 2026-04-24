# Design System — Design Decisions

## Colors

- Use `oklch` for all color values — perceptually uniform, enables deriving variants by math
- Never hardcode color variants (hover, focus, disabled). Derive them from base colors using relative color syntax: `oklch(from var(--base) calc(l - var(--shift)) c h)`
- Lightness/chroma adjustments are tokens (`--ds-l-hover`, `--ds-l-focus`, `--ds-l-disabled`, `--ds-c-disabled`) so the entire interaction palette is tunable from one place
- No hex values
- `--ds-color-accent` for interactive highlights (switch checked state). Green by default, blue for brand2
- `@property` registers all color tokens with `syntax: "<color>"` so they transition smoothly between themes

## Tokens

- All design tokens are CSS custom properties prefixed `--ds-`
- Use `em` for font sizes, spacing, and radius (scales with context). Use `px` for border-width, outline-width, outline-offset
- Keep comments with px equivalents on em-based tokens for reference
- Token naming: `--ds-color-{name}`, `--ds-l-{state}` (lightness shift), `--ds-c-{state}` (chroma shift)
- No redundant segments in names (e.g. `--ds-color-muted` not `--ds-color-text-muted`)
- Motion tokens: `--ds-duration-fast`, `--ds-duration-normal`, `--ds-duration-slow` (all 100ms by default), `--ds-easing: cubic-bezier(0.14, 0.25, 0.54, 1)` — no hardcoded durations or easings in component CSS
- Transitions only target color-related properties (`border-color, outline-color, background-color, color`) — use `transition-property` + shared `transition-duration` and `transition-timing-function` instead of repeating values per property
- Label font size matches input font size (both 16px / `--ds-font-size-md`)
- Font tokens: `--ds-font-family`, `--ds-font-stretch` — themed per brand

## CSS

- All styles wrapped in `@layer ds` so consumers can override without specificity wars
- No inline styles in components — use CSS files with class names
- `@scope` for component CSS encapsulation — inner elements use simple class names (`.label`, `.input`, `.error`) scoped to the component root (`.ds-text-field`, `.ds-switch`, etc.)
- Class names: root scope per component (`.ds-text-field`, `.ds-accordion`), inner elements use bare names within `@scope`
- Each component lives in its own subdirectory: `src/components/Switch/`, `src/components/Input/`, etc.
- Each subdirectory contains `ComponentName.tsx`, `ComponentName.css`, and `ComponentName.test.tsx` (colocated tests)
- No index files — use explicit names (`Input/Input.tsx`, not `Input/index.tsx`)
- Components support `className` passthrough on the wrapper element
- Style `::placeholder` explicitly (browser defaults vary)
- Use `:focus-visible` not `:focus` — outline only shows on keyboard navigation, not click
- `prefers-reduced-motion: reduce` disables all transitions
- Focus outline uses `--ds-color-outline`, `--ds-outline-width`, `--ds-outline-offset` — all tokenized, no hardcoded px in component CSS
- Focus border darkens from base border color (not outline color)
- Error border color on focus also darkens from error color
- `text-wrap: balance` on labels, descriptions, error messages
- `@starting-style` for error message fade-in animation
- `field-sizing: content` on Textarea for auto-growing, with `min-height: 4lh`
- `font-stretch: var(--ds-font-stretch)` on inputs explicitly (form elements don't inherit it)

## Theming

- Themes via `data-theme` attribute on root element: `brand1-light`, `brand1-dark`, `brand2-light`, `brand2-dark`
- `color-scheme: light/dark` set per theme so native browser controls match
- `light-dark()` collapses light+dark variants into a single file per brand
- Base `:root` tokens serve as the default (no `data-theme` needed for fallback)
- Themes only override tokens that differ from base — shift tokens inherited when unchanged
- `--ds-color-page` for page background (slightly darker than `--ds-color-bg` in dark themes for depth)
- `@media (prefers-color-scheme: dark)` auto-fallback when no `data-theme` is set
- Structural tokens (spacing, font sizes) are shared; color, radius, border-width, outline-width/offset, font-family, opacity-disabled are themeable
- Fonts are the consumer's responsibility — the library provides `--ds-font-family` token, consumer imports the actual font files

## Component states

- **Default**: base border, base background
- **Hover**: border darkens by `--ds-l-hover`
- **Focus**: outline appears, border darkens by `--ds-l-focus`
- **Error**: red border, red error message, red outline on focus
- **Disabled**: lightened border, gray background, muted text/label/description, `cursor: default`. Switch uses `--ds-opacity-disabled`
- **Read-only**: gray background, desaturated border, normal text color, `cursor: default`

## Component API

- `onChange` signature: value first, event second — `(value: string, event) => void` for fields, `(checked: boolean, event) => void` for Switch
- Support both controlled and uncontrolled patterns
- Use `forwardRef` so consumers can access the underlying element
- Extend native HTML attributes via `Omit<HTMLAttributes, ...>` for passthrough
- Auto-generate `id` via `useId()`, link label with `htmlFor`
- `aria-invalid` and `aria-describedby` set automatically from `error` prop
- Switch uses `role="switch"` on a checkbox input
- Error messages use `aria-live="polite"` (not `role="alert"`) so they don't interrupt screen reader flow
- Color tokens must meet WCAG AA contrast (4.5:1) against `--ds-color-bg`
- `description` prop for helper text below the field (hidden when error is shown)
- One export line per component in `src/index.ts`: `export { Component, type Props } from "..."`

## Architecture

- React is a peer dependency — not bundled
- Tests use jsdom + `react-dom/client` with direct DOM assertions — no testing-library
- Build with `vp pack`, output single `style.css` + `index.mjs` + `index.d.mts`
- Build verification tests assert dist files exist, exports are correct, CSS contains all selectors/tokens/themes
- Component tests include `forwardRef` contract check
- No hardcoded px values in component CSS — only shape constants (999px pill, 50% circle) and animation transforms
- Package ships `src/` and `CLAUDE.md` so consumer-side agents can read full source from `node_modules/system-design/src/` and design decisions from `node_modules/system-design/CLAUDE.md`
- Accordion uses native `<details>`/`<summary>` with `interpolate-size: allow-keywords` for animated open/close
- AccordionGroup uses native `name` attribute for exclusive mode — no React state management
- Accordion has `variant="ghost"` (brand1, divider borders) and `variant="default"` (brand2, boxed with border-radius)
- Icons sourced from EDS Figma Icon Library (`global/` set) — exported as SVG, used as TSX components with `fill="currentColor"`
- Linting: oxlint with `jsx-a11y`, `react`, `import` plugins + `sort-imports` (member sort only, `ignoreDeclarationSort: true`)

## For consumer-side agents

When working in a project that uses this design system:

1. Read `node_modules/system-design/CLAUDE.md` for design decisions and conventions
2. Read `node_modules/system-design/src/index.ts` for available exports
3. Read `node_modules/system-design/src/components/{Name}/{Name}.tsx` for props interface and component implementation
4. Read `node_modules/system-design/src/components/{Name}/{Name}.css` for available CSS classes, states, and tokens used
5. Read `node_modules/system-design/src/variables.css` for all design tokens and their default values
6. Read `node_modules/system-design/src/themes/` for brand-specific token overrides
7. Controlled fields use `value` + `onChange` together. For static/display values without `onChange`, use `defaultValue` (uncontrolled) or `readOnly` (explicit)
8. Import components: `import { Accordion, AccordionGroup, Button, Checkbox, Switch, Textarea, Input } from "system-design"`
9. Import styles: `import "system-design/style.css"`

## Figma

- Figma file: https://www.figma.com/design/NiBvhCdGieWhAcyuwn2K7W/Test
- Pages: Examples, Button, Input, Switch, Checkbox, Accordion, Icons
- Design Tokens variable collection with 4 modes: brand1-light, brand1-dark, brand2-light, brand2-dark
- Variables: colors, spacing, radius, border-width, outline, opacity, button sizing, font family/style/size
- All component fills/strokes/spacing bound to variables — theme switching via Figma variable modes
- Text styles (`label`, `body`, `description`, `heading`) with `fontFamily`, `fontSize`, `fontStyle` bound to variables — automatically switch between Inter (brand1) and Roboto Flex (brand2) per mode
- Icons imported from EDS Icon Library (`global/check`, `global/chevron-down`)
- Each component page has themed frames in 2×2 grid (lights top, darks bottom)
- Component sets moved off-canvas (x=2000) — themed frames are the primary view

### Component page rules (every component page must follow)

1. Component set at x=2000, no background fill — out of view
2. 4 themed frames in 2×2 grid: brand1-light + brand2-light (top row), brand1-dark + brand2-dark (bottom row)
3. All frames: 400px wide, equal height (max of 4), 24px gap
4. Frame layout: vertical auto-layout, 24px padding, 16px item spacing, 8px corner radius
5. Frame fill bound to `color/page` variable
6. Mode set via `setExplicitVariableModeForCollection`
7. Theme label: 11px, muted color, 0.5 opacity, first child
8. All component states shown as instances (default, error, disabled, readonly, hover, focused, required, etc.)
9. Instances: `layoutSizingHorizontal = "FILL"` after appending
10. Brand-specific variants where applicable (accordion ghost for brand1, default for brand2)
11. "All components" page: single horizontal row — brand1-light, brand2-light, brand1-dark, brand2-dark

## Figma gotchas (lessons learned)

- **Text styles CAN bind to variables** — `fontFamily`, `fontSize`, `fontStyle` all support `setBoundVariable()`. Use STRING variables for fontFamily/fontStyle, FLOAT for fontSize. Do NOT assume Figma features don't exist — test via the API before claiming limitations.
- **Component set variant cells share row height** — if some variants are taller, shorter ones get stretched. Arrange variants in rows of similar height, or accept the whitespace.
- **`layoutSizingVertical = "HUG"` on child frames** — inner frames (like triggers) default to FIXED height after `resize()`. Always set to HUG explicitly after creating content.
- **`width: 100%` on `<summary>`** — causes overflow past `<details>` border. Remove it; `<summary>` is block-level and fills naturally.
- **Font style names differ between families** — Inter uses "Semi Bold" (with space), Roboto Flex uses "SemiBold" (no space). Use `listAvailableFontsAsync()` to discover exact style strings.
- **Always verify via `get_screenshot` after Figma changes** — screenshots at component-set level may be too zoomed out. Screenshot individual variants or themed frames instead.
- **When unsure if a Figma API feature exists, try it** — don't assume based on documentation or prior knowledge. The API surface is larger than expected.

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
