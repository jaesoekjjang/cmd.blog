export interface HistoryManager {
  readonly history: string[];
  push(entry: string): void;
  clear(): void;
  current(): string | undefined;
  prev(): string | undefined;
  next(): string | undefined;
  goToStart(): void;
  goToEnd(): void;
  saveHistory(): void;
  loadHistory(): void;
}
