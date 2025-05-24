import { getAbsolutePath, isDirectory, isValidPath } from '@/core/filesystem';
import { Shell } from '@/core/shell';
import { BaseCommand, CommandResult } from '../BaseCommand';

export class LsCommand extends BaseCommand {
  readonly name = 'ls';
  readonly description = 'List files and directories';

  execute(args: string[], shell: Shell): CommandResult {
    const currentDirectory = shell.getCurrentDirectory();
    const fileSystem = shell.getFileSystem();

    if (!isValidPath(fileSystem, currentDirectory)) {
      return this.createError('존재하지 않는 경로입니다.');
    }

    if (!isDirectory(fileSystem, currentDirectory)) {
      return this.createError('디렉터리 경로가 아닙니다.');
    }

    const currentNode = fileSystem.nodes[currentDirectory];
    const files = currentNode && currentNode.type === 'directory' ? currentNode.children : [];

    const content = files
      .map(file => {
        const node = fileSystem.nodes[file];
        if (!node) return '';
        return `${node.name}${node.type === 'directory' ? '/' : ''}`;
      })
      .filter(name => name.length > 0)
      .join('\t');

    return this.createSuccess(content);
  }
}