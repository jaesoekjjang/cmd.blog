import type { AutoComplete } from '@/core/shell';
import clsx from 'clsx';

interface TerminalAutoCompleteProps {
  autoComplete: AutoComplete;
}

export function TerminalAutoComplete({ autoComplete }: TerminalAutoCompleteProps) {
  return (
    <div className="my-1 flex flex-wrap gap-1">
      {autoComplete.suggestions.length > 0 ? (
        autoComplete.suggestions.map((suggestion, index) => {
          const isActive = index === autoComplete.index;

          return (
            <div
              key={suggestion}
              className={clsx('rounded-sm px-2.5 py-1 text-base leading-[1.1] transition-all duration-150', {
                'bg-terminal-autocomplete-suggestion-bg text-terminal-autocomplete-suggestion-text underline': isActive,
              })}
            >
              {suggestion}
            </div>
          );
        })
      ) : (
        <div className="text-xs text-terminal-prompt-time">도움말을 보려면 `/?`를 입력하세요</div>
      )}
    </div>
  );
}
