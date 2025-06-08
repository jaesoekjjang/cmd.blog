import { CommandRegistry } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { CommandHistoryManager } from '@/core/history';
import { OutputItem } from '@/core/lineEditor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CompletionProvider } from '../completionProvider';
import { UsePagerReturn } from '../hooks/usePager';
import { InputLineEditor } from '../lineEditor/InputLineEditor';
import { TerminalSession } from '../terminalSession/TerminalSession';
import { Shell } from './Shell';
import { AutoComplete } from './types';

interface useLineEditorProps {
  commandRegistry: CommandRegistry;
  fileSystem: FileSystem;
  terminalSession: TerminalSession;
  paging: UsePagerReturn;
}

export function useShell({ commandRegistry, fileSystem, terminalSession, paging }: useLineEditorProps) {
  const [terminalMode, setTerminalMode] = useState(terminalSession.getCurrentMode());
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [autoComplete, setAutoComplete] = useState<AutoComplete>({
    suggestions: [],
    index: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const outputIdRef = useRef(0);

  const handleOutputChange = useCallback(
    (newOutputs: OutputItem[]) => {
      const updatedOutputs = newOutputs.map(output => ({
        id: outputIdRef.current++,
        ...output,
      }));
      setOutputs(updatedOutputs);
    },
    [setOutputs],
  );

  const [lineEditor] = useState(
    () =>
      new InputLineEditor({
        onInputChange: setInput,
        onOutputsChange: handleOutputChange,
        onSuggestionsChange: (suggestions, index) => setAutoComplete({ suggestions, index }),
      }),
  );

  const [shell] = useState(() => {
    const commandHistoryManager = new CommandHistoryManager();
    const completionProvider = new CompletionProvider();
    const shell = new Shell({
      commandRegistry,
      fileSystem,
      lineEditor,
      commandHistoryManager,
      completionProvider,
      terminalSession,
    });

    return shell;
  });

  // lineEditor->input 커서 위치 동기화
  const syncCursorPosition = useCallback(() => {
    const inputEl = inputRef.current;
    if (inputEl && lineEditor) {
      const { start, end } = lineEditor.cursorPosition;
      inputEl.setSelectionRange(start, end);
    }
  }, [lineEditor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const result = lineEditor.handleKeyDown(e);

      syncCursorPosition();
      return result;
    },
    [lineEditor, syncCursorPosition],
  );

  // input -> lineEditor 커서 위치 동기화
  const handleSelect = useCallback(() => {
    if (!inputRef.current) return;

    const { selectionStart, selectionEnd } = inputRef.current;

    if (selectionStart !== null && selectionEnd !== null) {
      lineEditor.setSelection(selectionStart, selectionEnd);
    }
  }, [lineEditor]);

  const handleTextInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      lineEditor.handleTextInput(e);
    },
    [lineEditor],
  );

  const handleRawOutputRequested = useCallback(
    ({ content, contentType, requiresPaging }: { content: string; contentType: string; requiresPaging: boolean }) => {
      if (requiresPaging) {
        paging.enable(content, contentType);
        handleOutputChange([
          {
            id: outputIdRef.current++,
            output: content,
            type: contentType === 'markdown' ? 'html' : 'text',
          },
        ]);
      } else {
        terminalSession.addOutput({
          output: content,
          type: contentType === 'markdown' ? 'html' : 'text',
        });
      }
    },
    [paging, terminalSession],
  );

  useEffect(() => {
    const handleModeChange = ({ mode }: { mode: any }) => {
      setTerminalMode(mode);
    };

    terminalSession.on('modeChanged', handleModeChange);
    terminalSession.on('rawOutputRequested', handleRawOutputRequested);
    terminalSession.on('outputsChanged', handleOutputChange);

    return () => {
      terminalSession.off('modeChanged', handleModeChange);
      terminalSession.off('rawOutputRequested', handleRawOutputRequested);
      terminalSession.off('outputsChanged', handleOutputChange);
    };
  }, [handleOutputChange, handleRawOutputRequested, terminalSession]);

  return {
    shell,
    terminalMode,
    input,
    outputs,
    inputRef,
    handleKeyDown,
    handleTextInput,
    handleSelect,
    autoComplete,
    focus: () => inputRef.current?.focus(),
  };
}
