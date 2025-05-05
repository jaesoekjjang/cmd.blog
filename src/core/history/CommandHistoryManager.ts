import { HistoryManager } from "./HistoryManager";

export class CommandHistoryManager implements HistoryManager {
  private readonly maxHistorySize = 1000;
  private history_: string[] = [];
  private historyIndex = 0;
  private listeners: ((history: string[]) => void)[] = [];

  constructor(initialHistory: string[] = []) {
    this.history_ = [...initialHistory];
    this.historyIndex = this.history_.length;
  }

  get history() {
    return [...this.history_];
  }

  saveHistory(): void {
    throw new Error("Method not implemented.");
  }
  loadHistory(): void {
    throw new Error("Method not implemented.");
  }

  clear() {
    this.history_ = [];
    this.historyIndex = 0;
    this.notifyListeners();
  }

  push(entry: string) {
    if (entry.trim() === "") return;

    if (this.history_.length >= this.maxHistorySize) {
      this.history_.shift();
    }

    this.history_.push(entry);
    this.historyIndex = this.history_.length;
    this.notifyListeners();
  }

  current() {
    if (this.history_.length === 0) return "";
    if (this.historyIndex < 0) return this.history_[0];
    return this.history_[this.historyIndex];
  }

  prev() {
    if (this.history_.length === 0) return "";

    if (this.historyIndex > 0) {
      this.historyIndex--;
    }

    return this.history_[this.historyIndex];
  }

  next() {
    if (this.historyIndex < this.history_.length) {
      this.historyIndex++;
    }

    if (this.historyIndex === this.history_.length) {
      return ""; // 빈 입력 줄
    }

    return this.history_[this.historyIndex];
  }

  goToStart() {
    this.historyIndex = 0;
    return this.history_[this.historyIndex];
  }

  goToEnd() {
    if (this.history_.length === 0) {
      this.historyIndex = 0;
      return "";
    }
    this.historyIndex = this.history_.length - 1;
    return this.history_[this.historyIndex];
  }

  subscribe(listener: (history: string[]) => void) {
    this.listeners.push(listener);
    return () => this.removeListener(listener);
  }

  removeListener(listener: (history: string[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    const historyCopy = [...this.history_];
    this.listeners.forEach((listener) => listener(historyCopy));
  }
}
