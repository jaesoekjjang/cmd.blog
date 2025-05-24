import { BaseCommand } from './BaseCommand';

export class CommandRegistry {
  private commands = new Map<string, BaseCommand>();

  constructor(commands: BaseCommand[]) {
    commands.forEach(cmd => this.register(cmd));
  }

  register(command: BaseCommand): void {
    this.commands.set(command.name, command);
  }

  unregister(name: string): boolean {
    return this.commands.delete(name);
  }

  get(name: string): BaseCommand | undefined {
    return this.commands.get(name);
  }

  getAll(): BaseCommand[] {
    return Array.from(this.commands.values());
  }

  getNames(): string[] {
    return this.getAll().map(cmd => cmd.name);
  }

  has(name: string): boolean {
    return this.commands.has(name);
  }

  clear(): void {
    this.commands.clear();
  }

  size(): number {
    return this.commands.size;
  }
}

