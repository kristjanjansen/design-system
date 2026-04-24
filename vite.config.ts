import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
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
      correctness: "warn",
    },
    rules: {
      "sort-imports": ["warn", { ignoreDeclarationSort: true }],
    },
    options: {
      typeAware: false,
    },
  },
  fmt: {},
});
