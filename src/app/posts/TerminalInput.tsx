"use client";

import { useEffect, useRef, useState } from "react";
import { Shell } from "@/Shell";
import { PromptState } from "@/terminal/TerminalEmulator";

interface TerminalInputProps {
  prompt: PromptState;
  execute: Shell["executeCommand"];
}

export function TerminalInput({ prompt, execute }: TerminalInputProps) {
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const command = input.trim();
    execute(command);
    setInput("");
  };

  return (
    <form onSubmit={handleInput} className="mt-2">
      <div className="flex items-center justify-between">
        <div className="text-terminal-prompt-directory font-semibold">
          {prompt.directory}
        </div>
        <time
          className="text-[13px] text-terminal-prompt-time mt-1"
          suppressHydrationWarning
        >
          {prompt.date}
        </time>
      </div>
      <div className="flex gap-1">
        <span className="text-terminal-prompt-prefix font-semibold">
          {prompt.prefix}
        </span>
        <input
          ref={inputRef}
          className="flex-1 pl-1 bg-transparent border-none focus:outline-none dark:text-[var(--color-text-dark)] dark:caret-white light:text-[var(--color-text)] light:caret-[var(--color-text)]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck="false"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
