import { LineEditor } from '@/core/lineEditor';
import { CommandRegistry } from '../commands';
import { DirectoryNode, FileSystem, FSNode } from '../filesystem';
import { CursorContext } from '../lineEditor/types';
import { Shell } from '../shell';

export class CompletionProvider {
  private readonly FILE_COMMANDS: string[] = ['ls', 'cd', 'cat'];

  complete(lineEditor: LineEditor, shell: Shell, commandRegistry: CommandRegistry): string[] {
    const context = lineEditor.getcursorContext();

    if (!context) {
      return [];
    }

    if (this.isInCommandPosition(context)) {
      return this.completeCommand(context.currentWord, commandRegistry);
    }

    if (this.isFileCompletionRequired(context)) {
      return this.completeFile(context.currentWord, shell);
    }

    return [];
  }

  /**
   * 커서가 command 단어 내부에 있는지 확인
   */
  private isInCommandPosition(context: CursorContext): boolean {
    return context.cursor <= (context.command?.length || 0);
  }

  /**
   * 지정된 command가 파일 관련 명령인지 확인
   */
  private isFileCompletionRequired(context: CursorContext): boolean {
    return this.FILE_COMMANDS.includes(context.command);
  }

  private completeFile(currentArg: string, shell: Shell): string[] {
    const fileSystem = shell.getFileSystem();
    const currentDirectory = shell.getCurrentDirectory();
    const currentNode = fileSystem.nodes[currentDirectory];

    if (!(currentNode && this.isValidDirectory(currentNode))) {
      return [];
    }

    return this.getFilteredFileList(currentNode, fileSystem, currentArg);
  }

  private isValidDirectory(node: FSNode): node is DirectoryNode {
    return node && node.type === 'directory';
  }

  private getFilteredFileList(dirNode: DirectoryNode, fileSystem: FileSystem, prefix: string): string[] {
    const files = dirNode.children.map(file => {
      const node = fileSystem.nodes[file];
      if (!node) return '';

      return `${node.name}${node.type === 'directory' ? '/' : ''}`;
    });

    return files.filter(file => file.startsWith(prefix));
  }

  private completeCommand(currentArg: string, commandRegistry: CommandRegistry): string[] {
    return commandRegistry.getNames().filter(command => command.startsWith(currentArg));
  }
}
