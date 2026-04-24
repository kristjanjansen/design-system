// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { InputPassword } from "./InputPassword.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("exports forwardRef component", () => {
  expect(InputPassword.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders password input by default", () => {
  const container = render(<InputPassword />);
  const input = container.querySelector("input")!;
  expect(input.type).toBe("password");
});

test("toggle switches type between password and text", () => {
  const container = render(<InputPassword />);
  const input = container.querySelector("input")!;
  const toggle = container.querySelector("button")!;

  expect(input.type).toBe("password");
  act(() => {
    toggle.click();
  });
  expect(input.type).toBe("text");
  act(() => {
    toggle.click();
  });
  expect(input.type).toBe("password");
});

test("toggle has aria-pressed", () => {
  const container = render(<InputPassword />);
  const toggle = container.querySelector("button")!;

  expect(toggle.getAttribute("aria-pressed")).toBe("false");
  act(() => {
    toggle.click();
  });
  expect(toggle.getAttribute("aria-pressed")).toBe("true");
});

test("toggle has aria-label from toggleLabel prop", () => {
  const container = render(<InputPassword toggleLabel="Show password" />);
  const toggle = container.querySelector("button")!;
  expect(toggle.getAttribute("aria-label")).toBe("Show password");
});

test("toggle has default aria-label", () => {
  const container = render(<InputPassword />);
  const toggle = container.querySelector("button")!;
  expect(toggle.getAttribute("aria-label")).toBe("Toggle password visibility");
});

test("renders label linked to input", () => {
  const container = render(<InputPassword label="Password" />);
  const label = container.querySelector("label");
  const input = container.querySelector("input");
  expect(label?.textContent).toContain("Password");
  expect(label?.htmlFor).toBe(input?.id);
});

test("renders error with aria attributes", () => {
  const container = render(<InputPassword error="Too short" />);
  const input = container.querySelector("input");
  const errorEl = container.querySelector("[aria-live=polite]");
  expect(errorEl?.textContent).toBe("Too short");
  expect(input?.getAttribute("aria-invalid")).toBe("true");
});

test("supports disabled", () => {
  const container = render(<InputPassword disabled />);
  const input = container.querySelector("input")!;
  const toggle = container.querySelector("button")!;
  expect(input.disabled).toBe(true);
  expect(toggle.disabled).toBe(true);
});

test("supports required", () => {
  const container = render(<InputPassword required />);
  const input = container.querySelector("input")!;
  expect(input.required).toBe(true);
  expect(input.getAttribute("aria-required")).toBe("true");
});

test("calls onChange with value", () => {
  const handleChange = vi.fn();
  const container = render(<InputPassword onChange={handleChange} />);
  const input = container.querySelector("input")!;
  act(() => {
    const nativeInputEvent = new InputEvent("input", { bubbles: true });
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
      input,
      "secret",
    );
    input.dispatchEvent(nativeInputEvent);
  });
  expect(handleChange).toHaveBeenCalledWith("secret", expect.anything());
});

test("forwards ref to input", () => {
  const ref = createRef<HTMLInputElement>();
  render(<InputPassword ref={ref} />);
  expect(ref.current?.type).toBe("password");
});
