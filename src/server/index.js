import serverConfig from 'configs/server';
import app from './app';

app.listen(serverConfig.PORT, (err) => {
  if (err) console.error(err.message);
});
