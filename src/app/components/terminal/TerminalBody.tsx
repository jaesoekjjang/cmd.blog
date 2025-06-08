import { CommandRegistry } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { UsePagerReturn } from '@/core/hooks/usePager';
import { ResizableState } from '@/core/hooks/useResizable';
import { useShell } from '@/core/shell/useShell';
import { TerminalSession } from '@/core/terminalSession/TerminalSession';
import { useEffect, useRef } from 'react';
import { TerminalAutoComplete } from './TerminalAutoComplete';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { TerminalResizeOverlay } from './TerminalResizeOverlay';

interface TerminalBodyProps {
  fileSystem: FileSystem;
  commandRegistry: CommandRegistry;
  resizeState: ResizableState;
  paging: UsePagerReturn<HTMLDivElement>;
  bodyRef: React.RefObject<HTMLDivElement>;
}

export function TerminalBody({ fileSystem, commandRegistry, resizeState, paging, bodyRef }: TerminalBodyProps) {
  const terminalSession = useRef(new TerminalSession());

  const {
    input,
    outputs,
    autoComplete,
    inputRef,
    handleKeyDown,
    handleTextInput,
    handleSelect,
    shell,
    focus,
    terminalMode,
  } = useShell({
    fileSystem,
    commandRegistry,
    terminalSession: terminalSession.current,
    paging,
  });

  useEffect(() => {
    focus();
  }, [focus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const handled = paging.handleKeyDown(event);
      if (handled) {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paging]);

  useEffect(() => {
    if (paging.isActive) return;

    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [outputs, autoComplete, bodyRef, paging.isActive]);

  return (
    <div className="scrollbar relative flex-auto px-2 py-1" ref={bodyRef} onClick={focus}>
      <TerminalOutput terminalMode={terminalMode} output={outputs}
        onLayoutReady={() => {
          paging.updateViewport(bodyRef.current?.clientHeight || 0);
        }}
      />
      <TerminalInput
        ref={inputRef}
        value={input}
        onChange={handleTextInput}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        prompt={shell.promptState}
      />
      <TerminalAutoComplete autoComplete={autoComplete} />
      <TerminalResizeOverlay state={resizeState} />
    </div>
  );
}
