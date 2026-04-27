# plan: fixes

## status: done

## figma: add danger and ghost button variants — DONE

- added 16 new variants: danger + ghost × default/small × default/hover/focused/disabled
- fixed first variant name (size=small → size=default)
- added danger + ghost instances to all 4 themed preview frames
- repositioned 2×2 grid to fit wider frames

## select: disabled bg same as readonly — DONE

removed background darkening from disabled state across all form components. disabled now uses muted border only (`border-color: color-mix(in oklch, var(--ds-color-border), transparent 50%)`), keeping default bg. readonly keeps the darkened bg to distinguish the two states.

fixed in: Select, Input, InputNumber, InputPassword, Textarea (all had the same issue).
