# Theme toggle

Theme toggle lets a user switch the style lab between light and dark appearance using the header control or the `d` keyboard shortcut.

## Sub-features

- `theme-button` flips appearance from the `Toggle dark mode` button.
- `theme-hotkey` flips appearance with `d` when focus is outside editable fields.
- `theme-persist` stores the choice in `localStorage` under `theme`.

## How to get to it (user POV)

- Choose the sun/moon icon button in the lab header (`Toggle dark mode`).
- Press `d` while focus is not in an input, textarea, select, or contenteditable.

## Driving it with verify-brijr-ui

Preconditions:

- Instance is healthy at `$VERIFY_URL` per `$BIN doctor`.
- Start from light: if needed, run `$BIN browser goto --path /` and ensure `html` does not have class `dark` (click toggle once if it does).

- **Button to dark.** Choose `Toggle dark mode`. Run `$BIN browser click --role button --name "Toggle dark mode"`. `document.documentElement` gains class `dark` and `localStorage.theme` is `dark`.
- **Hotkey to light.** Move focus off editable fields and press `d`. Run `$BIN browser press --key d`. Class `dark` is removed and `localStorage.theme` is `light`.
- **Proof.** Capture after dark and after light. Run `$BIN browser click --role button --name "Toggle dark mode"`, then `$BIN browser screenshot --path "$VERIFY_ARTIFACTS/theme-toggle/dark.png" --full-page` and `$BIN browser snapshot --aria --path "$VERIFY_ARTIFACTS/theme-toggle/dark.aria.yml"`. Repeat after pressing `d` into light with `light.png` / `light.aria.yml`. Both screenshots still show heading `brijr/ui`.

## Gotchas

- Pressing `d` while a textbox has focus types the character instead of toggling theme.
- `doctor` already performs a toggle round-trip; a failing doctor means do not claim theme proofs from that instance.
- Prefer asserting the `dark` class on `html` and `localStorage.theme`, not which sun/moon SVG is visible.
