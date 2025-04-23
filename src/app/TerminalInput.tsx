"use client";

import { useEffect, useRef, useState } from "react";
import { Shell } from "@/Shell";
import { PromptState } from "@/renderer/Terminal";

interface TerminalInputProps {
  prompt: PromptState;
  execute: Shell["executeCommand"];
}

export const TerminalInput = ({ prompt, execute }: TerminalInputProps) => {
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
      <div className="flex items-baseline justify-between">
        <div className="flex gap-2">
          <div className="text-cyan-500 font-semibold">{prompt.directory}</div>
          <div className="text-lime-500">{prompt.prefix}</div>
        </div>
        <time
          className="text-xs text-gray-500 dark:text-gray-500 light:text-slate-500 mt-1"
          suppressHydrationWarning
        >
          {prompt.date}
        </time>
      </div>
      <input
        ref={inputRef}
        className="flex-1 pl-1 bg-transparent border-none focus:outline-none dark:text-stone-300 dark:caret-white light:text-slate-800 light:caret-slate-800"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck="false"
        autoComplete="off"
      />
    </form>
  );
};
