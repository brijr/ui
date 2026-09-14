# Form controls

Form controls on the style lab let a user exercise text inputs, an invalid email state, a checkbox, and a switch exactly as consuming apps will after installing registry primitives.

## Sub-features

- `form-text` edits Display name and Notes.
- `form-invalid` shows Email with `aria-invalid`.
- `form-disabled` shows a disabled textbox.
- `form-checkbox` toggles the product-updates checkbox.
- `form-switch` toggles the preview switch.

## How to get to it (user POV)

- Scroll to the Form section on `/`.
- Use the labeled fields, checkbox, and switch in that section.

## Driving it with verify-brijr-ui

Preconditions:

- Instance is healthy at `$VERIFY_URL` per `$BIN doctor`.
- Browser is on `/`.

- **Edit display name.** Replace the Display name value. Run `$BIN browser fill --role textbox --name "Display name" --value "Verification Ada"`. The textbox value is `Verification Ada`.
- **Confirm invalid email.** Inspect Email. Run `$BIN browser snapshot --aria --path "$VERIFY_ARTIFACTS/form-controls/form.aria.yml"`. The Email textbox is marked invalid and still shows `not-an-email` unless you changed it.
- **Toggle checkbox.** Activate the sole checkbox. Run `$BIN browser click --role checkbox`. Its `aria-checked` flips relative to the prior value (defaults to checked).
- **Toggle switch.** Activate the sole switch. Run `$BIN browser click --role switch`. Its `aria-checked` flips relative to the prior value (defaults to checked).
- **Proof.** After edits, run `$BIN browser screenshot --path "$VERIFY_ARTIFACTS/form-controls/after.png" --full-page` and a fresh ARIA snapshot under `$VERIFY_ARTIFACTS/form-controls/after.aria.yml`. The snapshot shows the new Display name and the post-toggle checkbox/switch states.

## Gotchas

- Base UI checkbox/switch on this page have no accessible name — address them with `--role checkbox` / `--role switch` only (one of each).
- Do not use `getByLabel` against the native `id` for checkbox/switch; the interactive node is a `role=checkbox|switch` span.
- The disabled textbox named `Disabled` must remain non-editable; attempting to fill it should fail or leave the value `Can't edit this`.
- Card footer `Save` / `Cancel` buttons are visual samples only — they do not persist form data.
