# plan: next components

## status: pending

## components to add

| component    | brand1                 | brand2    | approach                                              |
| ------------ | ---------------------- | --------- | ----------------------------------------------------- |
| tooltip      | `Tooltip` (react-aria) | `Tooltip` | popover api, wraps any element, hover + focus trigger |
| popover      | yes                    | yes       | popover api, foundation for tooltip/dropdown/combobox |
| dialog/modal | yes                    | yes       | native `<dialog>` element                             |
| badge        | —                      | yes       | simple presentational component                       |
| tabs         | yes                    | yes       | tbd                                                   |

## order

1. **popover** — foundation for tooltip and dropdown
2. **tooltip** — needs popover. used by infohint on labels
3. **dialog** — native `<dialog>`, independent
4. **badge** — simple, independent
5. **tabs** — independent

## api reference from brand1/brand2

### tooltip

| prop      | brand1                              | brand2            |
| --------- | ----------------------------------- | ----------------- |
| component | `Tooltip` (react-aria `useTooltip`) | `Tooltip`         |
| usage     | wraps any element                   | wraps any element |
| trigger   | hover + focus                       | hover + focus     |

### popover

| prop        | brand1                          | brand2    |
| ----------- | ------------------------------- | --------- |
| component   | `Popover` (react-aria)          | `Popover` |
| positioning | react-aria `useOverlayPosition` | same      |
| trigger     | click or programmatic           | same      |

### dialog

| prop         | brand1               | brand2                   |
| ------------ | -------------------- | ------------------------ |
| component    | `Modal` / `ModalNew` | `Dialog` / `ModalDialog` |
| element      | div + portal         | div + portal             |
| our approach | native `<dialog>`    | —                        |

### badge

| prop   | brand2                                |
| ------ | ------------------------------------- |
| `type` | neutral success warning alert special |
| `size` | responsive large condensed            |

### tabs

| prop       | brand1 | brand2                      |
| ---------- | ------ | --------------------------- |
| component  | `Tabs` | `Tabs` + `Tab` + `TabPanel` |
| scrollable | —      | yes (scroll buttons)        |
