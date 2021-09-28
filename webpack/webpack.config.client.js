const { merge } = require('webpack-merge');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { baseConfig, getPath, isDev, mergeBaseEntry } = require('./webpack.config.base');

const config = baseConfig(true);

const rules = [...config.module.rules];
const [babelConfig] = rules.splice(0, 1);
Object.assign(babelConfig.options, { plugins: [isDev() && require.resolve('react-refresh/babel')].filter(Boolean) });
rules.shift(babelConfig);

module.exports = merge(config, {
  entry: mergeBaseEntry(
    isDev() && 'webpack-hot-middleware/client?reload=true&timeout=2000',
    getPath('src/client/index.jsx'),
  ),
  output: {
    path: getPath('public'),
    filename: isDev() ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isDev() ? '[id].js' : '[id].[contenthash:8].js',
    publicPath: '/',
  },
  plugins: [
    new LoadablePlugin({ filename: 'stats.json', writeToDisk: true }),
    new MiniCssExtractPlugin({
      filename: isDev() ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: isDev() ? '[id].css' : '[id].[contenthash:8].css',
    }),
    new WebpackPwaManifest({
      name: 'React SSR Starter',
      short_name: 'React SSR',
      description: 'The best react universal starter boilerplate in the world.',
      background_color: '#ffffff',
      filename: 'site.webmanifest',
      theme_color: '#ffffff',
      start_url: '.',
      display: 'standalone',
      inject: true,
      ios: true,
      icons: [
        {
          src: getPath('public/favicon-16x16.png'),
          size: '16x16',
          type: 'image/x-icon',
        },
        {
          src: getPath('public/favicon-32x32.png'),
          size: '32x32',
          type: 'image/x-icon',
        },
        {
          src: getPath('public/favicon-96x96.png'),
          size: '96x96',
          type: 'image/x-icon',
        },
        {
          src: getPath('public/icon-192x192.png'),
          size: '192x192',
          type: 'image/png',
        },
        {
          src: getPath('public/icon-512x512.png'),
          size: '512x512',
          type: 'image/png',
        },
        {
          src: getPath('public/icon-maskable.png'),
          size: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    }),
    !isDev() &&
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
    isDev() && new webpack.HotModuleReplacementPlugin(),
    isDev() && new ReactRefreshWebpackPlugin(),
    isDev() && new FriendlyErrorsWebpackPlugin(),
  ].filter(Boolean),
  optimization: isDev()
    ? undefined
    : {
        minimize: !isDev(),
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: { drop_console: true },
              mangle: {
                safari10: true,
              },
              keep_classnames: !isDev(),
              keep_fnames: !isDev(),
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
          }),
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
      },
  stats: isDev() ? 'none' : { children: true },
});
