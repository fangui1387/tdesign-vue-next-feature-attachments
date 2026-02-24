module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'ts', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!tdesign-vue|tdesign-icons-vue|lodash-es)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.runtime.common.js',
    '^vue/(.*)$': '<rootDir>/node_modules/vue/$1',
    '^lodash-es$': 'lodash',
    '\\.(css|less|scss)$': '<rootDir>/test/styleMock.js',
  },
  testMatch: ['**/test/unit/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/index.ts',
    '!src/index-lib.ts',
    '!src/shims-vue.d.ts',
    '!src/style/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
