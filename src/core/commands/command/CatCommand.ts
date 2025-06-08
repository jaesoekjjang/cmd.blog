import { getAbsolutePath, isFileNode, isValidPath } from '@/core/filesystem';
import { renderMarkdown } from '@/core/renderer/renderMarkdown';
import { Shell } from '@/core/shell';
import { BaseCommand, CommandResult } from '../BaseCommand';

export class CatCommand extends BaseCommand {
  readonly name = 'cat';
  readonly description = 'Display file contents';

  async execute(args: string[], shell: Shell): Promise<CommandResult> {
    if (!this.validateArgs(args, 1)) {
      return this.createError('파일 경로를 입력하세요.');
    }

    const file = args[0]!;
    const fileSystem = shell.getFileSystem();
    const filePath = getAbsolutePath(fileSystem, shell.getCurrentDirectory(), file);

    if (!isValidPath(fileSystem, filePath)) {
      return this.createError(`${file}: 존재하지 않는 파일 또는 경로입니다.`);
    }

    const node = fileSystem.nodes[filePath];
    if (!node || !isFileNode(node)) {
      return this.createError(`'${file}'은 파일이 아닙니다.`);
    }

    const content = node.rendered.content;
    const isMarkdown = this.isMarkdownFile(file) || node.rendered.kind === 'html';

    // 마크다운 파일인 경우 렌더링
    if (isMarkdown) {
      const renderedContent = await renderMarkdown(content);
      return this.createRawResult(content, 'markdown', true);
    }

    return this.createRawResult(content, 'text', true);
  }

  private isMarkdownFile(filename: string): boolean {
    const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkd'];
    return markdownExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}
