import serverConfig from 'configs/server';
import app from './app';

app.listen(serverConfig.PORT, (err) => {
  if (err) console.error(err.message);
});

process.on('SIGINT', app.shutdown.bind(app));
process.on('SIGTERM', app.shutdown.bind(app));
