const baseConfig = require('./config.base');

module.exports = {
  ...baseConfig(),
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/server/**/?(*.)+(spec|test).(js)'],
};
