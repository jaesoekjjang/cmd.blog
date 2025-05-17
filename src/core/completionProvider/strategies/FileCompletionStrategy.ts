import { FileSystem } from '../../filesystem';
import { Shell } from '../../shell';
import { CompletionStrategy } from './CompletionStrategy';

export class FileCompletionStrategy implements CompletionStrategy {
  constructor(private readonly fileSystem: FileSystem) {}

  canHandle(args: string[], currentArg: string): boolean {
    if (args.length === 0) {
      return false;
    }
  }

  complete(input: string, shell: Shell): string[] {
    const currentDirectory = shell.getCurrentDirectory();
    const currentNode = this.fileSystem.nodes[currentDirectory];

    if (!currentNode || currentNode.type !== 'directory') {
      return [];
    }

    const files = currentNode.children.map(file => {
      const node = this.fileSystem.nodes[file];
      if (!node) {
        return '';
      }
      return `${node.name}${node.type === 'directory' ? '/' : ''}`;
    });

    return files.filter(file => file.startsWith(input));
  }
}
