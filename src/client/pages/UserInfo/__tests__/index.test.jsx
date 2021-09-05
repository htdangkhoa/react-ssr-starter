import React from 'react';
import { render, screen, waitFor } from 'test-utils/render';
import UserInfo from '../index';

test('render <UserInfo />', async () => {
  render(<UserInfo path='/user-info/:id' />, { useRouter: true, route: '/user-info/1' });

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  await waitFor(() => screen.findByRole('list'), { timeout: 60000 });

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
