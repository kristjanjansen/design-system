import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";

import { Checkbox } from "./Checkbox.tsx";
import { CheckboxGroup } from "./CheckboxGroup.tsx";

test("renders fieldset with role group", () => {
  render(
    <CheckboxGroup label="Interests">
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  expect(screen.getByRole("group")).toBeInTheDocument();
  expect(screen.getByText("Interests")).toBeInTheDocument();
});

test("renders checkbox inputs", () => {
  render(
    <CheckboxGroup label="Interests">
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  expect(screen.getAllByRole("checkbox")).toHaveLength(2);
});

test("selection via click", async () => {
  const handleChange = vi.fn();
  render(
    <CheckboxGroup label="Interests" onChange={handleChange}>
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  await userEvent.click(screen.getByLabelText("A"));
  expect(handleChange).toHaveBeenCalledWith(["a"]);
  await userEvent.click(screen.getByLabelText("B"));
  expect(handleChange).toHaveBeenCalledWith(["a", "b"]);
});

test("deselection via click", async () => {
  const handleChange = vi.fn();
  render(
    <CheckboxGroup label="Interests" value={["a", "b"]} onChange={handleChange}>
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  await userEvent.click(screen.getByLabelText("A"));
  expect(handleChange).toHaveBeenCalledWith(["b"]);
});

test("controlled value", () => {
  render(
    <CheckboxGroup label="Interests" value={["b"]}>
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  expect(screen.getByLabelText("A")).not.toBeChecked();
  expect(screen.getByLabelText("B")).toBeChecked();
});

test("uncontrolled defaultValue", () => {
  render(
    <CheckboxGroup label="Interests" defaultValue={["a"]}>
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  expect(screen.getByLabelText("A")).toBeChecked();
  expect(screen.getByLabelText("B")).not.toBeChecked();
});

test("disabled group disables all checkboxes", () => {
  render(
    <CheckboxGroup label="Interests" disabled>
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  expect(screen.getByLabelText("A")).toBeDisabled();
  expect(screen.getByLabelText("B")).toBeDisabled();
});

test("renders error", () => {
  render(
    <CheckboxGroup label="Interests" error="Select at least one">
      <Checkbox value="a" label="A" />
    </CheckboxGroup>,
  );
  expect(screen.getByText("Select at least one")).toBeInTheDocument();
});

test("renders description", () => {
  render(
    <CheckboxGroup label="Interests" description="Pick all that apply">
      <Checkbox value="a" label="A" />
    </CheckboxGroup>,
  );
  expect(screen.getByText("Pick all that apply")).toBeInTheDocument();
});

test("forwards ref to fieldset", () => {
  const ref = createRef<HTMLFieldSetElement>();
  render(
    <CheckboxGroup label="Interests" ref={ref}>
      <Checkbox value="a" label="A" />
    </CheckboxGroup>,
  );
  expect(ref.current?.tagName).toBe("FIELDSET");
});

test("Space toggles checkbox in group", async () => {
  const handleChange = vi.fn();
  render(
    <CheckboxGroup label="Interests" onChange={handleChange}>
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  screen.getByLabelText("A").focus();
  await userEvent.keyboard(" ");
  expect(handleChange).toHaveBeenCalledWith(["a"]);
});

test("Tab moves between checkboxes", async () => {
  render(
    <CheckboxGroup label="Interests">
      <Checkbox value="a" label="A" />
      <Checkbox value="b" label="B" />
    </CheckboxGroup>,
  );
  await userEvent.tab();
  expect(screen.getByLabelText("A")).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByLabelText("B")).toHaveFocus();
});
