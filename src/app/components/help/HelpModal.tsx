import { keyMappings } from '@/app/components/help/keyMappings';
import { useKeyDown } from '@/core/hooks/useKeyDown';
import { useOutsideClick } from '@/core/hooks/useOutsideClick';
import { useEffect, useRef } from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => ref.current?.focus(), []);

  useOutsideClick(ref, onClose);

  useKeyDown(['Escape'], onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45">
      <div
        className="bg-terminal-bg border-terminal-border max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 shadow-xl"
        ref={ref}
        tabIndex={0}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-terminal-text text-2xl font-bold">Help</h2>
          <button
            onClick={onClose}
            className="text-terminal-text rouned-md border-terminal-button rounded-md border px-1.5 py-1 text-xs"
          >
            <kbd>esc</kbd>
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
                    <code className="bg-terminal-button text-terminal-text rounded px-2 py-1 text-sm">
                      {shortcut.key}
                    </code>
                    <span className="text-terminal-text ml-4 flex-1 text-sm">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
