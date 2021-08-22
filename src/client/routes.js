import { lazy } from 'react';
import { loadData as loadDataForTodoList } from './pages/TodoList';
import { loadData as loadDataForTodoInfo } from './pages/TodoInfo';

const TodoList = lazy(() => import('./pages/TodoList'));
const TodoInfo = lazy(() => import('./pages/TodoInfo'));
const NotFound = lazy(() => import('./pages/NotFound'));

const routes = [
  {
    path: '/',
    component: TodoList,
    loadData: loadDataForTodoList,
  },
  {
    path: '/todo-info/:id',
    component: TodoInfo,
    loadData: loadDataForTodoInfo,
  },
  {
    component: NotFound,
    default: true,
  },
];

export default routes;
