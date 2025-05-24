import { BaseCommand } from '../BaseCommand';

export class HelpCommand extends BaseCommand {
  readonly name = '/?';
  readonly description = 'Show help modal with keyboard shortcuts';

  constructor(private readonly onHelp: () => void) {
    super();
  }

  execute() {
    this.onHelp();
  }
}
