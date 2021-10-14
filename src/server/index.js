import serverConfig from 'configs/server';
import app from './app';

const shutdown = () => {
  console.log('\nShuting down server...');

  app.close((err) => {
    if (err) return process.exit(1);

    return process.exit(0);
  });
};

app.listen(serverConfig.PORT);

process.addListener('SIGTERM', shutdown);
process.addListener('SIGINT', shutdown);
