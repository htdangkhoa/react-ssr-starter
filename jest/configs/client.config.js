const baseConfig = require('./base.config');

module.exports = {
  ...baseConfig(true),
  testEnvironment: 'jsdom',
  testMatch: ['**/src/client/**/__tests__/**/?(*.)+(spec|test).js?(x)'],
};
