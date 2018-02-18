// @flow

import { takeEvery, call, put } from 'redux-saga/effects';
import type { InputFetch } from 'reduxTypes/input';
import fetchElemFromBC from '../api';

const fetchInputData = function* fetchInputData(action: InputFetch): Generator<*, *, *> {
  try {
    const data: Object = yield call(fetchElemFromBC, action.payload);
    yield put({ type: 'INPUT_FETCH_SUCCESS', payload: { data } });
  } catch (error) {
    yield put({ type: 'INPUT_FETCH_FAILURE', payload: { error } });
  }
};

function* watchInput(): Generator<*, *, *> {
  yield takeEvery('INPUT_FETCH', fetchInputData);
}

export default watchInput;
