'use client';

import { HelpModal } from '@/app/components/help/HelpModal';
import { useState } from 'react';

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-terminal-button text-terminal-text hover:bg-terminal-button-hover fixed right-6 bottom-6 z-30 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-lg transition-colors"
        aria-label="Help"
      >
        ?
      </button>
      {isOpen && <HelpModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
