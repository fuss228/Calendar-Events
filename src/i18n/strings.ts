// Lightweight i18n. Add new locales by extending Locale and Strings.

export type Locale = "auto" | "en" | "zh";

export interface Strings {
  viewTitle: string;
  monthPrev: string;
  monthNext: string;
  monthToday: string;
  weekdays: string[]; // 7 labels
  weekdaysStartMon: string[];
  legend: string;
  ribbonTooltip: string;

  modalTitlePrefix: string;
  eventCount: (n: number) => string;
  checklistCount: (open: number, total: number) => string;
  eventsHeading: string;
  checklistHeading: string;
  addEventLabel: string;
  addEventButton: string;
  addChecklistLabel: string;
  addChecklistButton: string;
  addChecklistPlaceholder: string;
  title: string;
  note: string;
  time: string;
  remove: string;
  clearDay: string;
  cancel: string;
  save: string;
  noEvents: string;
  noChecklist: string;
  savedNotice: (events: number, tasks: number, date: string) => string;
  confirmClear: string;

  settingsTitle: string;
  settingsLanguage: string;
  settingsLanguageDesc: string;
  settingsStartMon: string;
  settingsStartMonDesc: string;
  settingsShowWeekNumbers: string;
  settingsShowWeekNumbersDesc: string;
  settingsCategoriesHeading: string;
  settingsCategoriesHint: string;
  settingsAddCategory: string;
  settingsAdd: string;
  settingsExport: string;
  settingsExportDesc: string;
  settingsCopy: string;
  settingsCopied: string;
  settingsImport: string;
  settingsImportDesc: string;
  settingsReplace: string;
  settingsImported: string;
  settingsImportFailed: (e: string) => string;
  settingsRemoveConfirm: string;
  notesHeading: string;
  notesSearchLabel: string;
  notesSearchDesc: string;
  notesSearchPlaceholder: string;
  notesAddByUrl: string;
  notesUrlPrompt: string;
  invalidUrl: string;
  openNote: string;
  openExternal: string;
  noNotes: string;
}


const en: Strings = {
  viewTitle: "Calendar Events",
  monthPrev: "◀",
  monthNext: "▶",
  monthToday: "Today",
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekdaysStartMon: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  legend: "Categories: ",
  ribbonTooltip: "Open Calendar",

  modalTitlePrefix: "Events on ",
  eventCount: (n) => `${n} event(s)`,
  checklistCount: (open, total) => `${open}/${total} open task(s)`,
  eventsHeading: "Events",
  checklistHeading: "Checklist",
  addEventLabel: "Add an event",
  addEventButton: "New event",
  addChecklistLabel: "Add a task",
  addChecklistButton: "Add",
  addChecklistPlaceholder: "e.g. Reply to client email",
  title: "Title",
  note: "Note (optional)",
  time: "Time",
  remove: "Remove",
  clearDay: "Clear day",
  cancel: "Cancel",
  save: "Save",
  noEvents: "No events yet.",
  noChecklist: "No tasks yet.",
  savedNotice: (e, t, d) => `Saved ${e} event(s) and ${t} task(s) for ${d}.`,
  confirmClear: "Remove all events and checklist items for this day?",

  settingsTitle: "Calendar Events",
  settingsLanguage: "Language",
  settingsLanguageDesc: "Choose how the plugin's UI text appears. \"Auto\" follows Obsidian's display language.",
  settingsStartMon: "Start week on Monday",
  settingsStartMonDesc: "When enabled, the weekday header begins with Monday.",
  settingsShowWeekNumbers: "Show week numbers",
  settingsShowWeekNumbersDesc: "Display ISO week numbers on the left column.",
  settingsCategoriesHeading: "Event categories",
  settingsCategoriesHint: "Events are color-coded by category. Add or remove categories here.",
  settingsAddCategory: "Add a category",
  settingsAdd: "Add",
  settingsExport: "Export JSON",
  settingsExportDesc: "Copy the raw calendar-data.json content to your clipboard.",
  settingsCopy: "Copy",
  settingsCopied: "Data copied to clipboard.",
  settingsImport: "Import JSON",
  settingsImportDesc: "Paste calendar-data.json content to replace local data.",
  settingsReplace: "Replace",
  settingsImported: "Calendar data replaced.",
  settingsImportFailed: (e) => `Import failed: ${e}`,
  settingsRemoveConfirm: "Remove this category? Existing events keep the id.",
  notesHeading: "Linked notes",
  notesSearchLabel: "Link a note",
  notesSearchDesc: "Pick a vault file to associate with this day.",
  notesSearchPlaceholder: "Search vault notes…",
  notesAddByUrl: "Add URL…",
  notesUrlPrompt: "External link URL:",
  invalidUrl: "Please enter a valid http(s) URL.",
  openNote: "Open note",
  openExternal: "Open link in browser",
  noNotes: "No linked notes yet.",
};

