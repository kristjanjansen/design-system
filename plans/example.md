# plan: consumer app

## status: done

## goal

restructure consumer app to mirror figma page structure. each component gets its own page showing all states. minimal router for navigation.

## current

single `App.tsx` with all components in one scroll. theme switcher in top-right corner.

## proposed structure

```
/                    → all components (like figma "all components" page)
/accordion           → accordion states (display/default, group, standalone, disabled)
/button              → button variants × sizes × states
/checkbox            → checkbox + checkboxgroup states
/input               → input states (default, error, disabled, readonly, slots)
/input-number        → inputnumber states
/input-password      → inputpassword states
/radio               → radiogroup states
/select              → select states + trigger
/switch              → switch + switchgroup states
/textarea            → textarea states
/typography          → heading levels + text sizes
/icons               → all icons at actual size
```

## styling

tailwind for page layout (sidebar, grid, spacing, responsive). ds components render with their own css. no tailwind on ds components.

```
vp add tailwindcss @tailwindcss/vite
```

## router

no external dep. use simple hash router:

```tsx
const routes: Record<string, () => ReactNode> = {
  "": AllComponents,
  accordion: AccordionPage,
  button: ButtonPage,
  // ...
};

function App() {
  const [hash, setHash] = useState(location.hash.slice(1) || "");
  useEffect(() => {
    const handler = () => setHash(location.hash.slice(1) || "");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const Page = routes[hash] || AllComponents;
  return <Page />;
}
```

navigation: sidebar or top nav with component names linking to `#accordion`, `#button`, etc.

## page template

each page shows all states of one component, similar to figma themed frames:

```tsx
function ButtonPage() {
  return (
    <>
      <Heading level={2}>Button</Heading>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button size="small">Small</Button>
        <Button size="small" variant="secondary">
          Small
        </Button>
      </div>
      <Button disabled>Disabled</Button>
    </>
  );
}
```

## theme switcher

keep current top-right fixed position. mobile: cycle button. applies across all pages.

## navigation

sidebar list matching figma page order:

```
all components
accordion
button
checkbox
input
input-number
input-password
radio
select
switch
textarea
typography
icons
```

hide on mobile, toggle via hamburger or just show component name links at top.

## files

| file                          | purpose                             |
| ----------------------------- | ----------------------------------- |
| `src/App.tsx`                 | router + layout (sidebar + content) |
| `src/pages/AllComponents.tsx` | overview page                       |
| `src/pages/ButtonPage.tsx`    | button states                       |
| `src/pages/*.tsx`             | one per component                   |
