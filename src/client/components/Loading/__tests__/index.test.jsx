import React from 'react';
import { render, screen } from '@testing-library/react';

import Loading from '../index';

test('render <Loading />', () => {
  render(<Loading />);

  const div = screen.getByText(/Loading\.\.\./i);

  expect(div).toBeInTheDocument();
});
