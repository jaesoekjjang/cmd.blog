"use client";

import { useState, useRef } from "react";
import { TerminalEmulator, TerminalOutputItem, TextStyle } from "./types";
import { PromptState } from "@/core/shell";

export function useTerminal(): {
  terminal: TerminalEmulator;
  output: TerminalOutputItem[];
  prompt: PromptState;
} {
  const [outputItems, setOutputItems] = useState<TerminalOutputItem[]>([]);

  const [prompt, setPrompt] = useState<PromptState>({
    directory: "/",
    prefix: ">",
    date: new Date().toLocaleString(),
  });

  const idCounter = useRef(0);

  const terminal: TerminalEmulator = {
    addOutput: ({
      output,
      style,
      type = "text",
    }: {
      output: React.ReactNode;
      style?: TextStyle;
      type?: "text" | "react";
    }) => {
      setOutputItems((prevItems) => [
        ...prevItems,
        { id: idCounter.current++, content: output, style, type },
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
