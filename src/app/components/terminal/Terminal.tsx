'use client';

import {
  CatCommand,
  CdCommand,
  ClearCommand,
  CommandRegistry,
  HelpCommand,
  HistoryCommand,
  LsCommand,
  PwdCommand,
} from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { useResizable } from '@/core/hooks/useResizable';
import { useToggle } from '@/core/hooks/useToggle';
import clsx from 'clsx';
import { useMemo } from 'react';
import { HelpModal } from '../help/HelpModal';
import { TerminalBody } from './TerminalBody';
import { TerminalHeader } from './TerminalHeader';
import { TerminalResizeHandlers } from './TerminalResizeHandlers';

interface TerminalProps {
  fileSystem: FileSystem;
}

export function Terminal({ fileSystem }: TerminalProps) {
  const { isOpen, open: openHelp, close: closeHelp } = useToggle();

  const commandRegistry = useMemo(() => {
    return new CommandRegistry([
      new LsCommand(),
      new CdCommand(),
      new PwdCommand(),
      new CatCommand(),
      new ClearCommand(),
      new HistoryCommand(),
      new HelpCommand(openHelp),
    ]);
  }, [openHelp]);

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
          '!transition-all': !state.isDragging,
        },
      )}
    >
      <TerminalHeader controls={controls} />
      <TerminalBody fileSystem={fileSystem} commandRegistry={commandRegistry} resizeState={state} />
      <TerminalResizeHandlers handlers={handlers} />
      {isOpen && <HelpModal onClose={closeHelp} />}
    </div>
  );
}
