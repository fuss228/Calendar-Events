import { App, normalizePath, Plugin } from "obsidian";
import { CalendarStore, DayData, DEFAULT_CATEGORIES, DATA_FILE, emptyDay } from "./types/model";

export class CalendarStorage {
  private plugin: Plugin;
  private app: App;
  private data: CalendarStore;
  private saveTimer: number | null = null;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.app = plugin.app;
    this.data = this.makeDefault();
  }

  private makeDefault(): CalendarStore {
    return {
      version: 1,
      categories: DEFAULT_CATEGORIES.slice(),
      days: {},
    };
  }

  async load(): Promise<void> {
    const path = normalizePath(DATA_FILE);
    const adapter = this.app.vault.adapter;
    if (!(await adapter.exists(path))) {
      this.data = this.makeDefault();
      await this.saveNow();
      return;
    }
    try {
      const raw = await adapter.read(path);
      const parsed = JSON.parse(raw) as Partial<CalendarStore>;
      const fallback = this.makeDefault();
      this.data = {
        version: 1,
        categories:
          Array.isArray(parsed.categories) && parsed.categories.length > 0
            ? parsed.categories
            : fallback.categories,
        days: parsed.days && typeof parsed.days === "object" ? (parsed.days as Record<string, DayData>) : {},
      };
    } catch (e) {
      console.error("[CalendarEvents] failed to parse data file, resetting", e);
      this.data = this.makeDefault();
      await this.saveNow();
    }
  }

  getDay(dateKey: string): DayData {
    return this.data.days[dateKey] ?? emptyDay();
  }

  /** Replace the day entirely. */
  setDay(dateKey: string, day: DayData): void {
    const cleaned: DayData = {
      events: Array.isArray(day.events) ? day.events : [],
      checklist: Array.isArray(day.checklist) ? day.checklist : [],
    };
    if (cleaned.events.length === 0 && cleaned.checklist.length === 0) {
      delete this.data.days[dateKey];
    } else {
      this.data.days[dateKey] = cleaned;
    }
    this.scheduleSave();
  }

  getCategories() {
    return this.data.categories;
  }

  setCategories(cats: typeof this.data.categories) {
    this.data.categories = cats;
    this.scheduleSave();
  }

  getAll(): CalendarStore {
    return this.data;
  }

  setAll(next: CalendarStore) {
    this.data = next;
    this.scheduleSave();
  }

  private scheduleSave() {
    if (this.saveTimer !== null) {
      window.clearTimeout(this.saveTimer);
    }
    this.saveTimer = window.setTimeout(() => {
      void this.saveNow();
    }, 200);
  }

  async saveNow(): Promise<void> {
    const path = normalizePath(DATA_FILE);
    await this.app.vault.adapter.write(path, JSON.stringify(this.data, null, 2));
  }
}

export function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
