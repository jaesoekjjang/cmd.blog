import { PromptState } from '@/core/shell';
import { RefObject } from 'react';

interface TerminalInputProps {
  ref: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (e: React.SyntheticEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  prompt: PromptState;
}

export function TerminalInput({ ref, value, onChange, onSelect, onKeyDown, prompt }: TerminalInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-terminal-prompt-directory font-semibold">{prompt.directory}</div>
        <time className="text-terminal-prompt-time mt-1 text-[13px]" suppressHydrationWarning>
          {prompt.date}
        </time>
      </div>
      <div className="flex gap-1">
        <span className="text-terminal-prompt-prefix font-semibold">{prompt.prefix}</span>
        <input
          ref={ref}
          className="light:text-[var(--color-text)] light:caret-[var(--color-text)] flex-1 border-none bg-transparent pl-1 focus:outline-none dark:text-[var(--color-text-dark)] dark:caret-white"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onSelect={onSelect}
          spellCheck="false"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
