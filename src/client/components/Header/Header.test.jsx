import React from 'react';
import { render, screen } from '@testing-library/react';

import { Header } from './Header';

test('render Header component', () => {
  render(<Header />);

  const h1Element = screen.getByText(/React SSR Starter/i);

  expect(h1Element).toBeInTheDocument();
});
