import { resolve } from 'path';
import PureHttp from 'pure-http';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import compression from 'compression';
import serve from 'serve-static';
import render from '../render';

const app = PureHttp();

app.use(favicon(resolve(process.cwd(), 'public/favicon.ico')));
app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(serve(resolve(process.cwd(), 'public')));

/* istanbul ignore next */
const webpackMiddleware = __DEV__ ? require('../middlewares/webpack.middleware').default : undefined;

/* istanbul ignore next */
if (typeof webpackMiddleware === 'function') {
  app.use(webpackMiddleware());
}

app.get('/api/health', (req, res) => res.status(200).end());

app.get('*', render);

app.shutdown = function shutdown() {
  console.log('\nShuting down server...');

  this.close((err) => {
    if (err) return process.exit(1);

    return process.exit(0);
  });
};

export default app;
