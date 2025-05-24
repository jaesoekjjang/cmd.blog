import { Shell } from '@/core/shell';
import { BaseCommand, CommandResult } from '../BaseCommand';

export class PwdCommand extends BaseCommand {
  readonly name = 'pwd';
  readonly description = 'Print working directory';

  execute(args: string[], shell: Shell): CommandResult {
    return this.createSuccess(shell.getCurrentDirectory());
  }
}