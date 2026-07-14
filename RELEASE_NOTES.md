# Calendar Events v0.3.2

Sidebar calendar with per-day **events**, **checklists**, and **linked notes**. Bilingual UI (English + 中文).

![Sidebar](./docs/sidebar-view.png)
![Day editor](./docs/day-editor-modal.png)

## ✨ What's new in 0.3.2

- **Linked notes section** — UI cleanup:
  - The vault-note search input (`AbstractInputSuggest`) now lives **inside** the "Linked notes" section; previously it was being appended directly to the modal body and showing up in the bottom-left of the modal.
  - The "Add URL" row is now an inline `https://...` text field + **Add** button (it used to open a `prompt()` dialog).
- "Linked notes" search label upgraded to `Pick a note` / `选择 vault 笔记`.
- README rewritten with up-to-date screenshots.

## What 0.3.1 brought

- **Modal widened** — `min(1800px, 96vw)` cap; on large displays the day editor spans almost the full window.
- **Per-event row layout** — 6-column CSS grid: `swatch · category · title · time ·  · ✕` on row 1 and `swatch · category · note (flex) · ✕` on row 2 (note shares its row with the delete button).
- **Sticky modal header** — title and ✕ close button never scroll.

## What 0.3.0 brought

- **Linked notes per day** — search any vault note via `AbstractInputSuggest` or paste an http(s) URL.
- **Calendar cell 🔗N badge** for days with linked notes.
- Two-column layout: Events on the left, Checklist + Linked notes + Add task on the right.

## 📦 Install

1. Download `calendar-events.zip` below.
2. Unzip into `<vault>/.obsidian/plugins/calendar-events/`.
3. **Settings → Community plugins → enable Calendar Events**.
