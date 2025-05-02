"use client";

import { useState, useRef } from "react";
import { TerminalEmulator, TextStyle } from "./types";
import { PromptState } from "@/core/shell";

export interface OutputItem {
  id: number;
  content: string;
  style?: TextStyle;
}

export function useTerminal(): {
  terminal: TerminalEmulator;
  output: OutputItem[];
  prompt: PromptState;
} {
  const [outputItems, setOutputItems] = useState<OutputItem[]>([]);

  const [prompt, setPrompt] = useState<PromptState>({
    directory: "/",
    prefix: ">",
    date: new Date().toLocaleString(),
  });

  const idCounter = useRef(0);

  const terminal: TerminalEmulator = {
    addOutput: (output: string, style?: TextStyle) => {
      setOutputItems((prevItems) => [
        ...prevItems,
        { id: idCounter.current++, content: output, style },
      ]);
    },
    clear: () => {
      setOutputItems([]);
    },
    setShellPromptState: (newPrompt: PromptState) => {
      setPrompt(newPrompt);
    },
  };

  return {
    terminal,
    output: outputItems,
    prompt,
  };
}
