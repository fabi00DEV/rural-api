import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/test/setup-e2e.ts'],
};

export default config;

// test/setup.ts
import 'jest';

// Configuração global para testes unitários
beforeAll(async () => {
  // Setup global para testes
});

afterAll(async () => {
  // Cleanup após testes
});
