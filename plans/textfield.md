# Plan: TextField Component

## Overview

Add a `TextField` React component to the system-design library. This is the first React component, so it also requires setting up React as a peer dependency and configuring the build for JSX.

## Prerequisites

### 1. Add React dependencies

- Add `react` and `react-dom` as **peer dependencies** (not bundled with the library)
- Add `@types/react` and `@types/react-dom` as dev dependencies
- Run `vp add --save-peer react react-dom`
- Run `vp add -D @types/react @types/react-dom`

### 2. Configure TypeScript for JSX

Update `tsconfig.json`:

- Add `"jsx": "react-jsx"` to `compilerOptions`
- Add `"react"` to `types` array (alongside `"node"`)
- Add `"dom"` to `lib` array

### 3. Configure Vite+ pack for React

Update `vite.config.ts`:

- Ensure `pack` config handles `.tsx` entry points
- Add React to `external` so it's not bundled

## Component Implementation

### 4. Create component file

Create `src/components/TextField.tsx`:

```tsx
export interface TextFieldProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
```

Key decisions:

- **Controlled & uncontrolled**: Support both `value` and `defaultValue`
- **`onChange` signature**: Pass `value` as first arg for convenience, raw event as second
- **No built-in styling**: Export unstyled markup; consumers apply their own styles via className or a styling solution
- **Forward ref**: Use `React.forwardRef` so consumers can access the underlying `<input>`
- **Native HTML attrs**: Extend `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'>` for passthrough of `id`, `name`, `aria-*`, etc.

### 5. Component structure

```
<div>              ← wrapper
  <label />        ← optional, linked via htmlFor
  <input />        ← the input element
  <span />         ← optional error message
</div>
```

- Use `React.useId()` to auto-generate `id` linking `<label>` and `<input>`
- Set `aria-invalid` and `aria-describedby` when `error` is provided

### 6. Update library entry point

Update `src/index.ts` to re-export:

```ts
export { TextField } from "./components/TextField.tsx";
export type { TextFieldProps } from "./components/TextField.tsx";
```

## Testing

### 7. Write tests

Create `tests/TextField.test.tsx`:

- Renders with default props
- Renders label when provided
- Renders error message and sets `aria-invalid`
- Calls `onChange` with value string
- Supports `disabled` and `required`
- Forwards ref to input element
- Passes through native HTML attributes

Use lightweight DOM assertions with Vitest's built-in `jsdom` environment. No additional testing libraries needed — render components with `react-dom/client` and assert against the DOM directly.

## Build & Verify

### 8. Pack and verify output

- Run `vp pack` — confirm `dist/` contains `.mjs` and `.d.mts` with the TextField export
- Run `vp check` — no lint or type errors
- Run `vp test` — all tests pass

## File Summary

```
src/
  index.ts                    ← add TextField re-export
  components/
    TextField.tsx             ← component implementation
tests/
  TextField.test.tsx          ← component tests
tsconfig.json                 ← add jsx, dom lib
package.json                  ← add react peer dep
vite.config.ts                ← add react external
```