const zh: Strings = {
  viewTitle: "日历事件",
  monthPrev: "◀",
  monthNext: "▶",
  monthToday: "今天",
  weekdays: ["日", "一", "二", "三", "四", "五", "六"],
  weekdaysStartMon: ["一", "二", "三", "四", "五", "六", "日"],
  legend: "类别：",
  ribbonTooltip: "打开日历",

  modalTitlePrefix: "事件：",
  eventCount: (n) => `${n} 个事件`,
  checklistCount: (open, total) => `${open}/${total} 个待办`,
  eventsHeading: "事件",
  checklistHeading: "清单",
  addEventLabel: "添加事件",
  addEventButton: "新建事件",
  addChecklistLabel: "添加任务",
  addChecklistButton: "添加",
  addChecklistPlaceholder: "例如：回复客户邮件",
  title: "标题",
  note: "备注（可选）",
  time: "时间",
  remove: "删除",
  clearDay: "清空当天",
  cancel: "取消",
  save: "保存",
  noEvents: "暂无事件。",
  noChecklist: "暂无任务。",
  savedNotice: (e, t, d) => `已保存 ${d} 的 ${e} 个事件与 ${t} 项任务。`,
  confirmClear: "确认清空当天所有事件和任务？",

  settingsTitle: "日历事件",
  settingsLanguage: "语言",
  settingsLanguageDesc: "选择插件界面语言。\"自动\" 会跟随 Obsidian 的显示语言。",
  settingsStartMon: "以周一开始",
  settingsStartMonDesc: "启用后，星期的标题从周一开始。",
  settingsShowWeekNumbers: "显示周数",
  settingsShowWeekNumbersDesc: "在左列显示 ISO 周数。",
  settingsCategoriesHeading: "事件类别",
  settingsCategoriesHint: "事件按类别着色，可在这里新增 / 修改 / 删除。",
  settingsAddCategory: "新增类别",
  settingsAdd: "添加",
  settingsExport: "导出 JSON",
  settingsExportDesc: "复制当前 calendar-data.json 的内容到剪贴板。",
  settingsCopy: "复制",
  settingsCopied: "已复制到剪贴板。",
  settingsImport: "导入 JSON",
  settingsImportDesc: "粘贴 calendar-data.json 内容以替换本地数据。",
  settingsReplace: "替换",
  settingsImported: "日历数据已替换。",
  settingsImportFailed: (e) => `导入失败：${e}`,
  settingsRemoveConfirm: "确认删除该类别？已有事件会保留该 id。",
  notesHeading: "关联笔记",
  notesSearchLabel: "关联笔记",
  notesSearchDesc: "选择一个 vault 内的笔记，把它与这一天关联起来。",
  notesSearchPlaceholder: "搜索 vault 笔记…",
  notesAddByUrl: "添加外链…",
  notesUrlPrompt: "外部链接地址：",
  invalidUrl: "请输入合法的 http(s) 链接。",
  openNote: "打开笔记",
  openExternal: "在浏览器中打开",
  noNotes: "暂无关联笔记。",
};

export const STRINGS: Record<"en" | "zh", Strings> = { en, zh };

/** Resolve which locale to use. "auto" → follow Obsidian's locale via the `obsidian` API. */
export function resolveLocale(setting: Locale, obsidianLocale?: string): "en" | "zh" {
  if (setting === "en" || setting === "zh") return setting;
  const lower = (obsidianLocale ?? "").toLowerCase();
  if (lower.startsWith("zh")) return "zh";
  return "en";
}

export function t(setting: Locale, obsidianLocale?: string): Strings {
  return STRINGS[resolveLocale(setting, obsidianLocale)];
}
