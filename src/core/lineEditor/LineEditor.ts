import { OutputOptions } from './types';

export abstract class LineEditor {
  protected callbacks: LineEditorCallbacks;

  constructor(callbacks: LineEditorCallbacks) {
    this.callbacks = callbacks || {};
  }

  setCallbacks(callbacks: Partial<LineEditorCallbacks>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  abstract clear(): void;
  abstract getInput(): string;
  abstract setInput(input: string): void;
  abstract addOutput(options: OutputOptions): void;
  abstract getSuggestions(): string[];
  /* eslint-disable-next-line */
  abstract handleKeyDown(...args: any[]): void;
  abstract getCursorPosition(): { start: number; end: number };
  abstract moveCursorToEnd(): void;
  abstract moveCursorToStart(): void;
  abstract moveCursorLeft(): void;
  abstract moveCursorRight(): void;
}

export interface LineEditorCallbacks {
  onInputChange?: (input: string) => void;
  onOutputsChange?: (outputs: OutputOptions[]) => void;
  onSuggestionsChange?: (suggestions: string[], index: number) => void;
  onCommandExecute?: (command: string) => void;
  onRequestPrevCommand?: () => void;
  onRequestNextCommand?: () => void;
  onRequestLastCommand?: () => void;
  onRequestClear?: () => void;
  onRequestAutoComplete?: () => void;
}
