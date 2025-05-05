import { useState, useRef, useCallback, useEffect } from "react";
import { Shell } from "../shell";
import { InputLineEditor } from "./InputLineEditor";
import { Command } from "../commands";
import { TerminalOutputItem } from "./types";
import { FileSystem } from "../filesystem";
import { CommandHistoryManager } from "../history";

interface useLineEditorProps {
  commands: Command[];
  fileSystem: FileSystem;
}

export function useLineEditor({ commands, fileSystem }: useLineEditorProps) {
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState<TerminalOutputItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputIdRef = useRef(0);

  const shellRef = useRef<Shell | null>(null);

  const [lineEditor] = useState(() => {
    return new InputLineEditor({
      onInputChange: setInput,
      onOutputsChange: (outputs) => {
        const newOutputs = outputs.map((output) => ({
          id: outputIdRef.current++,
          ...output,
        }));

        setOutputs(newOutputs);
      },
      onFocus: () => inputRef.current?.focus(),
    });
  });

  const initializeShell = useCallback(
    (commands: Command[], fileSystem: FileSystem) => {
      const commandHistoryManager = new CommandHistoryManager();

      shellRef.current = new Shell({
        commands,
        fileSystem,
        lineEditor,
        commandHistoryManager,
      });

      lineEditor.setShell(shellRef.current);
    },
    [lineEditor],
  );

  useEffect(() => {
    initializeShell(commands, fileSystem);
  }, [commands, fileSystem, initializeShell]);

  // lineEditor->input 커서 위치 동기화
  const syncCursorPosition = useCallback(() => {
    const inputEl = inputRef.current;
    if (inputEl && lineEditor) {
      inputEl.setSelectionRange(
        lineEditor.cursorSelectionStart,
        lineEditor.cursorSelectionEnd,
      );
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
    input,
    outputs,
    inputRef,
    shell: shellRef.current,
    lineEditor,
    initializeShell,
    handleKeyDown,
    handleTextInput,
    handleSelect,
    focus: () => inputRef.current?.focus(),
  };
}
