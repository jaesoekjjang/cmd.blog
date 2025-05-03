import { PromptState } from "../shell";

export interface TerminalEmulator {
  addOutput: (output: string, style?: TextStyle) => void;
  clear: () => void;
  setShellPromptState: (prompt: PromptState) => void;
}

export interface TextStyle {
  foreground?: string;
  background?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  isHtml?: boolean;
}

export interface TerminalOutputItem {
  id: number;
  content: string;
  style?: TextStyle;
}
