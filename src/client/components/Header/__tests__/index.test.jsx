import React from 'react';
import { render, screen } from 'test-utils/render';

import Header from '../index';

test('render <Header />', () => {
  render(<Header />, { useRouter: true });

  const h1 = screen.getByText(/React SSR Starter/i);

  expect(h1).toBeInTheDocument();
});
