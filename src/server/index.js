import serverConfig from 'configs/server';
import app from './app';

const registerShutdown = (fn) => {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
};

app.listen(serverConfig.PORT, () => {
  registerShutdown(() => app.close());
});

registerShutdown(() => {
  console.log(`\nGracefully shutting down. Please wait...`);

  process.on('SIGINT', () => {
    console.log('Force-closing all open sockets...');
    process.exit(0);
  });
});
