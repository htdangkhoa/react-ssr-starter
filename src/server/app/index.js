import { resolve } from 'path';
import PureHttp from 'pure-http';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import compression from 'compression';
import serve from 'serve-static';
import render from '../render';

const app = PureHttp();

app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(favicon(resolve(__cwd, 'public/favicon.ico')));
app.use(serve(resolve(__cwd, 'public')));

/* istanbul ignore next */
const webpackMiddleware =
  process.env.NODE_ENV === 'development' ? require('../middlewares/webpack.middleware').default : undefined;

/* istanbul ignore next */
if (typeof webpackMiddleware === 'function') {
  app.use(webpackMiddleware());
}

app.get('/api/health', (req, res) => res.status(200).end());

app.get('*', render);

export default app;
