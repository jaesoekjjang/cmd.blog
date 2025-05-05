export interface OutputOptions {
  output: React.ReactNode;
  style?: TextStyle;
  type?: "text" | "react";
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
  output: React.ReactNode;
  style?: TextStyle;
  type?: "text" | "react";
}
