import { OutputItem } from '@/core/output/types';

export interface TerminalEvents {
  'terminal:viewportChanged': { width: number; height: number };
  'terminal:modeChanged': { mode: string; previousMode: string };
  'terminal:rawOutputRequested': {
    content: string;
    contentType: 'markdown' | 'text';
    requiresPaging: boolean;
  };
  'output:changed': OutputItem[];
  'output:cleared': void;
  'output:preserveCanonical': void;
  'output:setRaw': { content: string; contentType: 'markdown' | 'text' };
  'output:restoreCanonical': void;
  'paging:enabled': { content: string; contentType: string };
  'paging:disabled': void;
}
