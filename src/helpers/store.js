import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import combinedReducers from 'reducers'
import rootSaga from '../sagas'

const configureStore = () => {
  const isDebuggingInChrome = true

  const middlewares = []
  const sagaMiddleware = createSagaMiddleware()
  middlewares.push(sagaMiddleware)

  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
      predicate: () => isDebuggingInChrome,
      collapsed: true,
      duration: true,
    })
    middlewares.push(logger)
  }

  const store = createStore(combinedReducers, applyMiddleware(...middlewares))

  sagaMiddleware.run(rootSaga)
  return store
}

export default configureStore()
