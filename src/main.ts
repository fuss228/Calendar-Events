import { Plugin, ItemView, WorkspaceLeaf, Notice } from "obsidian";
import { CalendarStorage } from "./storage";
import { CalendarView, VIEW_TYPE_CALENDAR } from "./views/CalendarView";
import { DayEditorModal } from "./modals/DayEditorModal";
import { CalendarEventsSettingTab } from "./SettingsTab";
import { Category } from "./types/model";

interface CalendarEventsSettings {
  showWeekNumbers: boolean;
  startWeekOnMonday: boolean;
  locale: "auto" | "en" | "zh";
}

const DEFAULT_SETTINGS: CalendarEventsSettings = {
  showWeekNumbers: false,
  startWeekOnMonday: false,
  locale: "auto",
};

import type { Strings } from "./i18n/strings";
import { t as i18n_t, resolveLocale } from "./i18n/strings";

export default class CalendarEventsPlugin extends Plugin {
  storage!: CalendarStorage;
  settings: CalendarEventsSettings = DEFAULT_SETTINGS;
  private calendarView: CalendarView | undefined;

  async onload() {
    this.storage = new CalendarStorage(this);
    await this.storage.load();

    this.registerView(
      VIEW_TYPE_CALENDAR,
      (leaf: WorkspaceLeaf) => (this.calendarView = new CalendarView(leaf, this))
    );

    this.addRibbonIcon("calendar-with-checkmark", this.strings().ribbonTooltip, () => void this.activateView());

    this.addCommand({
      id: "open-calendar-view",
      name: "Open Calendar sidebar",
      callback: () => void this.activateView(),
    });

    this.addCommand({
      id: "open-day-editor",
      name: "Edit today's events",
      callback: () => {
        new DayEditorModal(this.app, this, this.todayKey()).open();
      },
    });

    this.addCommand({
      id: "jump-to-today",
      name: "Jump sidebar calendar to today",
      callback: async () => {
        await this.activateView();
        this.calendarView?.focusDate(this.todayKey());
      },
    });
    window.addEventListener("calendar-events:updated", () => {
      this.calendarView?.requestRender();
    });

    this.addSettingTab(new CalendarEventsSettingTab(this.app, this));
  }

  onunload() {
    // Obsidian removes the view automatically.
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
    if (existing.length > 0) {
      workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = workspace.getRightLeaf(false);
    if (!leaf) {
      new Notice("Could not open the right sidebar.");
      return;
    }
    await leaf.setViewState({ type: VIEW_TYPE_CALENDAR, active: true });
    workspace.revealLeaf(leaf);
  }

  todayKey(): string {
    return this.formatDateKey(new Date());
  }

  formatDateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  getCategory(id: string): Category | undefined {
    return this.storage.getCategories().find((c) => c.id === id);
  }

  /** Best-effort: read the language used elsewhere in the vault. */
  private detectBrowserLocale(): string {
    // Obsidian doesn't expose getLocale() everywhere; rely on navigator language as a
    // reasonable proxy for "Auto" mode.
    try {
      if (typeof navigator !== "undefined" && navigator.language) {
        return navigator.language;
      }
    } catch (_) {}
    return "";
  }

  strings(): Strings {
    return i18n_t(this.settings.locale, this.detectBrowserLocale());
  }
  currentLocale(): "en" | "zh" {
    return resolveLocale(this.settings.locale, this.detectBrowserLocale());
  }
}
