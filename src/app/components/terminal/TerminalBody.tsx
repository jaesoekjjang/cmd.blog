import { Command } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { useShell } from '@/core/shell/useShell';
import { useEffect, useRef } from 'react';
import { TerminalAutoComplete } from './TerminalAutoComplete';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';

interface TerminalBodyProps {
  fileSystem: FileSystem;
  commands: Command[];
}

export function TerminalBody({ fileSystem, commands }: TerminalBodyProps) {
  const { input, outputs, autoComplete, inputRef, handleKeyDown, handleTextInput, handleSelect, shell, focus } =
    useShell({
      fileSystem,
      commands,
    });

  const outputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    focus();
  }, [focus]);

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [outputs, autoComplete]);

  return (
    <div className="flex-auto py-1 px-2 scrollbar" ref={outputContainerRef} onClick={focus}>
      <TerminalOutput output={outputs} />
      <TerminalInput
        ref={inputRef}
        value={input}
        onChange={handleTextInput}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        prompt={shell.promptState}
      />
      <TerminalAutoComplete autoComplete={autoComplete} />
    </div>
  );
}
