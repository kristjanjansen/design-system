# component api comparison

comparing: ds (ours), enefit-design-system (brand1), elektrilevi-public-ui (brand2)

## architecture

|            | ds                    | brand1                                              | brand2                        |
| ---------- | --------------------- | --------------------------------------------------- | ----------------------------- |
| base       | native html           | react-aria                                          | react-aria                    |
| deps       | react only            | react-aria, react-stately                           | react-aria, react-stately     |
| styling    | css custom properties | css with `eds-*` classes                            | css with `[data-elv-*]` attrs |
| validation | `error` string        | `errorMessage` + `isInvalid` + `validationBehavior` | same as brand1                |
| tokens     | 39 css vars           | ~2750 css vars                                      | css vars + tailwind           |

## shared patterns (all three)

- label + control + messages layout
- hint tooltip on labels
- required indicator
- `aria-describedby` linking error/description
- disabled/readonly states
- forwardRef

## generic slot pattern (decision)

replace component-specific props with three reusable slot pairs:

| slot                  | where                             | replaces                                                      |
| --------------------- | --------------------------------- | ------------------------------------------------------------- |
| `iconStart/iconEnd`   | button, input, select             | brand1/brand2 `iconLeft/iconRight`                            |
| `inputStart/inputEnd` | input, inputnumber, inputpassword | already have this                                             |
| `labelStart/labelEnd` | all form components               | `suffix`, `infoHint`, `tooltipTrigger`, `link`, `labelSuffix` |

`labelStart` goes before the label text, `labelEnd` after. consumer composes:

```tsx
<Input label="Email" labelEnd={<InfoHint>Help text</InfoHint>} />
<Input label="Price" labelEnd="optional" />
<Input label="Account" labelStart={<IconUserXs />} />
<Checkbox label="Terms" labelEnd={<a href="/terms">Read terms</a>} />
```

## components

### button

