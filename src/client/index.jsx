import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';

import './assets/styles/index.scss';

import App from './app';
import configurationStore from './store';
import reportWebVitals from './report-web-vitals';
import * as serviceWorker from './service-worker';

const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const store = configurationStore({ initialState });

const render = () => {
  const container = document.getElementById('app');

  const children = (
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );

  if (__SERVER__) {
    ReactDOM.hydrateRoot(container, children);

    return;
  }

  const root = ReactDOM.createRoot(container);

  root.render(children);
};

loadableReady(render);

if (module.hot) {
  module.hot.accept();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below.
serviceWorker.register();
