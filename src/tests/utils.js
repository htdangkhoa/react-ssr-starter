/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { render as rtlRender } from '@testing-library/react';
import { createHistory, createMemorySource, LocationProvider, Router } from '@reach/router';
import createStore from 'client/store';

const store = createStore();

export const ProviderWithStore = ({ children }) => <Provider store={store}>{children}</Provider>;

export * from '@testing-library/react';

export const render = (
  ui,
  { route = '/', history = createHistory(createMemorySource(route)), useRouter = false, useStore = true } = {},
) => {
  const Routes = ({ children }) => (
    <LocationProvider history={history}>{useRouter ? <Router>{children}</Router> : children}</LocationProvider>
  );

  const Component = ({ children }) =>
    useStore ? (
      <ProviderWithStore>
        <Routes>{children}</Routes>
      </ProviderWithStore>
    ) : (
      <Routes>{children}</Routes>
    );

  return {
    ...rtlRender(
      <HelmetProvider>
        <Component>{ui}</Component>
      </HelmetProvider>,
    ),
    history,
  };
};

export { rtlRender };
