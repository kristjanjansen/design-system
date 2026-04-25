import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vite-plus/test";

import { Heading } from "./Heading.tsx";

test("renders h2 by default", () => {
  render(<Heading>Title</Heading>);
  expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
});

test("renders correct heading level", () => {
  render(<Heading level={3}>Title</Heading>);
  expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
});

test("as prop overrides tag", () => {
  const { container } = render(
    <Heading level={2} as="h4">
      Title
    </Heading>,
  );
  expect(container.querySelector("h4")).toBeInTheDocument();
  expect(container.querySelector("h4")).toHaveClass("ds-heading--h2");
});

test("passes className", () => {
  render(<Heading className="custom">Title</Heading>);
  const heading = screen.getByRole("heading");
  expect(heading).toHaveClass("ds-heading");
  expect(heading).toHaveClass("custom");
});

test("forwards ref", () => {
  const ref = createRef<HTMLHeadingElement>();
  render(<Heading ref={ref}>Title</Heading>);
  expect(ref.current?.tagName).toBe("H2");
});
