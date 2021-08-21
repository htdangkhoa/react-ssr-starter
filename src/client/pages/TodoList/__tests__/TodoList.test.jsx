import React from 'react';
import { render, screen } from 'tests/utils';
import { TodoList } from '../TodoList';

test('render <TodoList />', async () => {
  render(<TodoList />);

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
