# Plan: Rich Text & Links

## Status: pending

## Rich text (inline formatting inside Text)

CSS for semantic HTML children inside `.ds-text`:

```css
.ds-text strong,
.ds-text b {
  font-weight: 600;
}
.ds-text em,
.ds-text i {
  font-style: italic;
}
.ds-text u {
  text-decoration: underline;
}
.ds-text s,
.ds-text del {
  text-decoration: line-through;
}
.ds-text code {
  font-family: monospace;
  font-size: 0.9em;
}
```

No new components or props — just styling semantic HTML inside Text.

## Links

### Prose links (inside Text)

```css
.ds-text a {
  color: var(--ds-color-accent);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
```

### Link component inside Text

when using `<Link>` (our component or framework links) inside `<Text>`, they should get the same prose styling as native `<a>`. since Link renders as `<a>` by default (or via `as`), the `.ds-text a` rule covers it automatically.

```tsx
<Text>
  Read the <Link href="/docs">documentation</Link> for details.
</Text>
```

if Link uses a framework component (`as={NextLink}`), it still renders an `<a>` in the DOM — prose styles apply.

### Standalone Link component

For navigation links outside prose. Consumers may need to pass custom components (e.g. Next.js `<Link>`, React Router `<Link>`). Options:

- **Polymorphic `as` prop** — `<Link as={NextLink} href="/docs">` — same pattern as Heading/Text
- **Render prop** — `<Link render={(props) => <NextLink {...props} />}>`
- **Just export CSS class** — consumer applies `.ds-link` to their own link component

Polymorphic `as` is simplest and matches our existing pattern. But Next.js Link has different props than `<a>`. Need to handle generic prop forwarding.

```tsx
interface LinkProps<T extends React.ElementType = "a"> {
  as?: T;
  children: ReactNode;
}

<Link href="/docs">Native link</Link>
<Link as={NextLink} href="/docs">Next.js link</Link>
```

Decide approach when implementing.
