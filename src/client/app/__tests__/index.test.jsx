import React from 'react';

import { render, screen, cleanup } from 'test-utils/render';
import App from '../index';

test('render <App />', async () => {
  render(<App />, { useRouter: true });
  expect(await screen.findByText(/User List/i)).toBeInTheDocument();
  cleanup();

  render(<App />, { useRouter: true, path: '/home' });
  expect(await screen.findByText(/User List/i)).toBeInTheDocument();
  cleanup();

  render(<App />, { useRouter: true, path: '/user-info/1' });
  expect(await screen.findByText(/User Info/i)).toBeInTheDocument();
  cleanup();

  render(<App />, { useRouter: true, path: '/not-found' });
  expect(await screen.findByText('Page not found.')).toBeInTheDocument();
  cleanup();
});
