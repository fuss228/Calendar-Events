export interface CalendarEvent {
  id: string;
  title: string;
  type: string; // category id, e.g. "email", "meeting", "task", "reminder"
  time?: string; // optional HH:mm
  note?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface DayData {
  events: CalendarEvent[];
  checklist: ChecklistItem[];
}

export interface Category {
  id: string;
  label: string;
  color: string; // CSS color, e.g. "#3a7bd5"
}

export interface CalendarStore {
  version: 1;
  categories: Category[];
  days: Record<string, DayData>; // key: YYYY-MM-DD
}

export const DATA_FILE = "calendar-data.json";

export function emptyDay(): DayData {
  return { events: [], checklist: [] };
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "email",   label: "Email",   color: "#3a7bd5" },
  { id: "meeting", label: "Meeting", color: "#7e57c2" },
  { id: "task",    label: "Task",    color: "#26a69a" },
  { id: "reminder",label: "Reminder",color: "#ef6c00" },
  { id: "personal",label: "Personal",color: "#ec407a" },
];
