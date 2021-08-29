import { lazy } from 'react';
import { loadData as loadDataForUserList } from './pages/UserList';
import { loadData as loadDataForUserInfo } from './pages/UserInfo';

const UserList = lazy(() => import('./pages/UserList'));
const UserInfo = lazy(() => import('./pages/UserInfo'));
const NotFound = lazy(() => import('./pages/NotFound'));

const routes = [
  {
    path: '/',
    component: UserList,
    loadData: loadDataForUserList,
  },
  {
    path: '/user-info/:id',
    component: UserInfo,
    loadData: loadDataForUserInfo,
  },
  {
    component: NotFound,
    default: true,
  },
];

export default routes;
