# plan: nextjs testing

## status: done

## what was done

- added `"use client"` directive to 13 component source files that use hooks/state/context
- tsdown/rolldown preserves directives in built output — verified in dist
- created `design-system-next` test app at `/Users/s32863/projects/design-system-next`
- server component page (`/`): Button, Heading, Text, Badge — renders without "use client"
- client component page (`/form`): Input, InputPassword, InputNumber, Textarea, Select, RadioGroup, Checkbox, Switch — all work with "use client"
- `next build` succeeds — both pages statically prerendered

## notes

- local symlink install (`npm install ../design-system`) doesn't work with Next.js turbopack — CSS exports fail to resolve through symlinks. use `npm pack` + install tarball instead, or publish to registry.
- `transpilePackages` config needed for the local package
- server-safe components: Button, Heading, Text, Badge (forwardRef only, no hooks)
