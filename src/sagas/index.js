import { all } from 'redux-saga/effects';
import watchInput from './input';

const rootSaga = function* rootSaga() {
  yield all([
    watchInput(),
  ]);
};

export default rootSaga;
