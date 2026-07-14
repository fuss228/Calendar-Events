# Changelog

## 0.3.1 — 2026-07-14

- **Modal widened**: hard cap raised to `min(1800px, 96vw)`. On wide screens the day editor now spans almost the full window.
- **Per-event row layout**: 6-column grid where `Note` (备注) shares a row with the `Remove` button — the note input flexes across columns 3–5 on its own line, the ✕ button stays anchored in column 6. Category select bumped to 170 px, title to 200 px min, time to 160 px for better readability.
- **Modal header locked**: `.modal-header` (`flex: 0 0 auto`) keeps the title and ✕ close button fixed in place; only the body scrolls. `.modal-content { overflow-y: auto; overflow-x: hidden }` prevents the header from appearing to slide with horizontal scrolling.
- Behaviour unchanged: data shape, locale, linked notes logic all carry over from 0.3.0.

## 0.3.0 — 2026-07-14

- **Linked notes per day** — associate vault notes or external URLs with a date. Search via Obsidian's `AbstractInputSuggest`; one-click external link with http(s) validation.
- **Calendar cell note badge** — days with linked notes show a 🔗N badge.
- **Wider modal** — preview of the wider modal that 0.3.1 now finalizes.
- Backwards-compatible: existing JSON without `notes` is migrated on first read.

## 0.2.0 — 2026-07-14

- Modal sizing fix.
- Bilingual UI (English + 中文).

## 0.1.0 — 2026-07-14

- Initial release. Sidebar monthly calendar, day editor modal, JSON data store, 5 default categories.
