import { EventBus, TerminalEvents } from '@/core/eventBus';
import { OutputItem, OutputManger } from './types';

export class BaseOutputManager implements OutputManger {
  private outputs: OutputItem[] = [];
  private canonicalOutputs: OutputItem[] = [];
  private idCounter = 0;
  private eventBus: EventBus<TerminalEvents>;

  constructor(eventBus: EventBus<TerminalEvents>) {
    this.eventBus = eventBus;
  }

  addOutput(output: Omit<OutputItem, 'id'>): void {
    const outputWithId: OutputItem = {
      id: this.idCounter++,
      ...output,
    };

    this.outputs.push(outputWithId);
    this.eventBus.emit('output:changed', [...this.outputs]);
  }

  clearOutputs(): void {
    this.outputs = [];
    this.eventBus.emit('output:changed', []);
    this.eventBus.emit('output:cleared', undefined);
  }

  getOutputs(): OutputItem[] {
    return [...this.outputs];
  }

  preserveCanonicalOutputs(): void {
    this.canonicalOutputs = [...this.outputs];
  }

  setRawOutput(output: Omit<OutputItem, 'id'>): void {
    const outputWithId: OutputItem = {
      id: this.idCounter++,
      ...output,
    };

    this.outputs = [outputWithId];
    this.eventBus.emit('output:changed', [...this.outputs]);
  }

  restoreCanonicalOutputs(): void {
    this.outputs = [...this.canonicalOutputs];
    this.eventBus.emit('output:changed', [...this.outputs]);
  }
}
