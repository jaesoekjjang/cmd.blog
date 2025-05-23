'use client';

import { useTheme } from '@/app/theme';
import { UseResizableReturn } from '@/core/hooks/useResizable';

interface TerminalHeaderProps {
  controls?: UseResizableReturn['controls'];
}

export function TerminalHeader({ controls }: TerminalHeaderProps) {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="flex items-center px-4 py-2 border-b bg-terminal-header border-terminal-border">
      <div className="flex space-x-2">
        <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
        <button
          type="button"
          onClick={controls?.minimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
        />
        <button
          type="button"
          onClick={controls?.maximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
        />
      </div>
      <div className="mx-auto font-medium text-terminal-text bg-terminal-header">Cmd.blog</div>
      <button
        onClick={toggleTheme}
        className="text-xs px-2 py-1 rounded bg-terminal-button text-terminal-text hover:bg-terminal-button-hover"
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
