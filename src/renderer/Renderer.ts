export interface Renderer {
  renderPrompt(prompt: {
    directory: string;
    prompt: string;
    history: string[];
  }): void;
  renderOutput(output: string): void;
  clearOutput: () => void;
}
