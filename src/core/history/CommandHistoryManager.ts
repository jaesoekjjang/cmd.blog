import { HistoryManager } from './HistoryManager';

export class CommandHistoryManager implements HistoryManager {
  private maxHistorySize: number;
  private history_: string[] = [];
  private historyIndex = 0;

  constructor(initialHistory: string[] = [], maxHistorySize: number = 1000) {
    this.history_ = [...initialHistory];
    this.historyIndex = this.history_.length;
    this.maxHistorySize = maxHistorySize;
  }

  get history() {
    return [...this.history_];
  }

  saveHistory(): void {
    throw new Error('Method not implemented.');
  }

  loadHistory(): void {
    throw new Error('Method not implemented.');
  }

  clear() {
    this.history_ = [];
    this.historyIndex = 0;
  }

  push(entry: string) {
    if (entry.trim() === '') return;

    if (this.history_.length >= this.maxHistorySize) {
      this.history_.shift();
    }

    this.history_.push(entry);
    this.historyIndex = this.history_.length;
  }

  current() {
    if (this.history_.length === 0) return '';
    if (this.historyIndex >= this.history_.length) return '';
    return this.history_[this.historyIndex];
  }

  prev() {
    if (this.history_.length === 0) return '';

    if (this.historyIndex > 0) {
      this.historyIndex--;
    }

    return this.current();
  }

  next() {
    if (this.historyIndex < this.history_.length) {
      this.historyIndex++;
    }

    return this.current();
  }

  goToStart() {
    if (this.history_.length === 0) return '';
    this.historyIndex = 0;
    return this.history_[this.historyIndex];
  }

  goToEnd() {
    if (this.history_.length === 0) {
      this.historyIndex = 0;
      return '';
    }
    this.historyIndex = this.history_.length;
    return '';
  }
}
