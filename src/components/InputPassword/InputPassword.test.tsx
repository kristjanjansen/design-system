import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";

import { InputPassword } from "./InputPassword.tsx";

test("exports forwardRef component", () => {
  expect(InputPassword.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders password input by default", () => {
  render(<InputPassword label="Password" />);
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
});

test("toggle switches type between password and text", async () => {
  render(<InputPassword label="Password" />);
  const input = screen.getByLabelText("Password");
  const toggle = screen.getByRole("button");

  expect(input).toHaveAttribute("type", "password");
  await userEvent.click(toggle);
  expect(input).toHaveAttribute("type", "text");
  await userEvent.click(toggle);
  expect(input).toHaveAttribute("type", "password");
});

test("toggle has aria-pressed", async () => {
  render(<InputPassword label="Password" />);
  const toggle = screen.getByRole("button");

  expect(toggle).toHaveAttribute("aria-pressed", "false");
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "true");
});

test("toggle has aria-label from toggleLabel prop", () => {
  render(<InputPassword label="Password" toggleLabel="Show password" />);
  expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Show password");
});

test("toggle has default aria-label", () => {
  render(<InputPassword label="Password" />);
  expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Toggle password visibility");
});

test("renders label linked to input", () => {
  render(<InputPassword label="Password" />);
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
});

test("renders error with aria attributes", () => {
  render(<InputPassword label="Password" error="Too short" />);
  expect(screen.getByLabelText("Password")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Too short")).toBeInTheDocument();
});

test("supports disabled", () => {
  render(<InputPassword label="Password" disabled />);
  expect(screen.getByLabelText("Password")).toBeDisabled();
  expect(screen.getByRole("button")).toBeDisabled();
});

test("supports required", () => {
  render(<InputPassword label="Password" required />);
  const input = screen.getByLabelText(/Password/);
  expect(input).toBeRequired();
  expect(input).toHaveAttribute("aria-required", "true");
});

test("calls onChange with value", async () => {
  const handleChange = vi.fn();
  render(<InputPassword label="Password" onChange={handleChange} />);
  await userEvent.type(screen.getByLabelText("Password"), "secret");
  expect(handleChange).toHaveBeenLastCalledWith("secret", expect.anything());
});

test("forwards ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<InputPassword ref={ref} label="Password" />);
  expect(ref.current?.type).toBe("password");
});
