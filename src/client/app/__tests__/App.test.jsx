import React from 'react';
import { render } from 'tests/utils';
import { App } from '../App';

test('render <App />', async () => {
  const {
    container,
    history: { navigate },
  } = render(<App />);

  expect(container.innerHTML).toMatch(/React SSR Starter/i);

  await navigate('/todo-info/1');

  expect(container.innerHTML).toMatch(/Todo Info/i);

  await navigate('/not-found');

  expect(container.innerHTML).toMatch('Page not found.');
});
