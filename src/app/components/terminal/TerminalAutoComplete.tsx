import type { AutoComplete } from '@/core/shell';

interface TerminalAutoCompleteProps {
  autoComplete: AutoComplete;
}

export function TerminalAutoComplete({ autoComplete }: TerminalAutoCompleteProps) {
  return (
    <div className="my-1 flex flex-wrap gap-1">
      {autoComplete.suggestions.map((suggestion, index) => {
        const isActive = index === autoComplete.index;

        return (
          <div
            key={suggestion}
            className={`rounded-sm px-2.5 py-1 text-base leading-[1.1] transition-all duration-150 ${isActive ? 'bg-terminal-autocomplete-suggestion-bg text-terminal-autocomplete-suggestion-text underline' : ''} `}
          >
            {suggestion}
          </div>
        );
      })}
    </div>
  );
}
