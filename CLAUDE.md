# system-design

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
- Icons as TSX components with `fill="currentColor"`

## Build

- `vp pack` with `unbundle: true` — per-component JS for tree-shaking
- Combined CSS: `system-design/css/style.css`. Per-component: `system-design/css/*.css`
- Linting: oxlint with `jsx-a11y`, `react`, `import` plugins + `sort-imports`
- `vp check` runs format + lint. `vp test` runs Vitest

## For consumer-side agents

1. Read `node_modules/system-design/CLAUDE.md` then `DESIGN.md` for design decisions
2. Read `src/index.ts` for exports, `src/components/{Name}/{Name}.tsx` for props
3. Read `src/variables.css` for tokens, `src/themes/` for brand overrides
4. `value` + `onChange` = controlled. `defaultValue` = uncontrolled. Don't use `value` without `onChange`
5. `import { Button, Input, ... } from "system-design"` + `import "system-design/css/style.css"`

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
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`.
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools.
- **Import JavaScript modules from `vite-plus`:** e.g. `import { defineConfig } from 'vite-plus'` or `import { expect, test } from 'vite-plus/test'`.

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
