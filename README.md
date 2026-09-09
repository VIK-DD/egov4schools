# eGov4Schools

Compară rezultatele bacalaureatului pentru liceele din Republica Moldova, folosind datele publice
publicate de MEC și ANCE.

Proiect personal, non-comercial, open source. Interfața este construită pe
[Modelul Unitar de Design (MUD)](https://mud.egov.md/) — standardul național de design al
Republicii Moldova, întreținut de Agenția de Guvernare Electronică.

## Stack

| Layer         | Choice                                                |
| ------------- | ----------------------------------------------------- |
| Build         | Vite                                                  |
| UI            | React 19 + TypeScript                                 |
| Design system | `@egov-moldova/mud` (Stencil web components)          |
| Routing       | React Router                                          |
| Quality       | ESLint, Prettier, husky + lint-staged, GitHub Actions |

## Getting started

```bash
nvm use          # Node 22, per .nvmrc
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Dev server with HMR                               |
| `npm run build`     | Typecheck, then production build to `dist/`       |
| `npm run preview`   | Serve the production build locally                |
| `npm run lint`      | ESLint over the whole project                     |
| `npm run typecheck` | TypeScript only, no build                         |
| `npm run mud:types` | Regenerate the React JSX types for MUD components |

## Working with MUD

MUD components are native custom elements, used as ordinary tags:

```tsx
<mud-button variant="primary" size="lg">
  <button type="button">Caută</button>
</mud-button>
```

Three things are worth knowing before you add components.

**Events need a listener, not a prop.** React 19 forwards props and attributes to custom elements,
but it does not bind custom events — there is no `onMudSearch` prop. Use the `useCustomEvent` hook
in `src/lib/useCustomEvent.ts`:

```tsx
const ref = useCustomEvent<HTMLMudSearchInputRectangularElement, { value: string }>(
  'mudSearch',
  (detail) => setQuery(detail.value),
);
```

**Types are generated, not shipped.** MUD publishes Stencil's own JSX namespace, which React does
not read, so every `<mud-*>` tag would otherwise be a TypeScript error. `scripts/generate-mud-jsx.mjs`
reads the published element map and emits `src/types/mud-jsx.d.ts`. Re-run `npm run mud:types` after
upgrading the package — CI fails if the file is stale.

**The runtime import is not the documented one.** See the comment block in `src/lib/mud.ts`.
`@egov-moldova/mud@1.1.9` declares a `./loader` export whose target file is missing from the
published tarball, so the README's `defineCustomElements()` route fails to build. We import
`dist/mud/mud.esm.js` instead, which self-registers every element. Revisit when AGE ships a fix.

### What you may and may not change

Per the AGE rules, you must not override MUD's primary colours, spacing tokens, base typography,
standard component dimensions, or accessibility patterns. You may customise secondary/accent
colours, copy, page layout, and institution-specific imagery, and you may add components that do
not exist in the system. Application CSS in `src/styles/global.css` therefore handles layout only
and consumes MUD tokens (`var(--color-text-base-secondary)` and friends) rather than hardcoded
values.

Component reference: [design-system demo](https://egov-moldova.github.io/design-system/Components/).

## Data

The first stage uses only published MEC/ANCE data and collects no personal data. Data ingestion
lives in `src/lib/` — not yet wired up.

## Licence

MIT. MUD itself is the property of the Agency for Electronic Governance; this project uses it as a
consumer under the terms described in the
[official documentation](https://egov-moldova.github.io/egov4dev/mud/).
