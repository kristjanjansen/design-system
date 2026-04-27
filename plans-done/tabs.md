# plan: tabs

## status: done

## overview

compound component: `Tabs` + `Tab` + `TabPanel`. keyboard navigation, controlled/uncontrolled selection. no react-aria.

## how EDS/ELS do it

- EDS: context-based compound, `activeTabId` controlled, ArrowLeft/Right keyboard nav, `useIntersectionObserver` for auto-scroll active tab into view
- ELS: react-aria `useTabList`/`useTab` hooks, custom `useHorizontalScrollState` with scroll buttons, framer motion

our approach: native keyboard handling, optional scroll, no deps.

### brand differences

| aspect           | EDS (brand1)                         | ELV (brand2)                             |
| ---------------- | ------------------------------------ | ---------------------------------------- |
| active indicator | bottom border 2px                    | full border box 2px, top corners rounded |
| indicator color  | green accent                         | blue primary                             |
| tab list border  | inset bottom shadow 2px              | none                                     |
| padding          | 12px/4px (mobile), 16px/4px (laptop) | 12px/20px fixed                          |
| label weight     | 600 always                           | 400 default, 700 selected                |
| description      | yes, 12px/14px responsive            | not used                                 |
| focus            | 3-sided inset ring                   | custom shadow                            |

### component vars needed

```css
/* variables.css defaults (brand1) */
--ds-tab-indicator: border-bottom; /* "border-bottom" or "border-all" */
--ds-tab-active-color: var(--ds-color-fg-accent);
--ds-tab-font-weight: 600;
--ds-tab-active-font-weight: 600;
--ds-tab-border-radius: 0;

/* brand2 overrides */
--ds-tab-active-color: var(--ds-color-bg-accent);
--ds-tab-font-weight: 400;
--ds-tab-active-font-weight: 700;
--ds-tab-border-radius: var(--ds-radius-small);
```

note: brand2 uses full border box on active tab (top+left+right+bottom) vs brand1 bottom-only underline. implement via CSS class variant or component var.

## API

```tsx
interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string; // controlled
  defaultValue?: string; // uncontrolled
  onChange?: (value: string) => void;
  activateOnFocus?: boolean; // default: true — auto-activate on arrow key focus
}

interface TabProps {
  value: string; // unique ID
  children: ReactNode; // tab label
  description?: ReactNode; // secondary text below label
  disabled?: boolean;
}

interface TabPanelProps {
  value: string; // matches Tab value
  children: ReactNode;
}
```

### usage

```tsx
// uncontrolled
<Tabs defaultValue="general">
  <Tab value="general">General</Tab>
  <Tab value="security">Security</Tab>
  <Tab value="billing">Billing</Tab>

  <TabPanel value="general">General settings...</TabPanel>
  <TabPanel value="security">Security settings...</TabPanel>
  <TabPanel value="billing">Billing settings...</TabPanel>
</Tabs>;

// controlled
const [tab, setTab] = useState("general");

<Tabs value={tab} onChange={setTab}>
  <Tab value="general">General</Tab>
  <Tab value="security">Security</Tab>
  <TabPanel value="general">...</TabPanel>
  <TabPanel value="security">...</TabPanel>
</Tabs>;
```

## implementation

### context

```tsx
interface TabsContextValue {
  activeValue: string;
  setActiveValue: (value: string) => void;
  tabsId: string;
}
```

### Tabs (container)

```tsx
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, defaultValue, onChange, children, className, ...rest },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const activeValue = value ?? internal;
  const tabsId = useId();

  const setActiveValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  // separate Tab children (for tab list) from TabPanel children
  const tabs: ReactElement[] = [];
  const panels: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === Tab) tabs.push(child);
      else if (child.type === TabPanel) panels.push(child);
    }
  });

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue, tabsId }}>
      <div ref={ref} className={["ds-tabs", className].filter(Boolean).join(" ")} {...rest}>
        <div role="tablist" className="ds-tabs-list" onKeyDown={handleKeyDown}>
          {tabs}
        </div>
        {panels}
      </div>
    </TabsContext.Provider>
  );
});
```

### keyboard navigation

```tsx
function handleKeyDown(e: KeyboardEvent) {
  const tabs = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])')];
  const current = tabs.indexOf(e.target as HTMLElement);
  let next = -1;

  if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
  if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
  if (e.key === "Home") next = 0;
  if (e.key === "End") next = tabs.length - 1;

  if (next >= 0) {
    e.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  }
}
```

### Tab

