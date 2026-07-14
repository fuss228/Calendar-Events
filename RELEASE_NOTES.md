# Calendar Events v0.3.1

Sidebar calendar with per-day **events**, **checklists**, and **linked notes**. Bilingual UI. Finalizes the wider modal layout and the new per-event row layout.

## ✨ What's new in 0.3.1

- **Wider modal**: hard cap raised to `min(1800px, 96vw)`. The day editor now spans almost the full window on wide displays.
- **Per-event row layout**: 6-column grid where `Note` (备注) shares a row with the `Remove` button.

  ```
  swatch  category  [ title (1fr) ]     time (160)  ╱ ✕
  swatch  category  [── note (1fr) ──────────────────] ✕
  ```

  - Category select: **170 px**
  - Title: min **200 px** then flex
  - Time: **160 px**
  - Note: flex across columns 3–5 on the second row
  - ✕: stays in column 6, anchored to the right
- **Sticky modal header**: title and close button stay fixed in place while the body scrolls. Horizontal scrolling is suppressed inside the modal so the header never appears to slide sideways.

## 🔧 Install

1. Download `calendar-events.zip` below.
2. Unzip into `<vault>/.obsidian/plugins/calendar-events/`.
3. **Settings → Community plugins → enable Calendar Events**.

## 🗒️ Full changelog

[CHANGELOG.md](./CHANGELOG.md)
