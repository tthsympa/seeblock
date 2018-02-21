// @flow

import type {
  AdressDatas,
  InputFetch,
  InputFetchSuccess,
  InputFetchFailure,
} from 'reduxTypes/input';

export const input = (elem: string, type: number): InputFetch => ({
  type: 'INPUT_FETCH',
  payload: {
    elem,
    type,
  },
});

export const inputSuccess = (data: AdressDatas): InputFetchSuccess => ({
  type: 'INPUT_FETCH_SUCCESS',
  payload: {
    data,
  },
});

export const inputFailure = (error: Error): InputFetchFailure => ({
  type: 'INPUT_FETCH_FAILURE',
  payload: {
    error,
  },
});
