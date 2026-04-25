import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";

import { Select } from "./Select.tsx";

const options = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
];

test("exports forwardRef component", () => {
  expect(Select.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders native select", () => {
  render(<Select label="Color" options={options} />);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});

test("renders options from data", () => {
  render(<Select label="Color" options={options} />);
  expect(screen.getByRole("option", { name: "Red" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Blue" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Green" })).toBeInTheDocument();
});

test("renders placeholder", () => {
  render(<Select label="Color" options={options} placeholder="Pick a color" />);
  expect(screen.getByRole("option", { name: "Pick a color" })).toBeDisabled();
});

test("renders option groups", () => {
  const grouped = [
    { label: "Warm", options: [{ value: "red", label: "Red" }] },
    { label: "Cool", options: [{ value: "blue", label: "Blue" }] },
  ];
  render(<Select label="Color" options={grouped} />);
  expect(screen.getByRole("group", { name: "Warm" })).toBeInTheDocument();
  expect(screen.getByRole("group", { name: "Cool" })).toBeInTheDocument();
});

test("onChange returns selected value and event", async () => {
  const handleChange = vi.fn();
  render(<Select label="Color" options={options} onChange={handleChange} />);
  await userEvent.selectOptions(screen.getByRole("combobox"), "blue");
  expect(handleChange).toHaveBeenCalledWith("blue", expect.anything());
});

test("supports controlled value", () => {
  render(<Select label="Color" options={options} value="green" onChange={() => {}} />);
  expect(screen.getByRole("combobox")).toHaveValue("green");
});

test("supports disabled", () => {
  render(<Select label="Color" options={options} disabled />);
  expect(screen.getByRole("combobox")).toBeDisabled();
});

test("supports required", () => {
  render(<Select label="Color" options={options} required />);
  expect(screen.getByRole("combobox")).toBeRequired();
});

test("renders error", () => {
  render(<Select label="Color" options={options} error="Required" />);
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("renders label linked to select", () => {
  render(<Select label="Color" options={options} />);
  expect(screen.getByLabelText("Color")).toBeInTheDocument();
});

test("forwards ref", () => {
  const ref = createRef<HTMLSelectElement>();
  render(<Select ref={ref} label="Color" options={options} />);
  expect(ref.current?.tagName).toBe("SELECT");
});

test("renders chevron icon", () => {
  const { container } = render(<Select label="Color" options={options} />);
  expect(container.querySelector(".chevron svg")).toBeInTheDocument();
});
