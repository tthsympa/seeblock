import { all } from 'redux-saga/effects';
import watchInput from './input';
import watchWeb3 from './web3';

const rootSaga = function* rootSaga() {
  yield all([
    watchInput(),
    watchWeb3(),
  ]);
};

export default rootSaga;
