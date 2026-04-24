// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Textarea } from "./Textarea.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("exports forwardRef component", () => {
  expect(Textarea.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a textarea", () => {
  const container = render(<Textarea />);
  const textarea = container.querySelector("textarea");
  expect(textarea).not.toBeNull();
});

test("renders label linked to textarea", () => {
  const container = render(<Textarea label="Bio" />);
  const label = container.querySelector("label");
  const textarea = container.querySelector("textarea");
  expect(label?.textContent).toBe("Bio");
  expect(label?.htmlFor).toBe(textarea?.id);
});

test("renders error with aria attributes", () => {
  const container = render(<Textarea error="Too long" />);
  const textarea = container.querySelector("textarea");
  const errorEl = container.querySelector("[aria-live=polite]");
  expect(errorEl?.textContent).toBe("Too long");
  expect(textarea?.getAttribute("aria-invalid")).toBe("true");
  expect(textarea?.getAttribute("aria-describedby")).toBe(errorEl?.id);
});

test("calls onChange with value", () => {
  const handleChange = vi.fn();
  const container = render(<Textarea onChange={handleChange} />);
  const textarea = container.querySelector("textarea")!;
  act(() => {
    const nativeInputEvent = new InputEvent("input", { bubbles: true });
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set?.call(
      textarea,
      "hello",
    );
    textarea.dispatchEvent(nativeInputEvent);
  });
  expect(handleChange).toHaveBeenCalledWith("hello", expect.anything());
});

test("supports disabled and required", () => {
  const container = render(<Textarea disabled required />);
  const textarea = container.querySelector("textarea")!;
  expect(textarea.disabled).toBe(true);
  expect(textarea.required).toBe(true);
});

test("forwards ref to textarea", () => {
  const ref = createRef<HTMLTextAreaElement>();
  const container = render(<Textarea ref={ref} />);
  const textarea = container.querySelector("textarea");
  expect(ref.current).toBe(textarea);
});

test("passes through native HTML attributes", () => {
  const container = render(<Textarea name="bio" placeholder="Tell us about yourself" rows={4} />);
  const textarea = container.querySelector("textarea")!;
  expect(textarea.name).toBe("bio");
  expect(textarea.placeholder).toBe("Tell us about yourself");
  expect(textarea.rows).toBe(4);
});
