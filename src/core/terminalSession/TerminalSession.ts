import { EventBus, TerminalEvents } from '@/core/eventBus';

export const TerminalMode = {
  CANONICAL: 'canonical',
  RAW: 'raw',
} as const;

export type TerminalMode = (typeof TerminalMode)[keyof typeof TerminalMode];

export class TerminalSession {
  private viewportWidth: number;
  private viewportHeight: number;
  private currentMode: TerminalMode;
  private eventBus: EventBus<TerminalEvents>;

  constructor(eventBus: EventBus<TerminalEvents>) {
    this.viewportWidth = 800;
    this.viewportHeight = 600;
    this.currentMode = TerminalMode.CANONICAL;
    this.eventBus = eventBus;
  }

  setViewportDimensions(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.eventBus.emit('terminal:viewportChanged', { width, height });
  }

  async setMode(mode: TerminalMode): Promise<void> {
    if (this.currentMode !== mode) {
      const previousMode = this.currentMode;
      this.currentMode = mode;
      this.eventBus.emit('terminal:modeChanged', { mode, previousMode });
    }
  }

  getCurrentMode(): TerminalMode {
    return this.currentMode;
  }

  async handleRawOutput(result: {
    content: string;
    contentType?: 'markdown' | 'text';
    requiresPaging?: boolean;
  }): Promise<void> {
    this.eventBus.emit('terminal:rawOutputRequested', {
      content: result.content,
      contentType: result.contentType ?? 'text',
      requiresPaging: result.requiresPaging ?? false,
    });
  }

  exitRawMode(): void {
    if (this.currentMode === TerminalMode.RAW) {
      this.setMode(TerminalMode.CANONICAL);
    }
  }

  isInRawMode(): boolean {
    return this.currentMode === TerminalMode.RAW;
  }

  getViewportDimensions(): { width: number; height: number } {
    return { width: this.viewportWidth, height: this.viewportHeight };
  }
}
