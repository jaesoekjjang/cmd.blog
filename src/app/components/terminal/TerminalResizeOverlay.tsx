import { ResizableState } from '@/core/hooks/useResizable';

interface TerminalResizeOverlayProps {
  state?: ResizableState;
}

export function TerminalResizeOverlay({ state }: TerminalResizeOverlayProps) {
  return (
    <div
      className="absolute
        top-0 left-0 w-full h-full
        flex justify-center items-center
      "
    >
      {state?.isDragging && (
        <span className="ml-2 text-xs opacity-50">
          {state.width}×{state.height}
        </span>
      )}
    </div>
  );
}
