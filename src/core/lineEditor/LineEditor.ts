import { OutputOptions } from './types';

export abstract class LineEditor {
  protected input: string = '';

  protected cursorSelectionStart_: number = 0;
  protected cursorSelectionEnd_: number = 0;

  protected suggestions: string[] = [];
  protected isAutoCompleteActive: boolean = false;
  protected selectedSuggestionIndex: number = -1;

  protected callbacks: LineEditorCallbacks;

  abstract clear(): void;
  abstract getInput(): string;
  abstract setInput(input: string): void;
  abstract addOutput(options: OutputOptions): void;
  abstract getSuggestions(): string[];
  /* eslint-disable-next-line */
  abstract handleKeyDown(...args: any[]): void;

  constructor(callbacks: LineEditorCallbacks) {
    this.callbacks = callbacks || {};
  }

  protected moveCursorToEnd() {
    this.cursorSelectionStart_ = this.input.length;
    this.cursorSelectionEnd_ = this.input.length;
    return this.cursorSelectionEnd_;
  }

  protected moveCursorToStart() {
    this.cursorSelectionStart_ = 0;
    this.cursorSelectionEnd_ = 0;
    return this.cursorSelectionEnd_;
  }

  protected moveCursorLeft() {
    if (this.cursorSelectionEnd_ > 0) {
      // 범위 선택이 있으면 선택을 취소하고 시작 위치로 커서 이동
      if (this.cursorSelectionStart_ !== this.cursorSelectionEnd_) {
        this.cursorSelectionEnd_ = this.cursorSelectionStart_;
      } else {
        // 있다면 왼쪽으로 커서 이동
        this.cursorSelectionStart_--;
        this.cursorSelectionEnd_ = this.cursorSelectionStart_;
      }
    }

    return this.cursorSelectionEnd_;
  }

  protected moveCursorRight() {
    if (this.cursorSelectionEnd_ < this.input.length) {
      // 범위 선택이 있으면 선택을 취소하고 끝 위치로 커서 이동
      if (this.cursorSelectionStart_ !== this.cursorSelectionEnd_) {
        this.cursorSelectionStart_ = this.cursorSelectionEnd_;
      } else {
        // 없다면 오른쪽으로 커서 이동
        this.cursorSelectionEnd_++;
        this.cursorSelectionStart_ = this.cursorSelectionEnd_;
      }
    }
    return this.cursorSelectionEnd_;
  }

  protected deactivateAutoComplete() {
    this.isAutoCompleteActive = false;
    this.selectedSuggestionIndex = -1;
    this.suggestions = [];
    this.callbacks.onSuggestionsChange?.([], this.selectedSuggestionIndex);
  }

  get cursorPosition() {
    return {
      start: this.cursorSelectionStart_,
      end: this.cursorSelectionEnd_,
    };
  }

  setCallbacks(callbacks: Partial<LineEditorCallbacks>) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  setSelection(start: number, end: number) {
    this.cursorSelectionStart_ = Math.max(0, Math.min(start, this.input.length));
    this.cursorSelectionEnd_ = Math.max(0, Math.min(end, this.input.length));

    return {
      selectionStart: this.cursorSelectionStart_,
      selectionEnd: this.cursorSelectionEnd_,
    };
  }
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
