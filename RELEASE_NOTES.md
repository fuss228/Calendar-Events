# Calendar Events v0.3.0

Sidebar calendar with per-day **events**, **checklists**, and now **linked notes**. Bilingual UI. Bumpier event rows that fit at any width.

## ✨ What's new

- **Linked notes per day** — connect any vault note or external URL to a date.
  - Type in the "搜索 vault 笔记…" field in the day editor to find any note (powered by Obsidian's suggest API).
  - Click "添加外链…" to paste an http(s) URL — the plugin validates it.
  - Each linked row has a ↗ button to open it (note in Obsidian, link in browser) and a remove button.
- **Calendar badge** — days with linked notes show a 🔗N badge. Click to open the first one.
- **Better modal** — up to ~1400 px wide so all event controls (category / title / time / note / remove) stay visible side by side. Event row layout uses CSS grid so the title always has a minimum 160 px and stretches with the column.

## 🔧 Install

1. Download `calendar-events.zip` below.
2. Unzip into `<vault>/.obsidian/plugins/calendar-events/`.
3. **Settings → Community plugins → enable Calendar Events**.

## 📦 Linked notes data shape

`calendar-data.json` now adds a `notes` array per day:

```json
"2026-07-14": {
  "events":  [ ... ],
  "checklist": [ ... ],
  "notes": [
    { "id": "note_a", "title": "Acme contract draft", "path": null,                "url": "https://example.com/acme.pdf" },
    { "id": "note_b", "title": "Workflow notes",       "path": "00_知识库/工作流程", "url": null }
  ]
}
```

`path` (vault note) and `url` (external) are mutually exclusive — exactly one is non-null.

## 🗒️ Full changelog

[CHANGELOG.md](./CHANGELOG.md)
