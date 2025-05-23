'use client';

import { OutputItem } from '@/core/lineEditor';
import { memo } from 'react';
import { Prose } from '../prose/prose';
import { TermianlText } from './TerminalText';

interface OutputProps {
  output: OutputItem[];
}

export const TerminalOutput = memo(function TerminalOutput({ output }: OutputProps) {
  return (
    <div className="whitespace-pre-line data-[output-exists=true]:mb-4" data-output-exists={output.length > 0}>
      {output.map(item =>
        item.type === 'html' ? (
          <Prose key={item.id}>
            <div dangerouslySetInnerHTML={{ __html: item.output }} />
          </Prose>
        ) : (
          <TermianlText key={item.id} style={item.style}>
            {item.output}
          </TermianlText>
        ),
      )}
    </div>
  );
});
