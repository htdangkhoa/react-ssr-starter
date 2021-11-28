const path = require('path');
const fs = require('fs');
const { DefinePlugin, ProvidePlugin } = require('webpack');
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

  apply(compiler) {
    // it keeps your app from crashing when calling `process` on client-side
    if (this.options.isWeb) {
      new ProvidePlugin({
        process: 'process/browser',
      }).apply(compiler);
    }

    // eslint-disable-next-line prefer-object-spread
    const vars = Object.assign({}, process.env);

    const raw = Object.keys(vars)
      .filter((key) => (this.options.isWeb ? REACT_APP.test(key) : true))
      .reduce(
        (obj, key) => {
          const _obj = obj;
          _obj[key] = vars[key];
          return _obj;
        },
        {
          NODE_ENV: NODE_ENV || 'development',
        },
      );

    const formattedVars = Object.keys(raw).reduce((env, key) => {
      const _env = env;
      /**
       * Webpack 5 not polyfilling `process.env`
       * Reference: https://github.com/mrsteele/dotenv-webpack/issues/240#issuecomment-710231534
       */
      _env[`process.env.${key}`] = JSON.stringify(raw[key]);

      return _env;
    }, {});

    new DefinePlugin(formattedVars).apply(compiler);
  }
}

module.exports = DotenvWebpackPlugin;
