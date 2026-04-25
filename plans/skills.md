# Plan: Claude Code Skills

## Status: pending

Extract repeatable workflows from CLAUDE.md into Claude Code skills (slash commands).

## Proposed skills

### /add-icon

Add a new icon from the EDS Icon Library to both Figma and code.

1. Search EDS Icon Library for the icon by name
2. Import to DS Figma Icons page at correct size
3. Export SVG path data
4. Create `src/icons/Icon{Name}{Size}.tsx` with `fill="currentColor"`
5. Add export to `src/icons/index.ts`
6. Run `vp check && vp test`

### /add-component

Scaffold a new component following the template:

1. Create `src/components/{Name}/{Name}.tsx + .css + .test.tsx`
2. Follow component template from CLAUDE.md (forwardRef, useId, FieldLabel/FieldMessages, etc.)
3. Export from `src/index.ts`
4. Add CSS import to `src/style.css`
5. Run `vp check && vp test`
6. Create Figma component page with variants + 4 themed frames
7. Add instance to All Components page
8. Run `vp pack`

### /sync-figma

After code changes, sync Figma to match:

1. Update color variables if theme values changed
2. Update text styles if font scale changed
3. Rebuild themed frames on affected component pages
4. Bind fontFamily to font/family variable on new text nodes
5. HUG all frames
6. Screenshot and verify

### /sync-variables

Sync CSS color tokens → Figma color variables:

1. Run `vp check && vp test` (contrast tests catch bad values before syncing)
2. Parse `themes/brand1.css` and `themes/brand2.css` for oklch values
3. Convert oklch → sRGB (using culori)
4. Compare with current Figma variable values
5. Update changed variables
6. Report what changed

### /sync-consumer

After design system changes, update the consumer app:

1. Run `vp pack` in design system
2. Update consumer imports if new components were added
3. Add examples for new components

## Implementation

Skills are markdown files in `.claude/skills/`. Each skill has a prompt that guides the agent through the workflow with access to project tools and context.

## Source material

- CLAUDE.md "When adding a new component" and "Component template" sections
- CLAUDE.md "Figma MCP" section
- `plans/icons.md` workflow
- Feedback memories (vp check, HUG frames)
