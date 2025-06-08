import { RenderedOutput } from '../filesystem/vFileSystem';

export interface OutputOptions {
  output: React.ReactNode;
  style?: TextStyle;
  type?: RenderedOutput['kind'];
}

export interface TextStyle {
  foreground?: string;
  background?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface OutputItem {
  id: number;
  output: string;
  style?: TextStyle;
  type?: RenderedOutput['kind'];
}

export interface CursorContext {
  line: string;
  cursor: number;
  currentWord: string;
  command: string;
}
