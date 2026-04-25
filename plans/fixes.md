# plan: fixes

## figma: add danger and ghost button variants

button component set missing danger and ghost variants. currently only has primary/secondary/tertiary × default/small × default/hover/focused/disabled.

add:

- variant=danger, size=default, state=default/hover/focused/disabled
- variant=danger, size=small, state=default/hover/focused/disabled
- variant=ghost, size=default, state=default/hover/focused/disabled
- variant=ghost, size=small, state=default/hover/focused/disabled

danger: error color bg, white text
ghost: transparent bg, accent text, pill shape

also: first variant in component set has wrong name (size=small instead of size=default). fix it.

## select: disabled bg same as readonly

select disabled wrapper uses the same background darkening as readonly — both look identical. disabled should look more distinct.

current:

```css
.select-wrapper:has(:disabled) {
  background: color-mix(
    in oklch,
    var(--ds-color-bg),
    var(--ds-mix-direction) var(--ds-light-hover)
  );
}
```

fix: use a more subtle disabled bg, or just keep default bg with muted border. the `cursor: default` and muted text already signal disabled state.

```css
.select-wrapper:has(:disabled) {
  border-color: color-mix(in oklch, var(--ds-color-border), transparent 50%);
}
```

also check: Input, InputNumber, InputPassword, Textarea — do they have the same disabled/readonly confusion?
