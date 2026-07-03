# Store badges

`components/store-badges.tsx` renders two files from this folder:

- `app-store.svg` — Apple "Download on the App Store"
- `google-play.svg` — Google "Get it on Google Play"

Download the **official** artwork (do not recreate it — both are trademarked and
have brand rules), then save it here with the exact filenames above.

## Where to get the official badges

- **Apple — App Store badge:** Apple Marketing Tools badge generator
  <https://tools.applemediaservices.com/app-store/badges> (or the guidelines at
  <https://developer.apple.com/app-store/marketing/guidelines/#section-badges>).
  Download the SVG and save as `app-store.svg`.

- **Google — Google Play badge:** Google Play brand guidelines / badge
  <https://play.google.com/intl/en_us/badges/>. Download the badge and save as
  `google-play.svg` (rename if needed).

## Notes

- Both are the black variants, which read on light and dark backgrounds.
- The Google Play badge ships with built-in padding; Apple's has less. If they
  look mismatched at the same height, nudge one badge's height in
  `store-badges.tsx` (the `h-12` class) or add a little padding to the Apple one.
