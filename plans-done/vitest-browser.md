# Plan: Vitest Browser Testing

## Current setup

jsdom + @testing-library/react. Tests run in Node with simulated DOM.

## jsdom (current) — pros/cons

**Pros:**

- Fast (~1s for 82 tests)
- No browser dependency
- Simple CI setup
- Well-understood, huge ecosystem

**Cons:**

- CSS doesn't load — can't test visual states, @scope, @property, oklch
- No real layout — can't test overflow, field-sizing, text-wrap
- `act()` warnings in some patterns
- Mocking DOM APIs (ResizeObserver, IntersectionObserver) when needed

## Vitest browser mode — pros/cons

**Pros:**

- Real browser rendering — CSS actually works
- Can test theme switching (variable modes actually resolve)
- Can test keyboard navigation with real focus behavior
- Can test `@starting-style` animations, `field-sizing: content`
- Screenshot testing possible (visual regression)
- No jsdom quirks or missing APIs

**Cons:**

- Slower (~5-10x)
- Requires browser binary (Playwright/WebDriverIO)
- More complex CI setup (needs browser install step)
- Flakier in CI (timeouts, resource contention)
- Overkill for unit-level prop/event tests

## Recommendation

**Keep jsdom for unit tests** (props, events, aria, ref forwarding). These don't need a real browser.

**Add browser tests only for CSS features** that jsdom can't verify:

- Theme switching actually changes colors
- `@scope` isolation between components
- Focus-visible outline appearance
- Accordion animation

This is a small number of integration tests, not a full migration.

## If migrating fully

```ts
// vite.config.ts
test: {
  browser: {
    enabled: true,
    provider: "playwright",
    name: "chromium",
  },
}
```

Tests stay identical — @testing-library/react works in browser mode. The main change is the runner, not the test code.

## Decision: don't migrate now

The unit tests work well with jsdom + testing-library. Browser tests add complexity for marginal benefit at this stage. Revisit when we have visual regression testing needs.
