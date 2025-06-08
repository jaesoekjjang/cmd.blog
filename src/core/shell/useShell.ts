import { CommandRegistry } from '@/core/commands';
import { EventBus, TerminalEvents } from '@/core/eventBus';
import { FileSystem } from '@/core/filesystem';
import { CommandHistoryManager } from '@/core/history';
import { OutputItem } from '@/core/output';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CompletionProvider } from '../completionProvider';
import { UsePagerReturn } from '../hooks/usePager';
import { InputLineEditor } from '../lineEditor/InputLineEditor';
import { BaseOutputManager } from '../output/OutputManager';
import { TerminalMode, TerminalSession } from '../terminalSession/TerminalSession';
import { Shell } from './Shell';
import { AutoComplete } from './types';

interface useLineEditorProps<T extends HTMLElement> {
  commandRegistry: CommandRegistry;
  fileSystem: FileSystem;
  paging: UsePagerReturn<T>;
}

export function useShell<T extends HTMLElement>({ commandRegistry, fileSystem, paging }: useLineEditorProps<T>) {
  const [terminalMode, setTerminalMode] = useState<TerminalMode>(TerminalMode.CANONICAL);
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [autoComplete, setAutoComplete] = useState<AutoComplete>({
    suggestions: [],
    index: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [eventBus] = useState(() => new EventBus<TerminalEvents>());
  const [outputManager] = useState(() => new BaseOutputManager(eventBus));
  const [terminalSession] = useState(() => new TerminalSession(eventBus));

  const [shell] = useState(() => {
    const commandHistoryManager = new CommandHistoryManager();
    const shell = new Shell({
      commandRegistry,
      fileSystem,
      outputManager,
      commandHistoryManager,
      terminalSession,
    });

    return shell;
  });

  const [lineEditor] = useState(() => {
    const completionProvider = new CompletionProvider();
    return new InputLineEditor({
      onInputChange: setInput,
      onSuggestionsChange: (suggestions, index) => setAutoComplete({ suggestions, index }),
      onCommandExecute: command => shell.executeCommandFromInput(command),
      onRequestPrevCommand: () => shell.getPreviousCommand(),
      onRequestNextCommand: () => shell.getNextCommand(),
      onRequestLastCommand: () => shell.goToLastCommand(),
      onRequestClear: () => shell.clearOutput(),
      onRequestAutoComplete: lineEditor => completionProvider.complete(lineEditor, shell, commandRegistry),
    });
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
      } else {
        outputManager.addOutput({
          output: content,
          type: contentType === 'markdown' ? 'html' : 'text',
        });
      }
    },
    [paging, outputManager],
  );

  useEffect(() => {
    const handleModeChange = ({ mode }: { mode: string }) => {
      setTerminalMode(mode as TerminalMode);
    };

    const handleOutputsChanged = (outputs: OutputItem[]) => {
      setOutputs(outputs);
    };

    eventBus.on('terminal:modeChanged', handleModeChange);
    eventBus.on('terminal:rawOutputRequested', handleRawOutputRequested);
    eventBus.on('output:changed', handleOutputsChanged);

    return () => {
      eventBus.off('terminal:modeChanged', handleModeChange);
      eventBus.off('terminal:rawOutputRequested', handleRawOutputRequested);
      eventBus.off('output:changed', handleOutputsChanged);
    };
  }, [handleRawOutputRequested, eventBus]);

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