```tsx
function Tab({ value, children, description, disabled }: TabProps) {
  const { activeValue, setActiveValue, tabsId } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      type="button"
      id={`${tabsId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${tabsId}-panel-${value}`}
      aria-disabled={disabled || undefined}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={["ds-tab", isActive && "ds-tab--active"].filter(Boolean).join(" ")}
      onClick={() => setActiveValue(value)}
    >
      <span className="ds-tab-label">{children}</span>
      {description && <span className="ds-tab-description">{description}</span>}
    </button>
  );
}
```

### TabPanel

```tsx
function TabPanel({ value, children }: TabPanelProps) {
  const { activeValue, tabsId } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${tabsId}-panel-${value}`}
      aria-labelledby={`${tabsId}-tab-${value}`}
      className="ds-tab-panel"
    >
      {children}
    </div>
  );
}
```

## CSS

```css
@layer ds {
  @scope (.ds-tabs) {
    .ds-tabs-list {
      display: flex;
      gap: 0;
      border-bottom: var(--ds-border-width) solid var(--ds-color-border);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .ds-tabs-list::-webkit-scrollbar {
      display: none;
    }

    .ds-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      position: relative;
      padding: var(--ds-spacing-10) var(--ds-spacing-14);
      font-family: inherit;
      font-size: var(--ds-font-size-body);
      font-weight: var(--ds-tab-font-weight);
      color: var(--ds-color-fg-muted);
      background: none;
      border: var(--ds-border-width) solid transparent;
      border-bottom: none;
      border-radius: var(--ds-tab-border-radius) var(--ds-tab-border-radius) 0 0;
      cursor: pointer;
      white-space: nowrap;
      transition: color var(--ds-duration-100) var(--ds-easing-out);
    }

    .ds-tab:hover:not(:disabled) {
      color: var(--ds-color-fg);
    }

    .ds-tab--active {
      color: var(--ds-tab-active-color);
      font-weight: var(--ds-tab-active-font-weight);
      border-bottom-color: var(--ds-tab-active-color);
    }

    /* brand1: bottom underline indicator */
    .ds-tab--active::after {
      content: "";
      position: absolute;
      bottom: calc(-1 * var(--ds-border-width));
      left: 0;
      right: 0;
      height: var(--ds-border-width);
      background: var(--ds-tab-active-color);
    }

    /* brand2: full border box on active tab */
    .ds-tab--active[style*="--ds-tab-border-radius"] {
      /* overridden by component var — when border-radius is set, use full border */
    }

    .ds-tab-description {
      font-size: var(--ds-font-size-tiny);
      font-weight: 400;
      color: inherit;
      opacity: 0.7;
    }

    .ds-tab:focus-visible {
      outline: var(--ds-outline-width) solid var(--ds-color-outline);
      outline-offset: calc(-1 * var(--ds-outline-width));
    }

    .ds-tab:disabled {
      color: var(--ds-color-fg-muted);
      opacity: 0.5;
      cursor: default;
    }

    .ds-tab-panel {
      padding: var(--ds-spacing-20) 0;
    }

    @media (forced-colors: active) {
      .ds-tab--active::after {
        background: SelectedItem;
      }
      .ds-tab--active {
        color: SelectedItem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ds-tab {
        transition: none;
      }
    }
  }
}
```

## accessibility

### ARIA roles + attributes

- `role="tablist"` on tab list container
- `role="tab"` on each tab button
- `role="tabpanel"` on each panel
- `aria-selected="true"` on active tab, `"false"` on others
- `aria-controls` on tab → points to panel id
- `aria-labelledby` on panel → points to tab id
- `aria-disabled="true"` on disabled tabs (in addition to `disabled` attribute)

### keyboard navigation

- **ArrowRight** — focus next tab (circular: last → first)
- **ArrowLeft** — focus previous tab (circular: first → last)
- **Home** — focus first tab
- **End** — focus last tab
- **Tab key** — moves focus out of tablist (roving tabindex: only active tab is in tab order)
- disabled tabs skipped during arrow navigation

### activation mode

`activateOnFocus` prop (default: `true`):

- `true` — tab activates immediately when focused via arrow keys (WAI-ARIA "automatic activation"). simpler UX, recommended for most cases.
- `false` — focus moves but tab doesn't activate until Enter/Space pressed (WAI-ARIA "manual activation"). useful when tab switch triggers expensive operations (data fetching).

```tsx
// auto-activate (default) — arrow key switches tab immediately
<Tabs defaultValue="general">

// manual activation — arrow keys move focus, Enter/Space activates
<Tabs defaultValue="general" activateOnFocus={false}>
```

### description accessibility

`description` prop renders as visible text inside the tab button — screen readers announce both label and description naturally as part of the button content. no `aria-describedby` needed.

### reduced motion

tab indicator has no animation (CSS `::after` pseudo-element repositions instantly). `prefers-reduced-motion` disables color transition only.

## files

| file                                 | purpose               |
| ------------------------------------ | --------------------- |
| `src/components/Tabs/Tabs.tsx`       | container + context   |
| `src/components/Tabs/Tab.tsx`        | individual tab button |
| `src/components/Tabs/TabPanel.tsx`   | panel content         |
| `src/components/Tabs/TabsContext.ts` | context definition    |
| `src/components/Tabs/Tabs.css`       | styles                |
| `src/components/Tabs/Tabs.test.tsx`  | tests                 |
