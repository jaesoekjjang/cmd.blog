import { join, basename, extname } from "path";
import { readdirSync, readFileSync } from "fs";

const rootDirectory = join(process.cwd(), "src/files");

export interface FileSystem {
  nodes: Record<string, FileNode | DirectoryNode>;
  root: string;
}

export interface FSNode {
  type: "file" | "directory";
  name: string;
  path: string;
  parent: string | null;
}

export interface FileNode extends FSNode {
  type: "file";
  content: string;
  extension: string;
}

export interface DirectoryNode extends FSNode {
  type: "directory";
  children: string[];
}

export function generateFileSystem(): FileSystem {
  const fileSystem: FileSystem = {
    nodes: {},
    root: "/",
  };

  if (!readdirSync(rootDirectory, { withFileTypes: true })) {
    throw new Error(`루트 디렉터리 ${rootDirectory}가 존재하지 않습니다.`);
  }

  fileSystem.nodes["/"] = {
    type: "directory",
    name: basename(rootDirectory),
    path: "/",
    children: [],
    parent: null,
  };

  function walk(dir: string): void {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      const relativeDirPath = dir.replace(rootDirectory, "") || "/";
      const dirNode = fileSystem.nodes[relativeDirPath] as DirectoryNode;

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(rootDirectory, "") || "/";

        dirNode.children.push(relativePath);

        if (entry.isDirectory()) {
          fileSystem.nodes[relativePath] = {
            type: "directory",
            name: entry.name,
            path: relativePath,
            children: [],
            parent: relativeDirPath,
          };

          walk(fullPath);
        } else {
          try {
            const fileContent = readFileSync(fullPath, "utf8");
            const extension = extname(entry.name);

            fileSystem.nodes[relativePath] = {
              type: "file",
              name: entry.name,
              path: relativePath,
              content: fileContent,
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
