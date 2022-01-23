const { getAlias } = require('./webpack/webpack.config.base');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  settings: {
    'import/resolver': {
      alias: {
        map: Object.entries(getAlias()),
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  globals: {
    __CLIENT__: 'readonly',
    __SERVER__: 'readonly',
    __DEV__: 'readonly',
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ],
    'import/prefer-default-export': 'off',
    'import/no-import-module-exports': [
      'error',
      {
        exceptions: ['**/src/client/index.jsx'], // only use for `module.hot` in src/client/index.jsx
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    // 'no-console': 'warn',
  },
};
