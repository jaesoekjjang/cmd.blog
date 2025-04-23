"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput } from "./TerminalOutput";
import { useTerminal } from "@/terminal/useTerminal";
import { commands, CommandHistoryManager } from "@/command";
import { Shell } from "@/Shell";
import { FileSystem } from "@/vFileSystem";

interface TerminalProps {
  fileSystem: FileSystem;
}

export function Terminal({ fileSystem }: TerminalProps) {
  const commandHistoryManager = useMemo(() => new CommandHistoryManager(), []);
  const { terminal, output, prompt } = useTerminal();

  const [shell] = useState(
    () => new Shell({ commands, fileSystem, terminal, commandHistoryManager }),
  );

  const outputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop =
        outputContainerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="flex flex-col bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-lg w-full h-[520px] text-sm">
      <TerminalHeader />
      <div
        className="flex flex-col flex-1 py-1 px-2 scrollbar"
        ref={outputContainerRef}
      >
        <TerminalOutput output={output} />
        <TerminalInput
          prompt={prompt}
          execute={(command) => shell.executeCommand(command)}
        />
      </div>
    </div>
  );
}
