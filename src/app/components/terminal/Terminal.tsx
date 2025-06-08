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
import { usePager } from '@/core/hooks/usePager';
import { useResizable } from '@/core/hooks/useResizable';
import { useToggle } from '@/core/hooks/useToggle';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HelpModal } from '../help/HelpModal';
import { TerminalBody } from './TerminalBody';
import { TerminalHeader } from './TerminalHeader';
import { TerminalPagingControls } from './TerminalPagingControl';
import { TerminalResizeHandlers } from './TerminalResizeHandlers';

interface TerminalProps {
  fileSystem: FileSystem;
}

export function Terminal({ fileSystem }: TerminalProps) {
  const { isOpen, open: openHelp, close: closeHelp } = useToggle();
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const paging = usePager<HTMLDivElement>();

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

  useEffect(() => {
    if (paging.contentRef.current) {
      paging.setContentElement(paging.contentRef.current);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paging.contentRef.current, paging.isActive]);

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
      <div
        className={clsx({
          'absolute top-0 right-0 left-0 z-50': state.isMaximized,
          relative: !state.isMaximized,
        })}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        {state.isMaximized && <div className="h-4 w-full" />}
        <TerminalHeader
          ref={headerRef}
          controls={controls}
          isVisible={state.isMaximized ? isHeaderHovered : true}
          isMaximized={state.isMaximized}
        />
      </div>

      <TerminalBody
        bodyRef={paging.contentRef}
        fileSystem={fileSystem}
        commandRegistry={commandRegistry}
        resizeState={state}
        paging={paging}
        headerHeight={state.isMaximized && !isHeaderHovered ? 0 : undefined}
      />
      <TerminalResizeHandlers handlers={handlers} />
      {isOpen && <HelpModal onClose={closeHelp} />}
      <TerminalPagingControls isActive={paging.isActive} progress={paging.progress} />
    </div>
  );
}
