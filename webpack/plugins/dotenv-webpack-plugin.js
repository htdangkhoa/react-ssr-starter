/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const REACT_APP = /^REACT_APP_/i;

// eslint-disable-next-line prefer-destructuring
const NODE_ENV = process.env.NODE_ENV;

const envPath = path.resolve(process.cwd(), `.env`);

class DotenvWebpackPlugin {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.path=".env"]
   * @param {boolean} [options.isWeb=false]
   */
  constructor(options) {
    this.PLUGIN_NAME = 'DotenvWebpackPlugin';

    this.options = { ...options };

    const envFiles = [
      `${envPath}.${NODE_ENV}.local`,
      /**
       * Don't include `.env.local` for `test` environment
       * since normally you expect tests to produce the same
       * results for everyone
       */
      NODE_ENV !== 'test' && `${envPath}.local`,
      `${envPath}.${NODE_ENV}`,
      this.options.path || envPath,
    ].filter(Boolean);

    envFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        dotenvExpand(dotenv.config({ path: file }));
      }
    });
  }

  /**
   * @param {import('webpack').Compiler} compiler
   */
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    const raw = Object.keys(process.env)
      .filter((key) => (this.options.isWeb ? REACT_APP.test(key) : true))
      .reduce(
        (obj, key) => {
          const _obj = obj;
          _obj[key] = process.env[key];
          return _obj;
        },
        {
          NODE_ENV: NODE_ENV || 'development',
        },
      );

    new DefinePlugin({
      'process.env': Object.keys(raw).reduce((env, key) => {
        const _env = env;
        _env[key] = JSON.stringify(raw[key]);

        return _env;
      }, {}),
    }).apply(compiler);
  }
}

module.exports = DotenvWebpackPlugin;
