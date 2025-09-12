// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9933', // Saffron
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#138808', // Green
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // White
      paper: '#F5F5F5',
      primary: "#000080"
    },
    text: {
      primary: '#000080', // Navy Blue
      secondary: '#444444',
    },
    info: {
      main: '#000080', // Chakra Blue
    },
    success: {
      main: '#138808',
    },
    warning: {
      main: '#FF9933',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, color: '#000080' },
    h2: { fontWeight: 600, color: '#FF9933' },
    h3: { fontWeight: 500, color: '#138808' },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
