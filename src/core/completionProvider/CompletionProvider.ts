import { LineEditor } from '@/core/lineEditor';
import { Shell } from '../shell';
import { DirectoryNode, FileSystem, FSNode } from '../filesystem';
import { CommandType } from '../commands';

interface CursorContext {
  line: string;
  cursor: number;
  currentWord: string;
  command: string;
}

export class CompletionProvider {
  private readonly FILE_COMMANDS: CommandType[] = ['ls', 'cd', 'cat'];

  complete(lineEditor: LineEditor, shell: Shell): string[] {
    const context = this.extractCursorContext(lineEditor);

    if (!context) {
      return [];
    }

    if (this.isInCommandPosition(context)) {
      return this.completeCommand(context.currentWord, shell);
    }

    if (this.isFileCompletionRequired(context)) {
      return this.completeFile(context.currentWord, shell);
    }

    return [];
  }

  private extractCursorContext(lineEditor: LineEditor): CursorContext | null {
    const line = lineEditor.getInput();
    const { end: cursor } = lineEditor.getCursorPosition();

    if (line[cursor] === ' ') {
      return null;
    }

    const currentWord = this.extractCurrentWord(line, cursor);
    const args = line.slice(0, cursor).trim().split(/\s+/);
    const command = args[0] || '';

    return {
      line,
      cursor,
      currentWord,
      command,
    };
  }

  /**
   * 현재 커서 위치의 단어
   */
  private extractCurrentWord(line: string, cursor: number): string {
    const isAfterSpace = line[cursor - 1] === ' ';
    const noMoreWordsAfterCursor = line.slice(cursor).search(/\S/) === -1;

    if (isAfterSpace && noMoreWordsAfterCursor) {
      return '';
    }

    const leftBoundary = line.slice(0, cursor).search(/\S+$/);
    const rightSearch = line.slice(cursor).search(/\s|$/);

    const start = leftBoundary >= 0 ? leftBoundary : cursor;
    const end = rightSearch >= 0 ? cursor + rightSearch : line.length;

    return line.slice(start, end);
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

  private completeCommand(currentArg: string, shell: Shell): string[] {
    const commands = shell.getCommands().map(cmd => cmd.name);
    return commands.filter(command => command.startsWith(currentArg));
  }
}
