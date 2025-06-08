'use client';

import { OutputItem } from '@/core/lineEditor';
import { TerminalMode } from '@/core/terminalSession/TerminalSession';
import { memo, useEffect } from 'react';
import { Prose } from '../prose/prose';
import { TermianlText } from './TerminalText';

interface OutputProps {
  terminalMode: TerminalMode;
  output: OutputItem[];
  onLayoutReady: () => void;
}

export const TerminalOutput = memo(function TerminalOutput({ terminalMode, output, onLayoutReady }: OutputProps) {
  useEffect(() => {
    if (onLayoutReady) {
      requestAnimationFrame(() => {
        onLayoutReady();
      });
    }
  }, [onLayoutReady]);

  return (
    <div className="whitespace-pre-line data-[output-exists=true]:mb-4" data-output-exists={output.length > 0}>
      {terminalMode === TerminalMode.CANONICAL &&
        output.map(item =>
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
      {terminalMode === TerminalMode.RAW && (
        <Prose>
          <div
            dangerouslySetInnerHTML={{
              __html: output[0]?.output || '',
            }}
          />
        </Prose>
      )}
    </div>
  );
});
