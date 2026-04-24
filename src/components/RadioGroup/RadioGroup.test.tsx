import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vite-plus/test";
import { RadioGroup } from "./RadioGroup.tsx";
import { Radio } from "./Radio.tsx";

test("renders fieldset with role radiogroup", () => {
  render(
    <RadioGroup label="Color">
      <Radio value="red">Red</Radio>
      <Radio value="blue">Blue</Radio>
    </RadioGroup>,
  );
  expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  expect(screen.getByText("Color")).toBeInTheDocument();
});

test("renders radio inputs", () => {
  render(
    <RadioGroup label="Color">
      <Radio value="red">Red</Radio>
      <Radio value="blue">Blue</Radio>
    </RadioGroup>,
  );
  expect(screen.getAllByRole("radio")).toHaveLength(2);
});

test("selection via click", async () => {
  const handleChange = vi.fn();
  render(
    <RadioGroup label="Color" onChange={handleChange}>
      <Radio value="red">Red</Radio>
      <Radio value="blue">Blue</Radio>
    </RadioGroup>,
  );
  await userEvent.click(screen.getByLabelText("Blue"));
  expect(handleChange).toHaveBeenCalledWith("blue");
});

test("controlled value", () => {
  render(
    <RadioGroup label="Color" value="blue">
      <Radio value="red">Red</Radio>
      <Radio value="blue">Blue</Radio>
    </RadioGroup>,
  );
  expect(screen.getByLabelText("Blue")).toBeChecked();
  expect(screen.getByLabelText("Red")).not.toBeChecked();
});

test("uncontrolled defaultValue", () => {
  render(
    <RadioGroup label="Color" defaultValue="red">
      <Radio value="red">Red</Radio>
      <Radio value="blue">Blue</Radio>
    </RadioGroup>,
  );
  expect(screen.getByLabelText("Red")).toBeChecked();
});

test("disabled group disables all radios", () => {
  render(
    <RadioGroup label="Color" disabled>
      <Radio value="red">Red</Radio>
      <Radio value="blue">Blue</Radio>
    </RadioGroup>,
  );
  expect(screen.getByLabelText("Red")).toBeDisabled();
  expect(screen.getByLabelText("Blue")).toBeDisabled();
});

test("disabled individual radio", () => {
  render(
    <RadioGroup label="Color">
      <Radio value="red">Red</Radio>
      <Radio value="blue" disabled>
        Blue
      </Radio>
    </RadioGroup>,
  );
  expect(screen.getByLabelText("Red")).not.toBeDisabled();
  expect(screen.getByLabelText("Blue")).toBeDisabled();
});

test("renders error", () => {
  render(
    <RadioGroup label="Color" error="Required">
      <Radio value="red">Red</Radio>
    </RadioGroup>,
  );
  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("renders description", () => {
  render(
    <RadioGroup label="Color" description="Pick one">
      <Radio value="red">Red</Radio>
    </RadioGroup>,
  );
  expect(screen.getByText("Pick one")).toBeInTheDocument();
});

test("required indicator on legend", () => {
  render(
    <RadioGroup label="Color" required>
      <Radio value="red">Red</Radio>
    </RadioGroup>,
  );
  expect(screen.getByText("✱")).toBeInTheDocument();
});
