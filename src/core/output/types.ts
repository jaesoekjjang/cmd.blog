export interface OutputItem {
  id?: number;
  output: string;
  type?: 'text' | 'html' | 'markdown';
  style?: {
    foreground?: string;
    background?: string;
    bold?: boolean;
    italic?: boolean;
  };
}

export interface OutputManger {
  addOutput(output: Omit<OutputItem, 'id'>): void;
  clearOutputs(): void;
  getOutputs(): OutputItem[];
  on(event: 'outputsChanged', listener: (outputs: OutputItem[]) => void): void;
  off(event: 'outputsChanged', listener: (outputs: OutputItem[]) => void): void;
}
