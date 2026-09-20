import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#302e33'
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
    h5: {
      fontSize: 19
    },
    h6: {
      fontSize: 16
    },
    body1: {
      fontSize: 13
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
          marginBottom: 16
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
