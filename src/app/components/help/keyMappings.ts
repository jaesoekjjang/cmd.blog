export const keyMappings = [
  {
    category: 'Navigation',
    shortcuts: [
      { key: 'Tab', description: '명령어 및 파일 경로 자동 완성' },
      { key: '↑ / ↓', description: '명령어 기록 탐색' },
      { key: 'Ctrl + L', description: '터미널 화면 지우기' },
    ],
  },
  {
    category: 'Shell Commands',
    shortcuts: [
      { key: 'ls', description: '파일 및 디렉토리 목록 표시' },
      { key: 'cd <dir>', description: '디렉토리 변경' },
      { key: 'cat <file>', description: '파일 내용 표시' },
      { key: 'pwd', description: '현재 디렉토리 표시' },
      { key: 'clear', description: '터미널 출력 지우기' },
      { key: 'history', description: '명령어 기록 표시' },
      { key: '/?', description: '도움말 표시' },
    ],
  },
  {
    category: 'Line Editing',
    shortcuts: [
      { key: 'Ctrl + A', description: '줄의 시작으로 이동' },
      { key: 'Ctrl + E', description: '줄의 끝으로 이동' },
      { key: 'Ctrl + U', description: '커서에서 시작까지 삭제' },
      { key: 'Ctrl + K', description: '커서에서 끝까지 삭제' },
      { key: 'Ctrl + W', description: '이전 단어 삭제' },
    ],
  },
];
