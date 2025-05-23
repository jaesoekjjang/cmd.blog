import { getAbsolutePath, isDirectory, isFileNode, isValidPath } from '@/core/filesystem';
import { Shell } from '@/core/shell';
import path, { normalize, resolve } from 'path';
import { RenderedOutput } from '../filesystem/vFileSystem';

export type CommandType = 'ls' | 'cd' | 'cat' | 'clear' | 'pwd' | 'history' | (string & {});

export interface Command {
  name: CommandType;
  description: string;
  execute: (args: string[], shell: Shell) => CommandResult | void;
}

export type CommandResult = {
  type: RenderedOutput['kind'];
  content: string;
};

export const commands: Command[] = [
  {
    name: 'ls',
    description: 'List files and directories',
    execute: (_, shell) => {
      const currentDirectory = shell.getCurrentDirectory();
      const fileSystem = shell.getFileSystem();

      if (!isValidPath(fileSystem, currentDirectory)) {
        return { type: 'text', content: '존재하지 않는 경로입니다.' };
      }

      if (!isDirectory(fileSystem, currentDirectory)) {
        return { type: 'text', content: '디렉터리 경로가 아닙니다.' };
      }

      const currentNode = fileSystem.nodes[currentDirectory];
      const files = currentNode && currentNode.type === 'directory' ? currentNode.children : [];

      return {
        type: 'text',
        content: files
          .map(file => {
            const node = fileSystem.nodes[file];
            if (!node) {
              return '';
            }
            return `${node.name}${node.type === 'directory' ? '/' : ''}`;
          })
          .filter(({ length }) => length > 0)
          .join('\t'),
      };
    },
  },
  {
    name: 'cd',
    description: 'Change directory',
    execute: (args, shell) => {
      const directory = resolve(args[args.length - 1] || './');
      if (!directory) {
        return { type: 'text', content: '디렉터리 경로를 입력하세요.' };
      }

      const currentDirectory = shell.getCurrentDirectory();
      switch (directory) {
        case '..': {
          const parentDirectory = path.dirname(currentDirectory);
          shell.changeDirectory(parentDirectory);
          break;
        }
        case '.': {
          break;
        }
        case '-': {
          const previousDirectory = shell.getFileHistory().slice(-1)[0];
          if (!previousDirectory) {
            return { type: 'text', content: '이전 디렉터리가 없습니다.' };
          }
          shell.changeDirectory(previousDirectory);
          break;
        }
        default: {
          const fileSystem = shell.getFileSystem();
          const path = getAbsolutePath(fileSystem, currentDirectory, directory);

          if (!isValidPath(fileSystem, normalize(path)) || !isDirectory(fileSystem, path)) {
            return {
              type: 'text',
              content: `${directory}: 존재하지 않는 경로입니다.`,
            };
          }

          shell.changeDirectory(path);
          break;
        }
      }
    },
  },
  {
    name: 'pwd',
    description: 'Print working directory',
    execute: (_, shell) => {
      return { type: 'text', content: shell.getCurrentDirectory() };
    },
  },
  {
    name: 'cat',
    description: 'Display file contents',
    execute: (args: string[], shell) => {
      const file = args[0];
      if (!file) {
        return { type: 'text', content: '파일 경로를 입력하세요.' };
      }

      const fileSystem = shell.getFileSystem();
      const filePath = getAbsolutePath(fileSystem, shell.getCurrentDirectory(), file);

      if (!isValidPath(fileSystem, filePath)) {
        return {
          type: 'text',
          content: `${file}: 존재하지 않는 파일 또는 경로입니다.`,
        };
      }

      const node = fileSystem.nodes[filePath];
      if (!node || !isFileNode(node)) {
        return { type: 'text', content: `'${file}'은 파일이 아닙니다.` };
      }

      return {
        type: node.rendered.kind,
        content: node.rendered.content,
      };
    },
  },
  {
    name: 'clear',
    description: 'Clear the terminal screen',
    execute: (_, shell) => {
      shell.clearOutput();
    },
  },
  {
    name: 'history',
    description: 'Display command history',
    execute: (_, shell) => {
      const history = shell.getFullCommandHistory();
      if (history.length === 0) {
        return { type: 'text', content: '명령어 기록이 없습니다.' };
      }

      return {
        type: 'text',
        content: history.map((command, index) => `${index + 1} ${command}`).join('\n'),
      };
    },
  },
];
