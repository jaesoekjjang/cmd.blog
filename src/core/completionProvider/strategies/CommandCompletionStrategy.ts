import { CompletionStrategy } from './CompletionStrategy';

export class CommandCompletionStrategy implements CompletionStrategy {
  constructor(private readonly commands: string[]) {}

  canHandle(input: string): boolean {
    return this.commands.some(command => command.startsWith(input));
  }

  complete(input: string): string[] {
    return this.commands.filter(command => command.startsWith(input));
  }
}
