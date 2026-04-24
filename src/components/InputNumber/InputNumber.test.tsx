// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { InputNumber } from "./InputNumber.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("exports forwardRef component", () => {
  expect(InputNumber.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders text input with inputMode decimal", () => {
  const container = render(<InputNumber />);
  const input = container.querySelector("input")!;
  expect(input.type).toBe("text");
  expect(input.inputMode).toBe("decimal");
});

test("renders with role spinbutton", () => {
  const container = render(<InputNumber />);
  const input = container.querySelector("input")!;
  expect(input.getAttribute("role")).toBe("spinbutton");
});

test("formats with Intl.NumberFormat on blur", () => {
  const container = render(
    <InputNumber
      defaultValue={1050.1}
      locale="en-US"
      formatOptions={{ minimumFractionDigits: 2 }}
    />,
  );
  const input = container.querySelector("input")!;
  expect(input.value).toBe("1,050.10");
});

test("shows raw value on focus", () => {
  const container = render(<InputNumber defaultValue={1050} />);
  const input = container.querySelector("input")!;
  act(() => {
    input.focus();
  });
  expect(input.value).toBe("1050");
});

test("onChange returns number", () => {
  const handleChange = vi.fn();
  const container = render(<InputNumber onChange={handleChange} />);
  const input = container.querySelector("input")!;

  act(() => {
    input.focus();
  });
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "42");
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  act(() => {
    input.blur();
  });

  expect(handleChange).toHaveBeenCalledWith(42);
});

test("onChange returns undefined for empty", () => {
  const handleChange = vi.fn();
  const container = render(<InputNumber defaultValue={10} onChange={handleChange} />);
  const input = container.querySelector("input")!;

  act(() => {
    input.focus();
  });
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "");
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  act(() => {
    input.blur();
  });

  expect(handleChange).toHaveBeenCalledWith(undefined);
});

test("clamps to min on blur", () => {
  const handleChange = vi.fn();
  const container = render(<InputNumber min={10} onChange={handleChange} />);
  const input = container.querySelector("input")!;

  act(() => {
    input.focus();
  });
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "5");
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  act(() => {
    input.blur();
  });

  expect(handleChange).toHaveBeenCalledWith(10);
});

test("clamps to max on blur", () => {
  const handleChange = vi.fn();
  const container = render(<InputNumber max={100} onChange={handleChange} />);
  const input = container.querySelector("input")!;

  act(() => {
    input.focus();
  });
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "200");
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  act(() => {
    input.blur();
  });

  expect(handleChange).toHaveBeenCalledWith(100);
});

test("arrow up increments by step", () => {
  const handleChange = vi.fn();
  const container = render(<InputNumber defaultValue={10} step={5} onChange={handleChange} />);
  const input = container.querySelector("input")!;

  act(() => {
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
  });

  expect(handleChange).toHaveBeenCalledWith(15);
});

test("arrow down decrements by step", () => {
  const handleChange = vi.fn();
  const container = render(<InputNumber defaultValue={10} step={5} onChange={handleChange} />);
  const input = container.querySelector("input")!;

  act(() => {
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  });

  expect(handleChange).toHaveBeenCalledWith(5);
});

test("renders label", () => {
  const container = render(<InputNumber label="Amount" />);
  const label = container.querySelector("label");
  expect(label?.textContent).toContain("Amount");
});

test("renders inputStart and inputEnd", () => {
  const container = render(<InputNumber inputStart="€" inputEnd="EUR" />);
  const start = container.querySelector(".input-start");
  const end = container.querySelector(".input-end");
  expect(start?.textContent).toBe("€");
  expect(end?.textContent).toBe("EUR");
});

test("supports disabled", () => {
  const container = render(<InputNumber disabled />);
  const input = container.querySelector("input")!;
  expect(input.disabled).toBe(true);
});

test("forwards ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<InputNumber ref={ref} />);
  expect(ref.current?.type).toBe("text");
});

test("sets aria-valuemin and aria-valuemax", () => {
  const container = render(<InputNumber min={0} max={100} defaultValue={50} />);
  const input = container.querySelector("input")!;
  expect(input.getAttribute("aria-valuemin")).toBe("0");
  expect(input.getAttribute("aria-valuemax")).toBe("100");
  expect(input.getAttribute("aria-valuenow")).toBe("50");
});
