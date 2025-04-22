import { Shell } from "@/Shell";
import { isFileNode } from "@/vFileSystem";
import { getAbsolutePath, isDirectory, isValidPath } from "@/vPath";
import path, { normalize, resolve } from "path";

export type CommandType =
  | "ls"
  | "cd"
  | "cat"
  | "clear"
  | "help"
  | (string & {});

export interface Command {
  name: CommandType;
  description: string;
  execute: (args: string[], shell: Shell) => string | void;
}

export const commands: Command[] = [
  {
    name: "ls",
    description: "List files and directories",
    execute: (_, shell) => {
      const currentDirectory = shell.getCurrentDirectory();
      const fileSystem = shell.getFileSystem();

      if (!isValidPath(fileSystem, currentDirectory)) {
        return "존재하지 않는 경로입니다.";
      }

      if (!isDirectory(fileSystem, currentDirectory)) {
        return "디렉터리 경로가 아닙니다.";
      }
      const currentNode = fileSystem.nodes[currentDirectory];

      const files =
        currentNode && currentNode.type === "directory"
          ? currentNode.children
          : [];

      return files
        .map((file) => {
          const node = fileSystem.nodes[file];
          if (!node) {
            return "";
          }

          return `${node.name}${node.type === "directory" ? "/" : ""}`;
        })
        .filter(({ length }) => length > 0)
        .join("\n");
    },
  },
  {
    name: "cd",
    description: "Change directory",
    execute: (args, shell) => {
      const directory = resolve(args[args.length - 1] || "./");
      const currentDirectory = shell.getCurrentDirectory();

      switch (directory) {
        case "..": {
          const parentDirectory = path.dirname(currentDirectory);
          shell.changeDirectory(parentDirectory);
        }

        case ".": {
        }

        case "-": {
          const previousDirectory = shell.getFileHistory().slice(-1)[0];

          if (!previousDirectory) {
            return "이전 디렉터리가 없습니다.";
          }

          shell.changeDirectory(previousDirectory);
        }

        default: {
          const fileSystem = shell.getFileSystem();

          const path = getAbsolutePath(fileSystem, currentDirectory, directory);

          if (
            !isValidPath(fileSystem, path) &&
            !isValidPath(fileSystem, normalize(path))
          ) {
            return `${directory}: 존재하지 않는 경로입니다.`;
          }

          shell.changeDirectory(path);
        }
      }
    },
  },
  {
    name: "pwd",
    description: "Print working directory",
    execute: (_, shell) => shell.getCurrentDirectory(),
  },
  {
    name: "cat",
    description: "Display file contents",
    execute: (args: string[], shell) => {
      const file = args[0];

      if (!file) {
        return "파일 경로를 입력하세요.";
      }

      const fileSystem = shell.getFileSystem();

      const filePath = getAbsolutePath(
        fileSystem,
        shell.getCurrentDirectory(),
        file,
      );

      if (!isValidPath(fileSystem, filePath)) {
        return `${file}: 존재하지 않는 파일 또는 경로입니다.`;
      }

      const node = fileSystem.nodes[filePath];

      if (!node || !isFileNode(node)) {
        return `'${file}'은 파일이 아닙니다.`;
      }

      return node.content;
    },
  },
  {
    name: "clear",
    description: "Clear the terminal screen",
    execute: (_, shell) => {
      shell.clearOutput();
    },
  },
  {
    name: "help",
    description: "Display help information",
    execute: () => {
      return commands
        .map((command) => `${command.name}: ${command.description}`)
        .join("\n");
    },
  },
];
