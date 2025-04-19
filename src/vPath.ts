import { join } from "path";
import { FileSystem } from "./vFileSystem";

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

export const isDirectory = <D extends string, F extends FileSystem>(
  directory: D,
  fileSystem: F,
): boolean => {
  const node = fileSystem.nodes[directory];
  return node ? node.type === "directory" : false;
};
