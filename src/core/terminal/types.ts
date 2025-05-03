import { PromptState } from "../shell";

export interface TerminalEmulator {
  addOutput: (_: {
    output: React.ReactNode;
    style?: TextStyle;
    type?: "text" | "react";
  }) => void;
  clear: () => void;
  setShellPromptState: (prompt: PromptState) => void;
}

export interface TextStyle {
  foreground?: string;
  background?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface TerminalOutputItem {
  id: number;
  content: React.ReactNode;
  style?: TextStyle;
  type?: "text" | "react";
}
