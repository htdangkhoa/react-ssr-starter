import { lazy } from 'react';
import { loadData as loadDataForUserList } from './pages/UserList';
import { loadData as loadDataForUserInfo } from './pages/UserInfo';

const Navigate = lazy(() => import('react-router-dom').then(({ Navigate: m }) => ({ default: m })));
const UserList = lazy(() => import('./pages/UserList'));
const UserInfo = lazy(() => import('./pages/UserInfo'));
const NotFound = lazy(() => import('./pages/NotFound'));

const routes = [
  {
    path: '/',
    to: '/home',
    element: Navigate,
  },
  {
    path: '/home',
    element: UserList,
    loadData: loadDataForUserList,
  },
  {
    path: '/user-info/:id',
    element: UserInfo,
    loadData: loadDataForUserInfo,
  },
  {
    path: '*',
    element: NotFound,
  },
];

export default routes;
