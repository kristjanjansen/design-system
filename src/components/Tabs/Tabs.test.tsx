import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { expect, test, vi } from "vite-plus/test";

import { Tab } from "./Tab.tsx";
import { TabPanel } from "./TabPanel.tsx";
import { Tabs } from "./Tabs.tsx";

function renderTabs(props: Record<string, unknown> = {}) {
  return render(
    <Tabs defaultValue="a" {...props}>
      <Tab value="a">Tab A</Tab>
      <Tab value="b">Tab B</Tab>
      <Tab value="c" disabled>
        Tab C
      </Tab>
      <TabPanel value="a">Content A</TabPanel>
      <TabPanel value="b">Content B</TabPanel>
      <TabPanel value="c">Content C</TabPanel>
    </Tabs>,
  );
}

test("renders tablist with tabs", () => {
  renderTabs();
  expect(screen.getByRole("tablist")).toBeInTheDocument();
  expect(screen.getAllByRole("tab")).toHaveLength(3);
});

test("shows active tab panel", () => {
  renderTabs();
  expect(screen.getByText("Content A")).toBeInTheDocument();
  expect(screen.queryByText("Content B")).not.toBeInTheDocument();
});

test("switches tab on click", async () => {
  const user = userEvent.setup();
  renderTabs();
  await user.click(screen.getByRole("tab", { name: "Tab B" }));
  expect(screen.getByText("Content B")).toBeInTheDocument();
  expect(screen.queryByText("Content A")).not.toBeInTheDocument();
});

test("calls onChange", async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  renderTabs({ onChange });
  await user.click(screen.getByRole("tab", { name: "Tab B" }));
  expect(onChange).toHaveBeenCalledWith("b");
});

test("controlled value", () => {
  function Controlled() {
    const [val, setVal] = useState("b");
    return (
      <Tabs value={val} onChange={setVal}>
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <TabPanel value="a">Content A</TabPanel>
        <TabPanel value="b">Content B</TabPanel>
      </Tabs>
    );
  }
  render(<Controlled />);
  expect(screen.getByText("Content B")).toBeInTheDocument();
});

test("aria-selected on active tab", () => {
  renderTabs();
  expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute("aria-selected", "false");
});

test("aria-controls and aria-labelledby linking", () => {
  renderTabs();
  const tabA = screen.getByRole("tab", { name: "Tab A" });
  const panel = screen.getByRole("tabpanel");
  const controlsId = tabA.getAttribute("aria-controls");
  expect(panel).toHaveAttribute("id", controlsId);
  expect(panel).toHaveAttribute("aria-labelledby", tabA.id);
});

test("roving tabindex", () => {
  renderTabs();
  expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute("tabIndex", "0");
  expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute("tabIndex", "-1");
});

test("disabled tab has aria-disabled", () => {
  renderTabs();
  expect(screen.getByRole("tab", { name: "Tab C" })).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("tab", { name: "Tab C" })).toBeDisabled();
});

test("disabled tab cannot be clicked", async () => {
  const user = userEvent.setup();
  renderTabs();
  await user.click(screen.getByRole("tab", { name: "Tab C" }));
  expect(screen.getByText("Content A")).toBeInTheDocument();
});

test("ArrowRight moves to next tab", async () => {
  const user = userEvent.setup();
  renderTabs();
  screen.getByRole("tab", { name: "Tab A" }).focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Tab B" })).toHaveFocus();
  expect(screen.getByText("Content B")).toBeInTheDocument();
});

test("ArrowLeft wraps to last tab", async () => {
  const user = userEvent.setup();
  renderTabs();
  screen.getByRole("tab", { name: "Tab A" }).focus();
  await user.keyboard("{ArrowLeft}");
  // Skips disabled Tab C, goes to Tab B
  expect(screen.getByRole("tab", { name: "Tab B" })).toHaveFocus();
});

test("Home/End keys", async () => {
  const user = userEvent.setup();
  renderTabs();
  screen.getByRole("tab", { name: "Tab A" }).focus();
  await user.keyboard("{End}");
  expect(screen.getByRole("tab", { name: "Tab B" })).toHaveFocus();
  await user.keyboard("{Home}");
  expect(screen.getByRole("tab", { name: "Tab A" })).toHaveFocus();
});

test("activateOnFocus=false requires Enter to activate", async () => {
  const user = userEvent.setup();
  renderTabs({ activateOnFocus: false });
  screen.getByRole("tab", { name: "Tab A" }).focus();
  await user.keyboard("{ArrowRight}");
  // Focus moved but content didn't change
  expect(screen.getByRole("tab", { name: "Tab B" })).toHaveFocus();
  expect(screen.getByText("Content A")).toBeInTheDocument();
});

test("renders description", () => {
  render(
    <Tabs defaultValue="a">
      <Tab value="a" description="Details here">
        Tab A
      </Tab>
      <TabPanel value="a">Content</TabPanel>
    </Tabs>,
  );
  expect(screen.getByText("Details here")).toBeInTheDocument();
  expect(screen.getByText("Details here")).toHaveClass("ds-tab-description");
});

test("forwards ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Tabs ref={ref} defaultValue="a">
      <Tab value="a">A</Tab>
      <TabPanel value="a">Content</TabPanel>
    </Tabs>,
  );
  expect(ref.current?.classList.contains("ds-tabs")).toBe(true);
});

test("passes through className", () => {
  render(
    <Tabs defaultValue="a" className="custom">
      <Tab value="a">A</Tab>
      <TabPanel value="a">Content</TabPanel>
    </Tabs>,
  );
  expect(screen.getByRole("tablist").parentElement).toHaveClass("custom");
  expect(screen.getByRole("tablist").parentElement).toHaveClass("ds-tabs");
});
