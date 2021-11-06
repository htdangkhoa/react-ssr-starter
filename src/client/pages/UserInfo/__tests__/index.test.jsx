import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { render, screen, waitFor } from 'test-utils/render';
import UserInfo from '../index';

test('render <UserInfo />', async () => {
  render(
    <Routes>
      <Route path='/user-info/:id' element={<UserInfo />} />
    </Routes>,
    { useRouter: true, path: '/user-info/1' },
  );

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  await waitFor(() => screen.findByRole('list'), { timeout: 1000 });

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
