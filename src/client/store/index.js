import { configureStore } from '@reduxjs/toolkit';
import { createReduxHistoryContext } from 'redux-first-history';
import { createMemoryHistory, createBrowserHistory } from 'history';
import configurationReducers from './reducer';

const configurationStore = ({ initialState, url }) => {
  const initialHistory = __SERVER__ ? createMemoryHistory({ initialEntries: [url || '/'] }) : createBrowserHistory();

  const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: initialHistory,
  });

  const store = configureStore({
    preloadedState: initialState,
    reducer: configurationReducers(routerReducer),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware),
    devTools: __DEV__,
  });

  const history = createReduxHistory(store);

  return { store, history };
};

export default configurationStore;
