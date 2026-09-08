# brijr/ui

A [shadcn](https://ui.shadcn.com/docs/registry) component registry. This app is the playground and the registry server. Components are copied into consuming apps as source, not installed as a package.

## Use in an app

### GitHub (works after this repo is pushed)

```bash
npx shadcn@latest add brijr/ui/button
npx shadcn@latest add brijr/ui/base
```

No deploy required. The CLI reads `registry.json` from GitHub.

### Namespace (after this site is deployed)

In the app's `components.json`:

```json
{
  "registries": {
    "@brijr": "https://<your-domain>/r/{name}.json"
  }
}
```

Or:

```bash
npx shadcn@latest registry add @brijr=https://<your-domain>/r/{name}.json
```

Then:

```bash
npx shadcn@latest add @brijr/button
npx shadcn@latest add @brijr/base
```

Locally, point the namespace at the dev server:

```bash
npx shadcn@latest registry add @brijr=http://localhost:3000/r/{name}.json
```

## Style here

The home page is the style lab. Tokens are in `app/globals.css`. Primitives are in `components/ui`. Change a variable or a component, refresh, then ship it through the registry.

```bash
npm run dev
```

- Style lab: [http://localhost:3000](http://localhost:3000)
- Catalog: [http://localhost:3000/r/registry.json](http://localhost:3000/r/registry.json)
- Item: [http://localhost:3000/r/button.json](http://localhost:3000/r/button.json)

```bash
npx shadcn@latest list http://localhost:3000/r/registry.json
npx shadcn@latest view http://localhost:3000/r/button.json
```

```bash
npm run registry:build      # write static JSON to public/r
npm run registry:validate   # validate registry.json against the schema
```

## Add a component

1. Add the source file under `components/ui` (or `lib`, `hooks`).
2. Register it in the colocated `registry.json` (`components/ui/registry.json` for UI).
3. If another item depends on it:
   - GitHub installs: `"registryDependencies": ["brijr/ui/button"]`
   - Namespace installs: `"registryDependencies": ["@brijr/button"]`
4. Confirm it appears at `/r/<name>.json`.

Root `registry.json` composes those files with `include`. File paths in an included `registry.json` are relative to that file.
