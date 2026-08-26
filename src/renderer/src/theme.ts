import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#302e33'
    },
    background: {
      default: '#f7f7f7',
      paper: '#f9f9f9'
    }
  },
  typography: {
    h5: {
      fontSize: 19
    },
    body1: {
      fontSize: 13
    }
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    }
  }
})
