# plan: CLAUDE.md rewrite

## status: pending

## problem

CLAUDE.md serves two audiences but doesn't separate them:

- **Library authors** (contributors working on DS source) — need component templates, CSS patterns, EDS/ELV deep-dive rules, Figma MCP rules, test patterns
- **Library consumers** (developers using the DS in apps) — need install, import, theming, Tailwind setup, Next.js integration

Currently everything is in one flat file: author-only rules (EDS/ELV checklist, component page rules, CSS pattern) are mixed with consumer-relevant info (Next.js integration, Tailwind mapping). The Vite+ section at the bottom is auto-generated and can't move.

## proposed structure

```
# design-system

## For consumers

### Install & setup
### Theming (data-theme attribute, 4 themes)
### CSS imports
### Tailwind integration
### Next.js integration (globals.css, fonts, context "use client")
### Package updates (tarball workflow)

## For contributors

### File structure
### Conventions (naming, exports, icons)
### Plans (link to plans/)
### Adding a new component (checklist)

### Component patterns
#### TSX template
#### CSS template
#### Test template
#### onChange conventions

### CSS rules
#### Tokens & colors (never hardcode)
#### @layer ds (only on variables, not components)
#### @scope isolation
#### Component CSS vars for brand differences
#### EDS/ELV deep-dive checklist

### Accessibility checklist
### Browser support notes

### Figma MCP
#### File link
#### Component page rules
#### Variable scopes
#### Frame/text binding rules

## Build (vp commands)

---
## Vite+ (auto-generated, stays at bottom)
```

## what to clean up

1. **CSS template still shows `@layer ds`** — outdated, we removed it from components
2. **Next.js section says "Import DS CSS via JS"** — outdated, we now import via `globals.css` `@import`. The rule is: DS CSS + Tailwind all go through `globals.css`, component CSS is unlayered so no conflict.
3. **Duplicate info** — EDS/ELV paths listed twice (in CSS rules and deep-dive checklist)
4. **DESIGN.md reference** — line 3 references DESIGN.md, check if it exists and is current
5. **Component template** is very long — could be a separate file (`CONTRIBUTING.md` or `docs/component-template.md`) linked from CLAUDE.md
6. **"Combined CSS: design-system/css/style.css"** — path seems wrong, should be `dist/style.css`

## what to add

1. **Consumer quick-start** — minimal working example: install, import CSS, import components
2. **Theming** — how `data-theme` works, available themes, switching at runtime
3. **Tailwind class naming** — `text-ds-*`, `bg-ds-*`, `p-ds-*`, `rounded-ds` etc.
4. **"use client" gotcha** — barrel import pulls in contexts, server components need individual imports or the context files have `"use client"`

## what NOT to change

- Vite+ section at bottom (auto-generated between `<!--VITE PLUS START-->` markers)
- Keep it one file — splitting into multiple .md files makes it harder for agents to find

## implementation

1. Restructure sections with clear `## For consumers` / `## For contributors` headings
2. Fix outdated info (CSS template, Next.js imports, file paths)
3. Add consumer quick-start and theming sections
4. Deduplicate EDS/ELV info
5. Keep total length manageable — move component template to a linked file if too long
