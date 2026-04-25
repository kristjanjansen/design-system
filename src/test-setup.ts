import "@testing-library/jest-dom/vitest";
import * as matchers from "vitest-axe/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vite-plus/test";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
