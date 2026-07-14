import { ItemView, WorkspaceLeaf } from "obsidian";
import CalendarEventsPlugin from "../main";
import { DayEditorModal } from "../modals/DayEditorModal";

export const VIEW_TYPE_CALENDAR = "calendar-events-view";

interface DayCell {
  key: string; // YYYY-MM-DD, or "" for leading/trailing blanks
  day: number | null;
  inMonth: boolean;
}

export class CalendarView extends ItemView {
  private plugin: CalendarEventsPlugin;
  private cursor: Date = new Date();
  private monthLabelEl!: HTMLElement;
  private gridEl!: HTMLElement;
  private legendEl!: HTMLElement;
  private refreshTimer: number | null = null;
  private mounted = false;

  constructor(leaf: WorkspaceLeaf, plugin: CalendarEventsPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_CALENDAR;
  }

  getDisplayText(): string {
    return "Calendar Events";
  }

  getIcon(): string {
    return "calendar-with-checkmark";
  }

  async onOpen(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("cev-root");
    const t = this.plugin.strings();

    const header = root.createDiv({ cls: "cev-header" });
    const nav = header.createDiv({ cls: "cev-nav" });
    nav.createEl("button", { text: "◀", cls: "cev-nav-btn" }, (el) => {
      el.addEventListener("click", () => this.shiftMonth(-1));
    });
    nav.createEl("button", { text: t.monthToday, cls: "cev-today-btn" }, (el) => {
      el.addEventListener("click", () => {
        this.cursor = new Date();
        this.render();
      });
    });
    nav.createEl("button", { text: "▶", cls: "cev-nav-btn" }, (el) => {
      el.addEventListener("click", () => this.shiftMonth(1));
    });
    this.monthLabelEl = header.createDiv({ cls: "cev-month-label" });

    const weekdays = root.createDiv({ cls: "cev-weekdays" });
    const startMonday = this.plugin.settings.startWeekOnMonday;
    const labels = startMonday ? t.weekdaysStartMon : t.weekdays;
    for (const lbl of labels) {
      weekdays.createDiv({ cls: "cev-weekday", text: lbl });
    }

    this.gridEl = root.createDiv({ cls: "cev-grid" });

    this.legendEl = root.createDiv({ cls: "cev-legend" });
    this.mounted = true;
    this.render();
  }

  async onClose(): Promise<void> {
    this.mounted = false;
    if (this.refreshTimer !== null) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /** Public API: refresh the grid when underlying data changes. */
  requestRender(): void {
    if (this.mounted) this.render();
  }

  private shiftMonth(delta: number) {
    const d = new Date(this.cursor);
    d.setDate(1);
    d.setMonth(d.getMonth() + delta);
    this.cursor = d;
    this.render();
  }

  focusDate(key: string) {
    const [y, m] = key.split("-").map((s) => parseInt(s, 10));
    if (!y || !m) return;
    this.cursor = new Date(y, m - 1, 1);
    this.render();
  }

  private render() {
    if (!this.mounted) return;
    const t = this.plugin.strings();
    this.monthLabelEl.setText(this.formatMonthLabel(this.cursor));
    this.gridEl.empty();
    const cells = this.buildCells(this.cursor, this.plugin.settings.startWeekOnMonday);
    const todayKey = this.plugin.todayKey();

    for (const cell of cells) {
      const dayEl = this.gridEl.createDiv({ cls: "cev-cell" });
      if (!cell.inMonth) dayEl.addClass("cev-cell-out");
      if (cell.key === todayKey) dayEl.addClass("cev-cell-today");

      const numRow = dayEl.createDiv({ cls: "cev-cell-num" });
      numRow.setText(cell.day !== null ? String(cell.day) : "");

      if (cell.key) {
        const data = this.plugin.storage.getDay(cell.key);
        const dots = dayEl.createDiv({ cls: "cev-cell-dots" });
        const seen = new Set<string>();
        for (const ev of data.events) {
          if (seen.size >= 5) break;
          if (seen.has(ev.type)) continue;
          seen.add(ev.type);
          const cat = this.plugin.getCategory(ev.type);
          const dot = dots.createDiv({ cls: "cev-dot" });
          dot.style.backgroundColor = cat?.color ?? "#888";
        }
        if (data.events.length > 5) {
          dots.createDiv({ cls: "cev-dot cev-dot-more", text: `+${data.events.length - 5}` });
        }

        if (data.checklist.length > 0) {
          const remaining = data.checklist.filter((c) => !c.done).length;
          const badge = dayEl.createDiv({ cls: "cev-check-badge" });
          badge.setText(`${data.checklist.length - remaining}/${data.checklist.length}`);
          badge.title = `${remaining} open / ${data.checklist.length} total`;
        }

        if (data.notes && data.notes.length > 0) {
          const link = dayEl.createDiv({ cls: "cev-note-badge" });
          link.setText(`🔗${data.notes.length}`);
          link.title = `${data.notes.length} linked note(s)`;
          // Clicking the badge directly opens the first linked note.
          link.addEventListener("click", (ev) => {
            ev.stopPropagation();
            this.plugin.storage.openNoteRef(data.notes[0]);
          });
        }

        dayEl.addEventListener("click", () => {
          new DayEditorModal(this.plugin.app, this.plugin, cell.key).open();
        });
      }
    }

    this.renderLegend();

    if (this.refreshTimer !== null) window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => this.render(), 60_000);
  }

  private renderLegend() {
    this.legendEl.empty();
    const t = this.plugin.strings();
    this.legendEl.createSpan({ text: t.legend, cls: "cev-legend-title" });
    for (const cat of this.plugin.storage.getCategories()) {
      const chip = this.legendEl.createSpan({ cls: "cev-chip" });
      const swatch = chip.createSpan({ cls: "cev-chip-swatch" });
      swatch.style.backgroundColor = cat.color;
      chip.createSpan({ text: cat.label });
    }
  }

  private buildCells(month: Date, startMonday: boolean): DayCell[] {
    const year = month.getFullYear();
    const monthIdx = month.getMonth();
    const firstOfMonth = new Date(year, monthIdx, 1);
    const firstWeekday = firstOfMonth.getDay();
    const leading = startMonday ? (firstWeekday === 0 ? 6 : firstWeekday - 1) : firstWeekday;

    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const prevMonthLast = new Date(year, monthIdx, 0).getDate();

    const cells: DayCell[] = [];
    for (let i = leading - 1; i >= 0; i--) {
      const day = prevMonthLast - i;
      const date = new Date(year, monthIdx - 1, day);
      cells.push({
        key: this.plugin.formatDateKey(date),
        day,
        inMonth: false,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, monthIdx, d);
      cells.push({
        key: this.plugin.formatDateKey(date),
        day: d,
        inMonth: true,
      });
    }
    while (cells.length < 42) {
      const idx = cells.length - (leading + daysInMonth);
      const date = new Date(year, monthIdx + 1, idx + 1);
      cells.push({
        key: this.plugin.formatDateKey(date),
        day: idx + 1,
        inMonth: false,
      });
    }
    return cells;
  }

  private formatMonthLabel(d: Date): string {
    return d.toLocaleString(undefined, { year: "numeric", month: "long" });
  }
}
