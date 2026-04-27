# plan: modal + dialog

## status: pending

## overview

native `<dialog>` element. no portals, no react-aria, no div+backdrop hacks. built-in focus trap, escape handling, backdrop, top-layer rendering.

## how EDS/ELS do it

both use div + react-aria `useModalOverlay` + portals to `document.body` + react-transition-group or framer-motion for animations. EDS has IntersectionObserver scroll indicators, compound header/body/footer. heavy.

our approach: native `<dialog>` — gets focus trap, escape, backdrop, top-layer for free.

## API

```tsx
interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "onClose"> {
  open: boolean;
  onClose: () => void;
  size?: "default" | "small" | "large" | "full";
  children: ReactNode;
}

// compound sub-components
interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void; // renders close button
  className?: string;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}
```

### usage

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>

<Modal open={open} onClose={() => setOpen(false)}>
  <ModalHeader onClose={() => setOpen(false)}>
    Confirm deletion
  </ModalHeader>
  <ModalBody>
    Are you sure you want to delete this item?
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </ModalFooter>
</Modal>
```

## implementation

```tsx
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  { open, onClose, size = "default", children, className, ...rest },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resolvedRef = (ref as RefObject<HTMLDialogElement>) ?? dialogRef;

  useEffect(() => {
    const el = resolvedRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={resolvedRef}
      className={[`ds-modal ds-modal--${size}`, className].filter(Boolean).join(" ")}
      onClose={onClose}
      {...rest}
    >
      {children}
    </dialog>
  );
});
```

### ModalHeader

```tsx
function ModalHeader({ children, onClose, className }: ModalHeaderProps) {
  return (
    <div className={["ds-modal-header", className].filter(Boolean).join(" ")}>
      <Heading level={3} as="h2">
        {children}
      </Heading>
      {onClose && (
        <button type="button" className="ds-modal-close" onClick={onClose} aria-label="Close">
          <IconCloseSm />
        </button>
      )}
    </div>
  );
}
```

## CSS

```css
@layer ds {
  .ds-modal {
    border: none;
    border-radius: var(--ds-radius);
    padding: 0;
    max-height: calc(100vh - var(--ds-spacing-28) * 2);
    max-height: calc(100dvh - var(--ds-spacing-28) * 2);
    display: flex;
    flex-direction: column;
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    box-shadow: 0 8px 32px oklch(0 0 0 / 0.15);
  }

  /* sizes */
  .ds-modal--small {
    width: min(24rem, calc(100vw - 2rem));
  }
  .ds-modal--default {
    width: min(32rem, calc(100vw - 2rem));
  }
  .ds-modal--large {
    width: min(48rem, calc(100vw - 2rem));
  }
  .ds-modal--full {
    width: calc(100vw - 2rem);
    height: calc(100dvh - 2rem);
  }

  /* mobile: full-width bottom sheet */
  @media (max-width: 30rem) {
    .ds-modal:not(.ds-modal--small) {
      width: 100%;
      max-height: 85dvh;
      border-radius: var(--ds-radius) var(--ds-radius) 0 0;
      margin-bottom: 0;
    }
  }

  /* backdrop */
  .ds-modal::backdrop {
    background: oklch(0 0 0 / 0.5);
  }

  /* animations */
  .ds-modal[open] {
    opacity: 1;
    transform: translateY(0);
  }

  @starting-style {
    .ds-modal[open] {
      opacity: 0;
      transform: translateY(1rem);
    }
  }

  .ds-modal {
    transition:
      opacity var(--ds-duration-200) var(--ds-easing-out),
      transform var(--ds-duration-200) var(--ds-easing-out),
      display var(--ds-duration-200) var(--ds-easing-out) allow-discrete,
      overlay var(--ds-duration-200) var(--ds-easing-out) allow-discrete;
    opacity: 0;
  }

  .ds-modal::backdrop {
    transition:
      background var(--ds-duration-200) var(--ds-easing-out),
      display var(--ds-duration-200) var(--ds-easing-out) allow-discrete,
      overlay var(--ds-duration-200) var(--ds-easing-out) allow-discrete;
    background: oklch(0 0 0 / 0);
  }

  @starting-style {
    .ds-modal[open]::backdrop {
      background: oklch(0 0 0 / 0);
    }
  }

  /* compound layout */
  .ds-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ds-spacing-20) var(--ds-spacing-24);
    border-bottom: 1px solid var(--ds-color-border);
  }

  .ds-modal-body {
    padding: var(--ds-spacing-20) var(--ds-spacing-24);
    overflow-y: auto;
    flex: 1;
  }

  .ds-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-spacing-10);
    padding: var(--ds-spacing-14) var(--ds-spacing-24);
    border-top: 1px solid var(--ds-color-border);
  }

  .ds-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--ds-color-muted);
    padding: var(--ds-spacing-8);
    border-radius: var(--ds-radius);
  }

  .ds-modal-close:hover {
    color: var(--ds-color-fg);
  }

  .ds-modal-close:focus-visible {
    outline: var(--ds-outline-width) solid var(--ds-color-outline);
    outline-offset: var(--ds-outline-offset);
  }

  @media (forced-colors: active) {
    .ds-modal {
      border: 2px solid CanvasText;
    }
    .ds-modal::backdrop {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ds-modal,
    .ds-modal::backdrop {
      transition: none;
    }
  }
}
```

## accessibility

- native `<dialog>` with `showModal()` — built-in focus trap + escape + inert background
- `aria-labelledby` auto-linked to ModalHeader heading
- close button has `aria-label="Close"`
- backdrop click calls `onClose`
- `forced-colors` border for high contrast
- focus returns to trigger element on close (native behavior)

## icons needed

- `IconCloseSm` (24px) — close button in header. check EDS library for `global/close` or `global/x`.

## files

| file                                   | purpose                         |
| -------------------------------------- | ------------------------------- |
| `src/components/Modal/Modal.tsx`       | dialog wrapper + showModal sync |
| `src/components/Modal/ModalHeader.tsx` | header with title + close       |
| `src/components/Modal/ModalBody.tsx`   | scrollable body                 |
| `src/components/Modal/ModalFooter.tsx` | footer with actions             |
| `src/components/Modal/Modal.css`       | all styles                      |
| `src/components/Modal/Modal.test.tsx`  | tests                           |
