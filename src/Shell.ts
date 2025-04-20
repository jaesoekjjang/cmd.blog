import { Command } from "@/command/commands";
import { FileSystem } from "@/vFileSystem";
import { Renderer } from "./renderer/Renderer";

export class Shell {
  private commands: Command[];
  private fileSystem: FileSystem;
  private renderer: Renderer;
  private currentDirectory: string;
  private history: string[];

  constructor({
    commands,
    fileSystem,
    renderer,
  }: {
    commands: Command[];
    fileSystem: FileSystem;
    renderer: Renderer;
  }) {
    this.commands = commands;
    this.fileSystem = fileSystem;
    this.renderer = renderer;
    this.currentDirectory = "/";
    this.history = [];

    this.renderer.renderPrompt({
      directory: this.currentDirectory,
      prompt: this.prompt(),
      history: this.history,
    });
  }

  private renderPrompt(): void {
    this.renderer.renderPrompt({
      directory: this.currentDirectory,
      prompt: this.prompt(),
      history: this.history,
    });
  }

  executeCommand(commandStr: string): string | void {
    const [cmd, ...args] = commandStr.split(" ");

    const command = this.commands.find((c) => c.name === cmd);

    if (!command) {
      const output = "존재하지 않는 명령입니다.";
      this.renderer.renderOutput(output);
      this.renderPrompt();
      return output;
    }

    const output = command.execute(args, this);

    if (output) {
      this.renderer.renderOutput(output);
      this.renderPrompt();
    }

    return output;
  }

  changeDirectory(dir: string): string {
    this.history.push(this.currentDirectory);
    this.currentDirectory = dir;
    return dir;
  }

  prompt(): string {
    return "> ";
  }

  getFileSystem(): FileSystem {
    return this.fileSystem;
  }

  getCurrentDirectory(): string {
    return this.currentDirectory;
  }

  getHistory(): string[] {
    return this.history;
  }

  clearOutput(): void {
    this.renderer.clearOutput();
  }
}
