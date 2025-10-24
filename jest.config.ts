import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFiles: ['dotenv/config', '<rootDir>/tests/mongo-setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-env.ts']
};

export default config;
