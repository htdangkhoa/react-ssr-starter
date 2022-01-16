import os from 'os';
import webpack from 'webpack';
import whm from 'webpack-hot-middleware';
import wdm from 'webpack-dev-middleware';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import colors from 'picocolors';

import serverConfig from 'configs/server';
import config from '~/webpack/webpack.config.client';

const isInteractive = process.stdout.isTTY;

const clearConsole = () =>
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');

const printInstructions = () => {
  const interfaces = os.networkInterfaces();

  const arrInfo = Object.values(interfaces).reduce((original, details) => {
    let arr = original;
    arr = arr.concat(...details.filter(({ family, internal }) => family === 'IPv4' && !internal));

    return arr;
  }, []);

  // get last IPv4
  const [lastIPv4] = arrInfo;

  const host = !lastIPv4 ? '0.0.0.0' : lastIPv4.address;

  console.log(`You can now view ${colors.bold('app')} in the browser.\n`);
  console.log(`  ${colors.bold('Local:')}\t\thttp://localhost:${colors.bold(serverConfig.PORT)}`);
  console.log(`  ${colors.bold('On Your Network:')}\thttp://${host}:${colors.bold(serverConfig.PORT)}\n`);
  console.log('Note that the development build is not optimized.');
  console.log(`To create a production build, use ${colors.blue('npm run build')}.\n`);
};

const compiler = webpack(config);

const webpackMiddleware = (wsServer) => {
  let isFirstCompile = true;

  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      clearConsole();
    }

    console.log('Compiling...');
  });

  compiler.hooks.done.tap('done', (stats) => {
    if (isInteractive) {
      clearConsole();
    }

    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    const messages = formatWebpackMessages(statsData);

    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      console.log(colors.green('Compiled successfully!\n'));

      if (isInteractive || isFirstCompile) {
        printInstructions();
      }
    }
    isFirstCompile = false;

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }

      const errors = messages.errors.join('\n\n');

      console.log(colors.red('Failed to compile.\n'));
      console.log(errors);

      wsServer.on('connection', (ws) => {
        ws.send(JSON.stringify({ message: errors, type: 'error' }));
      });

      return;
    }

    if (messages.warnings.length) {
      console.log(colors.yellow('Compiled with warnings.\n'));

      const warnings = messages.warnings.join('\n\n');

      console.log(warnings);
      console.log(`\nSearch for the ${colors.underline(colors.yellow('keywords'))} to learn more about each warning.`);
      console.log(`To ignore, add ${colors.cyan('// eslint-disable-next-line')} to the line before.\n`);

      wsServer.on('connection', (ws) => {
        ws.send(JSON.stringify({ message: warnings, type: 'warn' }));
      });
    }
  });

  return [
    whm(compiler, { log: false, path: '/__webpack_hmr', heartbeat: 200 }),
    wdm(compiler, { serverSideRender: true, writeToDisk: true }),
    errorOverlayMiddleware(),
  ];
};

export default webpackMiddleware;
