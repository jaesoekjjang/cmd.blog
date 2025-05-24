import { CommandRegistry } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { ResizableState } from '@/core/hooks/useResizable';
import { useShell } from '@/core/shell/useShell';
import { useEffect, useRef } from 'react';
import { TerminalAutoComplete } from './TerminalAutoComplete';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { TerminalResizeOverlay } from './TerminalResizeOverlay';

interface TerminalBodyProps {
  fileSystem: FileSystem;
  commandRegistry: CommandRegistry;
  resizeState: ResizableState;
}

export function TerminalBody({ fileSystem, commandRegistry, resizeState }: TerminalBodyProps) {
  const { input, outputs, autoComplete, inputRef, handleKeyDown, handleTextInput, handleSelect, shell, focus } =
    useShell({
      fileSystem,
      commandRegistry,
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
    <div className="scrollbar relative flex-auto px-2 py-1" ref={outputContainerRef} onClick={focus}>
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
      <TerminalResizeOverlay state={resizeState} />
    </div>
  );
}
