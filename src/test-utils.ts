import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { ReactElement } from "react";
import { expect } from "vite-plus/test";

export async function expectNoAxeViolations(ui: ReactElement) {
  const { container } = render(ui);
  const results = await axe(container, {
    rules: {
      region: { enabled: false },
      "page-has-heading-one": { enabled: false },
    },
  });
  expect(results).toHaveNoViolations();
}
