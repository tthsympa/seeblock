// @flow

import type {
  Web3Object,
  CreateWeb3Object,
  CreateWeb3ObjectSuccess,
  CreateWeb3ObjectFailure,
} from 'reduxTypes/web3';

export const createWeb3Object = (): CreateWeb3Object => ({
  type: 'CREATE_WEB3_OBJECT',
});

export const createWeb3ObjectSuccess = (web3: Web3Object): CreateWeb3ObjectSuccess => ({
  type: 'CREATE_WEB3_OBJECT_SUCCESS',
  payload: {
    web3,
  },
});

export const createWeb3ObjectFailure = (error: Error): CreateWeb3ObjectFailure => ({
  type: 'CREATE_WEB3_OBJECT_FAILURE',
  payload: {
    error,
  },
});
