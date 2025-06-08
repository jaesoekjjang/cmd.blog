interface TerminalPagingControlsProps {
  isActive: boolean;
  progress: number;
}

export function TerminalPagingControls({ isActive, progress }: TerminalPagingControlsProps) {
  if (!isActive) return null;

  return (
    <div className="bg-gray-800 px-4 py-2 text-center text-xs text-gray-300">
      Progress: {progress}% | j/k up/down , g/G top/bottom, 'q' to quit
    </div>
  );
}
