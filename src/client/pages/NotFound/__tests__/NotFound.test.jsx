import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFound } from '../NotFound';

test('render NotFound page', () => {
  render(<NotFound />);

  const element = screen.getByText(/Page not found/i);

  expect(element).toBeInTheDocument();
});
