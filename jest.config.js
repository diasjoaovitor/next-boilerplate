const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: '.'
})

const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  modulePaths: ['<rootDir>/src/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
})

module.exports = jestConfig
