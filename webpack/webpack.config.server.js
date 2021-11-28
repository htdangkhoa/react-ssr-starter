const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const { baseConfig, getPath, isDev, mergeBaseEntry } = require('./webpack.config.base');
const SpawnWebpackPlugin = require('./plugins/spawn-webpack-plugin');

const _isDev = isDev();

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
    ignored: [getPath('src/client'), getPath('src/test-utils'), '**/node_modules'],
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
  plugins: [new SpawnWebpackPlugin('npm', ['start'], { dev: _isDev })],
});

registerShutdown(() => {
  process.on('SIGINT', () => {
    process.exit(0);
  });
});
