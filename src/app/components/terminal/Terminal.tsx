'use client';

import { commands } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { useResizable } from '@/core/hooks/useResizable';
import clsx from 'clsx';
import { TerminalBody } from './TerminalBody';
import { TerminalHeader } from './TerminalHeader';
import { TerminalResizeHandlers } from './TerminalResizeHandlers';

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
      className={clsx(
        'bg-terminal-bg border-terminal-border flex flex-col overflow-hidden rounded-lg border shadow-lg',
        {
          'transition-[width,height]': !state.isDragging,
        },
      )}
    >
      <TerminalHeader controls={controls} />
      <TerminalBody fileSystem={fileSystem} commands={commands} resizeState={state} />
      <TerminalResizeHandlers handlers={handlers} />
    </div>
  );
}
