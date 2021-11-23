<h1 align="center">react-ssr-starter</h1>

<p align="center">
  <img src="https://user-images.githubusercontent.com/15341301/131251228-40d7de86-ea0a-4cae-89a3-9a74e7f3b280.png" alt="banner" >
</p>

<p align='center'>
  <a href='https://depfu.com/github/htdangkhoa/react-ssr-starter?project_id=30809'>
    <img src='https://badges.depfu.com/badges/f269ac566de71c1081d497d42daec0d6/count.svg' alt='Depfu' />
  </a>

  <a href='https://github.com/htdangkhoa/react-ssr-starter/actions/workflows/ci.yml'>
    <img src='https://github.com/htdangkhoa/react-ssr-starter/actions/workflows/ci.yml/badge.svg' alt='CI' />
  </a>

  <a href="https://www.codefactor.io/repository/github/htdangkhoa/react-ssr-starter">
    <img src="https://www.codefactor.io/repository/github/htdangkhoa/react-ssr-starter/badge" alt="CodeFactor" />
  </a>

  <a href='https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base'>
    <img src='https://img.shields.io/badge/eslint-airbnb-4B32C3.svg' alt='Eslint: airbnb' />
  </a>

  <a href='https://github.com/prettier/prettier'>
    <img src='https://img.shields.io/badge/formatter-prettier-ff69b4.svg' alt='Formatter: prettier' />
  </a>
</p>

## Requirements

- [node >= 12](https://nodejs.org/en/download/)

## Getting Started

```sh
git clone https://github.com/htdangkhoa/react-ssr-starter

yarn install # or npm install

yarn dev # or npm run dev
```

## Highlight

Using [SWC](https://swc.rs) will give build times **1.5x** faster for the server and **2.2x** for the client instead of using Babel.

| Babel                                                                                                           | SWC                                                                                                           |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| ![Babel](https://user-images.githubusercontent.com/15341301/140147312-322db462-9374-4da0-a8f9-e04fd10e7430.png) | ![Swc](https://user-images.githubusercontent.com/15341301/140154139-a71b21e3-d800-4ecd-8fa4-5329e563c05b.png) |

## Features

- [React](https://reactjs.org) - A JavaScript library for building user interfaces.
- [Redux](https://redux.js.org) - A Predictable State Container for JS Apps.
- [Redux Toolkit](https://redux-toolkit.js.org) - The official, opinionated, batteries-included toolset for efficient Redux development.
- [React Router](https://github.com/remix-run/react-router) - Declarative routing for React.
- [pure-http](https://github.com/htdangkhoa/pure-http) - The simple web framework for Node.js with zero dependencies.
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - Isomorphic WHATWG Fetch API, for Node & Browserify.
- [Webpack](https://webpack.js.org) - App bundling.
- [SWC](https://swc.rs) - A super-fast compiler written in rust, producing widely-supported javascript from modern standards and typescript.
- [React Refresh](https://github.com/facebook/react/tree/main/packages/react-refresh) - Fast refresh components without losing their state.
- [react-helmet](https://github.com/nfl/react-helmet) - A document head manager for React.
- [react-helmet-async](https://github.com/staylor/react-helmet-async) - Thread-safe Helmet for React 16+ and friends.
- [loadable-component](https://github.com/gregberge/loadable-components) - The recommended Code Splitting library for React.
- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from `.env` for nodejs projects.
- [Webpack Dev Middleware](https://github.com/webpack/webpack-dev-middleware) - Serves the files emitted from webpack over the Express server.
- [Webpack Hot Middleware](https://github.com/webpack-contrib/webpack-hot-middleware) - Allows you to add hot reloading into the Express server.
- [ESLint](https://eslint.org) - Find and fix problems in your JavaScript code.
- [Prettier](https://prettier.io/) - Format code and style.
- Integrate [Jest](https://jestjs.io/) with [Supertest](https://github.com/visionmedia/supertest), [Nock](https://github.com/nock/nock) and [React Testing Library](https://github.com/testing-library/react-testing-library) as the solution for writing unit tests with code coverage support.

## Scripts

| Script              | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| `dev`               | Runs your app on the development server at `localhost:9090`. HMR will be enabled. |
| `build`             | Bundles both server-side and client-side files.                                   |
| `build:server`      | Bundles server-side files in production mode and put it to the `build`.           |
| `build:client`      | Bundles client-side files in production mode and put it to the `public`.          |
| `start`             | Runs your app after bundled.                                                      |
| `test`              | Runs testing.                                                                     |
| `docker`            | Builds then run docker.                                                           |
| `docker:build`      | Builds docker.                                                                    |
| `docker:run`        | Runs docker.                                                                      |
| `gen` or `generate` | Generate React component automatic based on template.                             |

## Environment Variables

Your project can consume variables declared in your environment as if they were declared locally in your JS files. By default you will have `NODE_ENV` defined for you, and you can define any other variables that you want but for the React app, your variables name must be have `REACT_APP_` prefix.

> WARNING: Do not store any secrets (such as private API keys) in your React app!
>
> Environment variables are embedded into the build, meaning anyone can view them by inspecting your app's files.

To define permanent environment variables, create a file called .env in the root of your project:

```
# For node
PRIVATE_CODE=123456

# For React app
REACT_APP_NOT_SECRET_CODE=abcdef
```

> NOTE: You need to restart the development server after changing `.env` files.

### What other `.env` files can be used?

- `.env`: Default.
- `.env.local`: Local overrides. This file is loaded for all environments except test.
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Or you can add custom `.env` path in `webpack/webpack.config.base.js`:

```js
const DotenvWebpackPlugin = require('./plugins/dotenv-webpack-plugin');

// webpack config
{
  ...,
  plugins: [
    ...,
    new DotenvWebpackPlugin({
      path: './custom-env',
      isWeb: true|false,
    }),
  ],
}
```

Please refer to the [dotenv](https://github.com/motdotla/dotenv) documentation for more details.

### Expanding Environment Variables In .env

Expand variables already on your machine for use in your .env file (using [dotenv-expand](https://github.com/motdotla/dotenv-expand)).

For example, to get the environment variable npm_package_version:

```
REACT_APP_VERSION=$npm_package_version
# also works:
# REACT_APP_VERSION=${npm_package_version}
```

Or expand variables local to the current .env file:

```
DOMAIN=www.example.com
REACT_APP_FOO=$DOMAIN/foo
REACT_APP_BAR=$DOMAIN/bar
```

## Generators

### Usage

- npm

  ```sh
  npm run gen component "<component_name>"

  npm run generate component "<component_name>"
  ```

- Yarn

  ```sh
  yarn gen component "<component_name>"

  yarn generate component "<component_name>"
  ```

### Example

```sh
yarn gen component "hello world"

# or npm run gen component "hello world"
```

Output: `/src/client/components/HelloWorld/index.jsx` will be generated. `/src/client/components/HelloWorld/__tests__/index.test.jsx` will be generated if you want add the unit testing.

### Custom

You can add template in `generators` directory, please read more at [plopjs](https://github.com/plopjs/plop).
