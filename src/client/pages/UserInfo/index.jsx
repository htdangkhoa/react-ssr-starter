import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet-async';

import Loading from 'client/components/Loading';
import useIsomorphicLayoutEffect from 'client/hooks/useIsomorphicLayoutEffect';
import { getUserInfoIfNeed } from 'client/store/slices/user-info-slice';
import { STATUS } from 'configs/constants';

const selectUser = (state, id) => state.userInfo[id];

export const loadData = ({ params }) => [getUserInfoIfNeed(params.id)];

const UserInfoAsync = memo(() => {
  const params = useParams();

  const selectUserById = createSelector(selectUser, (data) => data);

  const userInfo = useSelector((state) => selectUserById(state, params.id));

  if (userInfo?.loading === STATUS.LOADING) return <Loading />;

  if (userInfo?.loading === STATUS.FAILED)
    return (
      <div>
        <h2>Oops! Failed to load data.</h2>

        <p>Message: {userInfo?.error?.message}</p>

        <p>Stack: {userInfo?.error?.stack}</p>
      </div>
    );

  return (
    <ul>
      <li>Name: {userInfo?.data?.name}</li>
      <li>Phone: {userInfo?.data?.phone}</li>
      <li>Email: {userInfo?.data?.email}</li>
      <li>Website: {userInfo?.data?.website}</li>
    </ul>
  );
});

const UserInfo = () => {
  const params = useParams();

  const dispatch = useDispatch();

  useIsomorphicLayoutEffect(() => {
    dispatch(getUserInfoIfNeed(params.id));
  }, []);

  return (
    <div className='container'>
      <Helmet title='User Info' />

      <h1>User Info</h1>

      <UserInfoAsync />
    </div>
  );
};

export default memo(UserInfo);
