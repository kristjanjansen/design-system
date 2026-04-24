// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Switch } from "./Switch.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("exports forwardRef component", () => {
  expect(Switch.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a switch input", () => {
  const container = render(<Switch />);
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
  expect(input?.type).toBe("checkbox");
  expect(input?.getAttribute("role")).toBe("switch");
});

test("renders label linked to input", () => {
  const container = render(<Switch label="Dark mode" />);
  const label = container.querySelector("label");
  const input = container.querySelector("input");
  expect(label?.textContent).toBe("Dark mode");
  expect(label?.htmlFor).toBe(input?.id);
});

test("calls onChange with checked state", () => {
  const handleChange = vi.fn();
  const container = render(<Switch onChange={handleChange} />);
  const input = container.querySelector("input")!;
  act(() => {
    input.click();
  });
  expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
});

test("supports disabled", () => {
  const container = render(<Switch disabled label="Locked" />);
  const input = container.querySelector("input")!;
  expect(input.disabled).toBe(true);
});

test("forwards ref to input", () => {
  const ref = createRef<HTMLInputElement>();
  render(<Switch ref={ref} />);
  expect(ref.current?.type).toBe("checkbox");
});

test("supports defaultChecked", () => {
  const container = render(<Switch defaultChecked />);
  const input = container.querySelector("input")!;
  expect(input.checked).toBe(true);
});
