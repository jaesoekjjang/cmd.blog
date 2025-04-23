"use client";

import { commands } from "../command/commands";
import { useMemo, useState } from "react";
import { FileSystem } from "@/vFileSystem";
import { Shell } from "@/Shell";
import { TerminalInput } from "./posts/TerminalInput";
import { useTerminal } from "@/renderer/useTerminal";
import { CommandHistoryManager } from "@/command/CommandHistoryManager";
import { TerminalOutput } from "./posts/TerminalOutput";
import { TerminalHeader } from "./posts/TerminalHeader";

interface MainProps {
  fileSystem: FileSystem;
}

export const Main = ({ fileSystem }: MainProps) => {
  const commandHistoryManager = useMemo(() => new CommandHistoryManager(), []);
  const { terminal, output, prompt } = useTerminal();

  const [shell] = useState(
    () => new Shell({ commands, fileSystem, terminal, commandHistoryManager }),
  );

  return (
    <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-3xl mx-auto">
<<<<<<< Updated upstream
      <div
        className={`w-full rounded-lg overflow-hidden shadow-lg ${
          isDark
            ? "bg-gray-900 border border-gray-700"
            : "bg-slate-100 border border-slate-300"
        }`}
      >
        {/* Terminal Header */}
        <div
          className={`flex items-center px-4 py-2 border-b ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-slate-200 border-slate-300"
          }`}
        >
          {/* Window Controls */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {/* Terminal Title */}
          <div
            className={`mx-auto text-sm font-medium ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Terminal
          </div>
          {/* Theme Toggle */}
          <button
            onClick={toggleColorMode}
            className={`text-xs px-2 py-1 rounded ${
              isDark
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-slate-300 text-slate-700 hover:bg-slate-400"
            }`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
=======
      <div className="flex flex-col bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-lg w-full h-[520px] text-sm">
        <TerminalHeader />
>>>>>>> Stashed changes

        <div className="flex flex-col flex-1 overflow-hidden py-1 px-2">
          <TerminalOutput output={output} />
          <TerminalInput
            prompt={prompt}
            execute={(command) => shell.executeCommand(command)}
          />
        </div>
      </div>
    </main>
  );
};
