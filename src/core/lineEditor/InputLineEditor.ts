import { Shell } from '../shell';
import { LineEditor } from './LineEditor';
import { OutputOptions } from './types';

const getKeyName = (e: React.KeyboardEvent) => {
  if (e.ctrlKey) {
    return `<C-${e.key}>`;
  } else if (e.shiftKey) {
    return `<S-${e.key}>`;
  } else if (e.altKey) {
    return `<A-${e.key}>`;
  }

  if (e.key === ' ' || e.key === 'Spacebar') {
    return 'Space';
  }

  return e.key;
};

export class InputLineEditor implements LineEditor {
  private shell: Shell | null = null;
  private input: string = '';
  private outputs: OutputOptions[] = [];
  private suggestions: string[] = [];

  private isAutoCompleteActive: boolean = false;
  private selectedSuggestionIndex: number = -1;

  private cursorSelectionStart_: number = 0;
  private cursorSelectionEnd_: number = 0;

  private onInputChange?: (input: string) => void;
  private onOutputsChange?: (outputs: OutputOptions[]) => void;
  private onSuggestionsChange?: (suggestions: string[], index: number) => void;
  private onFocus?: () => void;

  private keyHandlers: Record<string, () => void | number> = {
    ArrowUp: this.handleArrowUp.bind(this),
    ArrowDown: this.handleArrowDown.bind(this),
    ArrowLeft: this.moveCursorLeft.bind(this),
    ArrowRight: this.moveCursorRight.bind(this),
    Enter: this.handleEnter.bind(this),
    Tab: this.handleTab.bind(this),
    Home: this.moveCursorToStart.bind(this),
    End: this.moveCursorToEnd.bind(this),
    Space: this.handleSpace.bind(this),
    '<C-l>': this.handleCtrlL.bind(this),
    '<C-u>': this.handleCtrlU.bind(this),
    '<C-e>': this.moveCursorToEnd.bind(this),
    '<C-a>': this.moveCursorToStart.bind(this),
    '<C-w>': this.handleCtrlW.bind(this),
  };

  constructor(callbacks?: {
    onInputChange?: (input: string) => void;
    onOutputsChange?: (outputs: OutputOptions[]) => void;
    onSuggestionsChange?: (suggestions: string[], index: number) => void;
    onFocus?: () => void;
  }) {
    this.onInputChange = callbacks?.onInputChange;
    this.onOutputsChange = callbacks?.onOutputsChange;
    this.onSuggestionsChange = callbacks?.onSuggestionsChange;
    this.onFocus = callbacks?.onFocus;
  }

  get cursorSelectionStart() {
    return this.cursorSelectionStart_;
  }

  get cursorSelectionEnd() {
    return this.cursorSelectionEnd_;
  }

  setShell(shell: Shell) {
    this.shell = shell;
  }

  clear() {
    this.outputs = [];
    this.onOutputsChange?.(this.outputs);
  }

  addOutput(options: OutputOptions) {
    this.outputs.push(options);
    if (this.onOutputsChange) {
      this.onOutputsChange([...this.outputs]);
    }
  }

  focus() {
    if (this.onFocus) {
      this.onFocus();
    }
  }

  getInput(): string {
    return this.input;
  }

  setInput(input: string, updateCursor = true) {
    this.input = input;
    if (updateCursor) {
      this.cursorSelectionStart_ = input.length;
      this.cursorSelectionEnd_ = input.length;
    }
    if (this.onInputChange) {
      this.onInputChange(input);
    }

    return this.cursorSelectionEnd_;
  }

  getSuggestions() {
    return this.suggestions;
  }

  createInputLine() {
    this.setInput('');
    this.setSelection(0, 0);
    this.shell?.goToLastCommand();
  }

  setSelection(start: number, end: number) {
    this.cursorSelectionStart_ = Math.max(0, Math.min(start, this.input.length));
    this.cursorSelectionEnd_ = Math.max(0, Math.min(end, this.input.length));

    return {
      selectionStart: this.cursorSelectionStart_,
      selectionEnd: this.cursorSelectionEnd_,
    };
  }

  getCursorPosition() {
    return {
      start: this.cursorSelectionStart_,
      end: this.cursorSelectionEnd_,
    };
  }

  moveCursorToEnd() {
    this.cursorSelectionStart_ = this.input.length;
    this.cursorSelectionEnd_ = this.input.length;
    return this.cursorSelectionEnd_;
  }

  moveCursorToStart() {
    this.cursorSelectionStart_ = 0;
    this.cursorSelectionEnd_ = 0;
    return this.cursorSelectionEnd_;
  }

