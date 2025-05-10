import { LineEditor } from '@/core/lineEditor';
import { CompletionStrategy } from './strategies/CompletionStrategy';
import { Shell } from '../shell';

export class CompletionProvider {
  constructor(private readonly strategies: CompletionStrategy[]) {}

  complete(lineEditor: LineEditor, shell: Shell) {
    const line = lineEditor.getInput();
    const { end } = lineEditor.getCursorPosition();
    const currentArg = line.trim().slice(0, end).split(' ').pop() || '';

    for (const strategy of this.strategies) {
      if (strategy.canHandle(currentArg, shell)) {
        return strategy.complete(currentArg, shell);
      }
    }

    return [];
  }
}
