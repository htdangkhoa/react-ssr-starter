import { resolve } from 'path';
import PureHttp from 'pure-http';
import favicon from 'serve-favicon';
import compression from 'compression';
import serve from 'serve-static';
import ssr from '../ssr';
import routes from '../routes';

const app = PureHttp();

app.use(favicon(resolve(__cwd, 'public/favicon.ico')));
app.use(compression());
app.use(serve(resolve(__cwd, 'public')));

const webpackMiddleware =
  process.env.NODE_ENV === 'development' ? require('../middlewares/webpack.middleware').default : undefined;

if (typeof webpackMiddleware === 'function') {
  app.use(webpackMiddleware());
}

app.use(routes);

app.all('/api/health', (req, res) => res.status(200).json({ message: 'ok' }));

app.get('*', ssr);

export default app;
