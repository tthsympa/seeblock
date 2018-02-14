// @flow

import type { InputState, InputAction } from 'reduxTypes/input';

const initialState: InputState = {
  input: {
    elem: '',
    type: -1,
  },
  data: {},
  isLoading: false,
  error: null,
};

export default (state: InputState = initialState, action: InputAction): InputState => {
  switch (action.type) {
    case 'INPUT_FETCH': {
      const { elem, type } = action.payload;
      return {
        ...state,
        input: { elem, type },
        isLoading: true,
      };
    }
    case 'INPUT_FETCH_SUCCESS': {
      const { data } = action.payload;
      return {
        ...state,
        data,
        isLoading: false,
      };
    }
    case 'INPUT_FETCH_FAILURE': {
      const { error } = action.payload;
      return {
        ...state,
        error,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};
