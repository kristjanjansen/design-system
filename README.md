# system-design

Agent-first React design system. oklch colors, CSS custom properties, multi-brand theming, native web platform features.

Components: `Input`, `Textarea`, `Button`, `Switch`, `Checkbox`, `Accordion`

## Setup

```bash
brew install vite-plus
vp install
```

## Development

```bash
vp dev          # watch mode
vp test         # tests
vp check        # format + lint + types
vp pack         # build
```

## Usage

```tsx
import { Button, Input } from "system-design";
import "system-design/css/style.css";
```

## Design

See [DESIGN.md](DESIGN.md) for tokens, theming, and Figma.
