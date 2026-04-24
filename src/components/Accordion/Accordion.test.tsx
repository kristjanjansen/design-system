// @vitest-environment jsdom
import { expect, test } from "vite-plus/test";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Accordion } from "./Accordion.tsx";
import { AccordionGroup } from "./AccordionGroup.tsx";

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(ui);
  });
  return container;
}

test("renders a details element with summary", () => {
  const container = render(<Accordion title="Section">Content</Accordion>);
  const details = container.querySelector("details");
  const summary = container.querySelector("summary");
  expect(details).not.toBeNull();
  expect(summary?.textContent).toContain("Section");
});

test("renders content inside details", () => {
  const container = render(<Accordion title="Section">Hello world</Accordion>);
  expect(container.textContent).toContain("Hello world");
});

test("supports defaultOpen", () => {
  const container = render(
    <Accordion title="Open" defaultOpen>
      Content
    </Accordion>,
  );
  const details = container.querySelector("details")!;
  expect(details.open).toBe(true);
});

test("closed by default", () => {
  const container = render(<Accordion title="Closed">Content</Accordion>);
  const details = container.querySelector("details")!;
  expect(details.open).toBe(false);
});

test("supports disabled", () => {
  const container = render(
    <Accordion title="Disabled" disabled>
      Content
    </Accordion>,
  );
  const details = container.querySelector("details")!;
  expect(details.classList.contains("ds-accordion--disabled")).toBe(true);
});

test("passes className", () => {
  const container = render(
    <Accordion title="Custom" className="my-class">
      Content
    </Accordion>,
  );
  const details = container.querySelector("details")!;
  expect(details.classList.contains("my-class")).toBe(true);
  expect(details.classList.contains("ds-accordion")).toBe(true);
});

test("AccordionGroup renders children", () => {
  const container = render(
    <AccordionGroup>
      <Accordion title="One">First</Accordion>
      <Accordion title="Two">Second</Accordion>
    </AccordionGroup>,
  );
  expect(container.textContent).toContain("One");
  expect(container.textContent).toContain("Two");
});

test("AccordionGroup exclusive sets shared name", () => {
  const container = render(
    <AccordionGroup exclusive>
      <Accordion title="One">First</Accordion>
      <Accordion title="Two">Second</Accordion>
    </AccordionGroup>,
  );
  const details = container.querySelectorAll("details");
  expect(details[0].getAttribute("name")).toBeTruthy();
  expect(details[0].getAttribute("name")).toBe(details[1].getAttribute("name"));
});

test("AccordionGroup non-exclusive has no name", () => {
  const container = render(
    <AccordionGroup>
      <Accordion title="One">First</Accordion>
      <Accordion title="Two">Second</Accordion>
    </AccordionGroup>,
  );
  const details = container.querySelectorAll("details");
  expect(details[0].getAttribute("name")).toBeNull();
  expect(details[1].getAttribute("name")).toBeNull();
});

test("standalone Accordion has no name", () => {
  const container = render(<Accordion title="Solo">Content</Accordion>);
  const details = container.querySelector("details")!;
  expect(details.getAttribute("name")).toBeNull();
});

test("supports explicit name prop", () => {
  const container = render(
    <Accordion title="Named" name="my-group">
      Content
    </Accordion>,
  );
  const details = container.querySelector("details")!;
  expect(details.getAttribute("name")).toBe("my-group");
});
