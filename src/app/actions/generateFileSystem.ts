import { DirectoryNode, FileSystem } from '@/core/filesystem';
import { readdirSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';

const rootDirectory = join(process.cwd(), 'src/files');

export async function generateFileSystem(): Promise<FileSystem> {
  const fileSystem: FileSystem = {
    nodes: {},
    root: '/',
  };

  if (!readdirSync(rootDirectory, { withFileTypes: true })) {
    throw new Error(`루트 디렉터리 ${rootDirectory}가 존재하지 않습니다.`);
  }

  fileSystem.nodes['/'] = {
    type: 'directory',
    name: basename(rootDirectory),
    path: '/',
    children: [],
    parent: null,
  };

  function walk(dir: string) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      const relativeDirPath = dir.replace(rootDirectory, '') || '/';
      const dirNode = fileSystem.nodes[relativeDirPath] as DirectoryNode;

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(rootDirectory, '') || '/';

        dirNode.children.push(relativePath);

        if (entry.isDirectory()) {
          fileSystem.nodes[relativePath] = {
            type: 'directory',
            name: entry.name,
            path: relativePath,
            children: [],
            parent: relativeDirPath,
          };

          walk(fullPath);
        } else {
          try {
            const fileContent = readFileSync(fullPath, 'utf8');
            const extension = extname(entry.name);

            fileSystem.nodes[relativePath] = {
              type: 'file',
              name: entry.name,
              path: relativePath,
              text: fileContent,
              extension: extension,
              parent: relativeDirPath,
            };
          } catch (error) {
            console.error(`파일을 읽는 중 오류 발생: ${fullPath}\n ${error}`);
          }
        }
      }
    } catch (error) {
      console.error(`디렉터리에 접근하는 중 오류 발생: ${dir}\n ${error}`);
    }
  }

  walk(rootDirectory);

  return fileSystem;
}
