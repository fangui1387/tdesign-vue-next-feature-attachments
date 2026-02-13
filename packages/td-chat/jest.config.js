module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.runtime.common.js',
    '^vue/(.*)$': '<rootDir>/node_modules/vue/$1',
    '^lodash-es$': 'lodash',
    '\\.(css|less)$': '<rootDir>/test/styleMock.js',
  },
  testMatch: ['**/test/unit/**/*.spec.js'],
};
