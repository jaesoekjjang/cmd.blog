interface TerminalPagingControlsProps {
  isActive: boolean;
  progress: number;
}

export function TerminalPagingControls({ isActive }: TerminalPagingControlsProps) {
  if (!isActive) return null;

  return (
    <div className="bg-gray-800 px-4 py-2 text-center text-xs text-gray-300">
      j/k 위/아래, g/G 맨 위/맨 아래, q 종료
    </div>
  );
}
