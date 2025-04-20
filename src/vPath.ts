import { join } from "path";
import { FileSystem, isDirectoryNode, isFileNode } from "./vFileSystem";

export function isValidPath(
  fileSystem: FileSystem,
  currentPath: string,
): boolean {
  return !!fileSystem.nodes[currentPath];
}

export const getAbsolutePath = (
  fileSystem: FileSystem,
  currentDirectory: string,
  path: string,
): string => {
  const root = fileSystem.root;

  if (path.startsWith("/")) {
    return path;
  }

  const absolutePath = join(root, currentDirectory, path);

  if (isValidPath(fileSystem, absolutePath)) {
    return absolutePath;
  }

  return join(root, currentDirectory);
};

export const isDirectory = (fileSystem: FileSystem, dir: string): boolean => {
  const node = fileSystem.nodes[dir];
  return node ? isDirectoryNode(node) : false;
};

export const isFile = (fileSystem: FileSystem, file: string): boolean => {
  const node = fileSystem.nodes[file];
  return node ? isFileNode(node) : false;
};
