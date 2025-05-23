'use client';

import { useTheme } from '@/app/theme';
import { UseResizableReturn } from '@/core/hooks/useResizable';

interface TerminalHeaderProps {
  controls?: UseResizableReturn['controls'];
}

export function TerminalHeader({ controls }: TerminalHeaderProps) {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="bg-terminal-header border-terminal-border flex items-center border-b px-4 py-2">
      <div className="flex space-x-2">
        <button className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600" />
        <button
          type="button"
          onClick={controls?.minimize}
          className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
        />
        <button
          type="button"
          onClick={controls?.maximize}
          className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600"
        />
      </div>
      <div className="text-terminal-text bg-terminal-header mx-auto font-medium">Cmd.blog</div>
      <button
        onClick={toggleTheme}
        className="bg-terminal-button text-terminal-text hover:bg-terminal-button-hover rounded px-2 py-1 text-xs"
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
