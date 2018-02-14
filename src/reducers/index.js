import { combineReducers } from 'redux';
import input from './input';
import web3 from './web3';

const uncombinedRootReducer = {
  input,
  web3,
};

export default combineReducers(uncombinedRootReducer);
