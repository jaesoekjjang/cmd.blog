import {  OutputItem, OutputManger } from './types';

export class BaseOutputManager implements OutputManger {
  private outputs: OutputItem[] = [];
  private idCounter = 0;
  private eventListeners: Record<string, Array<(...args: any[]) => void>> = {};

  addOutput(output: Omit<OutputItem, 'id'>): void {
    const outputWithId: OutputItem = {
      id: this.idCounter++,
      ...output,
    };
    
    this.outputs.push(outputWithId);
    this.emit('outputsChanged', [...this.outputs]);
  }

  clearOutputs(): void {
    this.outputs = [];
    this.emit('outputsChanged', []);
  }

  getOutputs(): OutputItem[] {
    return [...this.outputs];
  }

  on(event: 'outputsChanged', listener: (outputs: OutputItem[]) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  }

  off(event: 'outputsChanged', listener: (outputs: OutputItem[]) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(l => l !== listener);
    }
  }

  private emit(event: string, ...args: any[]): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(listener => listener(...args));
    }
  }
}
