import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";
import { Checkbox } from "./Checkbox.tsx";

test("exports forwardRef component", () => {
  expect(Checkbox.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a checkbox", () => {
  render(<Checkbox label="Accept" />);
  expect(screen.getByRole("checkbox")).toBeInTheDocument();
});

test("renders label linked to input", () => {
  render(<Checkbox label="Accept terms" />);
  expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
});

test("calls onChange with checked state", async () => {
  const handleChange = vi.fn();
  render(<Checkbox label="Accept" onChange={handleChange} />);
  await userEvent.click(screen.getByRole("checkbox"));
  expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
});

test("renders error with aria attributes", () => {
  render(<Checkbox label="Accept" error="Required" />);
  expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("renders description", () => {
  render(<Checkbox label="Accept" description="Optional" />);
  expect(screen.getByText("Optional")).toBeInTheDocument();
});

test("supports disabled", () => {
  render(<Checkbox label="Accept" disabled />);
  expect(screen.getByRole("checkbox")).toBeDisabled();
});

test("supports indeterminate", () => {
  render(<Checkbox label="Select all" indeterminate />);
  expect(screen.getByRole("checkbox")).toHaveProperty("indeterminate", true);
});

test("forwards ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<Checkbox ref={ref} label="Accept" />);
  expect(ref.current?.type).toBe("checkbox");
});

test("supports defaultChecked", () => {
  render(<Checkbox label="Accept" defaultChecked />);
  expect(screen.getByRole("checkbox")).toBeChecked();
});
