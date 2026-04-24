import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";
import { Accordion } from "./Accordion.tsx";
import { AccordionGroup } from "./AccordionGroup.tsx";

test("renders a details element with summary", () => {
  render(<Accordion title="Section">Content</Accordion>);
  expect(screen.getByText("Section")).toBeInTheDocument();
  expect(screen.getByText("Content")).toBeInTheDocument();
});

test("supports defaultOpen", () => {
  const { container } = render(
    <Accordion title="Open" defaultOpen>
      Content
    </Accordion>,
  );
  expect(container.querySelector("details")).toHaveAttribute("open");
});

test("closed by default", () => {
  const { container } = render(<Accordion title="Closed">Content</Accordion>);
  expect(container.querySelector("details")).not.toHaveAttribute("open");
});

test("supports disabled", () => {
  const { container } = render(
    <Accordion title="Disabled" disabled>
      Content
    </Accordion>,
  );
  expect(container.querySelector("details")).toHaveClass("ds-accordion--disabled");
});

test("passes className", () => {
  const { container } = render(
    <Accordion title="Custom" className="my-class">
      Content
    </Accordion>,
  );
  const details = container.querySelector("details")!;
  expect(details).toHaveClass("my-class");
  expect(details).toHaveClass("ds-accordion");
});

test("AccordionGroup renders children", () => {
  render(
    <AccordionGroup>
      <Accordion title="One">First</Accordion>
      <Accordion title="Two">Second</Accordion>
    </AccordionGroup>,
  );
  expect(screen.getByText("One")).toBeInTheDocument();
  expect(screen.getByText("Two")).toBeInTheDocument();
});

test("AccordionGroup exclusive sets shared name", () => {
  const { container } = render(
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
  const { container } = render(
    <AccordionGroup>
      <Accordion title="One">First</Accordion>
      <Accordion title="Two">Second</Accordion>
    </AccordionGroup>,
  );
  const details = container.querySelectorAll("details");
  expect(details[0].getAttribute("name")).toBeNull();
});

test("standalone Accordion has no name", () => {
  const { container } = render(<Accordion title="Solo">Content</Accordion>);
  expect(container.querySelector("details")?.getAttribute("name")).toBeNull();
});

test("supports explicit name prop", () => {
  const { container } = render(
    <Accordion title="Named" name="my-group">
      Content
    </Accordion>,
  );
  expect(container.querySelector("details")?.getAttribute("name")).toBe("my-group");
});
