/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configurationStore from 'client/store';

export const render = (ui, { path = '/', useRouter = false, useStore = true } = {}) => {
  const { store } = configurationStore({ url: path });

  const Router = ({ children }) =>
    !useRouter ? children : <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>;

  const Component = ({ children }) =>
    useStore ? (
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
    ) : (
      <Router>{children}</Router>
    );

  return rtlRender(
    <HelmetProvider>
      <Component>{ui}</Component>
    </HelmetProvider>,
  );
};

export * from '@testing-library/react';
