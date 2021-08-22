import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';

import './assets/styles/index.scss';

import App from './app';
import createStore from './store';

const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const store = createStore({ initialState });

const render = () => {
  ReactDOM.hydrate(
    <StrictMode>
      <Provider store={store}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    </StrictMode>,
    document.getElementById('app'),
  );
};

loadableReady(render);

if (module.hot) {
  module.hot.accept();

  module.hot.addStatusHandler((status) => {
    // React to the current status...
    if (status === 'check') window.location.reload();
  });
}
