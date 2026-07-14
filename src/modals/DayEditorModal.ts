import { App, Modal, Notice, Setting } from "obsidian";
import CalendarEventsPlugin from "../main";
import { CalendarEvent, ChecklistItem, Category, DayData } from "../types/model";
import { makeId } from "../storage";

export class DayEditorModal extends Modal {
  private plugin: CalendarEventsPlugin;
  private dateKey: string;
  private data: DayData;
  private eventsContainer!: HTMLElement;
  private checklistContainer!: HTMLElement;
  private summaryEl!: HTMLElement;
  private t!: import("../i18n/strings").Strings;

  constructor(app: App, plugin: CalendarEventsPlugin, dateKey: string) {
    super(app);
    this.plugin = plugin;
    this.dateKey = dateKey;
    this.data = clone(plugin.storage.getDay(dateKey));
  }

  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.empty();
    this.t = this.plugin.strings();
    titleEl.setText(`${this.t.modalTitlePrefix}${formatPretty(this.dateKey, this.plugin.currentLocale())}`);

    const root = contentEl.createDiv({ cls: "cev-modal-root" });

    this.summaryEl = root.createDiv({ cls: "cev-summary" });
    this.renderSummary();

    const grid = root.createDiv({ cls: "cev-modal-grid" });

    // --- Events column ---
    const eventsCol = grid.createDiv({ cls: "cev-col cev-col-events" });
    eventsCol.createEl("h3", { text: this.t.eventsHeading });
    this.eventsContainer = eventsCol.createDiv({ cls: "cev-list" });
    new Setting(eventsCol)
      .setName(this.t.addEventLabel)
      .addButton((btn) =>
        btn.setButtonText(this.t.addEventButton).onClick(() => {
          const firstCat = this.plugin.storage.getCategories()[0]?.id ?? "task";
          this.data.events.push({
            id: makeId("ev"),
            title: "",
            type: firstCat,
          });
          this.renderEvents();
          this.renderSummary();
        })
      );

