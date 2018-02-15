import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import combinedReducers from 'reducers';

const configureStore = () => {
  const isDebuggingInChrome = true;

  const logger = createLogger({
    predicate: () => isDebuggingInChrome,
    collapsed: true,
    duration: true,
  });

  const store = createStore(combinedReducers, applyMiddleware(logger));

  return store;
};

export default configureStore();
