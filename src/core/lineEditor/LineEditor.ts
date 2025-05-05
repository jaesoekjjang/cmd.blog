import { PromptState } from "../shell";
import { OutputOptions } from "./types";

export interface LineEditor {
  addOutput: (options: OutputOptions) => void;
  clear: () => void;
  setShellPromptState: (state: PromptState) => void;
  focus: () => void;
  getInput: () => string;
  setInput: (input: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleKeyDown: (...args: any[]) => void;
  moveCursorToEnd: () => void;
  moveCursorToStart: () => void;
  moveCursorLeft: () => void;
  moveCursorRight: () => void;
}
