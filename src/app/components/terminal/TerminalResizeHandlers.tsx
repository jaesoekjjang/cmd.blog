import { UseResizableReturn } from '@/core/hooks/useResizable';
import { TerminalResizeHandle } from './TerminalResizeHandle';

interface TerminalResizeHandleProps {
  handlers: UseResizableReturn['handlers'];
}

export function TerminalResizeHandlers({ handlers }: TerminalResizeHandleProps) {
  return (
    <>
      {/* handle border */}
      <TerminalResizeHandle direction="n" onMouseDown={handlers.onMouseDownBorder} />
      <TerminalResizeHandle direction="s" onMouseDown={handlers.onMouseDownBorder} />
      <TerminalResizeHandle direction="w" onMouseDown={handlers.onMouseDownBorder} />
      <TerminalResizeHandle direction="e" onMouseDown={handlers.onMouseDownBorder} />
      {/* handle corner */}
      <TerminalResizeHandle direction="nw" onMouseDown={handlers.onMouseDownCorner} />
      <TerminalResizeHandle direction="ne" onMouseDown={handlers.onMouseDownCorner} />
      <TerminalResizeHandle direction="sw" onMouseDown={handlers.onMouseDownCorner} />
      <TerminalResizeHandle direction="se" onMouseDown={handlers.onMouseDownCorner} />
    </>
  );
}
