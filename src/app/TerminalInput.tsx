"use client";

import { useState } from "react";
import { Shell } from "@/Shell";
import { PromptState } from "@/renderer/Terminal";

interface TerminalInputProps {
  prompt: PromptState;
  execute: Shell["executeCommand"];
}

export const TerminalInput = ({ prompt, execute }: TerminalInputProps) => {
  const [input, setInput] = useState("");

  const handleInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const command = input.trim();
    execute(command);
    setInput("");
  };

  return (
    <form onSubmit={handleInput}>
      <div className="w-full p-2 text-sm text-cyan-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
        <div className="flex justify-between">
          <div>{prompt.directory}</div>
          <div className="text-gray-500">{prompt.date}</div>
        </div>
        <div>
          {prompt.prefix}
          <input
            className="pl-2 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};
