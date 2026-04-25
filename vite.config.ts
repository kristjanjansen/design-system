import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: ["src/index.ts", "src/style.css"],
    unbundle: true,
    dts: {
      tsgo: true,
    },
    exports: false,
    deps: {
      neverBundle: ["react", "react-dom", "react/jsx-runtime"],
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
