import React, { memo, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';

import appConfig from 'configs/client';
import routes from 'client/routes';
import Loading from 'client/components/Loading';

const Header = React.lazy(() => import('client/components/Header'));

const App = () => (
  <Suspense fallback={<Loading />}>
    <Helmet {...appConfig.seo} encodeSpecialCharacters={__SERVER__} />

    <Header />

    <main>
      <Routes>
        {routes.map(({ path, to, element: Element }, i) => {
          const elementProps = {};

          // handle redirects with Navigate component
          // reference: https://gist.github.com/htdangkhoa/5b3407c749b6fb8cf05cfb591ec3ef07
          if (typeof to === 'string') {
            elementProps.to = to;
            elementProps.replace = true;
          }

          return <Route path={path} element={<Element {...elementProps} />} key={i.toString()} />;
        })}
      </Routes>
    </main>
  </Suspense>
);

export default memo(App);
