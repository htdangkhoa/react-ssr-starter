const { resolve } = require('path');
const glob = require('glob');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = () => !['production', 'test', 'analyze'].includes(process.env.NODE_ENV);
exports.isDev = isDev;

const getPath = (...args) => resolve(process.cwd(), ...args);
exports.getPath = getPath;

const mergeBaseEntry = (...main) => {
  const configsPath = getPath('src/configs');

  const patten = `${configsPath}/**.js*`;

  const configs = glob.sync(patten);

  return [].concat(...main, ...configs).filter(Boolean);
};
exports.mergeBaseEntry = mergeBaseEntry;

const getStyleLoaders = (isWeb, isModule) => {
  const dev = isDev();

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

exports.baseConfig = (isWeb) => ({
  mode: isDev() ? 'development' : 'production',
  devtool: isDev() ? 'cheap-module-source-map' : false,
  stats: 'minimal',
  output: { clean: !isWeb },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: isWeb,
      __SERVER__: !isWeb,
      __DEV__: isDev(),
    }),
    new Dotenv(),
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
      ],
    }),
    process.env.NODE_ENV === 'analyze' &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
      }),
    !isDev() &&
      new ESLintPlugin({
        extensions: ['js', 'jsx'],
        cache: true,
        cacheLocation: getPath('.cache/.eslintcache'),
        threads: 2,
      }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          caller: { target: isWeb ? 'web' : 'node' },
          cacheDirectory: true,
          cacheCompression: false,
        },
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
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset',
        generator: {
          emit: isWeb,
          publicPath: '/',
        },
      },
      {
        test: /\.(bmp|png|jpe?g|gif)$/i,
        type: 'asset',
        generator: {
          emit: isWeb,
          publicPath: '/',
        },
      },
      {
        test: /\.svg?$/,
        oneOf: [
          {
            type: 'asset',
            issuer: {
              and: [/\.(sa|sc|c)ss$/],
            },
            generator: { emit: isWeb },
          },
          {
            use: [
              {
                loader: '@svgr/webpack',
                options: {
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
                loader: 'file-loader',
                options: {
                  publicPath: '/',
                  emitFile: isWeb,
                },
              },
            ],
            type: 'javascript/auto',
            issuer: {
              // use as the ReactComponent
              and: [/\.(jsx?)$/],
            },
            generator: { emit: isWeb },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.json', '.js', '.jsx'],
  },
  optimization: isDev()
    ? undefined
    : {
        minimizer: [
          new TerserPlugin({
            parallel: true,
            extractComments: false,
            terserOptions: {
              compress: { drop_console: true },
            },
          }),
        ],
      },
});
