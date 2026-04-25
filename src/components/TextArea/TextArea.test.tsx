import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";
import { expectNoAxeViolations } from "../../test-utils.ts";
import { Textarea } from "./Textarea.tsx";

test("exports forwardRef component", () => {
  expect(Textarea.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a textarea", () => {
  render(<Textarea label="Bio" />);
  expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
});

test("renders label linked to textarea", () => {
  render(<Textarea label="Bio" />);
  expect(screen.getByLabelText("Bio")).toBeInTheDocument();
});

test("renders error with aria attributes", () => {
  render(<Textarea label="Bio" error="Too long" />);
  expect(screen.getByLabelText("Bio")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Too long")).toBeInTheDocument();
});

test("calls onChange with value", async () => {
  const handleChange = vi.fn();
  render(<Textarea label="Bio" onChange={handleChange} />);
  await userEvent.type(screen.getByLabelText("Bio"), "hello");
  expect(handleChange).toHaveBeenLastCalledWith("hello", expect.anything());
});

test("supports disabled and required", () => {
  render(<Textarea label="Bio" disabled required />);
  const textarea = screen.getByLabelText(/Bio/);
  expect(textarea).toBeDisabled();
  expect(textarea).toBeRequired();
});

test("forwards ref", () => {
  const ref = createRef<HTMLTextAreaElement>();
  render(<Textarea ref={ref} label="Bio" />);
  expect(ref.current?.tagName).toBe("TEXTAREA");
});

test("passes through native attributes", () => {
  render(<Textarea label="Bio" name="bio" placeholder="Tell us" rows={4} />);
  const textarea = screen.getByLabelText("Bio");
  expect(textarea).toHaveAttribute("name", "bio");
  expect(textarea).toHaveAttribute("placeholder", "Tell us");
});

test("has no accessibility violations", async () => {
  await expectNoAxeViolations(<Textarea label="Bio" />);
});

test("has no accessibility violations in error state", async () => {
  await expectNoAxeViolations(<Textarea label="Bio" error="Too long" />);
});
