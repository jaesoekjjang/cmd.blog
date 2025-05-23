import { DirectoryNode, FileNode, FileSystem } from '@/core/filesystem';
import { renderMarkdown } from '@/core/renderer/renderMarkdown';
import { readdirSync, readFileSync } from 'fs';
import { unstable_cache } from 'next/cache';
import { basename, extname, join } from 'path';

const rootDirectory = join(process.cwd(), 'src/files');

async function buildFileSystem(): Promise<FileSystem> {
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

  async function walk(dir: string) {
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

          const fileNode = await makeFileNode({
            name: entry.name,
            text: fileContent,
            parent: relativeDirPath,
            path: relativePath,
            extension,
          });

          fileSystem.nodes[relativePath] = fileNode;
        } catch (error) {
          console.error(`파일을 읽는 중 오류 발생: ${fullPath}\n ${error}`);
        }
      }
    }
  }

  walk(rootDirectory);
  return fileSystem;
}

async function makeFileNode({
  name,
  path,
  text,
  extension,
  parent,
}: {
  name: string;
  path: string;
  text: string;
  extension: string;
  parent: string;
}): Promise<FileNode> {
  switch (extension) {
    case '.md':
      return {
        type: 'file',
        name,
        path,
        text,
        extension,
        parent,
        rendered: {
          kind: 'html',
          content: await renderMarkdown(text),
        },
      };
    default:
      return {
        type: 'file',
        name,
        path,
        text,
        extension,
        parent,
        rendered: {
          kind: 'text',
          content: text,
        },
      };
  }
}

const getCachedFileSystem = unstable_cache(async () => buildFileSystem(), ['file-system'], {
  revalidate: false,
  tags: ['file-system-data'],
});

export async function generateFileSystem() {
  return getCachedFileSystem();
}
