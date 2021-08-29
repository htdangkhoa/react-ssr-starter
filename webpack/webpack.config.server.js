const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const { spawn, execSync } = require('child_process');
const { baseConfig, getPath, isDev, mergeBaseEntry } = require('./webpack.config.base');

let nodeProcess;

module.exports = merge(baseConfig(false), {
  entry: mergeBaseEntry(getPath('src/server/index.js')),
  target: 'node',
  watch: isDev(),
  output: {
    path: getPath('build'),
    filename: 'index.js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2',
  },
  node: { __dirname: true, __filename: true },
  externals: [
    '@loadable/component',
    nodeExternals({
      allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
    }),
  ],
  plugins: [
    isDev() && {
      apply(compiler) {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
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
          nodeProcess = spawn('npm', ['start'], {
            shell: true,
            env: process.env,
            stdio: 'inherit',
          });
        });
      },
    },
  ].filter(Boolean),
});
