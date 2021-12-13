import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers';

const configurationStore = ({ initialState } = {}) => {
  const store = configureStore({
    preloadedState: initialState,
    reducer: reducers,
    devTools: __DEV__,
  });

  return store;
};

export default configurationStore;
