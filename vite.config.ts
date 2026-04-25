import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: [
      "src/index.ts",
      "src/style.css",
      "src/tailwind.css",
      "src/themes/brand1-light.css",
      "src/themes/brand1-dark.css",
      "src/themes/brand2-light.css",
      "src/themes/brand2-dark.css",
    ],
    unbundle: true,
    dts: {
      tsgo: true,
    },
    exports: false,
    deps: {
      neverBundle: ["react", "react-dom", "react/jsx-runtime"],
    },
    css: {
      target: ["chrome123", "safari17.5", "firefox128"], // mid-2024 browsers
    },
  },
  lint: {
    plugins: ["jsx-a11y", "react", "import"],
    categories: {
      correctness: "error",
    },
    rules: {
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
    },
    options: {
      typeAware: false,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
  },
  fmt: {},
});
