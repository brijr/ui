# brijr/ui verification map

This directory is the maintained source for verifying the user-facing behavior of brijr/ui. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-brijr-ui/scripts/verify-brijr-ui launch` so `VERIFY_ROOT` points at a disposable run directory.
- Prefer production (`npm run start` after build). Do not drive a `next dev` instance unless `doctor` confirms theme toggle flips `dark`.
- Put the dispatcher on your mental PATH as `BIN=.cursor/skills/verify-brijr-ui/scripts/verify-brijr-ui`.
- Run `$BIN doctor` and require the expected URL, live PID, registry name `brijr`, and a passing theme interactivity check.
- Never drive an instance that was not started by this verification run.

## Driving conventions

- Start every recipe from `/` unless the feature says otherwise.
- Prefer ARIA roles and accessible names. For Base UI checkbox/switch on the lab, use `role` only (one checkbox, one switch).
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through `$BIN browser …`.
- Run registry HTTP through `$BIN http get …`.
- Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot with the `brijr/ui` heading visible.
- HTTP proof includes status code and response body on disk.
- Mutation proof includes before/after (theme class, field value, `aria-checked`).
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with verify-brijr-ui` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Style lab](./style-lab.md) covers the home page sections, tokens, and component gallery.
- [Theme toggle](./theme-toggle.md) covers dark/light via the header button and the `d` hotkey.
- [Form controls](./form-controls.md) covers text fields, invalid email, checkbox, and switch on the lab.
- [Registry API](./registry-api.md) covers catalog and item JSON over HTTP.
- [Install links](./install-links.md) covers navigating from the Install section to item JSON in the browser.
