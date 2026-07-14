# Changelog

## 0.3.0 — 2026-07-14

- **Linked notes per day** — associate any number of vault notes or external URLs with a date. A new section in the day editor modal:
  - **Search vault notes** via Obsidian's `AbstractInputSuggest` suggestion UI.
  - **Add external link** with one click; validates it is an http(s) URL.
  - Each linked row shows an open-arrow button (opens the note in Obsidian or the URL in the browser) and a remove button.
- **Calendar cell note badge** — days that have linked notes show a 🔗N badge in the calendar cell. Clicking the badge jumps straight to the first linked note.
- **Wider modal** — the day editor modal can now grow to ~1400 px so all event controls (category, title, time, note, remove) are visible side-by-side at any window width.
- Cleaner event-row grid: 16 px swatch · 150 px category · 1fr title (min 160 px) · 150 px time · 32 px remove, with the note input on its own dedicated row.
- Backwards-compatible: existing JSON without `notes` is migrated on first read.

## 0.2.0 — 2026-07-14

- Modal sizing fix.
- Bilingual UI (English + 中文). Choose in **Settings → Calendar Events → Language**.

## 0.1.0 — 2026-07-14

- Initial release. Sidebar monthly calendar with category-colored events, day editor modal, JSON data store, 5 default categories.
