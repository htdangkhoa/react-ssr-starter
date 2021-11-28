const baseConfig = require('./base.config');

module.exports = {
  ...baseConfig(),
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/server/**/?(*.)+(spec|test).(js)'],
};
