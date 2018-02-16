// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from 'utils/colors';
import store from 'utils/store';
import Root from 'containers/Views/Root';

/* global  document:true */

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Root />
    </MuiThemeProvider>
  </Provider>,
  // $FlowFixMe
  document.getElementById('app'),
);
