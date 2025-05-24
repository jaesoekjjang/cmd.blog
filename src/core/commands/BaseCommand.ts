import { Shell } from '@/core/shell';
import { RenderedOutput } from '../filesystem/vFileSystem';

export type CommandResult = {
  type: RenderedOutput['kind'];
  content: string;
};

export abstract class BaseCommand {
  abstract readonly name: string;
  abstract readonly description: string;

  abstract execute(args: string[], shell: Shell): CommandResult | void;

  protected validateArgs(args: string[], minArgs: number = 0, maxArgs?: number): boolean {
    if (args.length < minArgs) return false;
    if (maxArgs && args.length > maxArgs) return false;
    return true;
  }

  protected createError(message: string): CommandResult {
    return { type: 'text', content: message };
  }

  protected createSuccess(content: string, type: RenderedOutput['kind'] = 'text'): CommandResult {
    return { type, content };
  }
}
