import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";

import { InputNumber } from "./InputNumber.tsx";

test("exports forwardRef component", () => {
  expect(InputNumber.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders text input with inputMode decimal", () => {
  render(<InputNumber label="Amount" />);
  const input = screen.getByRole("spinbutton");
  expect(input).toHaveAttribute("type", "text");
  expect(input).toHaveAttribute("inputMode", "decimal");
});

test("formats with Intl.NumberFormat on blur", () => {
  render(
    <InputNumber
      label="Amount"
      defaultValue={1050.1}
      locale="en-US"
      formatOptions={{ minimumFractionDigits: 2 }}
    />,
  );
  expect(screen.getByRole("spinbutton")).toHaveValue("1,050.10");
});

test("shows raw value on focus", async () => {
  render(<InputNumber label="Amount" defaultValue={1050} />);
  await userEvent.click(screen.getByRole("spinbutton"));
  expect(screen.getByRole("spinbutton")).toHaveValue("1050");
});

test("onChange returns number on blur", async () => {
  const handleChange = vi.fn();
  render(<InputNumber label="Amount" onChange={handleChange} />);
  const input = screen.getByRole("spinbutton");
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, "42");
  await userEvent.tab();
  expect(handleChange).toHaveBeenCalledWith(42);
});

test("onChange returns undefined for empty", async () => {
  const handleChange = vi.fn();
  render(<InputNumber label="Amount" defaultValue={10} onChange={handleChange} />);
  const input = screen.getByRole("spinbutton");
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.tab();
  expect(handleChange).toHaveBeenCalledWith(undefined);
});

test("clamps to min on blur", async () => {
  const handleChange = vi.fn();
  render(<InputNumber label="Amount" min={10} onChange={handleChange} />);
  const input = screen.getByRole("spinbutton");
  await userEvent.click(input);
  await userEvent.type(input, "5");
  await userEvent.tab();
  expect(handleChange).toHaveBeenCalledWith(10);
});

test("clamps to max on blur", async () => {
  const handleChange = vi.fn();
  render(<InputNumber label="Amount" max={100} onChange={handleChange} />);
  const input = screen.getByRole("spinbutton");
  await userEvent.click(input);
  await userEvent.type(input, "200");
  await userEvent.tab();
  expect(handleChange).toHaveBeenCalledWith(100);
});

test("arrow up increments by step", async () => {
  const handleChange = vi.fn();
  render(<InputNumber label="Amount" defaultValue={10} step={5} onChange={handleChange} />);
  const input = screen.getByRole("spinbutton");
  await userEvent.click(input);
  await userEvent.keyboard("{ArrowUp}");
  expect(handleChange).toHaveBeenCalledWith(15);
});

test("arrow down decrements by step", async () => {
  const handleChange = vi.fn();
  render(<InputNumber label="Amount" defaultValue={10} step={5} onChange={handleChange} />);
  const input = screen.getByRole("spinbutton");
  await userEvent.click(input);
  await userEvent.keyboard("{ArrowDown}");
  expect(handleChange).toHaveBeenCalledWith(5);
});

test("renders label", () => {
  render(<InputNumber label="Amount" />);
  expect(screen.getByLabelText("Amount")).toBeInTheDocument();
});

test("renders inputStart and inputEnd", () => {
  const { container } = render(<InputNumber label="Price" inputStart="€" inputEnd="EUR" />);
  expect(container.querySelector(".input-start")?.textContent).toBe("€");
  expect(container.querySelector(".input-end")?.textContent).toBe("EUR");
});

test("supports disabled", () => {
  render(<InputNumber label="Amount" disabled />);
  expect(screen.getByRole("spinbutton")).toBeDisabled();
});

test("forwards ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<InputNumber ref={ref} label="Amount" />);
  expect(ref.current?.type).toBe("text");
});

test("sets aria-valuemin and aria-valuemax", () => {
  render(<InputNumber label="Amount" min={0} max={100} defaultValue={50} />);
  const input = screen.getByRole("spinbutton");
  expect(input).toHaveAttribute("aria-valuemin", "0");
  expect(input).toHaveAttribute("aria-valuemax", "100");
  expect(input).toHaveAttribute("aria-valuenow", "50");
});
