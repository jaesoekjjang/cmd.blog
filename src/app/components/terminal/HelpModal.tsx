'use client';

import { useEffect, useRef } from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      ref={ref}
      tabIndex={0}
    >
      <div
        className="bg-terminal-bg border-terminal-border max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-terminal-text text-2xl font-bold">Keyboard Shortcuts & Commands</h2>
          <button onClick={onClose} className="text-terminal-text hover:bg-terminal-button rounded px-3 py-1 text-xl">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {keyMappings.map(category => (
            <div key={category.category}>
              <h3 className="text-terminal-text border-terminal-border mb-3 border-b pb-1 text-lg font-semibold">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map(shortcut => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <code className="bg-terminal-button text-terminal-text rounded px-2 py-1 font-mono text-sm">
                      {shortcut.key}
                    </code>
                    <span className="text-terminal-text ml-4 flex-1 text-sm">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-terminal-border mt-6 border-t pt-4">
          <p className="text-terminal-text text-sm opacity-70">
            Press <kbd className="bg-terminal-button rounded px-1">Esc</kbd> or click outside to close this help dialog.
          </p>
        </div>
      </div>
    </div>
  );
}

const keyMappings = [
  {
    category: 'Navigation',
    shortcuts: [
      { key: 'Tab', description: 'Auto-complete commands and file paths' },
      { key: '↑ / ↓', description: 'Navigate command history' },
      { key: 'Ctrl + L', description: 'Clear terminal screen' },
    ],
  },
  {
    category: 'Commands',
    shortcuts: [
      { key: 'ls', description: 'List files and directories' },
      { key: 'cd <dir>', description: 'Change directory' },
      { key: 'cat <file>', description: 'Display file contents' },
      { key: 'pwd', description: 'Show current directory' },
      { key: 'clear', description: 'Clear terminal output' },
      { key: 'history', description: 'Show command history' },
    ],
  },
  {
    category: 'Text Editing',
    shortcuts: [
      { key: 'Ctrl + A', description: 'Move to beginning of line' },
      { key: 'Ctrl + E', description: 'Move to end of line' },
      { key: 'Ctrl + U', description: 'Delete from cursor to beginning' },
      { key: 'Ctrl + K', description: 'Delete from cursor to end' },
      { key: 'Ctrl + W', description: 'Delete previous word' },
    ],
  },
  {
    category: 'Window Controls',
    shortcuts: [
      { key: 'Red button', description: 'Close (no action)' },
      { key: 'Yellow button', description: 'Minimize window' },
      { key: 'Green button', description: 'Maximize window' },
      { key: 'Drag borders', description: 'Resize window from center' },
    ],
  },
];

