# Changelog

## 0.2.0 — 2026-07-14

- **Modal sizing fix** — the day editor modal is now wider and event rows use a flex-grid layout so the category dropdown, title, time, note, and remove button never get clipped.
- **Bilingual UI** — the entire interface (sidebar, modal, and settings) is now available in English and 中文. Add more locales by extending `src/i18n/strings.ts`.
- **`locale` setting** — choose `Auto` (follow Obsidian language), `English`, or `中文` in Settings → Calendar Events.
- **Version bump** to 0.2.0 (`main.js` rebuilt; settings file is backward compatible).

## 0.1.0 — 2026-07-14

- Initial release.
- Sidebar monthly calendar with category-colored event dots.
- Day editor modal for events and checklist.
- JSON data store in `calendar-data.json`.
- Five default categories (Email / Meeting / Task / Reminder / Personal); full CRUD in Settings.
