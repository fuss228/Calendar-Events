# Changelog

## 0.3.2 — 2026-07-14

- **UI polish for "Linked notes"** — the `🔍` vault note search input now lives inside the *Linked notes* section (it was accidentally being appended directly to `modal.contentEl`). The *Add URL* row is now an inline input + button (previously an `addButton` that triggered a `prompt()`).
- Improved the search prompt copy: Search field is now labeled `Pick a note` / `选择 vault 笔记`.
- README rewritten with up-to-date screenshots (`docs/sidebar-view.png`, `docs/day-editor-modal.png`).

## 0.3.1 — 2026-07-14

- **Modal widened** to `min(1800px, 96vw)`.
- **Per-event row layout** — `Note` and the remove ✕ button share a row.
- **Sticky modal header** — title and close button never scroll.

## 0.3.0 — 2026-07-14

- **Linked notes per day** — vault note search + external URL.
- **Calendar cell note badge 🔗N**.
- Backwards-compatible JSON.

## 0.2.0 — 2026-07-14

- Modal sizing fix.
- Bilingual UI (English + 中文).

## 0.1.0 — 2026-07-14

- Initial release. Sidebar monthly calendar, day editor modal, JSON data store, 5 default categories.
