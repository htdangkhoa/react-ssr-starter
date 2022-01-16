const spawn = require('cross-spawn');

const registerShutdown = (callback) => {
  let run = false;

  function wrapper() {
    if (run) return;

    run = true;

    callback();
  }

  ['SIGINT', 'SIGTERM', 'exit'].forEach((signal) => {
    process.on(signal, wrapper);
  });
};

/**
 * @class ShellWebpackPlugin
 */
class SpawnWebpackPlugin {
  /**
   * @param {string} command
   * @param {string[]} [args]
   * @param {Object} [options]
   * @param {boolean} [options.dev=false]
   */
  constructor(command, args, options) {
    this.PLUGIN_NAME = 'SpawnWebpackPlugin';

    this.command = command;

    let _args = [];

    if (Array.isArray(args)) {
      _args = args;
    }

    this.args = _args;

    this.opts = { ...options };

    registerShutdown(() => {
      this.tryToKillProcess(true);
    });
  }

  tryToKillProcess(force) {
    if (this.nodeProcess) {
      try {
        this.nodeProcess.kill('SIGINT');

        this.nodeProcess = undefined;
      } catch (err) {
        console.error(err);
      }
    }

    if (force) {
      process.exit();
    }
  }

  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    if (!this.opts.dev) return;

    compiler.hooks.done.tapAsync(this.PLUGIN_NAME, (stats, callback) => {
      if (this.nodeProcess) {
        this.tryToKillProcess();
      }

      if (stats.hasErrors()) {
        const msg = stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false,
        });

        process.stdout.write(`${msg}\n`);

        return process.exit(1);
      }

      this.nodeProcess = spawn(this.command, this.args, {
        shell: true,
        env: process.env,
        stdio: 'inherit',
      });

      return callback();
    });
  }
}

module.exports = SpawnWebpackPlugin;
