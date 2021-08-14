import { resolve } from 'path';
import PureHttp from 'pure-http';
import favicon from 'serve-favicon';
import compression from 'compression';
import serve from 'serve-static';
import ssr from './ssr';
import routes from './routes';

const app = PureHttp();

(async () => {
  app.use(favicon(resolve(__cwd, 'public/favicon.ico')));
  app.use(compression());
  app.use(serve(resolve(__cwd, 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const { default: webpackMiddleware } = await import('server/middlewares/webpack.middleware');
    app.use(webpackMiddleware());
  }

  app.use(routes);

  app.get('*', ssr);

  app.listen(9090, () => console.log('...'));
})();
