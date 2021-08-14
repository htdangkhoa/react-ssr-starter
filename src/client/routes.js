import { TodoList, loadData as loadDataForTodoList } from './pages/TodoList';
import { TodoInfo, loadData as loadDataForTodoInfo } from './pages/TodoInfo';
import { NotFound } from './pages/NotFound';

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
