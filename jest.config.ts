import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  testMatch: ['**/*.test.ts'],
  rootDir: 'src',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default config;