    // --- Checklist column ---
    const checkCol = grid.createDiv({ cls: "cev-col cev-col-checklist" });
    checkCol.createEl("h3", { text: this.t.checklistHeading });
    this.checklistContainer = checkCol.createDiv({ cls: "cev-checklist" });
    let newCheckText = "";
    new Setting(checkCol)
      .setName(this.t.addChecklistLabel)
      .addText((txt) => {
        txt.setPlaceholder(this.t.addChecklistPlaceholder);
        txt.onChange((v) => (newCheckText = v));
        txt.inputEl.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            this.addChecklist(newCheckText);
            newCheckText = "";
            txt.setValue("");
          }
        });
      })
      .addButton((btn) =>
        btn.setButtonText(this.t.addChecklistButton).onClick(() => {
          this.addChecklist(newCheckText);
          newCheckText = "";
        })
      );

    this.renderEvents();
    this.renderChecklist();

    const buttons = root.createDiv({ cls: "cev-modal-buttons" });
    buttons.createEl("button", { text: this.t.clearDay, cls: "cev-btn-warn" }, (el) => {
      el.addEventListener("click", () => {
        if (confirm(this.t.confirmClear)) {
          this.data.events = [];
          this.data.checklist = [];
          this.renderEvents();
          this.renderChecklist();
          this.renderSummary();
        }
      });
    });
    buttons.createEl("button", { text: this.t.cancel, cls: "cev-btn" }, (el) => {
      el.addEventListener("click", () => this.close());
    });
    buttons.createEl("button", { text: this.t.save, cls: "cev-btn cev-btn-primary" }, (el) => {
      el.addEventListener("click", () => {
        // Drop empty events (no title) before saving.
        this.data.events = this.data.events.filter((e) => e.title.trim().length > 0);
        this.plugin.storage.setDay(this.dateKey, this.data);
        new Notice(this.t.savedNotice(this.data.events.length, this.data.checklist.length, formatPretty(this.dateKey, this.plugin.currentLocale())));
        this.close();
        this.dispatchRefresh();
      });
    });
  }

  onClose() {
    this.contentEl.empty();
    this.dispatchRefresh();
  }

  private dispatchRefresh() {
    // Tell any open CalendarView to re-render via a custom event.
    window.dispatchEvent(new CustomEvent("calendar-events:updated"));
  }

  private addChecklist(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.data.checklist.push({ id: makeId("chk"), text: trimmed, done: false });
    this.renderChecklist();
    this.renderSummary();
  }

  private renderSummary() {
    const open = this.data.checklist.filter((c) => !c.done).length;
    this.summaryEl.empty();
    this.summaryEl.createSpan({ text: `${this.t.eventCount(this.data.events.length)}, ${this.t.checklistCount(open, this.data.checklist.length)}.` });
  }

  private renderEvents() {
    this.eventsContainer.empty();
    if (this.data.events.length === 0) {
      this.eventsContainer.createDiv({ cls: "cev-empty", text: this.t.noEvents });
      return;
    }
    const cats = this.plugin.storage.getCategories();
    this.data.events.forEach((ev, idx) => {
      const row = this.eventsContainer.createDiv({ cls: "cev-event-row" });
      row.style.borderLeftColor = colorOf(ev.type, this.plugin);

      // Color + category select
      const swatch = row.createDiv({ cls: "cev-event-swatch" });
      swatch.style.backgroundColor = colorOf(ev.type, this.plugin);
      swatch.title = "Event category color";

      const catSelect = row.createEl("select", { cls: "cev-event-category" });
      for (const cat of cats) {
        const opt = catSelect.createEl("option", { text: cat.label, value: cat.id });
        if (cat.id === ev.type) opt.selected = true;
        opt.style.color = cat.color;
      }
      catSelect.addEventListener("change", () => {
        ev.type = catSelect.value;
        swatch.style.backgroundColor = colorOf(ev.type, this.plugin);
        row.style.borderLeftColor = colorOf(ev.type, this.plugin);
      });

      const titleInput = row.createEl("input", {
        type: "text",
        cls: "cev-event-title",
        value: ev.title,
        placeholder: this.t.title,
      });
      titleInput.value = ev.title;
      titleInput.addEventListener("input", () => {
        ev.title = titleInput.value;
      });

      const timeInput = row.createEl("input", {
        type: "time",
        cls: "cev-event-time",
        value: ev.time ?? "",
      });
      timeInput.value = ev.time ?? "";
      timeInput.addEventListener("input", () => {
        ev.time = timeInput.value;
      });

      const noteInput = row.createEl("input", {
        type: "text",
        cls: "cev-event-note",
        value: ev.note ?? "",
        placeholder: this.t.note,
      });
      noteInput.value = ev.note ?? "";
      noteInput.addEventListener("input", () => {
        ev.note = noteInput.value;
      });

      const removeBtn = row.createEl("button", { cls: "cev-event-remove", text: "✕" });
      removeBtn.title = this.t.remove;
      removeBtn.addEventListener("click", () => {
        this.data.events.splice(idx, 1);
        this.renderEvents();
        this.renderSummary();
      });
    });
  }

  private renderChecklist() {
    this.checklistContainer.empty();
    if (this.data.checklist.length === 0) {
      this.checklistContainer.createDiv({ cls: "cev-empty", text: this.t.noChecklist });
      return;
    }
    this.data.checklist.forEach((item, idx) => {
      const row = this.checklistContainer.createDiv({ cls: "cev-check-row" });
      const cb = row.createEl("input", { type: "checkbox" });
      cb.checked = item.done;
      const text = row.createEl("input", {
        type: "text",
        cls: "cev-check-text",
        value: item.text,
      });
      text.value = item.text;
      if (item.done) text.addClass("cev-check-done");

      cb.addEventListener("change", () => {
        item.done = cb.checked;
        text.toggleClass("cev-check-done", item.done);
        this.renderSummary();
      });
      text.addEventListener("input", () => {
        item.text = text.value;
      });
      const removeBtn = row.createEl("button", { cls: "cev-event-remove", text: "✕" });
      removeBtn.title = this.t.remove;
      removeBtn.addEventListener("click", () => {
        this.data.checklist.splice(idx, 1);
        this.renderChecklist();
        this.renderSummary();
      });
    });
  }
}

function clone(d: DayData): DayData {
  return {
    events: d.events.map((e) => ({ ...e })),
    checklist: d.checklist.map((c) => ({ ...c })),
  };
}

function colorOf(typeId: string, plugin: CalendarEventsPlugin): string {
  const cat: Category | undefined = plugin.getCategory(typeId);
  return cat?.color ?? "#888";
}

function formatPretty(key: string, loc: "en" | "zh"): string {
  const [y, m, d] = key.split("-").map((s) => parseInt(s, 10));
  if (!y || !m || !d) return key;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(loc === "zh" ? "zh-CN" : "en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" });
}
