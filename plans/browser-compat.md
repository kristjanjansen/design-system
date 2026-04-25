# Plan: Browser Compatibility

## Status: done

Target: **Chrome 123+ / Firefox 128+ / Safari 17.5+** (mid-2024 browsers).

```ts
// vite.config.ts
pack: {
  css: {
    target: ["chrome123", "safari17.5", "firefox128"], // mid-2024 browsers
  },
}
```

## Why mid-2024

These targets are the minimum where all our core CSS features work natively:

| Feature        | Chrome | Firefox | Safari | Status |
| -------------- | ------ | ------- | ------ | ------ |
| `@scope`       | 118    | 128     | 17.4   | native |
| `oklch()`      | 111    | 113     | 15.4   | native |
| `light-dark()` | 123    | 120     | 17.5   | native |
| `@layer`       | 99     | 97      | 15.4   | native |
| `@property`    | 85     | 128     | 15.4   | native |
| CSS nesting    | 120    | 117     | 17.2   | native |
| `:has()`       | 105    | 121     | 15.4   | native |

Chrome 123 (Mar 2024) is the bottleneck — it's the first version with `light-dark()`.

## LightningCSS output

With these targets, almost nothing needs transforming. Output is 130.77 kB (same as raw).

Only transform applied: CSS nesting flattened (Chrome 120 nesting differs slightly from spec).

Everything else passes through as-is: `@scope`, `oklch()`, `light-dark()`, `@layer`, `@property`.

## Progressive enhancement (works but degrades)

| Feature                   | Needs                   | Fallback                                    |
| ------------------------- | ----------------------- | ------------------------------------------- |
| `oklch(from var(...))`    | Chrome 122, Safari 18   | No hover/focus color shifts                 |
| `@starting-style`         | Firefox 129             | No fade-in animations                       |
| `::details-content`       | Chrome 131, Safari 18.4 | No accordion animation                      |
| `interpolate-size`        | Chrome 129              | Accordion opens instantly                   |
| `field-sizing`            | Chrome 123              | Fixed height textarea                       |
| `details[name]`           | Firefox 130             | No exclusive accordion groups               |
| `appearance: base-select` | Chrome 134              | Native select (already `@supports`-guarded) |
