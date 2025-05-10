'use client';

import { useTheme } from '@/app/theme';

export function TerminalHeader() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="flex items-center px-4 py-2 border-b bg-terminal-header border-terminal-border">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
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
