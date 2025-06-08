import { getThemeTokenResolver } from '@/app/theme';
import { CompletionProvider } from '@/core//completionProvider';
import { HistoryManager } from '@/core//history';
import { CommandRegistry, type CommandResult } from '@/core/commands';
import { CommandExecutor } from '@/core/commands/CommandExecutor';
import { DefaultCommandPolicyProvider } from '@/core/commands/CommandPolicy';
import { FileSystem } from '@/core/filesystem';
import { LineEditor, type LineEditorCallbacks, type TextStyle } from '@/core/lineEditor';
import tinydate from 'tinydate';
import { RenderedOutput } from '../filesystem/vFileSystem';
import { TerminalSession } from '../terminalSession/TerminalSession';
import { PromptState, ShellOptions } from './types';

const { terminalPromptCommand, terminalPromptPrefix } = getThemeTokenResolver();

const defaultShellOptions: ShellOptions = {
  dateFormat: '🕔 {HH}:{mm}:{ss}',
  promptPrefix: '>',
};

export class Shell {
  private fileSystem: FileSystem;
  private lineEditor: LineEditor;
  private currentDirectory: string;
  private fileHistory: string[];

  private commandRegistry: CommandRegistry;
  private commandHistoryManager: HistoryManager;
  private commandExecutor: CommandExecutor;

  private completionProvider: CompletionProvider;

  private opts: ShellOptions;
  private promptState_: PromptState;
  private terminalSession: TerminalSession;

  constructor({
    commandRegistry,
    fileSystem,
    lineEditor,
    commandHistoryManager,
    completionProvider,
    terminalSession,
    opts,
  }: {
    commandRegistry: CommandRegistry;
    fileSystem: FileSystem;
    lineEditor: LineEditor;
    commandHistoryManager: HistoryManager;
    completionProvider: CompletionProvider;
    terminalSession: TerminalSession;
    opts?: Partial<ShellOptions>;
  }) {
    this.commandRegistry = commandRegistry;
    this.fileSystem = fileSystem;
    this.lineEditor = lineEditor;
    this.currentDirectory = '/';
    this.fileHistory = [];
    this.commandHistoryManager = commandHistoryManager;
    this.completionProvider = completionProvider;
    this.terminalSession = terminalSession;

    const policyProvider = new DefaultCommandPolicyProvider();
    this.commandExecutor = new CommandExecutor(policyProvider);

    this.opts = {
      ...defaultShellOptions,
      ...opts,
    };

    this.promptState_ = {
      directory: this.currentDirectory,
      prefix: this.opts.promptPrefix,
      date: tinydate(this.opts.dateFormat)(new Date()),
    };

    this.setupLineEditorCallbacks(lineEditor);

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

  getFileHistory() {
    return [...this.fileHistory];
  }

  addToFileHistory(file: string) {
    this.fileHistory.push(file);
  }

  clearOutput() {
    this.lineEditor.clear();
    this.updateShellState();
  }

  outputToTerminal(output: string, opts?: { newline?: boolean; style?: TextStyle; type?: RenderedOutput['kind'] }) {
    const { newline = false, style, type } = opts || {};

    this.lineEditor.addOutput({ output, style, type });

    if (newline) {
      this.lineEditor.addOutput({
        output: '\n',
        type,
      });
    }
  }

  getCommands() {
    return this.commandRegistry.getNames();
  }

  async executeCommand(commandStr: string) {
    this.outputToTerminal(`${this.opts.promptPrefix}\t`, {
      style: { foreground: terminalPromptPrefix(), bold: true },
      newline: false,
    });

    this.outputToTerminal(commandStr, {
      style: { foreground: terminalPromptCommand(), bold: true },
      newline: true,
    });

    const [cmd, ...args] = commandStr.split(' ');

    const command = cmd ? this.commandRegistry.get(cmd) : undefined;

    let output: CommandResult | void;

    if (!command) {
      output = {
        type: 'text',
        content: `${cmd}: 존재하지 않는 명령입니다.`,
      };
    } else {
      output = await this.commandExecutor.eval(command, args, this, this.terminalSession);
    }

    this.commandHistoryManager.push(commandStr);

    if (!output) return;

    switch (output.type) {
      case 'text':
        return this.outputToTerminal(output.content, {
          newline: true,
        });
      case 'html':
        return this.outputToTerminal(output.content, {
          type: 'html',
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

  private setupLineEditorCallbacks(lineEditor: LineEditor) {
    const callbacks: LineEditorCallbacks = {
      onCommandExecute: command => {
        if (!command) {
          this.outputToTerminal(`${this.opts.promptPrefix}\t`, {
            style: { foreground: terminalPromptPrefix(), bold: true },
            newline: true,
          });
          return;
        }

        this.executeCommand(command);
      },
      onRequestPrevCommand: () => {
        return this.getPreviousCommand();
      },
      onRequestNextCommand: () => {
        return this.getNextCommand();
      },
      onRequestLastCommand: () => {
        return this.goToLastCommand();
      },
      onRequestClear: () => {
        this.clearOutput();
      },
      onRequestAutoComplete: () => {
        return this.getAutocompleteSuggestions();
      },
    };

    lineEditor.setCallbacks(callbacks);
  }

  getAutocompleteSuggestions() {
    return this.completionProvider.complete(this.lineEditor, this);
  }

  getTerminalSession() {
    return this.terminalSession;
  }
}
