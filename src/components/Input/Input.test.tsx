import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";
import { Input } from "./Input.tsx";

test("exports forwardRef component", () => {
  expect(Input.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders an input", () => {
  render(<Input label="Name" />);
  expect(screen.getByLabelText("Name")).toBeInTheDocument();
});

test("renders error with aria attributes", () => {
  render(<Input label="Email" error="Required" />);
  expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("calls onChange with value", async () => {
  const handleChange = vi.fn();
  render(<Input label="Name" onChange={handleChange} />);
  await userEvent.type(screen.getByLabelText("Name"), "hello");
  expect(handleChange).toHaveBeenLastCalledWith("hello", expect.anything());
});

test("supports disabled and required", () => {
  render(<Input label="Name" disabled required />);
  const input = screen.getByLabelText(/Name/);
  expect(input).toBeDisabled();
  expect(input).toBeRequired();
});

test("forwards ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<Input ref={ref} label="Name" />);
  expect(ref.current).toBe(screen.getByLabelText("Name"));
});

test("passes through native attributes", () => {
  render(<Input label="Email" name="email" placeholder="Enter email" />);
  const input = screen.getByLabelText("Email");
  expect(input).toHaveAttribute("name", "email");
  expect(input).toHaveAttribute("placeholder", "Enter email");
});

test("renders description", () => {
  render(<Input label="Name" description="Your full name" />);
  expect(screen.getByText("Your full name")).toBeInTheDocument();
});
