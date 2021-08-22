import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@reach/router';

import useIsomorphicLayoutEffect from 'client/hooks/useIsomorphicLayoutEffect';
import { getTodoListIfNeed } from 'client/store/slices/todo-list-slice';
import { STATUS } from 'configs/constants';
import { makeId } from 'client/utils/string';

export const loadData = () => [getTodoListIfNeed()];

const TodoListAsyncComponent = memo(() => {
  const { loading, todos } = useSelector((state) => state.todoList);

  if (loading === STATUS.LOADING) return <p>Loading...</p>;

  if (loading === STATUS.FAILED) return <p>Oops! Failed to load data.</p>;

  return (
    <ul>
      {todos.map((todo) => (
        <li key={makeId()}>
          <input id={`todo-${todo.id}`} type='checkbox' disabled checked={todo.completed} />

          <label htmlFor={`todo-${todo.id}`} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <Link to={`/todo-info/${todo.id}`}>{todo.title}</Link>
          </label>
        </li>
      ))}
    </ul>
  );
});

const TodoListComponent = () => {
  const dispatch = useDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(getTodoListIfNeed());
  }, []);

  return (
    <div className='container'>
      <h1>Todos</h1>

      <TodoListAsyncComponent />
    </div>
  );
};

export const TodoList = memo(TodoListComponent);
