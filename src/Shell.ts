import { Command } from "@/command/commands";
import { FileSystem } from "@/vFileSystem";
import { TerminalEmulator } from "./renderer/Terminal";
import { CommandHistoryManager } from "./command/CommandHistoryManager";
import tinydate from "tinydate";

interface ShellOptions {
  /**
   * tinydate format
   */
  dateFormat: string;
  promptPrefix: string;
}

const defaultShellOptions: ShellOptions = {
  dateFormat: "🕔 {HH}:{mm}:{ss}",
  promptPrefix: ">",
};

export class Shell {
  private fileSystem: FileSystem;
  private terminal: TerminalEmulator;
  private currentDirectory: string;
  private fileHistory: string[];

  private commands: Command[];
  private commandHistoryManager: CommandHistoryManager;

  private opts: ShellOptions;

  constructor({
    commands,
    fileSystem,
    terminal,
    commandHistoryManager,
    opts,
  }: {
    commands: Command[];
    fileSystem: FileSystem;
    terminal: TerminalEmulator;
    commandHistoryManager: CommandHistoryManager;
    opts?: Partial<ShellOptions>;
  }) {
    this.commands = commands;
    this.fileSystem = fileSystem;
    this.terminal = terminal;
    this.currentDirectory = "/";
    this.fileHistory = [];
    this.commandHistoryManager = commandHistoryManager;

    this.opts = {
      ...defaultShellOptions,
      ...opts,
    };

    this.updateShellState();
  }

  private updateShellState() {
    const date = tinydate(this.opts.dateFormat)(new Date());

    this.terminal.setShellPromptState({
      directory: this.currentDirectory,
      prefix: this.opts.promptPrefix,
      date,
    });
  }

  /**
   * fileSystem 관련methods
   */
  changeDirectory(dir: string) {
    this.currentDirectory = dir;
    this.updateShellState();
    return dir;
  }

  getFileSystem() {
    return this.fileSystem;
  }

  getCurrentDirectory() {
    return this.currentDirectory;
  }

  clearOutput() {
    this.terminal.clear();
    this.updateShellState();
  }

  getFileHistory() {
    return [...this.fileHistory];
  }

  addToFileHistory(file: string) {
    this.fileHistory.push(file);
  }

  /**
   * command 관련 methods
   */
  executeCommand(commandStr: string): string | void {
    this.terminal.addOutput(`${this.opts.promptPrefix} ${commandStr}`);

    const [cmd, ...args] = commandStr.split(" ");

    const command = this.commands.find((c) => c.name === cmd);

    let output: string | void = undefined;

    if (!command) {
      output = "존재하지 않는 명령입니다.";
    } else {
      output = command.execute(args, this);
      this.commandHistoryManager.addCommand(commandStr);
    }

    if (output) {
      this.terminal.addOutput(output);
    }

    return output;
  }
}
