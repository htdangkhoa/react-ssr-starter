import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { render, screen } from 'test-utils/render';
import NotFound from '../index';

test('render NotFound page', () => {
  render(
    <Routes>
      <Route path='*' element={<NotFound />} />
    </Routes>,
    { useRouter: true, path: '/not-found' },
  );

  const element = screen.getByText(/Page not found/i);

  expect(element).toBeInTheDocument();
});
