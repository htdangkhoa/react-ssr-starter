const { resolve } = require('path');
const glob = require('glob');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = () => !['production', 'test'].includes(process.env.NODE_ENV);
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
  devtool: isDev() ? 'source-map' : false,
  stats: 'minimal',
  output: { clean: !isWeb },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: isWeb,
      __SERVER__: !isWeb,
      __DEV__: isDev(),
      __cwd: JSON.stringify(process.cwd()),
    }),
    new CleanWebpackPlugin({
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
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          caller: { target: isWeb ? 'web' : 'node' },
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
        // svg|woff2?|eot|ttf|otf
        test: /\.(png|jpe?g|gif)$/i,
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
                  svgo: true,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
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
    modules: ['backend', 'frontend', 'node_modules'],
    extensions: ['.json', '.js', '.jsx'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: true,
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
    ],
  },
});
