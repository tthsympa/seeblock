// @flow

import { takeEvery, call, put } from 'redux-saga/effects';
import type { Web3Object } from 'reduxTypes/web3';
import { createWeb3Object } from '../api';

const fetchWeb3 = function* fetchWeb3Data(): Generator<*, *, *> {
  try {
    const web3: Web3Object = yield call(createWeb3Object);
    yield put({ type: 'CREATE_WEB3_OBJECT_SUCCESS', payload: { web3 } });
  } catch (error) {
    yield put({ type: 'CREATE_WEB3_OBJECT_FAILURE', payload: { error } });
  }
};

function* watchWeb3(): Generator<*, *, *> {
  yield takeEvery('CREATE_WEB3_OBJECT', fetchWeb3);
}

export default watchWeb3;
