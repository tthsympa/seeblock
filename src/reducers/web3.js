// @flow

import type { Web3ObjectState, Web3ObjectAction } from 'reduxTypes/web3';

const initialState: Web3ObjectState = {
  web3: {
    web3Object: null,
  },
  isConnected: false,
  error: null,
};

export default (
  state: Web3ObjectState = initialState,
  action: Web3ObjectAction,
): Web3ObjectState => {
  switch (action.type) {
    case 'CREATE_WEB3_OBJECT': {
      return state;
    }
    case 'CREATE_WEB3_OBJECT_SUCCESS': {
      const { web3 } = action.payload;
      return {
        ...state,
        web3,
        isConnected: true,
      };
    }
    case 'CREATE_WEB3_OBJECT_FAILURE': {
      const { error } = action.payload;
      return {
        ...state,
        error,
        isConnected: false,
      };
    }
    default:
      return state;
  }
};
