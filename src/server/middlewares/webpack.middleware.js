/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import os from 'os';
import webpack from 'webpack';
import whm from 'webpack-hot-middleware';
import wdm from 'webpack-dev-middleware';
import { green, bold, blue } from 'colorette';

import serverConfig from 'configs/server';
import config from '~/webpack/webpack.config.client';

const compiler = webpack(config);

const webpackMiddleware = () => {
  const instance = wdm(compiler, {
    serverSideRender: true,
    writeToDisk: true,
  });

  instance.waitUntilValid(() => {
    const { en0 } = os.networkInterfaces();

    // get last en0
    const [lastEn0] = (en0 || []).filter(({ family }) => family === 'IPv4').splice(-1);

    const host = !lastEn0 ? '0.0.0.0' : lastEn0.address;

    console.clear();

    console.log(green('Compiled successfully!\n'));
    console.log(`You can now view ${bold('app')} in the browser.\n`);
    console.log(`  ${bold('Local:')}\t\thttp://localhost:${bold(serverConfig.PORT)}`);
    console.log(`  ${bold('On Your Network:')}\thttp://${host}:${bold(serverConfig.PORT)}\n`);
    console.log('Note that the development build is not optimized.');
    console.log(`To create a production build, use ${blue('npm run build')}.\n`);
  });

  return [whm(compiler, { log: false, path: '/__webpack_hmr', heartbeat: 200 }), instance];
};

export default webpackMiddleware;
