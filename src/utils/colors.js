import { createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#949494',
      light: '#c4c4c4',
      dark: '#666666',
      contrastText: '#000000',
    },
    secondary: {
      main: '#546e7a',
      light: '#819ca9',
      dark: '#29434e',
      contrastText: '#ffffff',
    },
  },
});

export default theme;
