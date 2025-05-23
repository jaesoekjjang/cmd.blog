'use client';

import { commands } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { useResizable } from '@/core/hooks/useResizable';
import { TerminalBody } from './TerminalBody';
import { TerminalHeader } from './TerminalHeader';
import { TerminalResizeHandlers } from './TerminalResizeHandlers';
import { TerminalResizeOverlay } from './TerminalResizeOverlay';

interface TerminalProps {
  fileSystem: FileSystem;
}

export function Terminal({ fileSystem }: TerminalProps) {
  const { controls, handlers, state, style } = useResizable({
    initialWidth: 1024,
    initialHeight: 720,
    minWidth: 400,
    minHeight: 300,
  });

  return (
    <div
      style={style}
      className="flex flex-col bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-lg"
    >
      <TerminalHeader controls={controls} />
      <TerminalBody fileSystem={fileSystem} commands={commands} resizeState={state} />
      <TerminalResizeHandlers handlers={handlers} />
    </div>
  );
}
