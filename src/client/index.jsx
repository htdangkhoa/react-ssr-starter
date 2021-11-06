import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';

import './assets/styles/index.scss';

import App from './app';
import createStore from './store';
import * as serviceWorker from './service-worker';

const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const store = createStore({ initialState });

const render = () => {
  ReactDOM.hydrate(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    </StrictMode>,
    document.getElementById('app'),
  );
};

loadableReady(render);

if (module.hot) {
  module.hot.accept();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below.
serviceWorker.register();
