module.exports = {
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'React Template Test',
        outputDirectory: './test/report',
        outputName: 'jestTestReport.xml',
        uniqueOutputName: 'false',
      },
    ],
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|jpg)$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
  },
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
    '\\.(css|less|sass|scss)$': '<rootDir>/test/mock/styleMock.js',
     "^@/(.*)": "<rootDir>/src/$1",
     '^mf_mesacyc_dashboards_common/(.*)$': '<rootDir>/test/__mocks__/mf_mesacyc_dashboards_common/$1',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'tsx', 'ts', 'vue', 'node'],
  testResultsProcessor: 'jest-sonar-reporter',
  testEnvironment: 'jsdom',
  // snapshotSerializers: ['enzyme-to-json/serializer'],
  // Used to run Garbage Collection after each describe block
  // This will reduce our memory used in CI
  // https://dev.to/pustovalov_p/reducing-jest-memory-usage-1ina
  setupFilesAfterEnv: ['./test/mock/force-gc.js'],
  // moduleDirectories: ['node_modules', 'src', __dirname],
};
