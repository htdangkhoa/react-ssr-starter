import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { loadableReady } from '@loadable/component';

import './assets/styles/index.scss';

import { App } from './app';
import createStore from './store';

const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const store = createStore({ initialState });

const render = () => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
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
