// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/styles'
import theme from 'config/colors'
import store from 'helpers/store'
import Root from 'sections/Root'

/* global  document:true */

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Root />
    </ThemeProvider>
  </Provider>,
  // $FlowFixMe
  document.getElementById('app')
)
