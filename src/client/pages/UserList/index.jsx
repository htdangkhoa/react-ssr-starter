import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Loading from 'client/components/Loading';
import useIsomorphicLayoutEffect from 'client/hooks/useIsomorphicLayoutEffect';
import { getUserListIfNeed } from 'client/store/slices/user-list-slice';
import { STATUS } from 'configs/constants';
import { makeId } from 'client/utils/string';

export const loadData = () => [getUserListIfNeed()];

const UserListAsync = memo(() => {
  const { loading, error, users } = useSelector((state) => state.userList);

  if (loading === STATUS.LOADING) return <Loading />;

  if (loading === STATUS.FAILED)
    return (
      <div>
        <h2>Oops! Failed to load data.</h2>

        <p>Message: {error?.message}</p>

        <p>Stack: {error?.stack}</p>
      </div>
    );

  return (
    <ul>
      {users.map((user) => (
        <li key={makeId()}>
          <Link to={`/user-info/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
});

const UserList = () => {
  const dispatch = useDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(getUserListIfNeed());
  }, []);

  return (
    <div className='container'>
      <h1>User List</h1>

      <UserListAsync />
    </div>
  );
};

export default memo(UserList);
