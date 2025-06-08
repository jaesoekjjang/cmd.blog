import { getKeyName } from './getKeyName';
import { LineEditor, LineEditorCallbacks } from './LineEditor';
import { CursorContext } from './types';

export class InputLineEditor extends LineEditor {
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

  constructor(callbacks: LineEditorCallbacks = {}) {
    super(callbacks);
  }

  getInput(): string {
    return this.input;
  }

  getSuggestions() {
    return this.suggestions;
  }

  setInput(input: string, updateCursor = true) {
    this.input = input;
    if (updateCursor) {
      this.cursorSelectionStart_ = input.length;
      this.cursorSelectionEnd_ = input.length;
    }
    this.callbacks.onInputChange?.(input);

    return this.cursorSelectionEnd_;
  }

  createInputLine() {
    this.setInput('');
    this.setSelection(0, 0);
    this.callbacks.onRequestLastCommand?.();
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

  private handleArrowUp() {
    const prevCommand = this.callbacks.onRequestPrevCommand?.();
    if (prevCommand !== undefined) {
      this.setInput(prevCommand || '');
    }
  }

  private handleArrowDown() {
    const nextCommand = this.callbacks.onRequestNextCommand?.();
    if (nextCommand !== undefined) {
      this.setInput(nextCommand || '');
    }
  }

  private handleEnter() {
    const trimmedInput = this.input.trim();
    this.callbacks.onCommandExecute?.(trimmedInput);
    this.createInputLine();
  }

  private handleSpace() {
    this.setInput(this.input + ' ');
  }

  private handleCtrlL() {
    this.callbacks.onRequestClear?.();
  }

  private handleCtrlU() {
    this.createInputLine();
  }

  private handleCtrlW() {
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

  private handleTab() {
    const trimmedInput = this.input.trim();

    if (!trimmedInput) {
      this.deactivateAutoComplete();
      this.setInput(this.input + '\t');
      return;
    }

    if (!this.isAutoCompleteActive) {
      const suggestions = this.callbacks.onRequestAutoComplete?.(this) || [];
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
      this.callbacks.onSuggestionsChange?.(this.suggestions, this.selectedSuggestionIndex);
    }
  }

  getcursorContext(): CursorContext | null {
    const line = this.getInput();
    const { end: cursor } = this.cursorPosition;

    if (line[cursor] === ' ') {
      return null;
    }

    const currentWord = this.extractCurrentWord(line, cursor);
    const args = line.slice(0, cursor).trim().split(/\s+/);
    const command = args[0] || '';

    return {
      line,
      cursor,
      currentWord,
      command,
    };
  }

  /**
   * 현재 커서 위치의 단어
   */
  private extractCurrentWord(line: string, cursor: number): string {
    const isAfterSpace = line[cursor - 1] === ' ';
    const noMoreWordsAfterCursor = line.slice(cursor).search(/\S/) === -1;

    if (isAfterSpace && noMoreWordsAfterCursor) {
      return '';
    }

    const leftBoundary = line.slice(0, cursor).search(/\S+$/);
    const rightSearch = line.slice(cursor).search(/\s|$/);

    const start = leftBoundary >= 0 ? leftBoundary : cursor;
    const end = rightSearch >= 0 ? cursor + rightSearch : line.length;

    return line.slice(start, end);
  }
}
