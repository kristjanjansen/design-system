import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";
import { expectNoAxeViolations } from "../../test-utils.ts";
import { Switch } from "./Switch.tsx";

test("exports forwardRef component", () => {
  expect(Switch.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a switch input", () => {
  render(<Switch label="Toggle" />);
  const input = screen.getByRole("switch");
  expect(input).toBeInTheDocument();
});

test("renders label linked to input", () => {
  render(<Switch label="Dark mode" />);
  const input = screen.getByLabelText("Dark mode");
  expect(input).toBeInTheDocument();
});

test("calls onChange with checked state", async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();
  render(<Switch label="Toggle" onChange={handleChange} />);
  const input = screen.getByRole("switch");
  await user.click(input);
  expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
});

test("supports disabled", () => {
  render(<Switch disabled label="Locked" />);
  const input = screen.getByRole("switch");
  expect(input).toBeDisabled();
});

test("forwards ref to input", () => {
  const ref = createRef<HTMLInputElement>();
  render(<Switch label="Toggle" ref={ref} />);
  expect(ref.current?.type).toBe("checkbox");
});

test("supports defaultChecked", () => {
  render(<Switch label="Toggle" defaultChecked />);
  const input = screen.getByRole("switch");
  expect(input).toBeChecked();
});

test("renders error", () => {
  render(<Switch label="Toggle" error="Required" />);
  expect(screen.getByRole("switch")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("renders description", () => {
  render(<Switch label="Toggle" description="Enable this feature" />);
  expect(screen.getByText("Enable this feature")).toBeInTheDocument();
});

test("has no accessibility violations", async () => {
  await expectNoAxeViolations(<Switch label="Toggle" />);
});

test("has no accessibility violations in error state", async () => {
  await expectNoAxeViolations(<Switch label="Toggle" error="Required" />);
});
