import React, { memo, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Router } from '@reach/router';

import appConfig from 'configs/app';
import routes from 'client/routes';
import Loading from 'client/components/Loading';

const Header = React.lazy(() => import('client/components/Header'));

const App = () => (
  <Suspense fallback={<Loading />}>
    <Helmet {...appConfig.seo} encodeSpecialCharacters={__SERVER__} />

    <Header />

    <hr />

    <Router primary={false} component={React.Fragment}>
      {routes.map(({ component: Component, ...props }, i) => (
        <Component {...props} key={i.toString()} />
      ))}
    </Router>
  </Suspense>
);

export default memo(App);
