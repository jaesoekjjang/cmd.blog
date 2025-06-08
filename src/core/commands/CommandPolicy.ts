import { ContentType } from '@/core/pager/types';

export interface CommandExecutionPolicy {
  readonly requiresRawMode: boolean;
  readonly requiresPaging: boolean;
  readonly pagingOptions?: {
    contentType: ContentType;
    estimatedLines?: number;
  };
}

export interface CommandExecutionContext {
  readonly content: string;
  readonly metadata?: {
    contentType?: 'markdown' | 'text';
    requiresPaging?: boolean;
  };
}

export interface PolicyProvider {
  getPolicy(commandName: string): CommandExecutionPolicy;
  shouldEnableRawMode(commandName: string, context: CommandExecutionContext): boolean;
  shouldEnablePaging(commandName: string, context: CommandExecutionContext): boolean;
}

export class DefaultCommandPolicyProvider implements PolicyProvider {
  private policies: Map<string, CommandExecutionPolicy> = new Map();

  constructor() {
    this.setupDefaultPolicies();
  }

  private setupDefaultPolicies(): void {
    this.policies.set('cat', {
      requiresRawMode: true,
      requiresPaging: true,
      pagingOptions: {
        contentType: ContentType.PLAIN_TEXT,
      },
    });

    ['ls', 'cd', 'pwd', 'clear', 'history', 'help'].forEach(cmd => {
      this.policies.set(cmd, {
        requiresRawMode: false,
        requiresPaging: false,
      });
    });
  }

  getPolicy(commandName: string): CommandExecutionPolicy {
    return (
      this.policies.get(commandName) || {
        requiresRawMode: false,
        requiresPaging: false,
      }
    );
  }

  shouldEnableRawMode(commandName: string): boolean {
    const policy = this.getPolicy(commandName);
    return policy.requiresRawMode;
  }

  shouldEnablePaging(commandName: string): boolean {
    const policy = this.getPolicy(commandName);

    if (!policy.requiresPaging) {
      return false;
    }

    return true;
  }

  setPolicyForCommand(commandName: string, policy: CommandExecutionPolicy): void {
    this.policies.set(commandName, policy);
  }
}
