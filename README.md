# Calendar Events (Obsidian plugin)

A sidebar calendar for Obsidian where every day can hold color-coded events and a checklist. Built to feel like a lightweight Google Calendar panel: open the side panel, glance at the month, click a day to edit.

![quick-look](./docs/screenshot.png)

## Features

- **Sidebar calendar**: persistent month grid in the right pane of Obsidian.
- **Per-day editing**: click any day to open a modal with two columns — Events and Checklist.
- **Color-coded categories**: events show up as colored dots on the calendar and a colored bar in the modal (Email, Meeting, Task, Reminder, Personal by default; add/rename/recolor freely in Settings).
- **Checklist per day**: independent of events, with completed-counter badges.
- **JSON data store**: stored at `calendar-data.json` in your vault root. Back up by copying the file; restore by pasting JSON in Settings → Import.
- **Commands**: open the sidebar, edit today's events, jump to today.

## Installation

1. Build (or grab a release):
   ```bash
   npm install
   npm run build
   ```
   This produces `main.js` and `styles.css`.
2. Copy the plugin folder (containing `main.js`, `manifest.json`, `styles.css`) into `<your-vault>/.obsidian/plugins/calendar-events/`.
3. In Obsidian: Settings → Community plugins → enable **Calendar Events**.

## Commands

| Command                | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| Open Calendar sidebar  | Reveals/creates the right-pane calendar view.   |
| Edit today's events    | Opens the day editor for the current date.      |
| Jump to today          | Opens the sidebar and focuses on the current month. |

## How data is stored

A single `calendar-data.json` file at the vault root:

```json
{
  "version": 1,
  "categories": [
    { "id": "email", "label": "Email", "color": "#3a7bd5" }
  ],
  "days": {
    "2026-07-14": {
      "events": [
        { "id": "ev_xxx", "title": "Reply: renewal terms", "type": "email", "time": "10:00" }
      ],
      "checklist": [
        { "id": "chk_xxx", "text": "Send proposal to Acme", "done": false }
      ]
    }
  }
}
```

> Deleting the file resets the plugin to defaults; the plugin will recreate it on next load.

## Roadmap / ideas

- Per-event Markdown notes inside the editor.
- Drag-to-move events between days.
- Daily Note integration (write into a `YYYY-MM-DD.md` file instead of the JSON store).
- Sync to/from Google Calendar.

Pull requests welcome.
