import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import combinedReducers from 'reducers';
import rootSaga from '../sagas';

const configureStore = () => {
  const isDebuggingInChrome = true;

  const sagaMiddleware = createSagaMiddleware();
  const logger = createLogger({
    predicate: () => isDebuggingInChrome,
    collapsed: true,
    duration: true,
  });

  const store = createStore(
    combinedReducers,
    applyMiddleware(
      logger,
      sagaMiddleware,
    ),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore();
