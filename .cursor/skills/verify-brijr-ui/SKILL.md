---
name: verify-brijr-ui
description: "Drive the brijr/ui Next.js style lab and registry server in a real browser/HTTP session to prove UI and registry changes. Use when verifying style-lab, theme, form controls, install links, or /r/*.json catalog behavior."
---

# Verify brijr/ui

Project-local verification for [brijr/ui](https://github.com/brijr/ui): a Next.js style lab at `/` and a shadcn registry at `/r/{name}.json`. Agents launch an isolated instance, doctor it, drive mapped features the way a user would, capture evidence, then clean up without deleting proof artifacts.

Read `features/README.md` before driving. Prefer production start (`next start`) over `next dev` — Turbopack HMR websocket failures in this environment can leave client components unhydrated so theme/checkbox/switch clicks do nothing.

## Launch

From the repo root:

```bash
export VERIFY_RUN_ID="${VERIFY_RUN_ID:-$(date +%Y%m%d-%H%M%S)}"
export VERIFY_ROOT="${VERIFY_ROOT:-/tmp/brijr-ui-verify/$VERIFY_RUN_ID}"
.cursor/skills/verify-brijr-ui/scripts/verify-brijr-ui launch
```

What it does:

- Uses `npm run build` when `.next` is missing or `VERIFY_REBUILD=1`.
- Starts `PORT=<port> npm run start` on a free port (or `VERIFY_PORT` if set).
- Writes state to `$VERIFY_ROOT/state.env` (`VERIFY_URL`, `VERIFY_PORT`, `VERIFY_PID`, `VERIFY_ARTIFACTS`).
- Ready when `GET $VERIFY_URL/` returns HTTP 200 and the HTML title/heading identify `brijr/ui`.

Optional env:

- `VERIFY_PORT` — pin the listen port.
- `VERIFY_REBUILD=1` — force a fresh production build.
- `VERIFY_ARTIFACTS` — override evidence directory (default `$VERIFY_ROOT/artifacts`).

Teardown is `verify-brijr-ui cleanup` (see Cleanup). Never drive a shared instance you did not launch.

## Doctor

Read-only health check for the instance named in `$VERIFY_ROOT/state.env`:

```bash
.cursor/skills/verify-brijr-ui/scripts/verify-brijr-ui doctor
```

Requires all of:

1. `VERIFY_PID` still alive and listening on `VERIFY_PORT`.
2. `GET /` is 200 and body includes the heading text `brijr/ui`.
3. `GET /r/registry.json` is 200 JSON with `"name":"brijr"`.
4. Client interactivity: Playwright click on `button` named `Toggle dark mode` flips `document.documentElement.classList` to include `dark` (then restores light). If this fails, the instance is not worth driving — rebuild/restart with `launch` rather than trusting a broken hydration session.

Run doctor whenever anything looks off, before claiming a proof.

## Drive

Harness binary (all invocations from repo root, with `VERIFY_ROOT` set to the launch state dir):

```bash
BIN=.cursor/skills/verify-brijr-ui/scripts/verify-brijr-ui
```

Browser (Playwright over CDP + system Chrome; installs Playwright into `$VERIFY_ROOT/tools` on first use — not into the app `package.json`). Chromium stays up across commands so theme/form state persists:

```bash
$BIN browser start
$BIN browser goto --path /
$BIN browser snapshot --aria --path "$VERIFY_ARTIFACTS/home.aria.yml"
$BIN browser screenshot --path "$VERIFY_ARTIFACTS/home.png" --full-page
$BIN browser click --role button --name "Toggle dark mode"
$BIN browser fill --role textbox --name "Display name" --value "Verification Ada"
$BIN browser click --role checkbox
$BIN browser click --role switch
$BIN browser press --key d
$BIN browser click --role link --name "button"
$BIN browser stop
```

`browser start` is optional — the first drive command starts Chromium if needed. `cleanup` stops Chromium as well as the Next server.

HTTP (registry surface; no browser):

```bash
$BIN http get /r/registry.json --path "$VERIFY_ARTIFACTS/registry.json"
$BIN http get /r/button.json --path "$VERIFY_ARTIFACTS/button.json"
```

Stable handles from this app:

- Heading level 1: `brijr/ui`
- Theme: `button` named `Toggle dark mode`; also keyboard `d` when focus is not in an editable field
- Form: textboxes `Display name`, `Email` (`aria-invalid=true`), `Notes`; `checkbox` and `switch` (Base UI — no accessible name; use role only, one of each on the lab)
- Install: links named after registry items (`button`, `input`, …) to `/r/<name>.json`
- Section headings (h2): `Color`, `Type`, `Radius`, `Button`, `Badge`, `Form`, `Card`, `Install`

Follow the feature files under `features/` for recipes. Prefer roles and accessible names over CSS selectors or coordinates.

## Evidence

Proof directory: `$VERIFY_ARTIFACTS` (default `$VERIFY_ROOT/artifacts`). Cleanup must not delete it.

Standards:

- Exercise the real user path (browser UI or HTTP GET the registry user/CLI would hit). Do not prove by editing `registry.json` in isolation or calling internal loaders.
- Capture the action and the resulting state (ARIA snapshot / screenshot / response body), not only the final screen.
- For mutations (theme, form fields, checkbox/switch), capture before and after.
- Registry proofs include status code and JSON fields (`name`, `items` / item `name`).
- Mocks are unnecessary — this app has no external auth or network side effects beyond serving itself.

Suggested layout:

```text
$VERIFY_ARTIFACTS/
  <feature-id>/
    before.aria.yml
    after.aria.yml
    after.png
    *.json          # HTTP bodies when relevant
```

## Cleanup

```bash
.cursor/skills/verify-brijr-ui/scripts/verify-brijr-ui cleanup
```

Stops only the PID recorded in `$VERIFY_ROOT/state.env`. Does not kill by process name. Leaves `$VERIFY_ARTIFACTS` and the state file for inspection; remove those manually only when the proof is no longer needed.

## Helpers

All helpers live under `.cursor/skills/verify-brijr-ui/scripts/` and are invoked through the dispatcher:

| Command | Purpose |
| --- | --- |
| `verify-brijr-ui launch` | Build if needed, start `next start`, write state |
| `verify-brijr-ui doctor` | Process, HTTP, and client-interactivity check |
| `verify-brijr-ui browser start\|stop` | Manage persistent Chromium (CDP) |
| `verify-brijr-ui browser …` | goto / click / fill / press / snapshot / screenshot |
| `verify-brijr-ui http get <path>` | curl registry endpoints into artifacts |
| `verify-brijr-ui cleanup` | Kill Chromium + the launched Next PID only |

Isolation: two runs can share a machine if they use different `VERIFY_ROOT` / `VERIFY_PORT` values. Do not attach to an unknown process on `:3000`.

## Maintenance

When routes, lab sections, or registry items change, update the feature map with `/maintain-verification-skill`.
