import { ContentType } from '@/core/pager/types';
import { Shell } from '@/core/shell';
import { TerminalSession } from '@/core/terminalSession/TerminalSession';
import { BaseCommand, CommandResult } from './BaseCommand';
import { CommandExecutionContext, CommandExecutionPolicy, PolicyProvider } from './CommandPolicy';

export class CommandExecutor {
  constructor(private policyProvider: PolicyProvider) {}

  async eval(
    command: BaseCommand,
    args: string[],
    shell: Shell,
    terminalSession: TerminalSession,
  ): Promise<CommandResult | void> {
    const result = await command.execute(args, shell);

    if (!result) {
      return;
    }

    const context: CommandExecutionContext = {
      content: result.content,
      metadata: result.meta,
    };

    const policy = this.policyProvider.getPolicy(command.name);
    const shouldUseRawMode = this.policyProvider.shouldEnableRawMode(command.name, context);
    const shouldUsePaging = this.policyProvider.shouldEnablePaging(command.name, context);

    if (shouldUseRawMode && result.type === 'raw') {
      const contentType = this.determineContentType(result, policy);

      await terminalSession.setMode('raw', {
        content: result.content,
        contentType,
      });
      await terminalSession.handleRawOutput({
        content: result.content,
        contentType,
        requiresPaging: shouldUsePaging,
      });
    }

    return result;
  }

  private determineContentType(result: CommandResult, policy: CommandExecutionPolicy): 'markdown' | 'text' {
    if (result.meta?.contentType) {
      return result.meta.contentType;
    }

    if (policy.pagingOptions?.contentType) {
      return policy.pagingOptions.contentType === ContentType.MARKDOWN ? 'markdown' : 'text';
    }

    return 'text';
  }
}
