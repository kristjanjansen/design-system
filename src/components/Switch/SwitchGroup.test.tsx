import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";
import { expectNoAxeViolations } from "../../test-utils.ts";
import { Switch } from "./Switch.tsx";
import { SwitchGroup } from "./SwitchGroup.tsx";

test("renders fieldset with role group", () => {
  render(
    <SwitchGroup label="Settings">
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
  expect(screen.getByRole("group")).toBeInTheDocument();
  expect(screen.getByText("Settings")).toBeInTheDocument();
});

test("renders switch inputs", () => {
  render(
    <SwitchGroup label="Settings">
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
  expect(screen.getAllByRole("switch")).toHaveLength(2);
});

test("selection via click", async () => {
  const handleChange = vi.fn();
  render(
    <SwitchGroup label="Settings" onChange={handleChange}>
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
  await userEvent.click(screen.getByLabelText("A"));
  expect(handleChange).toHaveBeenCalledWith(["a"]);
  await userEvent.click(screen.getByLabelText("B"));
  expect(handleChange).toHaveBeenCalledWith(["a", "b"]);
});

test("deselection via click", async () => {
  const handleChange = vi.fn();
  render(
    <SwitchGroup label="Settings" value={["a", "b"]} onChange={handleChange}>
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
  await userEvent.click(screen.getByLabelText("A"));
  expect(handleChange).toHaveBeenCalledWith(["b"]);
});

test("controlled value", () => {
  render(
    <SwitchGroup label="Settings" value={["b"]}>
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
  expect(screen.getByLabelText("A")).not.toBeChecked();
  expect(screen.getByLabelText("B")).toBeChecked();
});

test("uncontrolled defaultValue", () => {
  render(
    <SwitchGroup label="Settings" defaultValue={["a"]}>
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
  expect(screen.getByLabelText("A")).toBeChecked();
  expect(screen.getByLabelText("B")).not.toBeChecked();
});

test("disabled group disables all switches", () => {
  render(
    <SwitchGroup label="Settings" disabled>
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
  expect(screen.getByLabelText("A")).toBeDisabled();
  expect(screen.getByLabelText("B")).toBeDisabled();
});

test("renders error", () => {
  render(
    <SwitchGroup label="Settings" error="Required">
      <Switch value="a" label="A" />
    </SwitchGroup>,
  );
  expect(screen.getByText("Required")).toBeInTheDocument();
});

test("forwards ref to fieldset", () => {
  const ref = createRef<HTMLFieldSetElement>();
  render(
    <SwitchGroup label="Settings" ref={ref}>
      <Switch value="a" label="A" />
    </SwitchGroup>,
  );
  expect(ref.current?.tagName).toBe("FIELDSET");
});

test("has no accessibility violations", async () => {
  await expectNoAxeViolations(
    <SwitchGroup label="Settings">
      <Switch value="a" label="A" />
      <Switch value="b" label="B" />
    </SwitchGroup>,
  );
});
