import React from 'react';
import { screen } from '@testing-library/react';
import { render } from 'tests/utils';
import { TodoInfo } from '../TodoInfo';

test('render <TodoInfo />', async () => {
  render(<TodoInfo path='/todo-info/:id' />, { useRouter: true, route: '/todo-info/1' });

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
