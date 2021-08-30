import React from 'react';
import { screen } from '@testing-library/react';
import { render } from 'test-utils/render';
import UserInfo from '../index';

test('render <UserInfo />', async () => {
  render(<UserInfo path='/user-info/:id' />, { useRouter: true, route: '/user-info/1' });

  expect(screen.queryByText(/Loading\.\.\./i)).toBeInTheDocument();

  const ul = await screen.findByRole('list');

  expect(ul).toBeInTheDocument();
});
