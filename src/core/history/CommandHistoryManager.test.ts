import { CommandHistoryManager } from './CommandHistoryManager';

describe('CommandHistoryManager', () => {
  const TEST_COMMANDS = ['ls', 'cd posts', 'cat hello.md', 'clear'];

  let manager: CommandHistoryManager;

  beforeEach(() => {
    manager = new CommandHistoryManager();
  });

  test('새로운 명령을 히스토리에 추가', () => {
    TEST_COMMANDS.forEach(cmd => manager.push(cmd));
    expect(manager.history).toEqual(TEST_COMMANDS);
  });

  test('히스토리 maxSize를 초과하면 오래된 명령어 제거', () => {
    const overflowCommands = Array.from({ length: 1001 }, (_, i) => `cmd${i}`);
    overflowCommands.forEach(cmd => manager.push(cmd));

    expect(manager.history).toHaveLength(1000);
    expect(manager.history[0]).toBe('cmd1');
  });

  describe('히스토리 탐색', () => {
    beforeEach(() => {
      TEST_COMMANDS.forEach(cmd => manager.push(cmd));
    });

    test('이전 명령어 조회 - 가장 처음에 다다르면 첫 번째 히스토리를 항상 반환', () => {
      expect(manager.prev()).toBe('clear');
      expect(manager.prev()).toBe('cat hello.md');
      expect(manager.prev()).toBe('cd posts');
      expect(manager.prev()).toBe('ls');
      expect(manager.prev()).toBe('ls');
    });

    test('현재 명령어 조회', () => {
      expect(manager.current()).toBe('');
      expect(manager.prev()).toBe('clear');
      expect(manager.current()).toBe('clear');
    });

    test('다음 명령어 조회.', () => {
      expect(manager.next()).toBe(''); // 현재 위치
      manager.prev();
      manager.prev();

      expect(manager.next()).toBe('clear');
      expect(manager.next()).toBe('');
    });

    test('히스토리 시작점으로 이동', () => {
      expect(manager.goToStart()).toBe('ls');
    });

    test('히스토리 끝으로 이동', () => {
      manager.prev();
      manager.prev();
      expect(manager.goToEnd()).toBe('');
    });
  });

  test('히스토리 초기화', () => {
    TEST_COMMANDS.forEach(cmd => manager.push(cmd));
    manager.clear();
    expect(manager.history).toHaveLength(0);
  });
});
