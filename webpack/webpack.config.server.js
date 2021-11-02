const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const spawn = require('cross-spawn');
const { baseConfig, getPath, isDev, mergeBaseEntry } = require('./webpack.config.base');

const _isDev = isDev();

let nodeProcess;

const tryToKillProcess = () => {
  if (nodeProcess) {
    try {
      nodeProcess.kill();

      nodeProcess = null;
    } catch (e) {
      console.error(e);
    }
  }
};

const registerShutdown = (fn) => {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
};

module.exports = merge(baseConfig(false), {
  entry: mergeBaseEntry(getPath('src/server/index.js')),
  target: 'node',
  watch: _isDev,
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
    _isDev && {
      apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('AfterEmitPlugin', (_, callback) => {
          registerShutdown(tryToKillProcess);

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

registerShutdown(() => {
  process.on('SIGINT', () => {
    process.exit(0);
  });
});
