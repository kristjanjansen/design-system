import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vite-plus/test";

import { Badge } from "./Badge.tsx";

test("exports forwardRef component", () => {
  expect(Badge.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders with default variant and size", () => {
  render(<Badge>Draft</Badge>);
  const badge = screen.getByText("Draft");
  expect(badge).toHaveClass("ds-badge--neutral");
  expect(badge).toHaveClass("ds-badge--default");
});

test("renders success variant", () => {
  render(<Badge variant="success">Active</Badge>);
  expect(screen.getByText("Active")).toHaveClass("ds-badge--success");
});

test("renders warning variant", () => {
  render(<Badge variant="warning">Pending</Badge>);
  expect(screen.getByText("Pending")).toHaveClass("ds-badge--warning");
});

test("renders error variant", () => {
  render(<Badge variant="error">Failed</Badge>);
  expect(screen.getByText("Failed")).toHaveClass("ds-badge--error");
});

test("renders info variant", () => {
  render(<Badge variant="info">New</Badge>);
  expect(screen.getByText("New")).toHaveClass("ds-badge--info");
});

test("renders small size", () => {
  render(<Badge size="small">3</Badge>);
  expect(screen.getByText("3")).toHaveClass("ds-badge--small");
});

test("renders icon with aria-hidden", () => {
  render(<Badge icon={<svg data-testid="icon" />}>With icon</Badge>);
  const iconWrapper = screen.getByTestId("icon").parentElement;
  expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
  expect(iconWrapper).toHaveClass("ds-badge-icon");
});

test("renders without icon when not provided", () => {
  const { container } = render(<Badge>No icon</Badge>);
  expect(container.querySelector(".ds-badge-icon")).toBeNull();
});

test("forwards ref", () => {
  const ref = createRef<HTMLSpanElement>();
  render(<Badge ref={ref}>Ref</Badge>);
  expect(ref.current?.tagName).toBe("SPAN");
});

test("passes through className", () => {
  render(<Badge className="custom">Test</Badge>);
  const badge = screen.getByText("Test");
  expect(badge).toHaveClass("custom");
  expect(badge).toHaveClass("ds-badge");
});

test("passes through native attributes", () => {
  render(
    <Badge data-testid="my-badge" title="Status">
      Info
    </Badge>,
  );
  const badge = screen.getByTestId("my-badge");
  expect(badge).toHaveAttribute("title", "Status");
});