| prop            | ds                         | brand1                                                  | brand2                                    | decision                                                                                                                                              |
| --------------- | -------------------------- | ------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`       | primary secondary tertiary | primary secondary tertiary alert floating colored ghost | primary secondary ghost white link danger | add: danger ghost. danger=destructive (b1 "alert", b2 "danger"). ghost=text-link style (b1 "ghost", b2 "link"). skip: floating colored white inverted |
| `size`          | default small              | default small                                           | default sm                                | keep                                                                                                                                                  |
| `as`            | —                          | polymorphic                                             | `element` (button/a/div)                  | add                                                                                                                                                   |
| `iconStart/End` | —                          | `iconLeft/Right`                                        | `iconLeft/Right`                          | add                                                                                                                                                   |
| `isIcon`        | —                          | yes                                                     | yes                                       | add                                                                                                                                                   |
| `isFullWidth`   | —                          | yes                                                     | yes                                       | add                                                                                                                                                   |
| `inverted`      | —                          | yes                                                     | —                                         | skip                                                                                                                                                  |
| `onChange`      | native                     | `onPress`                                               | `onPress`                                 | keep native                                                                                                                                           |

### input

| prop             | ds                       | brand1                                    | brand2                       | decision                      |
| ---------------- | ------------------------ | ----------------------------------------- | ---------------------------- | ----------------------------- |
| component        | `Input`                  | `Textfield`                               | `Textfield`                  | keep `Input`                  |
| `onChange`       | `(value, event)`         | `(value: string)`                         | `(value: string)`            | keep                          |
| `error`          | string                   | `errorMessage`                            | `errorMessage`               | keep `error`                  |
| `inputStart/End` | reactnode                | reactnode                                 | reactnode                    | keep                          |
| `labelEnd`       | `suffix` + `infoHint`    | `labelSuffix` + `tooltipTrigger` + `link` | `infoHint` + placement props | unify to `labelEnd` reactnode |
| number           | separate `InputNumber`   | textfield + `numberFormat`                | separate `Numberfield`       | keep separate                 |
| password         | separate `InputPassword` | textfield + toggle                        | —                            | keep separate                 |

### checkbox

| prop            | ds                 | brand1                         | brand2                       | decision                      |
| --------------- | ------------------ | ------------------------------ | ---------------------------- | ----------------------------- |
| `onChange`      | `(checked, event)` | `(isSelected: boolean)`        | `(isSelected: boolean)`      | keep                          |
| `indeterminate` | yes                | —                              | —                            | keep                          |
| `value` (group) | string             | string                         | —                            | keep                          |
| `error`         | string             | `errorMessage`                 | `errorMessage`               | keep                          |
| `description`   | string             | string                         | string                       | keep                          |
| `labelEnd`      | —                  | `suffix` + `link` + `infoHint` | `infoHint` + placement props | unify to `labelEnd` reactnode |
| group           | `CheckboxGroup`    | `CheckboxGroup`                | —                            | keep                          |

### switch

| prop          | ds                 | brand1                  | brand2                  | decision |
| ------------- | ------------------ | ----------------------- | ----------------------- | -------- |
| `onChange`    | `(checked, event)` | `(isSelected: boolean)` | `(isSelected: boolean)` | keep     |
| `error`       | string             | —                       | —                       | keep     |
| `description` | string             | string                  | string                  | keep     |
| group         | `SwitchGroup`      | —                       | —                       | keep     |

### radiogroup

| prop          | ds                    | brand1                           | brand2                       | decision                      |
| ------------- | --------------------- | -------------------------------- | ---------------------------- | ----------------------------- |
| `onChange`    | `(value: string)`     | `(value: string)`                | `(value: string)`            | keep                          |
| `direction`   | vertical/horizontal   | —                                | vertical/horizontal          | keep                          |
| `error`       | string                | `errorMessage`                   | `errorMessage`               | keep                          |
| `description` | string                | —                                | string                       | keep                          |
| `labelEnd`    | `suffix` + `infoHint` | `labelSuffix` + `tooltipTrigger` | `infoHint` + placement props | unify to `labelEnd` reactnode |

### select

| prop       | ds                    | brand1                           | brand2                       | decision                      |
| ---------- | --------------------- | -------------------------------- | ---------------------------- | ----------------------------- |
| element    | native `<select>`     | custom popover                   | custom popover               | keep native                   |
| options    | array prop            | children (collection)            | children (generic `<T>`)     | keep array                    |
| `trigger`  | render prop           | `customTrigger` boolean          | —                            | keep render prop              |
| `onChange` | `(value, event)`      | `onSelectionChange(key)`         | `onSelectionChange(key)`     | keep                          |
| `labelEnd` | `suffix` + `infoHint` | `labelSuffix` + `tooltipTrigger` | `infoHint` + placement props | unify to `labelEnd` reactnode |

### accordion

| prop             | ds                         | brand1                | brand2                                     | decision                                          |
| ---------------- | -------------------------- | --------------------- | ------------------------------------------ | ------------------------------------------------- |
| element          | `<details>`                | custom div            | custom div                                 | keep native                                       |
| `variant`        | display/default            | —                     | —                                          | keep                                              |
| `title`          | string                     | reactnode             | reactnode                                  | change to reactnode                               |
| mode             | `AccordionGroup exclusive` | `AccordionGroup mode` | `AccordionGroup mode="single"\|"multiple"` | change `exclusive` to `mode="single"\|"multiple"` |
| `onChange`       | `onToggle(open)`           | —                     | `onOpenChange(isOpen)`                     | rename to `onChange`                              |
| `as`             | —                          | —                     | polymorphic                                | skip (native `<details>`)                         |
| `headerTemplate` | —                          | —                     | reactnode                                  | skip (use `title` as reactnode)                   |

### typography

| prop        | ds                    | brand1                                         | brand2                                   | decision |
| ----------- | --------------------- | ---------------------------------------------- | ---------------------------------------- | -------- |
| heading     | `Heading` (level 1-6) | `Heading` (display h1-h6 leadtext subheadline) | `Typography` (h1-h5)                     | keep     |
| text        | `Text` (sm/md/lg)     | `Text` (p/line × sizes)                        | `Typography` (text/text-line × sm/md/lg) | keep     |
| `as`        | polymorphic           | polymorphic                                    | polymorphic                              | keep     |
| `weight`    | 400/600               | 400/600                                        | 400/700                                  | keep     |
| `italic`    | —                     | boolean                                        | boolean                                  | add      |
| `underline` | —                     | boolean (line only)                            | boolean                                  | add      |
| `uppercase` | —                     | —                                              | boolean                                  | skip     |
