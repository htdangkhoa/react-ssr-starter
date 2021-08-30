import React from 'react';
import { render, screen } from 'test-utils/render';
import UserList from '../index';

test('render <UserList />', async () => {
  render(<UserList />);

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
