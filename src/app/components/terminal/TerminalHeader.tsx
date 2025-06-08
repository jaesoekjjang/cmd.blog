'use client';

import { useTheme } from '@/app/theme';
import { UseResizableReturn } from '@/core/hooks/useResizable';
import { forwardRef } from 'react';

interface TerminalHeaderProps {
  controls?: UseResizableReturn['controls'];
  isVisible?: boolean;
  isMaximized?: boolean;
}

export const TerminalHeader = forwardRef<HTMLDivElement, TerminalHeaderProps>(function TerminalHeader(
  { controls, isVisible = true, isMaximized = false },
  ref,
) {
  const [theme, toggleTheme] = useTheme();

  return (
    <div
      ref={ref}
className={`bg-terminal-header border-terminal-border flex items-center border-b px-4 py-2 ${
  isMaximized
    ? `absolute top-0 right-0 left-0 z-40 transform transition-all duration-500 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0'
      }`
    : 'relative translate-y-0 opacity-100'
}`}
      onDoubleClick={controls?.toggleMaximize}
    >
      <div className="flex space-x-2">
        <button className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600" />
        <button
          type="button"
          onClick={controls?.minimize}
          className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
        />
        <button
          type="button"
          onClick={controls?.toggleMaximize}
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
});
