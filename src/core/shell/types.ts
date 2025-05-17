export interface PromptState {
  directory: string;
  prefix: string;
  date: string;
}

export interface ShellOptions {
  /**
   * tinydate format
   */
  dateFormat: string;
  promptPrefix: string;
}

export interface AutoComplete {
  suggestions: string[];
  index: number;
}
