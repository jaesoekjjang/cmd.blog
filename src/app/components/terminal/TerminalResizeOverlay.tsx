import { ResizableState } from '@/core/hooks/useResizable';

interface TerminalResizeOverlayProps {
  state?: ResizableState;
}

export function TerminalResizeOverlay({ state }: TerminalResizeOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {state?.isDragging && (
        <div className="bg-black/50 text-white rounded px-2 py-1 text-sm font-mono">
          {state.width}×{state.height}
        </div>
      )}
    </div>
  );
}
