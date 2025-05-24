'use client';

import { useState } from 'react';
import { HelpModal } from '../terminal/HelpModalpModal';

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-terminal-button text-terminal-text hover:bg-terminal-button-hover fixed right-6 bottom-6 z-30 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-lg transition-colors"
        title="Show keyboard shortcuts"
      >
        ?
      </button>
      {isOpen && <HelpModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

