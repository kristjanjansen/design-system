// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Input } from "./Input.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("exports forwardRef component", () => {
  expect(Input.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders an input", () => {
  const container = render(<Input />);
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
});

test("renders label linked to input", () => {
  const container = render(<Input label="Name" />);
  const label = container.querySelector("label");
  const input = container.querySelector("input");
  expect(label?.textContent).toBe("Name");
  expect(label?.htmlFor).toBe(input?.id);
});

test("renders error with aria attributes", () => {
  const container = render(<Input error="Required" />);
  const input = container.querySelector("input");
  const errorEl = container.querySelector("[aria-live=polite]");
  expect(errorEl?.textContent).toBe("Required");
  expect(input?.getAttribute("aria-invalid")).toBe("true");
  expect(input?.getAttribute("aria-describedby")).toBe(errorEl?.id);
});

test("calls onChange with value", () => {
  const handleChange = vi.fn();
  const container = render(<Input onChange={handleChange} />);
  const input = container.querySelector("input")!;
  act(() => {
    const event = new Event("input", { bubbles: true });
    Object.defineProperty(event, "target", { value: { value: "hello" } });
    input.dispatchEvent(event);
  });
  // Use native change event for React's onChange
  act(() => {
    const nativeInputEvent = new InputEvent("input", { bubbles: true });
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "hello");
    input.dispatchEvent(nativeInputEvent);
  });
  expect(handleChange).toHaveBeenCalledWith("hello", expect.anything());
});

test("supports disabled and required", () => {
  const container = render(<Input disabled required />);
  const input = container.querySelector("input")!;
  expect(input.disabled).toBe(true);
  expect(input.required).toBe(true);
});

test("forwards ref to input", () => {
  const ref = createRef<HTMLInputElement>();
  const container = render(<Input ref={ref} />);
  const input = container.querySelector("input");
  expect(ref.current).toBe(input);
});

test("passes through native HTML attributes", () => {
  const container = render(<Input name="email" placeholder="Enter email" aria-label="Email" />);
  const input = container.querySelector("input")!;
  expect(input.name).toBe("email");
  expect(input.placeholder).toBe("Enter email");
  expect(input.getAttribute("aria-label")).toBe("Email");
});
