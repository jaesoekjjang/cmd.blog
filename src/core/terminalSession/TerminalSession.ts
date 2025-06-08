export type TerminalMode = (typeof TerminalMode)[keyof typeof TerminalMode];

export const TerminalMode = {
  CANONICAL: 'canonical',
  RAW: 'raw',
} as const;

export class TerminalSession {
  private viewportWidth: number;
  private viewportHeight: number;
  private currentMode: (typeof TerminalMode)[keyof typeof TerminalMode];
  private outputs: Array<{
    output: string;
    style?: {
      foreground?: string;
      background?: string;
      bold?: boolean;
      italic?: boolean;
    };
    type?: string;
  }>;
  private eventListeners: Record<string, Array<(...args: any[]) => void>>;

  constructor() {
    this.viewportWidth = 800;
    this.viewportHeight = 600;
    this.currentMode = TerminalMode.CANONICAL;
    this.outputs = [];
    this.eventListeners = {};
  }

  setViewportDimensions(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.emit('viewportChanged', { width, height });
  }

  async setMode(
    mode: (typeof TerminalMode)[keyof typeof TerminalMode],
    data?: {
      content: string;
      title?: string;
      contentType?: 'markdown' | 'text';
      requiresPaging?: boolean;
    },
  ): Promise<void> {
    if (this.currentMode !== mode) {
      const previousMode = this.currentMode;
      this.currentMode = mode;
      this.emit('modeChanged', { mode, data, previousMode });
    }
  }

  getCurrentMode(): (typeof TerminalMode)[keyof typeof TerminalMode] {
    return this.currentMode;
  }

  addOutput(output: {
    output: string;
    style?: {
      foreground?: string;
      background?: string;
      bold?: boolean;
      italic?: boolean;
    };
    type?: string;
  }): void {
    this.outputs.push(output);
    this.emit('outputsChanged', [...this.outputs]);
  }

  clearOutputs(): void {
    this.outputs = [];
    this.emit('outputsChanged', []);
  }

  off(event: string, listener: (...args: any[]) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(l => l !== listener);
    }
  }

  on(event: string, listener: (...args: any[]) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  }

  emit(event: string, ...args: any[]): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(listener => listener(...args));
    }
  }

  async handleRawOutput(result: {
    content: string;
    contentType?: 'markdown' | 'text';
    requiresPaging?: boolean;
  }): Promise<void> {
    this.emit('rawOutputRequested', {
      content: result.content,
      contentType: result.contentType || 'text',
      requiresPaging: result.requiresPaging || false,
    });
    
    if (!result.requiresPaging) {
      this.addOutput({
        output: result.content,
        type: result.contentType === 'markdown' ? 'html' : 'text',
      });
    }
  }

  exitRawMode(): void {
    if (this.currentMode === TerminalMode.RAW) {
      this.setMode(TerminalMode.CANONICAL);
    }
  }

  isInRawMode(): boolean {
    return this.currentMode === TerminalMode.RAW;
  }
}
