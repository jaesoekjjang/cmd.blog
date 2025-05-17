import { getThemeTokenResolver } from '@/app/theme';
import { Command } from '@/core/commands';
import { FileSystem } from '@/core/filesystem';
import tinydate from 'tinydate';
import { CommandResult } from '../commands/commands';
import { CompletionProvider } from '../completionProvider';
import { HistoryManager } from '../history';
import { TextStyle } from '../lineEditor';
import { LineEditor } from '../lineEditor/LineEditor';
import { renderFileNode } from '../renderer/fileNodeRenderer';
import { PromptState, ShellOptions } from './types';

const defaultShellOptions: ShellOptions = {
  dateFormat: '🕔 {HH}:{mm}:{ss}',
  promptPrefix: '>',
};

const { terminalPromptCommand, terminalPromptPrefix } = getThemeTokenResolver();

export class Shell {
  private fileSystem: FileSystem;
  private lineEditor: LineEditor;
  private currentDirectory: string;
  private fileHistory: string[];

  private commands: Command[];
  private commandHistoryManager: HistoryManager;

  private completionProvider: CompletionProvider;

  private opts: ShellOptions;
  private promptState_: PromptState;

  constructor({
    commands,
    fileSystem,
    lineEditor,
    commandHistoryManager,
    completionProvider,
    opts,
  }: {
    commands: Command[];
    fileSystem: FileSystem;
    lineEditor: LineEditor;
    commandHistoryManager: HistoryManager;
    completionProvider: CompletionProvider;
    opts?: Partial<ShellOptions>;
  }) {
    this.commands = commands;
    this.fileSystem = fileSystem;
    this.lineEditor = lineEditor;
    this.currentDirectory = '/';
    this.fileHistory = [];
    this.commandHistoryManager = commandHistoryManager;
    this.completionProvider = completionProvider;

    this.opts = {
      ...defaultShellOptions,
      ...opts,
    };

    this.promptState_ = {
      directory: this.currentDirectory,
      prefix: this.opts.promptPrefix,
      date: tinydate(this.opts.dateFormat)(new Date()),
    };

    this.updateShellState();
  }

  get promptState() {
    return this.promptState_;
  }

  private updateShellState() {
    const date = tinydate(this.opts.dateFormat)(new Date());

    this.promptState_ = {
      directory: this.currentDirectory,
      prefix: this.opts.promptPrefix,
      date,
    };
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
    this.lineEditor.clear();
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

  getCommands() {
    return [...this.commands];
  }

  executeCommand(commandStr: string) {
    this.outputToTerminal(`${this.opts.promptPrefix}\t`, {
      style: { foreground: terminalPromptPrefix(), bold: true },
      newline: false,
    });

    this.outputToTerminal(commandStr, {
      style: { foreground: terminalPromptCommand(), bold: true },
      newline: true,
    });

    const [cmd, ...args] = commandStr.split(' ');

    const command = this.commands.find(c => c.name === cmd);

    let output: CommandResult | void;

    if (!command) {
      output = {
        type: 'error',
        message: `${cmd}: 존재하지 않는 명령입니다.`,
      };
    } else {
      output = command.execute(args, this);
    }

    this.commandHistoryManager.push(commandStr);

    switch (output?.type) {
      case 'text':
        return this.outputToTerminal(output.content, {
          newline: true,
        });
      case 'file':
        const renderedFile = renderFileNode(output.node);
        return this.outputToTerminal(renderedFile, {
          type: 'react',
          newline: true,
        });
      case 'error':
        return this.outputToTerminal(output.message, {
          newline: true,
        });
    }
  }

  getFullCommandHistory() {
    return this.commandHistoryManager.history;
  }

  getCurrentCommand() {
    return this.commandHistoryManager.current();
  }

  getPreviousCommand() {
    return this.commandHistoryManager.prev();
  }

  getNextCommand() {
    return this.commandHistoryManager.next();
  }

  goToLastCommand() {
    return this.commandHistoryManager.goToEnd();
  }

  outputToTerminal(output: React.ReactNode, opts?: { newline?: boolean; style?: TextStyle; type?: 'text' | 'react' }) {
    const { newline = false, style, type } = opts || {};

    this.lineEditor.addOutput({ output, style, type });

    if (newline) {
      this.lineEditor.addOutput({
        output: '\n',
        type,
      });
    }
  }

  getAutocompleteSuggestions() {
    return this.completionProvider.complete(this.lineEditor, this);
  }
}
