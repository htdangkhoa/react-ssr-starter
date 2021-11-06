import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { render, screen, waitFor } from 'test-utils/render';
import UserList from '../index';

test('render <UserList />', async () => {
  render(
    <Routes>
      <Route path='/home' element={<UserList />} />
    </Routes>,
    { useRouter: true, path: '/home' },
  );

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  await waitFor(() => screen.findByRole('list'), { timeout: 60000 });

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
