import { createTheme } from '@mui/material'

export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#514f5e'
    },
    background: {
      default: '#f7f7f7',
      paper: '#f9f9f9'
    },
    text: {
      secondary: '#999'
    }
  },
  typography: {
    fontFamily: 'Geist Variable',
    h5: {
      fontSize: 19,
      fontFamily: 'Open Sans Variable'
    },
    h6: {
      fontSize: 16,
      fontFamily: 'Open Sans Variable'
    },
    body1: {
      fontSize: 13,
      fontWeight: '300'
    },
    body2: {
      fontSize: 11.5
    },
    caption: {
      fontSize: 10,
      color: '#999'
    }
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 8
        }
      }
    },

    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    }
  }
})
