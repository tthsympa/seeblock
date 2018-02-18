// @flow

const isFunction = input => typeof input === 'function';
export default (predicate: boolean) => (elemOrThunk: any) => {
  if (predicate) {
    return isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk;
  }
  return null;
};
