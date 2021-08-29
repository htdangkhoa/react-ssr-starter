import React, { memo, useMemo } from 'react';
import { useParams } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import Loading from 'client/components/Loading';
import useIsomorphicLayoutEffect from 'client/hooks/useIsomorphicLayoutEffect';
import { getTodoInfoIfNeed } from 'client/store/slices/todo-info-slice';
import { STATUS } from 'configs/constants';

export const loadData = ({ params }) => [getTodoInfoIfNeed(params.id)];

const TodoInfoAsync = memo(() => {
  const params = useParams();

  const todoInfo = useSelector((state) => state.todoInfo);

  const todoInfoState = useMemo(() => todoInfo[params.id], [params]);

  if (todoInfoState?.loading === STATUS.LOADING) return <Loading />;

  if (todoInfoState?.loading === STATUS.FAILED) return <p>Oops! Failed to load data.</p>;

  return (
    <ul>
      <li>Title: {todoInfoState?.data?.title}</li>
      <li>Completed: {todoInfoState?.data?.completed ? 'true' : 'false'}</li>
    </ul>
  );
});

const TodoInfo = () => {
  const params = useParams();

  const dispatch = useDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(getTodoInfoIfNeed(params.id));
  }, []);

  return (
    <div className='container'>
      <Helmet title='Todo Info' />

      <h4>Todo Info</h4>

      <TodoInfoAsync />
    </div>
  );
};

export default memo(TodoInfo);
