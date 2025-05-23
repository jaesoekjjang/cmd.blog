export interface FileSystem {
  nodes: Record<string, FileNode | DirectoryNode>;
  root: string;
}

export interface FSNode {
  type: 'file' | 'directory';
  name: string;
  path: string;
  parent: string | null;
}

export interface FileNode extends FSNode {
  type: 'file';
  text: string;
  extension: string;
  rendered: RenderedOutput;
}

export type RenderedOutput = { kind: 'html'; content: string } | { kind: 'text'; content: string };

export interface DirectoryNode extends FSNode {
  type: 'directory';
  children: string[];
}

export function isDirectoryNode(node: FSNode): node is DirectoryNode {
  return node.type === 'directory';
}

export function isFileNode(node: FSNode): node is FileNode {
  return node.type === 'file';
}
