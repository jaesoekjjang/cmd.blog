import { getAbsolutePath, isDirectory, isValidPath } from '@/core/filesystem';
import { Shell } from '@/core/shell';
import path, { normalize, resolve } from 'path';
import { BaseCommand, CommandResult } from '../BaseCommand';

export class CdCommand extends BaseCommand {
  readonly name = 'cd';
  readonly description = 'Change directory';

  execute(args: string[], shell: Shell): CommandResult | void {
    const directory = resolve(args[args.length - 1] || './');
    if (!directory) {
      return this.createError('디렉터리 경로를 입력하세요.');
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
          return this.createError('이전 디렉터리가 없습니다.');
        }
        shell.changeDirectory(previousDirectory);
        break;
      }
      default: {
        const fileSystem = shell.getFileSystem();
        const targetPath = getAbsolutePath(fileSystem, currentDirectory, directory);

        if (!isValidPath(fileSystem, normalize(targetPath)) || !isDirectory(fileSystem, targetPath)) {
          return this.createError(`${directory}: 존재하지 않는 경로입니다.`);
        }

        shell.changeDirectory(targetPath);
        break;
      }
    }
  }
}