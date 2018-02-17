import { combineReducers } from 'redux';
import input from './input';

const uncombinedRootReducer = {
  input,
};

export default combineReducers(uncombinedRootReducer);
