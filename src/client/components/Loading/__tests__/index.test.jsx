import React from 'react';
import { render, screen } from 'test-utils/render';

import Loading from '../index';

test('render <Loading />', () => {
  render(<Loading />);

  const div = screen.getByText(/Loading\.\.\./i);

  expect(div).toBeInTheDocument();
});
