import { Command, CommandHistoryManager } from "@/core/commands";
import { FileSystem } from "@/core/filesystem";
import { getThemeTokenResolver } from "@/app/theme";
import {  TextStyle } from "@/core/types/terminal";
import { TerminalEmulator } from "@/core/terminal/TerminalEmulator";
import { ShellOptions } from "./types";
import tinydate from "tinydate";

const defaultShellOptions: ShellOptions = {
  dateFormat: "🕔 {HH}:{mm}:{ss}",
  promptPrefix: ">",
};

const { terminalPromptCommand, terminalPromptPrefix } = getThemeTokenResolver();
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
    this.outputToTerminal(`${this.opts.promptPrefix}\t`, {
      style: { foreground: terminalPromptPrefix(), bold: true },
      newline: false,
    });

    this.outputToTerminal(commandStr, {
      style: { foreground: terminalPromptCommand(), bold: true },
      newline: true,
    });

    const [cmd, ...args] = commandStr.split(" ");

    const command = this.commands.find((c) => c.name === cmd);

    let output: string | void;

    if (!command) {
      output = "존재하지 않는 명령입니다.";
    } else {
      output = command.execute(args, this);
      this.commandHistoryManager.addCommand(commandStr);
    }

    if (output) {
      this.outputToTerminal(output, { newline: true });
    }

    return output;
  }

  outputToTerminal(
    output: string,
    opts?: { newline?: boolean; style?: TextStyle },
  ) {
    const { newline = false, style } = opts || {};

    this.terminal.addOutput(output, style);

    if (newline) {
      this.terminal.addOutput("\n");
    }
  }

  getCommandHistory() {
    return this.commandHistoryManager.getHistory();
  }
}
