# Plan: Typography

## Status: Heading + Text done, rich text + Link pending

### Done

- Heading component: levels 1-6, polymorphic `as`, forwardRef
- Text component: sizes sm/md/lg, weight 400/600, polymorphic `as`, forwardRef
- Font-size tokens: xs through 5xl, rem-based
- Spacing/radius migrated from em to rem
- FieldLabel refactored to use Text internally
- FieldMessages refactored to use Text internally
- Figma: 10 text styles (heading/h1-h6, text/xs-lg), Typography page, font variable bindings

### Font scale

| Token                | Size            | Used by                              |
| -------------------- | --------------- | ------------------------------------ |
| `--ds-font-size-xs`  | 0.75rem (12px)  | —                                    |
| `--ds-font-size-sm`  | 0.875rem (14px) | Text sm, FieldMessages               |
| `--ds-font-size-md`  | 1rem (16px)     | Text md, FieldLabel, inputs          |
| `--ds-font-size-lg`  | 1.125rem (18px) | Text lg, Heading h6, Accordion title |
| `--ds-font-size-xl`  | 1.25rem (20px)  | Heading h5                           |
| `--ds-font-size-2xl` | 1.5rem (24px)   | Heading h4                           |
| `--ds-font-size-3xl` | 1.75rem (28px)  | Heading h3                           |
| `--ds-font-size-4xl` | 2.25rem (36px)  | Heading h2                           |
| `--ds-font-size-5xl` | 3rem (48px)     | Heading h1                           |

## Use inside other components (done)

| Component     | Before                        | After                            |
| ------------- | ----------------------------- | -------------------------------- |
| FieldLabel    | Manual font styling           | `<Text as="label" weight={600}>` |
| FieldMessages | `<span>` with font-size class | `<Text as="span" size="sm">`     |
