import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vite-plus/test";

import { Button } from "./Button.tsx";

test("exports forwardRef component", () => {
  expect(Button.$$typeof?.toString()).toBe("Symbol(react.forward_ref)");
});

test("renders a button with default variant and size", () => {
  render(<Button>Click</Button>);
  const button = screen.getByRole("button", { name: "Click" });
  expect(button).toHaveClass("ds-button--primary");
  expect(button).toHaveClass("ds-button--default");
});

test("renders secondary variant", () => {
  render(<Button variant="secondary">Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });
  expect(button).toHaveClass("ds-button--secondary");
});

test("renders tertiary variant", () => {
  render(<Button variant="tertiary">Cancel</Button>);
  const button = screen.getByRole("button", { name: "Cancel" });
  expect(button).toHaveClass("ds-button--tertiary");
});

test("renders small size", () => {
  render(<Button size="small">Small</Button>);
  const button = screen.getByRole("button", { name: "Small" });
  expect(button).toHaveClass("ds-button--small");
});

test("supports disabled", () => {
  render(<Button disabled>Disabled</Button>);
  const button = screen.getByRole("button", { name: "Disabled" });
  expect(button).toBeDisabled();
});

test("calls onClick", async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Button onClick={handleClick}>Click</Button>);
  const button = screen.getByRole("button", { name: "Click" });
  await user.click(button);
  expect(handleClick).toHaveBeenCalledOnce();
});

test("forwards ref", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<Button ref={ref}>Ref</Button>);
  expect(ref.current?.tagName).toBe("BUTTON");
});

test("passes through className", () => {
  render(<Button className="custom">Test</Button>);
  const button = screen.getByRole("button", { name: "Test" });
  expect(button).toHaveClass("custom");
  expect(button).toHaveClass("ds-button");
});

test("passes through native attributes", () => {
  render(
    <Button type="submit" aria-label="Submit form">
      Go
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Submit form" });
  expect(button).toHaveAttribute("type", "submit");
  expect(button).toHaveAttribute("aria-label", "Submit form");
});

test("renders danger variant", () => {
  render(<Button variant="danger">Delete</Button>);
  const button = screen.getByRole("button", { name: "Delete" });
  expect(button).toHaveClass("ds-button--danger");
});

test("renders ghost variant", () => {
  render(<Button variant="ghost">Ghost</Button>);
  const button = screen.getByRole("button", { name: "Ghost" });
  expect(button).toHaveClass("ds-button--ghost");
});
