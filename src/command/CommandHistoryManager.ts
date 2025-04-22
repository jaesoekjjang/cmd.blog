export class CommandHistoryManager {
  private history: string[] = [];
  private listeners: ((history: string[]) => void)[] = [];

  constructor(initialHistory: string[] = []) {
    this.history = [...initialHistory];
  }

  addCommand(command: string) {
    this.history.push(command);
    this.notifyListeners();
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
    this.notifyListeners();
  }

  subscribe(listener: (history: string[]) => void) {
    this.listeners.push(listener);

    return () => this.removeListener(listener);
  }

  removeListener(listener: (history: string[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    const historyCopy = [...this.history];
    this.listeners.forEach((listener) => listener(historyCopy));
  }
}
