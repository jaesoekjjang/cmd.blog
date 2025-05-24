import { getAbsolutePath, isFileNode, isValidPath } from '@/core/filesystem';
import { Shell } from '@/core/shell';
import { BaseCommand, CommandResult } from '../BaseCommand';

export class CatCommand extends BaseCommand {
  readonly name = 'cat';
  readonly description = 'Display file contents';

  execute(args: string[], shell: Shell): CommandResult {
    if (!this.validateArgs(args, 1)) {
      return this.createError('파일 경로를 입력하세요.');
    }

    const file = args[0];
    const fileSystem = shell.getFileSystem();
    const filePath = getAbsolutePath(fileSystem, shell.getCurrentDirectory(), file);

    if (!isValidPath(fileSystem, filePath)) {
      return this.createError(`${file}: 존재하지 않는 파일 또는 경로입니다.`);
    }

    const node = fileSystem.nodes[filePath];
    if (!node || !isFileNode(node)) {
      return this.createError(`'${file}'은 파일이 아닙니다.`);
    }

    return this.createSuccess(node.rendered.content, node.rendered.kind);
  }
}