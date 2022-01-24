const { merge } = require('webpack-merge');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { baseConfig, getPath, isDev, mergeBaseEntry } = require('./webpack.config.base');

const _isDev = isDev();

const config = baseConfig(true);

const rules = [...config.module.rules];
const [swcConfig] = rules.splice(0, 1);
Object.assign(swcConfig.options.jsc.transform.react, { refresh: _isDev });
rules.shift(swcConfig);

const getEntry = () => {
  const entries = [getPath('src/client/index.jsx')];

  if (_isDev) {
    entries.unshift(
      require.resolve('./entries/react-error-overlay'),
      'webpack-hot-middleware/client?reload=true&timeout=2000',
      'react-refresh/runtime',
    );
  }

  return mergeBaseEntry(...entries);
};

const getPlugins = () => {
  const plugins = [
    new LoadablePlugin({ filename: 'stats.json', writeToDisk: true }),
    new MiniCssExtractPlugin({
      filename: _isDev ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: _isDev ? '[id].css' : '[id].[contenthash:8].css',
    }),
  ];

  if (_isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new ReactRefreshPlugin());
  } else {
    plugins.push(
      new WorkboxWebpackPlugin.GenerateSW({
        mode: 'production',
        swDest: 'sw.js',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\.(jpe?g|png|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
            },
          },
          {
            urlPattern: /\.(js|json|css)$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-resources' },
          },
        ],
      }),
    );
  }

  return plugins;
};

const getOptimization = () => {
  if (_isDev) return undefined;

  return {
    minimize: !_isDev,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  };
};

module.exports = merge(config, {
  entry: getEntry(),
  output: {
    path: getPath('public'),
    filename: _isDev ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: _isDev ? '[id].js' : '[id].[contenthash:8].js',
    publicPath: '/',
  },
  plugins: getPlugins(),
  optimization: getOptimization(),
  stats: _isDev ? 'none' : { children: true, errorDetails: true },
});
