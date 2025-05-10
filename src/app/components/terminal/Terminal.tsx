'use client';

import { useEffect, useRef } from 'react';
import { TerminalHeader } from './TerminalHeader';
import { TerminalInput } from './TerminalInput';
import { commands } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { TerminalOutput } from './TerminalOutput';
import { useShell } from '@/core/shell/useShell';

interface TerminalProps {
  fileSystem: FileSystem;
}

export function Terminal({ fileSystem }: TerminalProps) {
  const { input, outputs, inputRef, handleKeyDown, handleTextInput, handleSelect, focus, shell } = useShell({
    fileSystem,
    commands,
  });

  useEffect(() => {
    focus();
  }, [focus]);

  const outputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [outputs]);

  return (
    <div className="flex flex-col bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-lg w-full max-w-5xl h-[720px]">
      <TerminalHeader />
      <div className="py-1 px-2 scrollbar" ref={outputContainerRef}>
        <TerminalOutput output={outputs} />
        <TerminalInput
          ref={inputRef}
          value={input}
          onChange={handleTextInput}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          prompt={shell.promptState}
        />
      </div>
    </div>
  );
}
