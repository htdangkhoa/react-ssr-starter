/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import whm from 'webpack-hot-middleware';
import wdm from 'webpack-dev-middleware';
import config from '~/webpack/webpack.config.client';

const compiler = webpack(config);

const webpackMiddleware = () => {
  const instance = wdm(compiler, {
    serverSideRender: true,
    writeToDisk: true,
  });

  instance.waitUntilValid(() => console.log('...'));

  return [whm(compiler, { log: false, path: '/__webpack_hmr', heartbeat: 200 }), instance];
};

export default webpackMiddleware;
