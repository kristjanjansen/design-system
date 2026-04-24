# Plan: Visual Reference Site

## What it is

A visual catalog of components in all states and themes. No props tables, no API docs — agents read source for that. Humans need to see what things look like.

## Structure

```
design-system/
  src/                    ← library source (existing)
  docs/                   ← visual reference app
    index.html
    vite.config.ts
    src/
      main.tsx
      App.tsx
      pages/
        TextField.tsx     ← all states: default, error, disabled, readonly
        TextArea.tsx
        Switch.tsx
        Button.tsx
      layout/
        Sidebar.tsx
        ThemeSwitch.tsx
    package.json
```

## Each page shows

- The component in every state (default, hover, focus, error, disabled, readonly)
- Both sizes where applicable (default, small)
- All variants (primary, secondary, tertiary)
- No prose, no API tables, no code snippets — just rendered components with labels

Example TextField page:

```
Default          [___________]
With label       Name
                 [___________]
With description Name
                 [___________]
                 Your full name
Error            Email
                 [___________]
                 Invalid email
Disabled         Username
                 [___________]
Read-only        Account ID
                 [acct_7f3k9]
```

## Theme comparison

The theme switcher stays global (top or sidebar). Switching theme re-renders everything — you see the entire catalog in that brand's look.

## Dev setup

`docs/vite.config.ts` aliases `design-system` to `../src/index.ts` for HMR. No build needed during dev.

## Scripts

```json
{
  "scripts": {
    "docs:dev": "vp dev --root docs",
    "docs:build": "vp build --root docs"
  }
}
```

## Migration

1. Move consumer app content into `docs/`
2. Split into per-component pages with routing
3. Delete consumer project

## What it is NOT

- Not API documentation — agents read types
- Not a playground — just a visual catalog
- Not generated — hand-curated layouts showing every state

---

## Status: PARTIALLY DONE

Decision: agent-first documentation, no docs site needed. What was done:

- CLAUDE.md + DESIGN.md ship in npm package for consumer-side agents
- Source code (`src/`) ships in package — agents read types/CSS directly
- Consumer prompt in README.md shows how to instruct an agent
- Visual reference via Figma file (not a code-based docs site)
- No VitePress, no Storybook — source IS the documentation

What was NOT done:

- No visual reference React app (the consumer app exists but is not part of the library)
- No auto-generated docs from source
