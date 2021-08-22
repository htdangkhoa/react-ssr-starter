import React from 'react';
import { render, screen } from '@testing-library/react';

import Header from '../index';

test('render <Header />', () => {
  render(<Header />);

  const h1 = screen.getByText(/React SSR Starter/i);

  expect(h1).toBeInTheDocument();
});
