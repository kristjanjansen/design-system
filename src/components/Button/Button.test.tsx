// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Button } from "./Button.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("exports forwardRef component", () => {
  expect(Button.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a button with default variant and size", () => {
  const container = render(<Button>Click</Button>);
  const button = container.querySelector("button")!;
  expect(button.textContent).toBe("Click");
  expect(button.classList.contains("ds-button--primary")).toBe(true);
  expect(button.classList.contains("ds-button--default")).toBe(true);
});

test("renders secondary variant", () => {
  const container = render(<Button variant="secondary">Save</Button>);
  const button = container.querySelector("button")!;
  expect(button.classList.contains("ds-button--secondary")).toBe(true);
});

test("renders tertiary variant", () => {
  const container = render(<Button variant="tertiary">Cancel</Button>);
  const button = container.querySelector("button")!;
  expect(button.classList.contains("ds-button--tertiary")).toBe(true);
});

test("renders small size", () => {
  const container = render(<Button size="small">Small</Button>);
  const button = container.querySelector("button")!;
  expect(button.classList.contains("ds-button--small")).toBe(true);
});

test("supports disabled", () => {
  const container = render(<Button disabled>Disabled</Button>);
  const button = container.querySelector("button")!;
  expect(button.disabled).toBe(true);
});

test("calls onClick", () => {
  const handleClick = vi.fn();
  const container = render(<Button onClick={handleClick}>Click</Button>);
  const button = container.querySelector("button")!;
  act(() => {
    button.click();
  });
  expect(handleClick).toHaveBeenCalledOnce();
});

test("forwards ref", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<Button ref={ref}>Ref</Button>);
  expect(ref.current?.tagName).toBe("BUTTON");
});

test("passes through className", () => {
  const container = render(<Button className="custom">Test</Button>);
  const button = container.querySelector("button")!;
  expect(button.classList.contains("custom")).toBe(true);
  expect(button.classList.contains("ds-button")).toBe(true);
});

test("passes through native attributes", () => {
  const container = render(
    <Button type="submit" aria-label="Submit form">
      Go
    </Button>,
  );
  const button = container.querySelector("button")!;
  expect(button.type).toBe("submit");
  expect(button.getAttribute("aria-label")).toBe("Submit form");
});
