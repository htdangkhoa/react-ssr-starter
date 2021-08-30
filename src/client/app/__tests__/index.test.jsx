import React from 'react';
import { render, screen } from 'test-utils/render';
import App from '../index';

test('render <App />', async () => {
  const {
    history: { navigate },
  } = render(<App />);

  expect(await screen.findByText(/React SSR Starter/i)).toBeInTheDocument();

  await navigate('/user-info/1');

  expect(await screen.findByText(/User Info/i)).toBeInTheDocument();

  await navigate('/not-found');

  expect(await screen.findByText('Page not found.')).toBeInTheDocument();
});
