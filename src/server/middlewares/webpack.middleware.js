/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import os from 'os';
import webpack from 'webpack';
import whm from 'webpack-hot-middleware';
import wdm from 'webpack-dev-middleware';
import chalk from 'chalk';

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

    console.log(chalk.green('Compiled successfully!\n'));
    console.log(`You can now view ${chalk.bold('app')} in the browser.\n`);
    console.log(`  ${chalk.bold('Local:')}\t\thttp://localhost:${chalk.bold(serverConfig.PORT)}`);
    console.log(`  ${chalk.bold('On Your Network:')}\thttp://${host}:${chalk.bold(serverConfig.PORT)}\n`);
    console.log('Note that the development build is not optimized.');
    console.log(`To create a production build, use ${chalk.blue('npm run build')}.`);
  });

  return [whm(compiler, { log: false, path: '/__webpack_hmr', heartbeat: 200 }), instance];
};

export default webpackMiddleware;
