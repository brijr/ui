# Style lab

The style lab is the home page gallery where a user inspects design tokens and component primitives before shipping them through the registry.

## Sub-features

- `lab-open` loads `/` and shows the product heading.
- `lab-sections` exposes Color, Type, Radius, Button, Badge, Form, Card, and Install sections.
- `lab-buttons` shows button variants and sizes, including a disabled control and an icon button.

## How to get to it (user POV)

- Open `http://<host>:<port>/` in a browser (the style lab is the only page).
- Refresh after changing tokens in `app/globals.css` or components under `components/ui`.

## Driving it with verify-brijr-ui

Preconditions:

- Instance is healthy at `$VERIFY_URL` per `$BIN doctor`.
- Browser starts from a clean navigation to `/`.

- **Open lab.** Navigate to `/`. Run `$BIN browser goto --path /`. The document title is `brijr/ui` and a level-1 heading reads `brijr/ui`.
- **Confirm sections.** Snapshot the page. Run `$BIN browser snapshot --aria --path "$VERIFY_ARTIFACTS/style-lab/home.aria.yml"`. The snapshot includes headings `Color`, `Type`, `Radius`, `Button`, `Badge`, `Form`, `Card`, and `Install`.
- **Confirm buttons.** The Button section includes buttons named `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`, sizes `xs`/`sm`/`default`/`lg`, `Icon button`, and a disabled `Disabled` button.
- **Proof.** Capture a full-page screenshot. Run `$BIN browser screenshot --path "$VERIFY_ARTIFACTS/style-lab/home.png" --full-page`. The image shows the `brijr/ui` heading and at least Color and Button sections.

## Gotchas

- Decorative column guides are `aria-hidden` and `pointer-events: none`; ignore them in snapshots and hits.
- Client components may look present in static HTML while remaining non-interactive under a broken `next dev` HMR session — trust `doctor`, not the first paint alone.
- Do not treat presence of CSS class names in HTML as proof that tokens render correctly; use the visible swatch section labels (`background`, `primary`, …) in the ARIA/text snapshot.
