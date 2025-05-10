import { Shell } from '@/core/shell';

export interface CompletionStrategy {
  canHandle(input: string, shell: Shell): boolean;
  complete(input: string, shell: Shell): string[];
}
