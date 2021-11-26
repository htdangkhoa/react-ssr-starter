import { resolve } from 'path';
import PureHttp from 'pure-http';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import compression from 'compression';
import serve from 'serve-static';
import render from '../render';
import users from '../db/users.json';

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

app.get('/api/users', (req, res) =>
  res.json({
    success: true,
    users,
  }),
);

app.get('/api/users/:id', (req, res) => {
  const user = users.find((_user) => _user.id === parseInt(req.params.id, 10)) || {};

  return res.json({
    success: true,
    user,
  });
});

app.get(/^(?!.*^\/api\/)(.*)/, render);

app.use((req, res, _next) =>
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path}`,
  }),
);

export default app;
