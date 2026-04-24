// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Checkbox } from "./Checkbox.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("exports forwardRef component", () => {
  expect(Checkbox.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a checkbox input", () => {
  const container = render(<Checkbox />);
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
  expect(input?.type).toBe("checkbox");
});

test("renders label linked to input", () => {
  const container = render(<Checkbox label="Accept terms" />);
  const label = container.querySelector("label");
  const input = container.querySelector("input");
  expect(label?.htmlFor).toBe(input?.id);
  expect(label?.textContent).toContain("Accept terms");
});

test("calls onChange with checked state", () => {
  const handleChange = vi.fn();
  const container = render(<Checkbox onChange={handleChange} />);
  const input = container.querySelector("input")!;
  act(() => {
    input.click();
  });
  expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
});

test("renders error with aria attributes", () => {
  const container = render(<Checkbox error="Required" />);
  const input = container.querySelector("input");
  const errorEl = container.querySelector("[aria-live=polite]");
  expect(errorEl?.textContent).toBe("Required");
  expect(input?.getAttribute("aria-invalid")).toBe("true");
  expect(input?.getAttribute("aria-describedby")).toBe(errorEl?.id);
});

test("renders description", () => {
  const container = render(<Checkbox description="Optional" />);
  const desc = container.querySelector(".ds-field-messages-description");
  expect(desc?.textContent).toBe("Optional");
});

test("supports disabled", () => {
  const container = render(<Checkbox disabled label="Locked" />);
  const input = container.querySelector("input")!;
  expect(input.disabled).toBe(true);
});

test("supports indeterminate", () => {
  const container = render(<Checkbox indeterminate />);
  const input = container.querySelector("input")!;
  expect(input.indeterminate).toBe(true);
});

test("forwards ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<Checkbox ref={ref} />);
  expect(ref.current?.type).toBe("checkbox");
});

test("supports defaultChecked", () => {
  const container = render(<Checkbox defaultChecked />);
  const input = container.querySelector("input")!;
  expect(input.checked).toBe(true);
});
