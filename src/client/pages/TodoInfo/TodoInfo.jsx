import React, { memo, useEffect } from 'react';
import { useParams } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';

import { getTodoInfoIfNeed } from 'client/store/slices/todo-info-slice';
import { STATUS } from 'configs/constants';

export const loadData = ({ params }) => [getTodoInfoIfNeed(params.id)];

const TodoInfoAsyncComponent = memo(() => {
  const { loading, todo } = useSelector((state) => state.todoInfo);

  if (loading === STATUS.LOADING) return <p>Loading...</p>;

  if (loading === STATUS.FAILED) return <p>Oops! Failed to load data.</p>;

  return (
    <ul>
      <li>Title: {todo?.title}</li>
      <li>Completed: {todo?.completed ? 'true' : 'false'}</li>
    </ul>
  );
});

const TodoInfoComponent = () => {
  const params = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTodoInfoIfNeed(params.id));
  }, []);

  return (
    <div className='container'>
      <h4>Todo Info</h4>

      <TodoInfoAsyncComponent />
    </div>
  );
};

export const TodoInfo = memo(TodoInfoComponent);
