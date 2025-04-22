export interface TerminalEmulator {
  addOutput: (output: string, style?: TextStyle) => void;
  clear: () => void;
  setShellPromptState: (prompt: PromptState) => void;
}

export interface PromptState {
  directory: string;
  prefix: string;
  date: string;
}

export interface TextStyle {
  foreground?: string;
  background?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}
