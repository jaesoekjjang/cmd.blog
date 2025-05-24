import { Shell } from '@/core/shell';
import { BaseCommand, CommandResult } from '../BaseCommand';

export class HistoryCommand extends BaseCommand {
  readonly name = 'history';
  readonly description = 'Display command history';

  execute(args: string[], shell: Shell): CommandResult {
    const history = shell.getFullCommandHistory();
    
    if (history.length === 0) {
      return this.createError('명령어 기록이 없습니다.');
    }

    const content = history
      .map((command, index) => `${index + 1} ${command}`)
      .join('\n');

    return this.createSuccess(content);
  }
}