  moveCursorLeft() {
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

  moveCursorRight() {
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

  handleKeyDown(e: React.KeyboardEvent) {
    const keyName = getKeyName(e);
    const handler = this.keyHandlers[keyName];

    if (keyName !== 'Tab' && this.isAutoCompleteActive) {
      this.deactivateAutoComplete();
    }

    if (handler) {
      e.preventDefault();
      return handler();
    }
  }

  private handleArrowUp() {
    if (!this.shell) return;

    const prevCommand = this.shell.getPreviousCommand();
    this.setInput(prevCommand || '');
  }

  private handleArrowDown() {
    if (!this.shell) return;

    const nextCommand = this.shell.getNextCommand();
    this.setInput(nextCommand || '');
  }

  private handleEnter() {
    if (!this.shell) return;

    const trimmedInput = this.input.trim();
    if (trimmedInput) {
      this.shell.executeCommand(trimmedInput);
    } else {
      this.shell.outputToTerminal('', { newline: true });
    }

    this.createInputLine();
  }

  private handleSpace() {
    if (!this.shell) return;

    this.setInput(this.input + ' ');
  }

  private handleTab() {
    if (!this.shell) return;

    const trimmedInput = this.input.trim();

    if (!trimmedInput) {
      this.deactivateAutoComplete();
      this.setInput(this.input + '\t');
      return;
    }

    if (!this.isAutoCompleteActive) {
      const suggestions = this.shell.getAutocompleteSuggestions();
      this.suggestions = suggestions;
      this.isAutoCompleteActive = true;
      this.selectedSuggestionIndex = 0;
      this.applySuggestion(this.selectedSuggestionIndex);
    } else if (this.suggestions.length > 0) {
      this.selectedSuggestionIndex = ++this.selectedSuggestionIndex % this.suggestions.length;
      this.applySuggestion(this.selectedSuggestionIndex);
    }
  }

  // 현재 커서가 위치한 단어를 suggestion으로 대치
  private applySuggestion(index: number) {
    if (index >= 0 && index < this.suggestions.length) {
      const suggestion = this.suggestions[index];

      const input = this.input;
      const cursorStart = this.cursorSelectionStart_;
      const cursorEnd = this.cursorSelectionEnd_;
      const beforeCursor = input.slice(0, cursorStart);
      const afterCursor = input.slice(cursorEnd);
      const lastWordBoundary = beforeCursor.lastIndexOf(' ');

      const newBeforeCursor =
        lastWordBoundary === -1 ? suggestion : beforeCursor.slice(0, lastWordBoundary + 1) + suggestion;
      const newInput = newBeforeCursor + afterCursor;

      this.cursorSelectionStart_ = this.cursorSelectionEnd_ = newBeforeCursor?.length || 0;
      this.setInput(newInput);
      this.onSuggestionsChange?.(this.suggestions, this.selectedSuggestionIndex);
    }
  }

  private deactivateAutoComplete() {
    this.isAutoCompleteActive = false;
    this.selectedSuggestionIndex = -1;
    this.suggestions = [];
    this.onSuggestionsChange?.([], this.selectedSuggestionIndex);
  }

  private handleCtrlL() {
    if (!this.shell) return;

    this.shell.clearOutput();
  }

  private handleCtrlU() {
    if (!this.shell) return;

    this.createInputLine();
  }

  private handleCtrlW() {
    if (!this.shell) return;

    const input = this.input;
    const cursor = this.cursorSelectionStart_;

    const beforeCursor = input.slice(0, cursor);
    const afterCursor = input.slice(this.cursorSelectionEnd_);

    // 커서 앞 마지막 단어 + 공백
    const newBeforeCursor = beforeCursor.replace(/(\s*)\S+\s*$/, '');

    const newCursor = newBeforeCursor.length;
    const newInput = newBeforeCursor + afterCursor;

    this.setInput(newInput);
    this.setSelection(newCursor, newCursor);
  }

  handleTextInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newInput = e.target.value;

    /**
     * @description 단축키로 커서 이동 시, Input과 LineEditor 사이 커서 위치가 동기화되지 않기 때문에
     * 커서 위치 자동 업데이트 안 함
     * */
    this.setInput(newInput, false);

    // input의 입력 이벤트로부터 선택 범위 manual 업데이트
    if (e.target.selectionStart !== null && e.target.selectionEnd !== null) {
      this.setSelection(e.target.selectionStart, e.target.selectionEnd);
    }
  }
}
