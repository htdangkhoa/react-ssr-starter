const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const { spawn, execSync } = require('child_process');
const { baseConfig, getPath, isDev, mergeBaseEntry } = require('./webpack.config.base');

let nodeProcess;

const tryToKillProcess = (force) => () => {
  if (nodeProcess) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${nodeProcess.pid} /f /t`);
      } else {
        nodeProcess.kill();
      }

      nodeProcess = null;
    } catch (e) {
      console.error(e);
    }
  }

  if (force) process.exit(0);
};

module.exports = merge(baseConfig(false), {
  entry: mergeBaseEntry(getPath('src/server/index.js')),
  target: 'node',
  watch: isDev(),
  watchOptions: {
    ignored: [getPath('src/client'), getPath('src/test-utils')],
  },
  output: {
    path: getPath('build'),
    filename: 'index.js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2',
  },
  node: { __dirname: true, __filename: true },
  externals: [
    nodeExternals({
      allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
    }),
  ],
  plugins: [
    isDev() && {
      apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('AfterEmitPlugin', (_, callback) => {
          tryToKillProcess()();

          nodeProcess = spawn('npm', ['start'], {
            shell: true,
            env: process.env,
            stdio: 'inherit',
          });

          callback();
        });
      },
    },
  ].filter(Boolean),
});

process.addListener('SIGINT', tryToKillProcess(true));
process.addListener('SIGTERM', tryToKillProcess(true));
