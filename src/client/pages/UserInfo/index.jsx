import React, { memo, useMemo } from 'react';
import { useParams } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import Loading from 'client/components/Loading';
import useIsomorphicLayoutEffect from 'client/hooks/useIsomorphicLayoutEffect';
import { getUserInfoIfNeed } from 'client/store/slices/user-info-slice';
import { STATUS } from 'configs/constants';

export const loadData = ({ params }) => [getUserInfoIfNeed(params.id)];

const UserInfoAsync = memo(() => {
  const params = useParams();

  const userInfo = useSelector((state) => state.userInfo);

  const userInfoState = useMemo(() => userInfo[params.id], [params]);

  if (userInfoState?.loading === STATUS.LOADING) return <Loading />;

  if (userInfoState?.loading === STATUS.FAILED)
    return (
      <div>
        <h2>Oops! Failed to load data.</h2>

        <p>Message: {userInfoState?.error?.message}</p>

        <p>Stack: {userInfoState?.error?.stack}</p>
      </div>
    );

  return (
    <ul>
      <li>Name: {userInfoState?.data?.name}</li>
      <li>Phone: {userInfoState?.data?.phone}</li>
      <li>Email: {userInfoState?.data?.email}</li>
      <li>Website: {userInfoState?.data?.website}</li>
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
