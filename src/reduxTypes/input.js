// @flow

// State
export type Input = {
  +elem: string,
  +type: number,
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
    data: Object,
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
