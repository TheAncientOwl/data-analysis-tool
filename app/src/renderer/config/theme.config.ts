import { yellow, green, teal, lightBlue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: green[900],
    },
    secondary: {
      main: yellow[600],
    },
    success: {
      main: teal[900],
    },
    info: {
      main: lightBlue[500],
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 1280,
      md: 1439,
      lg: 1925,
      xl: 2559,
      xxl: 3839,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
  }
}
