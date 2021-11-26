import { resolve } from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchRoutes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import ssrPrepass from 'react-ssr-prepass';

import App from 'client/app';
import createStore from 'client/store';
import routes from 'client/routes';

import renderHtml from './render-html';

const renderController = async (req, res) => {
  const store = createStore();

  const contexts = [];

  const loadBranchData = () => {
    const promises = matchRoutes(routes, req.path).map(({ route, params }) => {
      // handling redirects in react-router v6
      // reference: https://gist.github.com/htdangkhoa/5b3407c749b6fb8cf05cfb591ec3ef07#handling-redirects-in-react-router-v6
      if (typeof route.to === 'string') {
        contexts.push({ url: route.to, status: 301 });

        return Promise.resolve(null);
      }

      if (route.path === '*') {
        contexts.push({ status: 404 });
      } else {
        contexts.push({ status: 200 });
      }

      if (typeof route.loadData === 'function') {
        const thunks = route.loadData({ params, getState: store.getState }).map((thunk) => store.dispatch(thunk));

        return Promise.all(thunks);
      }

      return Promise.resolve(null);
    });

    return Promise.all(promises);
  };

  await loadBranchData();

  const [redirectContext] = contexts;

  // handling redirects in react-router v6
  // reference: https://gist.github.com/htdangkhoa/5b3407c749b6fb8cf05cfb591ec3ef07#handling-redirects-in-react-router-v6
  if (redirectContext && redirectContext.url) return res.redirect(301, redirectContext.url);

  const statsFile = resolve(process.cwd(), 'public/stats.json');

  const extractor = new ChunkExtractor({ statsFile });

  const helmetContext = {};

  const node = await ssrPrepass(
    <ChunkExtractorManager extractor={extractor}>
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <HelmetProvider context={helmetContext}>
            <App />
          </HelmetProvider>
        </StaticRouter>
      </Provider>
    </ChunkExtractorManager>,
  );

  const markup = renderToString(node);

  const { helmet: head } = helmetContext;

  const initialState = store.getState();

  const canonical = [
    `${req.protocol}://`,
    req.host,
    ![80, 443].includes(req.port) && `:${req.port}`,
    req.originalUrl,
  ].join('');

  const html = renderHtml(head, canonical, extractor, markup, initialState);

  // handle not found status
  const status = contexts.filter(({ status: stt }) => stt === 404).length !== 0 ? 404 : 200;

  return res.send(html, status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  });
};

export default renderController;
