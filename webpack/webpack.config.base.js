const { resolve } = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

const DotenvWebpackPlugin = require('./plugins/dotenv-webpack-plugin');

const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';

// by default, a file with size less than 10000 bytes will be inlined as a data URI and emitted as a separate file otherwise
const IMAGE_INLINE_SIZE_LIMIT = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10);

const isDev = () => !['production', 'test', 'analyze'].includes(process.env.NODE_ENV);
exports.isDev = isDev;

const getPath = (...args) => resolve(process.cwd(), ...args);
exports.getPath = getPath;

const mergeBaseEntry = (...main) => {
  const configsPath = getPath('src/configs');

  const patten = `${configsPath}/**.js*`;

  const configs = glob.sync(patten);

  return configs.concat(...main).filter(Boolean);
};
exports.mergeBaseEntry = mergeBaseEntry;

const _isDev = isDev();

const getPlugins = (isWeb) => {
  const plugins = [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: isWeb,
      __SERVER__: !isWeb,
      __DEV__: _isDev,
    }),
    new DotenvWebpackPlugin({ isWeb }),
    new CleanPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!robots.txt',
        '!android-icon-*',
        '!apple-icon*',
        '!browserconfig.xml',
        '!favicon*',
        '!ms-icon*',
        '!icon-*.png',
        '!icon-*.png',
        '!site.webmanifest',
      ],
    }),
  ];

  if (process.env.NODE_ENV === 'analyze') {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
      }),
    );
  }

  if (!disableESLintPlugin) {
    plugins.push(
      new ESLintPlugin({
        extensions: ['js', 'jsx'],
        cache: true,
        cacheLocation: getPath('.cache/.eslintcache'),
        threads: 2,
        formatter: eslintFormatter,
        failOnError: !(_isDev && emitErrorsAsWarnings),
        exclude: ['node_modules', !isWeb && 'src/client', isWeb && 'src/server'].filter(Boolean),
      }),
    );
  }

  return plugins.filter(Boolean);
};

const getStyleLoaders = (isWeb, isModule) => {
  const dev = _isDev;

  const loaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: dev,
        importLoaders: 2,
        modules: !isModule
          ? 'global'
          : {
              auto: true,
              localIdentName: dev ? '[name]__[local]__[contenthash:base64:5]' : '[contenthash:base64:5]',
              exportLocalsConvention: 'camelCase',
              exportOnlyLocals: !isWeb,
            },
      },
    },
    { loader: 'sass-loader', options: { sourceMap: !dev } },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: !dev,
      },
    },
  ];

  if (isWeb) {
    loaders.unshift(dev ? 'style-loader' : MiniCssExtractPlugin.loader);
  }

  return loaders;
};

const getAlias = () => ({
  '~': getPath(),
  configs: getPath('src/configs'),
  client: getPath('src/client'),
  server: getPath('src/server'),
  'test-utils': getPath('src/test-utils'),
});
exports.getAlias = getAlias;

const getOptimization = () => {
  if (_isDev) return undefined;

  return {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
    ],
  };
};

const swcConfig = JSON.parse(fs.readFileSync(getPath('.swcrc'), 'utf-8'));
swcConfig.jsc.transform.react.development = _isDev;

exports.baseConfig = (isWeb) => ({
  mode: _isDev ? 'development' : 'production',
  devtool: _isDev ? 'cheap-module-source-map' : false,
  stats: 'minimal',
  output: { clean: !isWeb },
  plugins: getPlugins(isWeb),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'swc-loader',
        options: swcConfig,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: getStyleLoaders(isWeb),
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: getStyleLoaders(isWeb, true),
      },
      {
        test: [/\.avif$/],
        type: 'asset',
        generator: {
          emit: isWeb,
          publicPath: '/',
          dataUrl: { mimetype: 'image/avif' },
        },
        parser: {
          dataUrlCondition: { maxSize: IMAGE_INLINE_SIZE_LIMIT },
        },
      },
      {
        test: /\.(bmp|png|jpe?g|gif|woff2?|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          emit: isWeb,
          publicPath: '/',
        },
        parser: {
          dataUrlCondition: { maxSize: IMAGE_INLINE_SIZE_LIMIT },
        },
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            issuer: /\.jsx?$/,
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  exportType: 'named',
                  prettier: false,
                  svgo: false,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
                  ref: true,
                },
              },
              {
                loader: require.resolve('./loaders/url-loader'),
              },
            ],
          },
          {
            type: 'asset',
            generator: {
              emit: isWeb,
              publicPath: '/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.json', '.js', '.jsx'],
    alias: getAlias(),
  },
  optimization: getOptimization(),
});
