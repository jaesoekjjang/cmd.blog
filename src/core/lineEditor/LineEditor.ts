import { OutputOptions } from './types';

export interface LineEditor {
  clear: () => void;
  focus: () => void;
  getInput: () => string;
  setInput: (input: string) => void;
  addOutput: (options: OutputOptions) => void;
  getSuggestions: () => string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleKeyDown: (...args: any[]) => void;
  getCursorPosition: () => {
    start: number;
    end: number;
  };
  moveCursorToEnd: () => void;
  moveCursorToStart: () => void;
  moveCursorLeft: () => void;
  moveCursorRight: () => void;
}
