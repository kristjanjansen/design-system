import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vite-plus/test";

import { Text } from "./Text.tsx";

test("renders p by default", () => {
  render(<Text>Hello</Text>);
  expect(screen.getByText("Hello").tagName).toBe("P");
});

test("renders correct size class", () => {
  render(<Text size="sm">Small</Text>);
  expect(screen.getByText("Small")).toHaveClass("ds-text--sm");
});

test("as prop overrides tag", () => {
  render(<Text as="span">Inline</Text>);
  expect(screen.getByText("Inline").tagName).toBe("SPAN");
});

test("weight prop sets font-weight", () => {
  render(<Text weight={600}>Bold</Text>);
  expect(screen.getByText("Bold")).toHaveStyle({ fontWeight: 600 });
});

test("default weight has no inline style", () => {
  render(<Text>Normal</Text>);
  expect(screen.getByText("Normal")).not.toHaveAttribute("style");
});

test("passes className", () => {
  render(<Text className="custom">Text</Text>);
  const el = screen.getByText("Text");
  expect(el).toHaveClass("ds-text");
  expect(el).toHaveClass("custom");
});

test("forwards ref", () => {
  const ref = createRef<HTMLElement>();
  render(<Text ref={ref}>Text</Text>);
  expect(ref.current?.tagName).toBe("P");
});
