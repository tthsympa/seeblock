// @flow

// State
export type Web3Object = {
  +web3Object: null | Object,
};

export type Web3ObjectState = {
  +web3: Web3Object,
  isConnected: boolean,
  error: null | Error,
};

// Actions
export type CreateWeb3Object = {
  +type: 'CREATE_WEB3_OBJECT',
};

export type CreateWeb3ObjectSuccess = {
  +type: 'CREATE_WEB3_OBJECT_SUCCESS',
  +payload: {
    web3: Web3Object,
  },
};

export type CreateWeb3ObjectFailure = {
  +type: 'CREATE_WEB3_OBJECT_FAILURE',
  +payload: {
    error: Error,
  },
};

export type Web3ObjectAction = (
  | CreateWeb3Object
  | CreateWeb3ObjectSuccess
  | CreateWeb3ObjectFailure
);
