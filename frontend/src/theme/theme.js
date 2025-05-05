import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#1894c3',
    },
    background: {
      main: '#4d566b',
      paper: '#4d566b',
      default: '#120815'
    },
    secondary: {
      main: '#51d6a4',
    },
    success: {
      main: '#51d6a4',
    },
    defaultBg: {
      main: '#4d566b',
      light: '#4d566b',
      dark: '#4d566b',
      contrastText: '#fff',
    },

  },
});

export default theme;