const fs = require('fs');
const path = require('path');
const { getAlias } = require('../../webpack/webpack.config.base');

const swcConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.swcrc'), 'utf-8'));

const alias = Object.entries(getAlias()).reduce((original, [key, value]) => {
  const obj = original;

  obj[`^${key}(.*)$`] = `${value.replace(process.cwd(), '<rootDir>')}$1`;

  return obj;
}, {});

module.exports = (isWeb) => ({
  rootDir: process.cwd(),
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov'],
  globals: {
    __SERVER__: !isWeb,
    __DEV__: false,
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/__mocks__/file-mock.js',
    '\\.(svg)$': '<rootDir>/jest/__mocks__/svgr-mock.js',
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/jest/__mocks__/style-mock.js',
    '\\.module.(css|less|scss|sss|styl)$': 'identity-obj-proxy',
    ...alias,
  },
  modulePathIgnorePatterns: ['<rootDir>/.history'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup-test.js'],
  transform: {
    '^.+\\.(jsx?)$': ['@swc/jest', swcConfig],
  },
  testTimeout: 120000,
});
