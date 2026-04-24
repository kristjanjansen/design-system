# Plan: Figma Component Library

## Goal

Build a proper Figma design system library that mirrors the code — components with variants, design tokens as variables, organized pages.

## File

https://www.figma.com/design/sdWyRfiEqElblYjDQSVumg

## Structure

### Pages

```
Tokens              ← color, spacing, radius swatches
TextField           ← component + variants + examples
TextArea            ← component + variants + examples
Button              ← component + variants + examples
Switch              ← component + variants + examples
Checkbox            ← component + variants + examples
Accordion           ← component + variants + examples
```

### Variables (from tokens.css)

Create Figma variable collections:

**Colors** (with light/dark modes per brand):

- `color/fg`, `color/muted`, `color/error`, `color/border`, `color/bg`, `color/page`, `color/accent`, `color/outline`

**Spacing:**

- `spacing/8`, `spacing/10`, `spacing/14`

**Sizing:**

- `radius`, `border-width`, `outline-width`, `outline-offset`

**Motion:**

- Not applicable in Figma (static)

### Components with variants

**TextField:**

- Properties: `state=default|error|disabled|readonly`, `label=string`, `placeholder=string`, `description=string`

**TextArea:**

- Same as TextField

**Button:**

- Properties: `variant=primary|secondary|tertiary`, `size=default|small`, `state=default|disabled`, `label=string`

**Switch:**

- Properties: `checked=true|false`, `state=default|disabled`, `label=string`

**Checkbox:**

- Properties: `checked=true|false|indeterminate`, `state=default|error|disabled`, `label=string`

**Accordion:**

- Properties: `variant=ghost|default`, `open=true|false`, `state=default|disabled`, `title=string`

### Each component page contains

1. The component set (all variants)
2. Example instances showing each state
3. No documentation text — agents read source

## Status: DONE

Implemented in https://www.figma.com/design/NiBvhCdGieWhAcyuwn2K7W/Test

- Variable collection "Design Tokens" with 4 modes (brand1-light/dark, brand2-light/dark)
- 22 variables: colors, spacing, radius, border-width, outline, opacity, button sizing
- All component fills/strokes/spacing bound to variables
- Icons imported from EDS Icon Library (`global/` set)
- Each page has 2×2 themed example frames
- Component sets moved off-canvas, themed frames are primary view

## Next steps

- Publish as team library
- Add Code Connect mappings for Figma Dev Mode
- Add Accordion component to Figma

---

## Status: DONE

Implemented. Key details:

- File: https://www.figma.com/design/NiBvhCdGieWhAcyuwn2K7W/Test
- 22+ variables in Design Tokens collection, 4 modes
- Text styles with variable-bound fontFamily/fontSize/fontStyle
- Component sets: Button (24 variants), Input (8), Textarea (4), Switch (6), Checkbox (9), Accordion (8)
- Pages: All components, Accordion, Button, Checkbox, Input, Switch, Textarea, Icons
- Themed frames: 2×2 grid per component page, single row on All components
- Icons imported from EDS Icon Library (`global/` set)
- Code Connect: not yet done (requires library publish)
