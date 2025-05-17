import { Command } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import { CommandHistoryManager } from '@/core/history';
import { OutputItem } from '@/core/lineEditor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CompletionProvider } from '../completionProvider';
import { InputLineEditor } from '../lineEditor/InputLineEditor';
import { Shell } from './Shell';
import { AutoComplete } from './types';

interface useLineEditorProps {
  commands: Command[];
  fileSystem: FileSystem;
}

export function useShell({ commands, fileSystem }: useLineEditorProps) {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [autoComplete, setAutoComplete] = useState<AutoComplete>({
    suggestions: [],
    index: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const outputIdRef = useRef(0);

  // TODO: shell과 lineEditor의 역할 구분.
  const [lineEditor] = useState(
    () =>
      new InputLineEditor({
        onInputChange: setInput,
        onOutputsChange: outputs => {
          const newOutputs = outputs.map(output => ({
            id: outputIdRef.current++,
            ...output,
          }));
          setOutputs(newOutputs);
        },
        onSuggestionsChange: (suggestions, index) => setAutoComplete({ suggestions, index }),
        onFocus: () => inputRef.current?.focus(),
      }),
  );

  const [shell] = useState(() => {
    const commandHistoryManager = new CommandHistoryManager();
    const completionProvider = new CompletionProvider();
    const shell = new Shell({
      commands,
      fileSystem,
      lineEditor,
      commandHistoryManager,
      completionProvider,
    });

    return shell;
  });

  useEffect(() => {
    lineEditor.setShell(shell);
  }, [lineEditor, shell]);

  // lineEditor->input 커서 위치 동기화
  const syncCursorPosition = useCallback(() => {
    const inputEl = inputRef.current;
    if (inputEl && lineEditor) {
      inputEl.setSelectionRange(lineEditor.cursorSelectionStart, lineEditor.cursorSelectionEnd);
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

  return {
    shell,
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
