/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { createHistory, createMemorySource, LocationProvider } from '@reach/router';
import createStore from 'client/store';

const store = createStore();

export const renderPage = (page, { route = '/', history = createHistory(createMemorySource(route)) } = {}) => ({
  ...render(<LocationProvider history={history}>{page}</LocationProvider>),
  history,
});

// eslint-disable-next-line react/prop-types
export const ProviderWithStore = ({ children }) => <Provider store={store}>{children}</Provider>;

export * from '@testing-library/react';
