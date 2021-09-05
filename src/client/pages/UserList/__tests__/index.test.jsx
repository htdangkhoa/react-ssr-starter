import React from 'react';
import { render, screen, waitFor } from 'test-utils/render';
import UserList from '../index';

test('render <UserList />', async () => {
  render(<UserList />);

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  await waitFor(() => screen.findByRole('list'), { timeout: 60000 });

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
