# Plan: Accordion & AccordionGroup

## Approach

Use native `<details>` + `<summary>` instead of custom JS height animation. Modern browsers handle open/close animation natively with `interpolate-size: allow-keywords` (animates to/from `auto` height). No ResizeObserver, no measured heights, no `overflow: hidden` hacks.

## Components

### Accordion

Single collapsible section using `<details>`.

```
details.ds-accordion              ← native open/close behavior
  summary.trigger                 ← clickable header
    span.title                    ← title text
    span.icon                     ← chevron SVG, rotates on open
  div.content                     ← panel content
    {children}
```

**Props:**

```ts
interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  name?: string; // native details name attr for grouping
  onToggle?: (open: boolean) => void;
}
```

**Key decisions:**

- `<details>` handles open/close state natively — no React state needed for uncontrolled usage
- `name` prop maps to the native `name` attribute — details elements with the same `name` form an exclusive group (browser-native, no JS needed)
- No font size change on open (EDS does this — we explicitly skip it)
- Chevron on the right side, rotates 180° on open
- Disabled via `pointer-events: none` + opacity

### AccordionGroup

Wrapper that applies shared `name` for mutual exclusivity.

```tsx
interface AccordionGroupProps {
  exclusive?: boolean; // sets shared name for single-open behavior
  className?: string;
  children: React.ReactNode;
}
```

When `exclusive` is true, generates a unique `name` and passes it to children via context. Each `Accordion` reads context and applies the `name` attribute.

This replaces the EDS/ELV `mode="single"|"multiple"` + selectedKeys + Context state machine — the browser does it natively with the `name` attribute.

## CSS

### Animation

```css
details {
  interpolate-size: allow-keywords;
}

details::details-content {
  transition:
    height var(--ds-duration-normal) var(--ds-easing),
    opacity var(--ds-duration-normal) var(--ds-easing),
    content-visibility var(--ds-duration-normal) var(--ds-easing);
  height: 0;
  opacity: 0;
  overflow: clip;
}

details[open]::details-content {
  height: auto;
  opacity: 1;
}
```

No JS height measurement. No ResizeObserver. Browser transitions `height: 0` → `height: auto` natively.

### Styling

- Bottom border divider between items in a group (like EDS, not boxed like ELV)
- Summary padding: `--ds-spacing-sm` vertical, `--ds-spacing-md` horizontal
- Content padding: `--ds-spacing-md` top/bottom
- Chevron: TSX component, right-aligned, rotates with transition
- Focus: `--ds-outline-*` tokens on summary `:focus-visible`
- No `::marker` — hide native marker, use custom icon
- `@scope (.ds-accordion)` for encapsulation

### States

- **Closed**: default, chevron points down
- **Open**: chevron rotates 180°, content visible
- **Hover**: border darkens by `--ds-l-hover`
- **Focus-visible**: outline on summary
- **Disabled**: `--ds-opacity-disabled`, no pointer events

## File structure

```
src/components/
  Accordion/
    Accordion.tsx
    Accordion.css
    Accordion.test.tsx
    AccordionGroup.tsx
    icons/
      ChevronIcon.tsx
```

## Why `<details>` over custom JS

1. **No height measurement** — `interpolate-size: allow-keywords` handles auto height animation
2. **No ResizeObserver** — browser handles content reflow
3. **Native keyboard** — Enter/Space toggle, no custom handlers
4. **Native `name` grouping** — exclusive mode without React context/state
5. **SEO/accessibility** — content is in the DOM, semantic elements
6. **Progressive enhancement** — works without JS

## What EDS/ELV do that we skip

- Font size bump on open title (EDS) — visual noise
- `inert` attribute on closed panel (ELV) — `<details>` handles this natively
- ResizeObserver height tracking — unnecessary with `interpolate-size`
- Custom `selectedKeys` state management — native `name` attribute
- `useFocusRing` hook (ELV) — `:focus-visible` CSS
