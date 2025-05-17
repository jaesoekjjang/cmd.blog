import type { AutoComplete } from '@/core/shell';

interface TerminalAutoCompleteProps {
  autoComplete: AutoComplete;
}

export function TerminalAutoComplete({ autoComplete }: TerminalAutoCompleteProps) {
  return (
    <div className="flex flex-wrap my-1 gap-1">
      {autoComplete.suggestions.map((suggestion, index) => {
        const isActive = index === autoComplete.index;

        return (
          <div
            key={suggestion}
            className={`transition-all duration-150 px-2.5 py-1 rounded-sm text-base leading-[1.1] 
                  ${isActive ? 'underline bg-terminal-autocomplete-suggestion-bg text-terminal-autocomplete-suggestion-text' : ''}
                `}
          >
            {suggestion}
          </div>
        );
      })}
    </div>
  );
}
