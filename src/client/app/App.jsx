import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { Router } from '@reach/router';

import appConfig from 'configs/app';

import { Header } from 'client/components/Header';
import routes from 'client/routes';

const AppComponent = () => (
  <>
    <Helmet {...appConfig.seo} encodeSpecialCharacters={__SERVER__} />

    <Header />

    <hr />

    <Router primary={false} component={React.Fragment}>
      {routes.map(({ component: Component, ...props }, i) => (
        <Component {...props} key={i.toString()} />
      ))}
    </Router>
  </>
);

export const App = memo(AppComponent);
