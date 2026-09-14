# Install links

Install links on the style lab let a user open each registry item’s JSON from the Install section after browsing the component gallery.

## Sub-features

- `install-list` lists every registry item name with a link to `/r/<name>.json`.
- `install-open` opens an item JSON document in the browser.
- `install-command` shows the example `npx shadcn@latest add brijr/ui/button` command.

## How to get to it (user POV)

- Scroll to the Install section at the bottom of `/`.
- Choose an item name link such as `button`.

## Driving it with verify-brijr-ui

Preconditions:

- Instance is healthy at `$VERIFY_URL` per `$BIN doctor`.
- Browser is on `/`.

- **See install command.** Snapshot the Install section. Run `$BIN browser goto --path /` then `$BIN browser snapshot --aria --path "$VERIFY_ARTIFACTS/install-links/install.aria.yml"`. The snapshot includes text `npx shadcn@latest add brijr/ui/button` and links named `button`, `base`, and other registered items.
- **Open button JSON.** Choose the `button` link. Run `$BIN browser click --role link --name "button"`. The URL becomes `$VERIFY_URL/r/button.json` and the page body is JSON whose `name` field is `button`.
- **Proof.** Save the page text. Run `$BIN browser screenshot --path "$VERIFY_ARTIFACTS/install-links/button-json.png"` and `$BIN http get /r/button.json --path "$VERIFY_ARTIFACTS/install-links/button.json"` so the browser navigation and HTTP body agree on `name: button`.

## Gotchas

- Link accessible names are the short item ids (`button`), not the titles (`Button`).
- After opening JSON, return to `/` with `$BIN browser goto --path /` before driving another lab feature.
- A link list alone is incomplete proof — open at least one item and confirm JSON `name`.
