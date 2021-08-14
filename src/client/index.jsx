import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { loadableReady } from '@loadable/component';

import './assets/styles/index.scss';

import { App } from './app';
import createStore from './store';
import reportWebVitals from './reportWebVitals';

const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const { store } = createStore({ initialState });

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
