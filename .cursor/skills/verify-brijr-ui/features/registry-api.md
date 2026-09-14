# Registry API

The registry API lets a user or the shadcn CLI fetch the catalog and individual component items as JSON from the running app.

## Sub-features

- `registry-catalog` returns the composed catalog at `/r/registry.json`.
- `registry-item` returns one item at `/r/<name>.json` (with or without the `.json` suffix in the path param).
- `registry-missing` returns 404 JSON for an unknown item.

## How to get to it (user POV)

- Open `/r/registry.json` or `/r/button.json` in a browser.
- Point the shadcn CLI at `http://localhost:<port>/r/{name}.json` as documented in the README.
- Follow Install section links on the style lab (see Install links).

## Driving it with verify-brijr-ui

Preconditions:

- Instance is healthy at `$VERIFY_URL` per `$BIN doctor`.

- **Fetch catalog.** Request the catalog. Run `$BIN http get /r/registry.json --path "$VERIFY_ARTIFACTS/registry-api/registry.json"`. Exit status 0, HTTP 200, JSON `name` is `brijr`, and `items` includes `button` and `base`.
- **Fetch item.** Request the button item. Run `$BIN http get /r/button.json --path "$VERIFY_ARTIFACTS/registry-api/button.json"`. HTTP 200, JSON `name` is `button`, and `files` is a non-empty array.
- **Missing item.** Request an absent name. Run `$BIN http get /r/no-such-component.json --path "$VERIFY_ARTIFACTS/registry-api/missing.json" --expect-status 404`. Body explains the item was not found.
- **Proof.** Keep the saved JSON bodies under `$VERIFY_ARTIFACTS/registry-api/`. Catalog proof must list the same item names shown in the Install section of the lab.

## Gotchas

- `/r/registry` and `/r/registry.json` both resolve to the catalog; prefer the `.json` form to match README and Install links.
- CORS is open for `/r/*` (`GET`, `OPTIONS`) — a browser fetch from another origin is expected to succeed; do not treat CORS headers as the primary proof.
- GitHub installs read `registry.json` from the repo without the server; still verify the live server path when changes touch `app/r/[name]/route.ts` or registry composition.
