import { Shell } from '@/core/shell';
import { BaseCommand } from '../BaseCommand';

export class ClearCommand extends BaseCommand {
  readonly name = 'clear';
  readonly description = 'Clear the terminal screen';

  execute(args: string[], shell: Shell): void {
    shell.clearOutput();
  }
}