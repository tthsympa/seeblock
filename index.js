// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from 'utils/store';
import Root from 'containers/Views/Root';

/* global  document:true */

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  // $FlowFixMe
  document.getElementById('app'),
);
