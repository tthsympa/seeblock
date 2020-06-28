// @flow
import { List } from 'immutable';
// State
export type Input = {
  +elem: string,
  +type: number,
};

export type AdressDatas = {
  adress: string,
  block: number,
  count: number,
  from: List<*>,
  to: List<*>,
};

export type InputState = {
  +input: Input,
  +data: any,
  +isLoading: boolean,
  error: null | Error,
};

// Actions
export type InputFetch = {
  +type: 'INPUT_FETCH',
  +payload: {
    elem: string,
    type: number,
  },
};

export type InputFetchSuccess = {
  +type: 'INPUT_FETCH_SUCCESS',
  +payload: {
    +data: AdressDatas,
  },
};

export type InputFetchFailure = {
  +type: 'INPUT_FETCH_FAILURE',
  +payload: {
    error: Error,
  },
};

export type InputAction = (
  | InputFetch
  | InputFetchSuccess
  | InputFetchFailure
);
