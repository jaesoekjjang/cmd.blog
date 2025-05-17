'use client';

import { commands } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { TerminalBody } from './TerminalBody';
import { TerminalHeader } from './TerminalHeader';

interface TerminalProps {
  fileSystem: FileSystem;
}

export function Terminal({ fileSystem }: TerminalProps) {
  return (
    <div className="flex flex-col bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-lg w-full max-w-5xl h-[720px]">
      <TerminalHeader />
      <TerminalBody fileSystem={fileSystem} commands={commands} />
    </div>
  );
}
