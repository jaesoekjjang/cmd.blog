"use client";

import { commands } from "../command/commands";
import { useMemo, useState } from "react";
import { FileSystem } from "@/vFileSystem";
import { Shell } from "@/Shell";
import { TerminalInput } from "./TerminalInput";
import { useTerminal } from "@/renderer/useTerminal";
import { CommandHistoryManager } from "@/command/CommandHistoryManager";

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
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <div>
        {output.map((item) => {
          return (
            <div key={item.id} className="text-stone-300 whitespace-pre-wrap">
              {item.content}
            </div>
          );
        })}
      </div>

      <TerminalInput
        prompt={prompt}
        // Shell의 this context를 잃지 않기 위해 익명함수로 래핑
        execute={(command) => shell.executeCommand(command)}
      />
    </main>
  );
};
