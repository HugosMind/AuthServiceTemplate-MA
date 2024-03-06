export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};