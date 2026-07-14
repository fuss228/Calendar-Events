import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import CalendarEventsPlugin from "./main";
import { Category } from "./types/model";
import { makeId } from "./storage";

const PRESET_COLORS = [
  "#e91e63", "#9c27b0", "#3f51b5", "#03a9f4", "#009688",
  "#4caf50", "#ff9800", "#795548", "#607d8b", "#ec407a",
];

export class CalendarEventsSettingTab extends PluginSettingTab {
  private plugin: CalendarEventsPlugin;

  constructor(app: App, plugin: CalendarEventsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const t = this.plugin.strings();
    containerEl.empty();
    containerEl.createEl("h2", { text: t.settingsTitle });

    new Setting(containerEl)
      .setName(t.settingsLanguage)
      .setDesc(t.settingsLanguageDesc)
      .addDropdown((dd) => {
        const cur = this.plugin.currentLocale();
        const autoLabel = cur === "zh" ? "自动 (跟随 Obsidian)" : "Auto (follow Obsidian)";
        dd.addOption("auto", autoLabel);
        dd.addOption("en", "English");
        dd.addOption("zh", "中文");
        dd.setValue(this.plugin.settings.locale);
        dd.onChange(async (v) => {
          this.plugin.settings.locale = v as "auto" | "en" | "zh";
          await this.plugin.saveData(this.plugin.settings);
          this.display();
        });
      });

    new Setting(containerEl)
      .setName(t.settingsStartMon)
      .setDesc(t.settingsStartMonDesc)
      .addToggle((tg) =>
        tg.setValue(this.plugin.settings.startWeekOnMonday).onChange(async (v) => {
          this.plugin.settings.startWeekOnMonday = v;
          await this.plugin.saveData(this.plugin.settings);
        })
      );

    new Setting(containerEl)
      .setName("Show week numbers")
      .setDesc("Display ISO week numbers on the left column.")
      .addToggle((tg) =>
        tg.setValue(this.plugin.settings.showWeekNumbers).onChange(async (v) => {
          this.plugin.settings.showWeekNumbers = v;
          await this.plugin.saveData(this.plugin.settings);
        })
      );

    containerEl.createEl("h3", { text: t.settingsCategoriesHeading });
    containerEl.createEl("p", {
      text: t.settingsCategoriesHint,
      cls: "setting-item-description",
    });

    const list = containerEl.createDiv({ cls: "cev-cat-list" });
    const cats = this.plugin.storage.getCategories();
    cats.forEach((cat, idx) => this.renderCategoryRow(list, cat, idx));

    new Setting(containerEl)
      .setName(t.settingsAddCategory)
      .addButton((btn) =>
        btn.setButtonText(t.settingsAdd).onClick(() => {
          const next: Category = {
            id: makeId("cat"),
            label: "New category",
            color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
          };
          const updated = [...this.plugin.storage.getCategories(), next];
          this.plugin.storage.setCategories(updated);
          this.display();
        })
      );

    containerEl.createEl("h3", { text: "Color presets" });
    const presets = containerEl.createDiv({ cls: "cev-presets" });
    for (const c of PRESET_COLORS) {
      const swatch = presets.createDiv({ cls: "cev-preset-swatch" });
      swatch.style.backgroundColor = c;
      swatch.title = c;
    }

    containerEl.createEl("h3", { text: "Data" });
    new Setting(containerEl)
      .setName(t.settingsExport)
      .setDesc(t.settingsExportDesc)
      .addButton((btn) =>
        btn.setButtonText(t.settingsCopy).onClick(async () => {
          const json = JSON.stringify(this.plugin.storage.getAll(), null, 2);
          await navigator.clipboard.writeText(json);
          new Notice(t.settingsCopied);
        })
      );
    let importText = "";
    new Setting(containerEl)
      .setName(t.settingsImport)
      .setDesc(t.settingsImportDesc)
      .addTextArea((ta) => {
        ta.setPlaceholder("{ ... }");
        ta.onChange((v) => (importText = v));
        ta.inputEl.rows = 6;
        ta.inputEl.cols = 40;
      })
      .addButton((btn) =>
        btn
          .setButtonText(t.settingsReplace)
          .setWarning()
          .onClick(() => {
            try {
              const parsed = JSON.parse(importText);
              if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.categories)) {
                throw new Error("missing categories array");
              }
              this.plugin.storage.setAll(parsed);  // unchanged
              new Notice(
                t.settingsImported
              );
              window.dispatchEvent(new CustomEvent("calendar-events:updated"));
            } catch (e) {
              new Notice(
                t.settingsImportFailed((e as Error).message)
              );
            }
          })
      );
  }

  private renderCategoryRow(container: HTMLElement, cat: Category, idx: number) {
    const row = container.createDiv({ cls: "cev-cat-row" });
    const colorPicker = row.createEl("input", { type: "color", cls: "cev-color-picker" });
    colorPicker.value = cat.color;
    colorPicker.addEventListener("input", () => {
      cat.color = colorPicker.value;
      this.persistCats();
    });
    const labelInput = row.createEl("input", { type: "text", cls: "cev-cat-label" });
    labelInput.value = cat.label;
    labelInput.addEventListener("input", () => {
      cat.label = labelInput.value;
      this.persistCats();
    });
    const idLabel = row.createEl("span", { cls: "cev-cat-id", text: cat.id });
    idLabel.title = "Internal id; safe to rename label, but the id stays the same for existing events.";

    const removeBtn = row.createEl("button", { text: this.plugin.strings().remove, cls: "cev-btn-warn" });
    removeBtn.addEventListener("click", () => {
      const updated = this.plugin.storage.getCategories().filter((_, i) => i !== idx);
      this.plugin.storage.setCategories(updated);
      this.display();
    });

    // Preset swatches for quick color changes
    const presetsRow = row.createDiv({ cls: "cev-cat-presets" });
    for (const c of PRESET_COLORS) {
      const sw = presetsRow.createDiv({ cls: "cev-preset-swatch" });
      sw.style.backgroundColor = c;
      sw.title = c;
      sw.addEventListener("click", () => {
        cat.color = c;
        colorPicker.value = c;
        this.persistCats();
      });
    }
  }

  private persistCats() {
    this.plugin.storage.setCategories(this.plugin.storage.getCategories().slice());
  }
}
