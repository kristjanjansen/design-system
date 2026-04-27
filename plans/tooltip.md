# plan: tooltip + popover

## status: pending

## overview

popover is the foundation. tooltip wraps it with hover/focus trigger semantics. both use the native Popover API — no react-aria, no portals.

## how EDS/ELS do it

both use react-aria (`useOverlayPosition`, `useTooltipTrigger`, `usePopover`) + react-transition-group or framer-motion + portals to `document.body`. heavy deps.

our approach: native Popover API + CSS anchor positioning. zero deps.

## popover (internal primitive)

not exported — used internally by Tooltip (and later Dropdown, Combobox).

### implementation

```tsx
// src/components/internal/Popover.tsx
interface PopoverProps {
  trigger: RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
  children: ReactNode;
}
```

- renders a `<div popover>` with `anchor` CSS pointing to trigger ref
- positioning via CSS anchor positioning (`position-anchor`, `inset-area`)
- fallback: `position-try-fallbacks` for auto-flip when clipped
- `popover="manual"` for tooltip (no light-dismiss), `popover="auto"` for dropdown (light-dismiss)
- toggle via `showPopover()` / `hidePopover()` imperatively

### CSS anchor positioning

```css
.ds-popover {
  position: fixed;
  position-anchor: --ds-popover-anchor;
  inset: unset;
  margin: 0;
  border: var(--ds-border-width) solid var(--ds-color-border);
  border-radius: var(--ds-radius);
  background: var(--ds-color-bg);
  padding: var(--ds-spacing-8) var(--ds-spacing-14);
  box-shadow: 0 4px 12px oklch(0 0 0 / 0.1);
}

/* placement */
.ds-popover--top {
  bottom: anchor(top);
  left: anchor(center);
  translate: -50% calc(-1 * var(--ds-popover-offset, 8px));
}

.ds-popover--bottom {
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% var(--ds-popover-offset, 8px);
}

/* auto-flip fallback */
.ds-popover--top {
  position-try-fallbacks: --ds-popover-bottom;
}

@position-try --ds-popover-bottom {
  top: anchor(bottom);
  bottom: unset;
  translate: -50% var(--ds-popover-offset, 8px);
}
```

### browser support

CSS anchor positioning: Chrome 125+, Edge 125+. no Firefox/Safari yet.

fallback strategies:

- **CSS anchor positioning polyfill** — [github.com/nicolo-ribaudo/css-anchor-positioning-polyfill](https://github.com/nicolo-ribaudo/css-anchor-positioning-polyfill) or [@oddbird/css-anchor-positioning](https://github.com/nicolo-ribaudo/css-anchor-positioning-polyfill). adds ~5kb, covers Firefox/Safari.
- **JS positioning fallback** — detect `@supports (anchor-name: --x)`, fall back to `getBoundingClientRect()` positioning in useEffect. no deps but more code.
- **floating-ui** — proven library (successor to popper.js), ~3kb. does what anchor positioning does but in JS. could use as fallback or primary until anchor positioning has wider support.
- **fixed position centered** — simplest: `@supports not (anchor-name: --x)` shows tooltip above trigger without smart positioning. acceptable since tooltip content is supplementary.
- **wait** — ship tooltip later when Firefox/Safari support anchor positioning. use `title` attribute as interim.

## tooltip (exported)

### API

```tsx
interface TooltipProps {
  content: ReactNode;
  placement?: "top" | "bottom" | "left" | "right"; // default: "top"
  delay?: number;          // default: 300ms
  children: ReactElement;  // single child, receives trigger props
}

// usage
<Tooltip content="Save changes">
  <Button>Save</Button>
</Tooltip>

<Tooltip content="More info about this field" placement="right">
  <InfoIcon />
</Tooltip>
```

### behavior

- hover trigger: show after `delay` ms, hide on mouse leave
- focus trigger: show immediately on focus, hide on blur
- escape key: dismiss tooltip
- `popover="manual"` — no light-dismiss (stays while hovering)
- `role="tooltip"` + `aria-describedby` linking trigger to tooltip content
- single tooltip visible at a time (hide others when new one opens)

### implementation

```tsx
export function Tooltip({ content, placement = "top", delay = 300, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipId = useId();
  const timeoutRef = useRef<number>();

  // clone child to attach ref + event handlers + aria-describedby
  const trigger = cloneElement(children, {
    ref: triggerRef,
    "aria-describedby": open ? tooltipId : undefined,
    onMouseEnter: () => {
      timeoutRef.current = window.setTimeout(() => setOpen(true), delay);
    },
    onMouseLeave: () => {
      clearTimeout(timeoutRef.current);
      setOpen(false);
    },
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  });

  return (
    <>
      {trigger}
      <Popover
        trigger={triggerRef}
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
      >
        <div role="tooltip" id={tooltipId}>
          {content}
        </div>
      </Popover>
    </>
  );
}
```

### CSS

```css
@layer ds {
  .ds-tooltip {
    font-size: var(--ds-font-size-small);
    line-height: var(--ds-line-height-small);
    color: oklch(1 0 0);
    background: var(--ds-color-fg);
    padding: var(--ds-spacing-8) var(--ds-spacing-10);
    border-radius: var(--ds-radius);
    max-width: 20rem;
    pointer-events: none;
  }

  /* entrance animation */
  .ds-tooltip:popover-open {
    opacity: 1;
    transform: scale(1);
  }

  @starting-style {
    .ds-tooltip:popover-open {
      opacity: 0;
      transform: scale(0.96);
    }
  }

  .ds-tooltip {
    transition:
      opacity var(--ds-duration-100) var(--ds-easing-out),
      transform var(--ds-duration-100) var(--ds-easing-out),
      display var(--ds-duration-100) var(--ds-easing-out) allow-discrete;
    opacity: 0;
  }
}
```

## accessibility

- `role="tooltip"` on tooltip content
- `aria-describedby` on trigger element pointing to tooltip id
- escape key dismisses tooltip
- tooltip content is supplementary — never put interactive content in tooltips
- `prefers-reduced-motion`: disable transform animation, keep opacity

## files

| file                                      | purpose                              |
| ----------------------------------------- | ------------------------------------ |
| `src/components/internal/Popover.tsx`     | positioning primitive (not exported) |
| `src/components/internal/Popover.css`     | anchor positioning styles            |
| `src/components/Tooltip/Tooltip.tsx`      | tooltip component                    |
| `src/components/Tooltip/Tooltip.css`      | tooltip styles                       |
| `src/components/Tooltip/Tooltip.test.tsx` | tests                                |

## dependencies on this

- icon buttons need tooltip for accessible label (icons plan)
- field `infoHint` prop will use tooltip
- dropdown/combobox will use popover
